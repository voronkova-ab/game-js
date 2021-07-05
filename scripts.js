class Quiz {
  constructor(properties) {
    this.preloader = properties.preloader;
    this.correctRequestAnswers = properties.correctRequestAnswers;
    this.allAnswersRequest = properties.allAnswersRequest;
    this.correctDefaultAnswers = properties.correctDefaultAnswers;
    this.questionRequest = properties.questionRequest;
    this.requestLink = properties.requestLink;
    this.checkResultBind = this.checkResult.bind(this);
    this.start = properties.start;
    this.next = properties.next;
    this.previous = properties.previous;
    this.slides = properties.slides;
    this.restart = properties.restart;
    this.container = properties.container;
    this.form = properties.form;
    this.formName = properties.formName;
    this.buttonName = properties.buttonName;
    this.counterAnswers = properties.counterAnswers;
    this.regex = properties.regex;
    this.countSlide = 0;
    this.countAnswers = 0;
    this.timerShowQuestion;
    this.timerCheckQuestion;
  }

  makeRequest() {
    fetch(this.requestLink)
      .then(res => res.json())
      .then(json => {
        let result = [...json.results];
        let quizCategory = result[0].category;
        result.forEach(obj => {
          this.correctRequestAnswers.push(obj.correct_answer);
          this.questionRequest.push(obj.question);
          this.allAnswersRequest.push(...obj.incorrect_answers, obj.correct_answer);
        });

        document.querySelector('.title').textContent = `Quiz about ${quizCategory}`;

        this.insertText(this.questionRequest, this.allAnswersRequest);
        json.onload = this.preloader.classList.add('none');
      })
      .catch(err => console.log(err));
  }

  insertText(arrQuestion, arrAnswer) {
    const questionText = this.container.querySelectorAll('.question__title');
    for (let i = 0; i < arrQuestion.length; i++) {
      questionText[i].textContent = arrQuestion[i];
    }

    const answerText = this.container.querySelectorAll('.answer');
    const valueText = this.container.querySelectorAll('.radio');
    for (let i = 0; i < arrAnswer.length; i++) {
      answerText[i].textContent = arrAnswer[i];
      valueText[i].value = arrAnswer[i];
    }
  }

  assignHandlerAnswer() {
    Array.from(this.container.querySelectorAll('.question .question__answers'))
      .forEach(answers => {
        answers.addEventListener("click", this.checkResultBind);
      })
  }

  assignHandlerButton() {
    this.start.addEventListener("click", this.startGame.bind(this));
    this.next.addEventListener("click", this.switchNextQuestion.bind(this));
    this.previous.addEventListener("click", this.switchPreviousQuestion.bind(this));
    this.buttonName.addEventListener("click", this.eventButtonName.bind(this));
    this.restart.addEventListener("click", this.eventRestart.bind(this));
  }

  checkResult(event) {
    let target = event.target;
    if (target.tagName != 'LABEL') return;

    this.disableButton();

    let answer = target.previousElementSibling.value;
    let isCorrect = this.correctDefaultAnswers.includes(answer) || this.correctRequestAnswers.includes(answer);
    if (isCorrect) {
      target.style.background = "green";
      this.countAnswers++;
    } else {
      target.style.background = "red";
    }

    clearTimeout(this.timerShowQuestion);

    this.timerCheckQuestion = setTimeout(this.switchNextQuestion.bind(this), 1500);
  }

  disableButton() {
    const disableBtn = this.slides[this.countSlide].querySelectorAll('.radio');
    Array.from(disableBtn).forEach(item => item.setAttribute("disabled", "disabled"));

    const disableAnswers = this.slides[this.countSlide].querySelector('.question__answers');
    disableAnswers.removeEventListener("click", this.checkResultBind);
  }

  startGame() {
    this.start.classList.add('none');
    this.next.classList.remove('none');
    this.previous.classList.remove('none');
    this.switchQuestion(this.countSlide);
    console.log(`start ${this.countSlide + 1}`);
  }

  switchQuestion(switchedSlide) {
    this.slides[this.countSlide].classList.remove('active');
    this.slides[switchedSlide].classList.add('active');

    if (this.timerShowQuestion !== null) clearTimeout(this.timerShowQuestion);
    if (this.countSlide !== 3) {
      this.timerShowQuestion = setTimeout(() => {
        this.disableButton();
        this.switchNextQuestion();
      }, 10000);
    }
  }

  switchNextQuestion() {
    if (this.countSlide === 2) {
      this.next.textContent = 'check';
    }

    if (this.countSlide === 3) {
      this.next.classList.add('none');
      this.previous.classList.add('none');
    }

    if (this.countSlide === 4) return;


    this.switchQuestion(this.countSlide + 1);
    this.countSlide++;
    console.log(`next ${this.countSlide + 1}`);
    clearTimeout(this.timerCheckQuestion);
  }

  switchPreviousQuestion() {
    if (this.countSlide <= 0) {
      return;
    }

    if (this.countSlide != 2) {
      this.next.textContent = 'next';
    }

    this.switchQuestion(this.countSlide - 1);
    this.countSlide--;
    console.log(this.countSlide + 1);
  }

  eventButtonName() {
    let name = this.formName.value;
    let err = document.createElement('p');
    if (!this.regex.test(name)) {
      err.classList.add('error');
      err.textContent = 'Введите корректное имя(содержит 2-10 символов и начинается с заглавной буквы)';
      this.form.append(err);
    } else {
      this.slides[4].classList.remove('active');
      this.showResult(name);
      this.restart.classList.remove('none');
    }
    setTimeout(() => err.remove(), 2000);
    this.formName.value = null;
  }

  showResult(name) {
    this.counterAnswers.classList.remove('none');
    this.counterAnswers.innerHTML = `Число правильных ответов игрока ${name} ${this.countAnswers}`;
  }

  eventRestart() {
    this.restart.classList.add('none');
    this.counterAnswers.classList.add('none');
    this.start.classList.remove('none');
    this.countSlide = 0;
    this.countAnswers = 0;
    this.assignHandlerAnswer();
    this.activeButton();
    this.correctRequestAnswers = [];
    this.allAnswersRequest = [];
    this.questionRequest = [];
    this.makeRequest();
    this.preloader.classList.remove('none');
  }

  activeButton() {
    const radio = this.container.querySelectorAll('.radio');
    Array.from(radio).forEach(item => item.removeAttribute('disabled'));

    const label = this.container.querySelectorAll('.answer');
    Array.from(label).forEach(item => item.style.background = '#ffff2b');
  }
}

let animalQuiz = {
  preloader: document.querySelector('.preloader'),
  correctRequestAnswers: [],
  questionRequest: [],
  allAnswersRequest: [],
  requestLink: 'https://opentdb.com/api.php?amount=4&category=27&type=multiple',
  correctDefaultAnswers: ['В Африке', '55 км/ч', '9', '30 лет'],
  start: document.querySelector('.start-btn'),
  next: document.getElementById('next'),
  previous: document.getElementById('previous'),
  slides: document.querySelectorAll('.question'),
  restart: document.querySelector('.restart'),
  container: document.querySelector('.container'),
  form: document.querySelector('.form'),
  formName: document.querySelector('.form__name'),
  buttonName: document.querySelector('.form__btn'),
  counterAnswers: document.getElementById('counterAnswers'),
  regex: /(^[A-Z]{1}[a-z]{1,9}( )?$)|(^[А-Я]{1}[а-я]{1,9}( )?$)/
}

let quiz = new Quiz(animalQuiz);
quiz.makeRequest();
quiz.assignHandlerAnswer();
quiz.assignHandlerButton()

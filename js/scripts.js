const questionOne = {
  question: 'Где обитает жираф?',
  answer: {
    a: 'В Индии',
    b: 'В Америке',
    c: 'В Африке',
    d: 'В Австралии'
  },
  currectAnswer: 'В Африке'
};
const questionTwo = {
  question: 'Как быстро может бегать жираф?',
  answer: {
    a: '70 км/ч',
    b: '55 км/ч',
    c: '30 км/ч',
    d: '100 км/ч'
  },
  currectAnswer: '55 км/ч'
};
const questionThree = {
  question: 'Сколько подвидов жирафа существует?',
  answer: {
    a: 9,
    b: 7,
    c: 10,
    d: 17
  },
  currectAnswer: 9
};
const questionFour = {
  question: 'Сколько живет жираф?',
  answer: {
    a: '50 лет',
    b: '90 лет',
    c: '30 лет',
    d: '70 лет'
  },
  currectAnswer: '30 лет'
};
const questions = [];
questions.push(questionOne);
questions.push(questionTwo);
questions.push(questionThree);
questions.push(questionFour);
questions.map(obj => {
  if (obj.currectAnswer === obj.answer.c) {
    console.log(obj.currectAnswer);
  }
});

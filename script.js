const formNumbers = document.querySelector(".form__input");
const formDifficulty = document.querySelector(".form__difficulty");
const formType = document.querySelector(".form__type");
const formCategory = document.querySelector(".form__category");
const formBtn = document.querySelector(".form__btn");
const questions = document.querySelector(".questions");
const container = document.querySelector(".container");
const template = document.querySelector(".question__template");
const questionsContainer = document.querySelector(".questions__container");
const checkBtn = document.querySelector(".check__btn");
const questionsCheck = document.querySelector(".questions__check");
const questionsResult = document.querySelector(".questions__result");
const result = document.querySelector(".result");
const bottomBtn = document.querySelector(".bottom__btn");

let quizEnd = false;

formBtn.onclick = startQuiz;
function startQuiz() {
  const number = formNumbers.value;
  const difficulty = formDifficulty.value;
  const type = formType.value;
  const category = formCategory.value;
  const params = new URLSearchParams();
  if (number >= 1) {
    params.append("amount", number);
  }
  if (difficulty != "any") {
    params.append("difficulty", difficulty);
  }
  if (type != "any") {
    params.append("type", type);
  }
  if (category != "any") {
    params.append("category", category);
  }
  fetch(`https://opentdb.com/api.php?${params}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      container.classList.add("hide");
      questions.classList.remove("hide");
      renderQuestions(
        data.results.map((el) => {
          const answers = [...el.incorrect_answers, el.correct_answer].sort(
            () => Math.random() - 0.5
          );
          el.answers = answers;
          return el;
        })
      );
    });
}

function renderQuestions(questions) {
  questionsContainer.innerHTML = null;
  let allAnswers = true;
  let correctAnswers = 0;
  questions.forEach((el) => {
    const clone = template.content.cloneNode(true);
    const questionText = clone.querySelector(".question__text");
    questionText.innerHTML = el.question;
    const questionAnswers = clone.querySelector(".question__answers");
    if (!el.selected_answer) {
      allAnswers = false;
    }
    if (el.selected_answer === el.correct_answer) {
      correctAnswers++;
    }
    el.answers.forEach((answer) => {
      const btn = document.createElement("button");
      btn.classList.add("answer");
      if (el.selected_answer === answer && !quizEnd) {
        btn.classList.add("select");
      }
      if (quizEnd) {
        if (el.correct_answer === answer) {
          btn.classList.add("true");
        }
        if (
          el.selected_answer === answer &&
          el.selected_answer != el.correct_answer
        ) {
          btn.classList.add("false");
        }
      }
      btn.innerHTML = answer;
      if (!quizEnd) {
        btn.addEventListener("click", () => {
          el.selected_answer = answer;
          renderQuestions(questions);
        });
      }
      questionAnswers.append(btn);
    });
    questionsContainer.append(clone);
  });
  if (allAnswers) {
    checkBtn.removeAttribute("disabled");
    checkBtn.addEventListener("click", () => {
      questionsCheck.classList.add("hide");
      questionsResult.classList.remove("hide");
      quizEnd = true;
      renderQuestions(questions);
      result.innerHTML = `${correctAnswers} / ${questions.length}`;
    });
  }
}

bottomBtn.addEventListener("click", () => {
  container.classList.remove("hide");
  questions.classList.add("hide");
  quizEnd = false
  questionsCheck.classList.remove("hide");
  questionsResult.classList.add("hide");
  checkBtn.setAttribute("disabled", true)

});

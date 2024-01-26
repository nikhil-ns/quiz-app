let questions = [];
async function dataFetch(){
    const response = await fetch('https://the-trivia-api.com/v2/questions');
    const data = await response.json();
    // console.log(response);
    // console.log(data)
    questions = [];
    data.forEach(el => {
        const correctAns = el.correctAnswer;
        const correctAnswerList = [el.correctAnswer];
        const incorrectAnswersList = el.incorrectAnswers;
        const ans = [...correctAnswerList , ...incorrectAnswersList];
        ans.sort();

        tempQuestions = {
                category : `${el.category}`,
                question : `${el.question.text}`,
                answers : ans,
                correctAnswer : correctAns
            }
        questions.push(tempQuestions)
    });
}



const questionsText = document.querySelector(".question");
const ctgBtn = document.querySelector(".ctgBtn")
const answerBtn = document.querySelector(".answers");
const nextBtn = document.querySelector(".nextBtn");

let currentIndex = 0;
let totalScore = 0;

function showScore(){
    ctgBtn.style.display = "none";
    answerBtn.style.display = "none";
    questionsText.innerHTML =  `Your scored ${totalScore} out of ${questions.length}`
    nextBtn.innerHTML = "Reset Game";
    nextBtn.addEventListener("click", main);
    
}
function showNextQuestion(){
    currentIndex++;
    if(currentIndex < questions.length){
        showQuestion(questions);
    }
    else{
        showScore();
    }
}

nextBtn.addEventListener("click", ()=>{
    if(currentIndex < questions.length){
        showNextQuestion();
    }
    else{
        showScore();
    }
})


function displayAns(e){
    const selectedBtn = e.target;
    const correctAns = questions[currentIndex].correctAnswer;

    console.log(selectedBtn.innerHTML)
   if(selectedBtn.innerHTML === correctAns){
       selectedBtn.style.background = "green";
       totalScore++;
    }
    else{
        selectedBtn.style.background = "red" 
    }
    
    Array.from(answerBtn.children).forEach(button =>{
        if(button.innerHTML === correctAns){
            button.style.background = "green"
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function resetAnsBtn(){
    nextBtn.style.display = "none"
    while(answerBtn.firstChild){
        answerBtn.removeChild(answerBtn.firstChild)
    }
}


function showQuestion(question){
    resetAnsBtn();
    // console.log(question);
    let currentQuestion = question[currentIndex].question;
    let currentQuestionNumber = currentIndex + 1;
    let currentCategory = question[currentIndex].category.charAt(0).toUpperCase() + question[currentIndex].category.slice(1);

    questionsText.innerHTML = currentQuestionNumber + ") " + currentQuestion;
    ctgBtn.innerHTML = currentCategory;
    
    question[currentIndex].answers.forEach((ans)=>{
       const button = document.createElement("button");
       button.innerHTML = ans;
       button.classList.add("btn")
       answerBtn.appendChild(button)
       button.addEventListener("click", displayAns);
    })
}

function startQuiz(){
    currentIndex = 0;
    totalScore = 0;
    nextBtn.innerHTML = "Next";
    showQuestion(questions);
}

async function main(){
    await dataFetch();
    startQuiz();
}
main();


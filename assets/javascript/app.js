//Array to store the api data
var movieArray = [];
//variable to store the chosen trivia question
var movieIndex;
//Array to store the possible answer choices
var answerChoices = [];
// variable to set the diffculty for the queryURL
var difficulty = "easy";
//variable to set the amount of data in the queryURL
var questions = 30;
//Global variable to use in timerStop function
var stopTimer;
//global variable to set the time alloted for each question
var timerCount = 30;
//Global variable to store correct answers
var correctCount = 0;
//Global variable to store incorrect answers
var incorrectCount = 0;

//Ajax call to get response from api
function loadMovies(){
    var queryURL = "https://opentdb.com/api.php?amount="+questions+"&category=11&difficulty="+difficulty+"&type=multiple";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response){
        movieArray = response.results;
        console.log(movieArray);
        console.log(movieArray.length);
    });
};

//call function loadMovies to get response from api
loadMovies();

//function to get correct movie
function loadQuestion(){
    movieIndex = Math.floor(Math.random() * movieArray.length);
    var question = movieArray[movieIndex].question;
    //dequestion = decodeURI(question);
    var h3 = $("<h2>").text(question);
    h3.addClass("mx-auto text-center");
    console.log("movie index: "+movieIndex);
    $("#triviaQuestion").append(h3);
};

//Function to get incorrect choices
function loadAnswers(){
    var correctAnswer = movieArray[movieIndex].correct_answer;
    answerChoices = movieArray[movieIndex].incorrect_answers;

    if ( answerChoices.indexOf(correctAnswer) == -1){
    var randomIndex = Math.floor(Math.random() * answerChoices.length);
    answerChoices.splice(randomIndex,0,correctAnswer);
    }

    for ( var i = 0 ; i < answerChoices.length; i++){
        var button = $("<button>").text(answerChoices[i]);
        button.attr("type", "button");
        button.attr("id", "answer"+i);
        button.attr("data-answer", answerChoices[i]);
        button.addClass("answerSel btn btn-info w-75 mx-auto m-2");
        $("#answerChoices").append(button);
    }
};

//Function to start and display time left
function questionTimer(){
    if(timerCount != 0){
    $("#questionTimer").html("Time Left: "+timerCount)
    timerCount--;
    }else{
        $("#questionTimer").html("Time Left: "+timerCount)
        alert("Out of Time");
        timerStop();
        clearRound();
        nextQuestion();
    }
};

function timerStart(){
    stopTimer = setInterval(questionTimer,1000);
};

//Function to stop timer
function timerStop(){
    clearInterval(stopTimer);
};

//Function to clear current round of questions and buttons
function clearRound(){
    movieArray.splice(movieIndex,1);
    $("#triviaQuestion").html("");
    $("#answerChoices").html("");
    answerChoices = [];
    movieIndex = 0;
    timerCount = 30;
    console.log(movieArray.length);
};

function nextQuestion(){
    $("#triviaQuestion").html("Next Question Loading...");
    var spinner = $("<div>").addClass("spinner-border text-primary")
    spinner.attr("role","status");
    var spinnerSpan = $("<span>").addClass("sr-only mx-auto").text("Loading...");
    spinner.append(spinnerSpan);
    $("#triviaQuestion").append(spinner);
    $("#questionTimer").html("");
    setTimeout(function(){
        $("#questionTimer").html("Time Left: "+timerCount)
        $("#triviaQuestion").html("");
        loadQuestion();
        loadAnswers();
        timerStart();
    },1000);
};

//On page load modal with a start button
$(window).on("load", function(){
    $("#onLoadModal").modal("show");
});

//Onlick function for button with id #startButton
$("#startButton").on("click", function(){
    $("#loadingModal").modal("show");
    setTimeout(function(){
        loadQuestion();
        loadAnswers();
        $("#loadingModal").modal("hide");
        timerStart();
    },questions*25);
});

//One click function to take user choice and compare to correct answer
$(document).on("click",".answerSel", function(){
    var selectedAns = $(this).attr("data-answer");
    if( selectedAns == movieArray[movieIndex].correct_answer){
        correctCount++;
        $("#correctCount").text(correctCount);
        alert("Correct!");
        clearRound();
        timerStop();
        nextQuestion();
    }else{
        incorrectCount++;
        $("#incorrectCount").text(incorrectCount);
        alert("Wrong!");
        clearRound();
        timerStop();
        nextQuestion();
    }
});
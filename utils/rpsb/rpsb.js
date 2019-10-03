//check that the file is loading into the html document
//console.log("hello world");

//Cache the DOM

//reset scores to 0
let userScore = 0;
let tiesScore = 0;
let compScore = 0;

//get span score elements from the document
const userScore_span = document.getElementById("user-score");
const tiesScore_span = document.getElementById("ties-score");
const compScore_span = document.getElementById("comp-score");

//query selector div scoreboard element from the document
const scoreBoard_div = document.querySelector(".scoreboard");

//query selector div result element from the document
const result_div = document.querySelector(".result");

//get divs of the rock paper scissors and bomb button elements
const rock_div = document.getElementById("r");
const paper_div = document.getElementById("p");
const scissors_div = document.getElementById("s");
const bomb_div = document.getElementById("b");
const random_div = document.getElementById("random")

//Set the scope for the user and computer's choices
let userRPSB;
let compRPSB;

function checkTheBoxes() {

//Check what checkboxes are checked
let checkUserBomb = document.getElementById("userBomb").checked;
let checkUserTies = document.getElementById("userTies").checked;
let checkCompBomb = document.getElementById("compBomb").checked;
let checkCompTies = document.getElementById("compTies").checked;
let checkCompSmartBomb = document.getElementById("compSmartBomb").checked;
let clickxX = document.getElementById("xX").checked;
let clickxC = document.getElementById("xC").checked;
let clickxM = document.getElementById("xM").checked;
let clickx10M = document.getElementById("x10M").checked;
let clickx100M = document.getElementById("x100M").checked;
// let clickxMillion = document.getElementById("xMillion").checked;

return [ checkUserBomb, checkUserTies, checkCompBomb, checkCompTies, checkCompSmartBomb, clickxX, clickxC, clickxM, clickx10M, clickx100M/*, clickxMillion*/ ];

}

//Comp's Choice

function getCompChoice() {

let compChoices;
let compChoice;
let boxes = checkTheBoxes();

    if (boxes[2] == true) {
    compChoices = ["r", "p", "b", "s"];
    compChoice = Math.floor(Math.random()*4)}
    else if (boxes[4] == true){
    compChoices = ["r", "b", "s"];
    compChoice = Math.floor(Math.random()*3)}
    else if (boxes[2] != true && boxes[4] != true) {
    compChoices = ["r", "p", "s"];
    compChoice = Math.floor(Math.random()*3) 
    };
    
console.log(compChoices[compChoice]);

    return compChoices[compChoice];
};

function getRandomChoice() {

    let randomChoices;
    let randomChoice;
    let boxes = checkTheBoxes();
    
        if (boxes[0] == true) {
        randomChoices = ["r", "b", "s"];
        randomChoice = Math.floor(Math.random()*3)}
        else if (boxes[0] != true){
        randomChoices = ["r", "p", "s"];
        randomChoice = Math.floor(Math.random()*3)};
        
    console.log(randomChoices[randomChoice]);
    
        return randomChoices[randomChoice];
    };

//On Win

function onWin() {
    
    userScore++;
    console.log ("Wins: " + userScore + " Ties: " + tiesScore + " Losses: " +  compScore);
    userScore_span.innerHTML = userScore;
    result_div.innerHTML = "<p>" + userRPSB + " beats " + compRPSB + ", User Wins!</p>"
};

//On Tie

function onTie() {
    
    tiesScore++;
    console.log ("Wins: " + userScore + " Ties: " + tiesScore + " Losses: " +  compScore);
    tiesScore_span.innerHTML = tiesScore; 
    result_div.innerHTML = "<p>" + userRPSB + " matches " + compRPSB + ", Tie.</p>"
};

//On Loss

function onLoss() {
    
    compScore++;
    console.log ("Wins: " + userScore + " Ties: " + tiesScore + " Losses: " +  compScore);
    compScore_span.innerHTML = compScore;
    result_div.innerHTML =  "<p>" + compRPSB + " beats " + userRPSB + ", Comp Wins!</p>"
};

//Reset Scores

function resetScores() {
userScore = 0;
tiesScore = 0;
compScore = 0;
userScore_span.innerHTML = userScore;
tiesScore_span.innerHTML = tiesScore;
compScore_span.innerHTML = compScore;
};

//Game Function

function game(userChoice) {
    const compGameChoice = getCompChoice();

    if (userChoice == "r") {
        userRPSB = "Rock";
    }
    else if (userChoice == "p") {
        userRPSB = "Paper";
    }
    else if (userChoice == "s") {
        userRPSB = "Scissors"
    }
    else if (userChoice == "b") {
        userRPSB = "Bomb"
    }

    if (compGameChoice == "r") {
        compRPSB = "Rock";
    }
    else if (compGameChoice == "p") {
        compRPSB = "Paper";
    }
    else if (compGameChoice == "s") {
        compRPSB = "Scissors"
    }
    else if (compGameChoice == "b") {
        compRPSB = "Bomb"
    }

    let boxes = checkTheBoxes();
    console.log("Virtual GM Says: The Player Chose " + userRPSB + ". The Computer Chose " + compRPSB + ".");

// Game Logic - tells which instances win, lose, or tie    
    if ( boxes[1] == false && boxes[3] == false || boxes[1] == true && boxes[3] == true) {
        switch (userChoice + compGameChoice) {
            case "rs":
            case "sp":
            case "pr":
            case "bp":
            case "br":
            case "sb":
            onWin();
            console.log (userChoice + " beats " + compGameChoice + ": User Wins!");
            break; 
            case "rr":
            case "pp":
            case "ss":
            case "bb":
            onTie();
            console.log (userChoice + " matches " + compGameChoice + ": Tie! Compare your traits.");
            break;
            case "sr":
            case "ps":
            case "rp":
            case "rb":
            case "pb":
            case "bs":
            onLoss();
            console.log ( compGameChoice + " beats " + userChoice + ": User Loses!");
            break; 
        } ;
    }
    else if ( boxes[1] == true,  boxes[3] == false) {
        switch (userChoice + compGameChoice) {
            case "rs":
            case "sp":
            case "pr":
            case "bp":
            case "br":
            case "sb":
            case "rr":
            case "pp":
            case "ss":
            case "bb":
            onWin();
            console.log (userChoice + " beats " + compGameChoice + ": User Wins!");
            break;
            case "sr":
            case "ps":
            case "rp":
            case "rb":
            case "pb":
            case "bs":
            onLoss();
            console.log ( compGameChoice + " beats " + userChoice + ": User Loses!");
            break; 
        } ;
    }
    else if ( boxes[1] == false,  boxes[3] == true) {
        switch (userChoice + compGameChoice) {
            case "rs":
            case "sp":
            case "pr":
            case "bp":
            case "br":
            case "sb":
            onWin();
            console.log (userChoice + " beats " + compGameChoice + ": User Wins!");
            break;
            case "rr":
            case "pp":
            case "ss":
            case "bb":
            case "sr":
            case "ps":
            case "rp":
            case "rb":
            case "pb":
            case "bs":
            onLoss();
            console.log ( compGameChoice + " beats " + userChoice + ": User Loses!");
            break; 
        } ;
    };

    

};

// turn the bomb on or off

function bombOnOff() {
    let boxes = checkTheBoxes();
if (boxes[0] == true) {
    document.getElementById('b').style.display = 'inline-block';
}
else {
    document.getElementById('b').style.display = 'none';
};
};



//Main Function

function main() {

/*  function timesThis() { 
    let boxes = checkTheBoxes();
    if (boxes[5] == true) { for (x=0; x<10; x++) {}}
    else if (boxes[6] == true) { for (x=0; x<100; x++) {}}
    else if (boxes[7] == true) { for (x=0; x<1000; x++) {}}
    else if (boxes[8] == true) { for (x=0; x<10000; x++) {}}
    else if (boxes[9] == true) { for (x=0; x<100000; x++) {}}
    else if (boxes[10] == true) { for (x=0; x<1000000; x++) {}}
    else {for (x=0; x<1; x++) {}}

    return 
 } */

    //Event Listeners

    rock_div.addEventListener('click', function(){

         let boxes = checkTheBoxes();
         if (boxes[5] == true) { for (x=0; x<10; x++) {game("r");}}
    else if (boxes[6] == true) { for (x=0; x<100; x++) {game("r");}}
    else if (boxes[7] == true) { for (x=0; x<1000; x++) {game("r");}}
    else if (boxes[8] == true) { for (x=0; x<10000; x++) {game("r");}}
    else if (boxes[9] == true) { for (x=0; x<100000; x++) {game("r");}}
//  else if (boxes[10] == true) { alert("this will crash your computer"); for (x=0; x<1000000; x++) {game("r");}}
    else {for (x=0; x<1; x++) {game("r");}}
//  console.log("You clicked the Rock.");
    });

    paper_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        if (boxes[5] == true) { for (x=0; x<10; x++) {game("p");}}
   else if (boxes[6] == true) { for (x=0; x<100; x++) {game("p");}}
   else if (boxes[7] == true) { for (x=0; x<1000; x++) {game("p");}}
   else if (boxes[8] == true) { for (x=0; x<10000; x++) {game("p");}}
   else if (boxes[9] == true) { for (x=0; x<100000; x++) {game("p");}}
// else if (boxes[10] == true) { alert("this will crash your computer"); for (x=0; x<1000000; x++) {game("p");}}
   else {for (x=0; x<1; x++) {game("p");}}
//        console.log("You clicked the Paper.");
    });

    scissors_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        if (boxes[5] == true) { for (x=0; x<10; x++) {game("s");}}
   else if (boxes[6] == true) { for (x=0; x<100; x++) {game("s");}}
   else if (boxes[7] == true) { for (x=0; x<1000; x++) {game("s");}}
   else if (boxes[8] == true) { for (x=0; x<10000; x++) {game("s");}}
   else if (boxes[9] == true) { for (x=0; x<100000; x++) {game("s");}}
// else if (boxes[10] == true) { alert("this will crash your computer"); for (x=0; x<1000000; x++) {game("s");}}
   else {for (x=0; x<1; x++) {game("s");}}
//        console.log("You clicked the Scissors.");
    });

    bomb_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        if (boxes[5] == true) { for (x=0; x<10; x++) {game("b");}}
   else if (boxes[6] == true) { for (x=0; x<100; x++) {game("b");}}
   else if (boxes[7] == true) { for (x=0; x<1000; x++) {game("b");}}
   else if (boxes[8] == true) { for (x=0; x<10000; x++) {game("b");}}
   else if (boxes[9] == true) { for (x=0; x<100000; x++) {game("b");}}
//  else if (boxes[10] == true) { alert("this will crash your computer"); for (x=0; x<1000000; x++) {game("b");}}
   else {for (x=0; x<1; x++) {game("b");}}
//        console.log("You clicked the Bomb.");
    });

    random_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        if (boxes[5] == true) { for (x=0; x<10; x++) {game(getRandomChoice());}}
   else if (boxes[6] == true) { for (x=0; x<100; x++) {game(getRandomChoice());}}
   else if (boxes[7] == true) { for (x=0; x<1000; x++) {game(getRandomChoice());}}
   else if (boxes[8] == true) { for (x=0; x<10000; x++) {game(getRandomChoice());}}
   else if (boxes[9] == true) { for (x=0; x<100000; x++) {game(getRandomChoice());}}
// else if (boxes[10] == true) { alert("this will crash your computer"); for (x=0; x<1000000; x++) {game(getRandomChoice());}}
   else {for (x=0; x<1; x++) {game(getRandomChoice());}}
//        console.log("You clicked the Scissors.");
    });

};

//Call Main Function

main();

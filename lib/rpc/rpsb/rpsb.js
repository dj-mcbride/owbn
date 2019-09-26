//check that the file is loading into the html document
console.log("hello world");

//Cache the DOM

//reset scores to 0
const userScore = 0;
const compScore = 0;

//get span score elements from the document
const userScore_span = document.getElementById("user-score");
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

function checkTheBoxes() {

//Check what checkboxes are checked
let checkUserBomb = document.getElementById("userBomb").checked;
let checkUserTies = document.getElementById("userTies").checked;
let checkCompBomb = document.getElementById("compBomb").checked;
let checkCompTies = document.getElementById("compTies").checked;

return [ checkUserBomb, checkUserTies, checkCompBomb, checkCompTies ];

}

//Comp's Choice

function getCompChoice() {

let compChoices;
let compChoice;
let boxes = checkTheBoxes();

    if (boxes[2] != true) {
    compChoices = ["r", "p", "s"];
    compChoice = Math.floor(Math.random()*3)}
    else {
    compChoices = ["r", "p", "b", "s"];
    compChoice = Math.floor(Math.random()*4)};
    
    console.log(compChoices[compChoice]);

    return compChoices[compChoice];
};

getCompChoice();

//Game Function

function game(userChoice) {
    console.log("Caine Says:" + userChoice);
}

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

    //Event Listeners
   
/*    document.getElementById("userBomb").addEventListener('click', function(){
        document.getElementById("b").style.display = "inline-block" ;
    }
    )*/

    rock_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        game("r");
        console.log(boxes)
        console.log("You clicked the Rock.");
    });

    paper_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        game("p");
        console.log("You clicked the Paper.");
    });

    scissors_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        game("s");
        console.log("You clicked the Scissors.");
    });

    bomb_div.addEventListener('click', function(){
        let boxes = checkTheBoxes();
        game("b");
        console.log("You clicked the Bomb.");
    });

};

//Call Main Function

main();

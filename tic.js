let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#reset");
let newgamebtn = document.querySelector(".newbtn");
let msgcontainer= document.querySelector(".msg-container");
let msg = document.querySelector(".msg");
let winSound = document.querySelector("#winSound");
let turnIndicator = document.querySelector("#turn");
let xscore = document.querySelector("#xscore");
let oscore = document.querySelector("#oscore");
let resetScoreBtn = document.querySelector("#resetscore");
let startScreen = document.querySelector("#startScreen");
let container = document.querySelector("#container");

let friendBtn = document.querySelector("#friendBtn");
let computerBtn = document.querySelector("#computerBtn");
let exitBtn = document.querySelector("#exitBtn");
let bgMusic = document.querySelector("#bgMusic");
let mainmusic = document.querySelector("#mainmusic");
let drawSound = document.querySelector("#drawSound");
let gametitle = document.querySelector("#gametitle");
let vsComputer = false;
let turnO = true;
let xwin = 0;
let owin = 0;

const winpatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

alert("Welcome to Raiyyan's Game World:")
// Enable all boxes (for new game)
const enableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("win");
    });
    turnIndicator.innerText = "Turn : O";
}

// Disable all boxes (after win/draw)
const disabledboxes = () => {
    boxes.forEach(box => box.disabled = true);
}

// Reset game (keep score)
const resetgame = () => {
    turnO = true;
    enableBoxes();
    msgcontainer.classList.add("hide");
    winSound.pause();
    winSound.currentTime = 0;
    bgMusic.pause();
}

// Show winner
const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgcontainer.classList.remove("hide");
    winSound.play();
    if(winner === "X"){
        xwin++;
        xscore.innerText = xwin;
    } else {
        owin++;
        oscore.innerText = owin;
    }
    disabledboxes();
}

// Check winner
const checkwinner = () => {
    for(let pattern of winpatterns){
        let [a,b,c] = pattern;
        let valA = boxes[a].innerText;
        let valB = boxes[b].innerText;
        let valC = boxes[c].innerText;

        if(valA && valA === valB && valB === valC){
            boxes[a].classList.add("win");
            boxes[b].classList.add("win");
            boxes[c].classList.add("win");
            showWinner(valA);
            return;
        }
    }
}

function playDrawSound(){
    if(drawSound){
        drawSound.currentTime = 0;  // start from beginning
        drawSound.play().catch(err=>{
            console.log("Draw sound play blocked:", err);
        });
    }
}
// Check draw
const checkDraw = () => {
    let filled = Array.from(boxes).every(box => box.innerText !== "");
    if(filled && msgcontainer.classList.contains("hide")){
        msg.innerText = "It's a Draw!";
        msgcontainer.classList.remove("hide");
        disabledboxes();
         bgMusic.play().catch(err => console.log("BG music blocked", err));
    }
}

// Computer move
const computerMove = () => {

    // 1️⃣ Try to win
    for(let pattern of winpatterns){
        let [a,b,c] = pattern;

        let vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];

        if(vals.filter(v => v === "X").length === 2 && vals.includes("")){
            let index = pattern[vals.indexOf("")];
            makeMove(index);
            return;
        }
    }

    // 2️⃣ Block player win
    for(let pattern of winpatterns){
        let [a,b,c] = pattern;

        let vals = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];

        if(vals.filter(v => v === "O").length === 2 && vals.includes("")){
            let index = pattern[vals.indexOf("")];
            makeMove(index);
            return;
        }
    }

    // 3️⃣ Otherwise random move
    let emptyBoxes = [];

    boxes.forEach((box,index)=>{
        if(box.innerText === "") emptyBoxes.push(index);
    });

    if(emptyBoxes.length === 0) return;

    let randomIndex = emptyBoxes[Math.floor(Math.random()*emptyBoxes.length)];

    makeMove(randomIndex);
}

function makeMove(index){

    boxes[index].innerText = "X";
    boxes[index].style.color = "red";
    boxes[index].disabled = true;

    checkwinner();
    checkDraw();

    if(msgcontainer.classList.contains("hide")){
        turnIndicator.innerText = "Turn : O";
    }

}

boxes.forEach(box => {
    box.addEventListener("click", () => {

        if(box.innerText !== "") return; // already filled

        if(vsComputer){
           
            box.innerText = "O";
            box.style.color = "green";
            //  box.style.backgroundColor = "#a0f0a0";
            box.disabled = true;

            checkwinner();
            checkDraw();

            if(msgcontainer.classList.contains("hide")){
                setTimeout(computerMove, 500);
            }

        } else {
           
            if(turnO){
                box.innerText = "O";
                box.style.color = "green";
                //    box.style.backgroundColor = "#a0f0a0";
                turnIndicator.innerText = "Turn : X";
                turnO = false;
            } else {
                box.innerText = "X";
                box.style.color = "red";
                //  box.style.backgroundColor = "#f0a0a0";
                turnIndicator.innerText = "Turn : O";
                turnO = true;
            }
            box.disabled = true;
            checkwinner();
            checkDraw();
        }
    });
});

// ==== Button Events ====
resetbtn.addEventListener("click", resetgame);
newgamebtn.addEventListener("click", resetgame);
resetScoreBtn.addEventListener("click", () => {
    xwin = 0;
    owin = 0;
    xscore.innerText = 0;
    oscore.innerText = 0;
});

// Start Screen Buttons
friendBtn.addEventListener("click", () => {
    vsComputer = false;
    startScreen.style.display = "none";
    container.classList.remove("hide");
     document.body.style.backgroundColor = "#d4f7d4";
      mainmusic.play().catch(err => console.log("BG music blocked", err));
});

computerBtn.addEventListener("click", () => {
    vsComputer = true;
    startScreen.style.display = "none";
    container.classList.remove("hide");
     document.body.style.backgroundColor = "#f7d4d4"; 
      mainmusic.play().catch(err => console.log("BG music blocked", err));
      alert("You're Playing With Computer")
});

exitBtn.addEventListener("click", () => {
    container.classList.add("hide");

    startScreen.style.display = "block";

    resetgame();
    document.body.style.backgroundColor = "#e0f4ff";
     bgMusic.pause();  
     mainmusic.pause(); 
    bgMusic.currentTime = 0;
});

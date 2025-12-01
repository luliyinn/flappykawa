document.fonts.ready.then(() => {
    drawStartScreen(); 
});

function drawStartScreen() {
  context.fillStyle = "white"; 
    context.strokeStyle = 'black';
    context.font = "100px TTpixel"; // 
    context.fillText("START", boardWidth/2.5, boardHeight/2);
}

//board
let board; // -> access the canvas tag, empty variable
let boardWidth = 1000;
let boardHeight = 640;
let context; // -> for drawing in canvas\

//bird
let birdWidth = 90; //width/height = 408/228 = 17/12 (ratio)
let birdHeight = 60;
let birdX = boardWidth/8 // to make x,y coordinate we divide board height & width
let birdY = boardHeight/2
let birdImage;
let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight
} // makes a bird object

//pipes 
let pipeArray = []; // makes an array for pipes bc there will be a lot
let pipeWidth = 64; // width/height ratio 1/8
let pipeHeight = 512;
let pipeX = boardWidth; // (360, 0)
let pipeY = 0; 

let topPipeImage;
let bottomPipeImage;

// physics
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.1;

let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // used for drawing on the board

  // draw flappy bird (temp)
  // context.fillStyle = "green" // fills the "bird" with green
  // context.fillRect(bird.x, bird.y, bird.width, bird.height) // makes a rectangle

  // load images
  birdImage = new Image(); // draws an image thats empty
  birdImage.src = "images/hachiware.png"; // gives the image
  birdImage.onload = function() {
  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height)
  }

  topPipeImage = new Image();
  topPipeImage.src = "images/toppipe.png"

  bottomPipeImage = new Image();
  bottomPipeImage.src = "images/bottompipe.png"

  context.fillStyle = "white"; // color of the font
  context.strokeStyle = 'black';
  context.font = "100px TTpixel"; // size & font
  context.fillText("START", boardWidth/2.5, boardHeight/2)
  context.strokeText("START", boardWidth/2.5, boardHeight/2);
  
  // start game
  document.addEventListener("keydown", startGame)

  function startGame(event) {
    document.removeEventListener("keydown", startGame)
    requestAnimationFrame(update);
    setInterval(placePiples, 2000); // calls placePipes function every 1.5s
    document.addEventListener("keydown", moveBird); // if u tap on a key, its gonna call the function
  }
}

function update() {

  requestAnimationFrame(update); // loop update() again the next frame
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height); // clears from the previous frame so it doesnt stack

  //bird
  velocityY += gravity; // adds gravity to velocity
  // bird.y += velocityY; // adds bird.y and adds velocity to it
  bird.y = Math.max(bird.y + velocityY, 0) // apply gravity, and doesnt go pass the top of the canvas
  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height); // draws bird again in next frame

  if (bird.y > 550) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) { // i = index, pipeArray.length = how many items r inside the array
    let pipe = pipeArray[i];
    pipe.x += velocityX; // overtime, the pipe moves to the left
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

    if (!pipe.passed && bird.x > pipe.x + pipe.width) { // if the bird.x has passed the right side of the pipe, add score
      score = score + 1 /2; // adds the score
      pipe.passed = true;

      if (score > highScore) {
          highScore = score;
          saveHighscore(highScore);
      }
    }

    if (detectCollision(bird, pipe)) { // so if the function of detectColission = true, gameover = true
      gameOver = true;
    }
  }

  // clear pipe to save memory 
  while (pipeArray.length  > 0 && pipeArray[0].x < -pipeWidth) { // checks if the x position has gone passed 0
    pipeArray.shift(); // removes the first element from the array

  }

  // score
  context.fillStyle = "white"; // color of the font
  context.font = "100px TTpixel"; // size & font
  context.fillText(score, 5, 90);
  context.strokeText(score, 5, 90);
  context.fillText(`HS:${highScore}`, 750, 90)
  context.strokeText(`HS:${highScore}`, 750, 90)

if (gameOver) {
    context.fillStyle = "rgba(0, 0, 0, 0.2)"; 
    context.fillRect(0, 0, boardWidth, boardHeight);
    context.fillStyle = "white";  // makes fill style white again
    context.fillText("GAME OVER :(", boardWidth / 3.5, boardHeight / 2);
    context.strokeText("GAME OVER :(", boardWidth / 3.5, boardHeight / 2);
    context.fillText("space to restart", boardWidth / 3.5, boardHeight / 1.6);
    context.strokeText("space to restart", boardWidth / 3.5, boardHeight / 1.6);
    context.fillText(score, 5, 90);
    context.strokeText(score, 5, 90);
}
}

function placePiples() {
  if (gameOver) {
    return;
  }
  // returns a value between 0-1*pipe height/2
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 
  let openingSpace = board.height/3.5;

  let topPipe = {
    img : topPipeImage,
    x : pipeX,
    y : randomPipeY,
    width : pipeWidth,
    height : pipeHeight,
    passed : false // to see if flappy bird already passed the pipe
  }

  pipeArray.push(topPipe); // adds a new pipe to the array every time the function is called

  let bottomPipe = {
    img : bottomPipeImage,
    x : pipeX,
    y : randomPipeY + pipeHeight + openingSpace,
    width : pipeWidth,
    height : pipeHeight,
    passed : false
  }

  pipeArray.push(bottomPipe) // adds bottom pipe to the array

}

function moveBird(e) {

  if (e.code == "Space" || e.code == "ArrowUp") { // .code tells which key has been pressed
    //jump
    velocityY = -4;


    // reset game
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollision(a, b) { // aabb collision detection
  return a.x < b.x + b.width && // checks if bird is at the left side of b
        a.x + a.width > b.x && // checks if bird is at the right side of b
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

}

function changeSkin(skin) {
  context.clearRect(bird.x, bird.y, birdWidth, birdHeight);
  if (skin == 2) {
      birdImage.src = "images/chiikawa.png"; 
  } else if (skin == 1) {
      birdImage.src = "images/hachiware.png"; 
  } else if (skin == 3) {
      birdImage.src = "images/usagi.png"; 
  }
    birdImage.onload = function() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  }
}

function adjustAmount(plusMinus) { 
  if (plusMinus == 1) {
    velocityY = velocityY*2
    gravity = gravity*2
  } else if (plusMinus == 2) {
    velocityY = velocityY/2
    gravity = gravity/2
  }
}


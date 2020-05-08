var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

window.onload = function() {
    this.init();
    window.addEventListener('resize', init, false);
}

var mywidth = window.innerWidth/2;
var myheight = window.innerHeight/2;

function init() {
    
    ctx.canvas.width = mywidth;
    ctx.canvas.height = myheight;
    ctx.fillStyle = "light-grey"
    ctx.fillRect(0, 0, mywidth, myheight);
}


var ballRadius = (mywidth+myheight)/120;
var x = canvas.width/2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

var paddleHeight = myheight/35;
var paddleWidth = mywidth/8;
var paddleX = (canvas.width - paddleWidth)/2;

var brickRowCount = 3;
var brickColCount = 5;
var brickWidth = mywidth/10;
var brickHeight = myheight/35;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = (mywidth-(6*brickWidth))/2;

var score = 0;
var lives = 3;

var bricks = [];
for(var c = 0; c < brickColCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }

}

var leftpressed = false;
var rightpressed = false;

function drawLives() {
    ctx.font = "16px Ariel";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}

var brickColor = "black";

function drawbricks() {
    for(var c = 0; c < brickColCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
            var brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = brickColor;
            ctx.fill();
            ctx.closePath();
        }
      }
    }
}

function drawpaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

var ballColor = "blue";
function changeColor() {
    var x = Math.floor(Math.random()*256);
    var y = Math.floor(Math.random()*256);
    var z = Math.floor(Math.random()*256);
    ballColor = "rgb(" + x + "," + y + "," + z + ")";
}


function drawball() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Ariel";
    ctx.fillStyle = "0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    for(var c = 0; c < brickColCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColCount) {
                        alert("YOU WIN!! CONGRATULATION!!!")
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawbricks();
    drawLives();
    drawScore();
    drawpaddle();
    collisionDetection();
    drawball();
    x = x + dx;
    y = y + dy;
    if(x+ballRadius+dx > canvas.width || x+dx-ballRadius < 0) {
        dx = -dx;
        changeColor();
    }
    if(y+dy-ballRadius < 0) {
        dy = -dy;
        changeColor();
    }
    if(y+ballRadius+dy > canvas.height) {
        if(x >= paddleX && x <= paddleX + paddleWidth) {
            dy = -dy;
            if(dx<0) { dx = dx - 0.2;}
            else { dx = dx + 0.2;}
            if(dy<0) { dy = dy - 0.2;}
            else { dy = dy + 0.2;}
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                alert("OOPS! ONLY " + lives + " LIVES LEFT! CLICK OK TO CONTINUE");
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleHeight = 10;
                paddleWidth = 75;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    if(rightpressed == true) {
        paddleX += 3;
        if(paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleX;
        }
    }
    if(leftpressed == true) {
        paddleX -= 3;
        if(paddleX < 0) {
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}


document.addEventListener("keydown", keydownHandler, false);
document.addEventListener("keyup", keyupHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keydownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightpressed = true;
    }    
    if(e.key == "Left" || e.key == "ArrowLeft") {
        leftpressed = true;
    }
}

function keyupHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightpressed = false;
    }
    if(e.key == "Left" || e.key == "ArrowLeft") {
        leftpressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

draw();
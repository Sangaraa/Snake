var snake;
var grid = 20;
var HighScore = 0;

function setup() {
  createCanvas(800, 600);
  frameRate(10);
  snake = new Snake();
  food = new Food();
}

function draw() {
  layout();
  
  snake.update();
  snake.show();
  
  if (snake.gameover) {
    noLoop();
  }
  
  if (snake.eat(food.pos)) {
    food.spawn();
  }
  food.show();
}

function layout(){
	background(15);
	stroke(255, 0, 0);
	for (var w = 0; w * grid <= width; w++){
  	line((w - 1/4) * grid, 0, (w + 1/4) * grid, 0);
    line((w - 1/4) * grid, height - 1, (w + 1/4) * grid, height - 1);
  }
  for (var h = 0; h * grid <= height; h++){
  	line(0, (h - 1/4) * grid, 0, (h + 1/4) * grid);
    line(width - 1, (h - 1/4) * grid, width - 1, (h + 1/4) * grid);
  }
  
  stroke(0);
  fill(255);
  textSize(12);
  text('Score: ' + snake.length, 1, height - 6);
  textSize(12);
  text('Highscore: ' + HighScore, width * 0.75, height - 6);
}

function Food() {
  this.pos = createVector(grid, 0);

  this.spawn = function() {
    this.pos.x = floor(random(1, width / grid-1)) * grid;
    this.pos.y = floor(random(1, height / grid-1)) * grid;
  }

  this.show = function() {
    fill(50, 220, 51);
    rect(this.pos.x, this.pos.y, grid, grid);
  }
}

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      snake.dir(0, -1);
      break;
    case LEFT_ARROW:
      snake.dir(-1, 0);
      break;
    case RIGHT_ARROW:
      snake.dir(1, 0);
      break;
    case DOWN_ARROW:
      snake.dir(0, 1);
      break;
  	case ENTER:
      setup();
      loop();
      break;
  }
}

function Snake() {
  this.pos = createVector(0, 0)
  this.speed = createVector(0, 0)

  this.tail = [];
  this.length = 0;

  this.gameover = false;

  this.update = function() {
    
    //shifting tail, so new location is at the end  
    if (this.length === this.tail.length) {
      for (var i = 0; i < this.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.length - 1] = createVector(this.pos.x, this.pos.y);

    //moving snake
    this.pos.x += this.speed.x * grid;
    this.pos.y += this.speed.y * grid;

    for (var j = 0; j < this.length - 1; j++){
    	if (dist(this.pos.x, this.pos.y, this.tail[j].x, this.tail[j].y) < 5){
        console.log('You have bitten your own ASS you FOOL');
        this.death();
      }    
    }       

    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      this.death();
    }

  }

  this.death = function() {
    
    if (snake.length > HighScore){
      HighScore = snake.length;
    }
    
    fill(255, 50, 50);
    textSize(128);
    text('Game Over', 40, height / 2);
    fill(120);
    textSize(32);
    text('Score: ' + snake.length, 40, height / 2 + 64)
    textSize(32);
    text('Highscore: ' + HighScore, 40, height / 2 + 96)
    fill(255);
    textSize(32);
    text('Press ENTER to Restart the Game!', 0, height-8);
    this.gameover = true;
  }

  this.dir = function(x, y) {
    this.speed.x = x;
    this.speed.y = y;
  }

  this.eat = function(f) {
    //distance between snake head and food
    var d = dist(this.pos.x, this.pos.y, f.x, f.y);

    if (d < 1) {
      this.length++;
      return true;
    } else {
      return false;
    }
  }

  this.show = function() {
    fill(255);

    //drawing history of snake
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, grid, grid);
    }

    //drawing head of snake
    rect(this.pos.x, this.pos.y, grid, grid);

  }
}
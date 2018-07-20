// Global variables
var intHighlight = false;
var extHighlight = false;

function setup() {
  // Canvas Setup
  canvas = {
    width: 0.95 * document.getElementById('model').offsetWidth,
    height: 400,
  };
  var model = createCanvas(canvas.width, canvas.height);
  model.parent('model')

  // Shape settings
  offset = {
    top: canvas.height * 0.62,
    bottom: canvas.height * 0.38,
    left: canvas.width * 0.25,
    right: canvas.width * 0.75,
  };
  center = {
    horizontal: canvas.height * 0.5,
    vertical: canvas.width * 0.5,
  };
  rectMode(CENTER)
  ellipseMode(CENTER)
}

function draw() {
  // Base schematic drawing
  background(240, 240, 255)
  drawBase(offset, center, 0.9 * canvas.width)

  // Draws highlights
  if (intHighlight) {
    for (let i=0; i<=3; i++) {
      drawIntHighlight(i)
    }
  }
  if (extHighlight) {
    for (let i=0; i<=3; i++) {
      drawExtHighlight(i)
    }
  }
}

function drawBase(offset, center, length) {
  // Draws 2D bearing housings schematic
  let offsetArr = [offset.left, offset.right, offset.top, offset.bottom];
  for (let i=0; i<=1; i++) {
    fill(240, 240, 240)
      rect(offsetArr[i], center.horizontal, 60, 180)
    fill(200, 200, 200)
      rect(offsetArr[i], offset.bottom - 30, 60, 24)
      rect(offsetArr[i], offset.top + 30, 60, 24)
    fill(255, 255, 255)
  }

  // Draws 2D bearing schematic
  for (let i=0; i<=1; i++) {
    for (let j=2; j<=3; j++) {
      rect(offsetArr[i], offsetArr[j] - 12, 30, 12)
      rect(offsetArr[i], offsetArr[j] + 12, 30, 12)
      ellipse(offsetArr[i], offsetArr[j], 18, 18)
    }
  }

  // Draws 2D shaft schematic
  rect(center.vertical, center.horizontal, length, 60)

  // Draws centerline
  let prev = 6;
  for (let i=0; i<length + 20; i+=20) {
    line(prev + 4, center.horizontal, prev + 16, center.horizontal)
    point(prev + 20, center.horizontal)
    prev += 20;
  }
  line(prev + 4, center.horizontal, prev + 16, center.horizontal)
}

function internalHighlight() {
  // Internal highlight boolean
  intHighlight = true;
  extHighlight = false;
}

function externalHighlight() {
  // External highlight boolean
  extHighlight = true;
  intHighlight = false;
}

function drawIntHighlight(pos) {
  // Draws internal location highlights
  let posArr = [offset.left - 15, offset.left + 15, offset.right - 15, offset.right + 15]
  noStroke()
  fill(255, 100, 100, 100)
    rect(posArr[pos], center.horizontal + 31, 20, 20, 5, 5, 5, 5)
    rect(posArr[pos], center.horizontal - 30, 20, 20, 5, 5, 5, 5)
  stroke(0)
}

function drawExtHighlight(pos) {
  // Draws internal location highlights
  let posArr = [offset.left - 15, offset.left + 15, offset.right - 15, offset.right + 15]
  noStroke()
  fill(255, 100, 100, 100)
    rect(posArr[pos], center.horizontal + 66, 20, 20, 5, 5, 5, 5)
    rect(posArr[pos], center.horizontal - 65, 20, 20, 5, 5, 5, 5)
  stroke(0)
}

function drawExtCirclip(pos) {
  // Draws external circlip schematic at position 0 to 3
  let posArr = [offset.left - 18, offset.left + 18, offset.right - 18, offset.right + 18]
  fill(100, 100, 255)
    rect(posArr[pos], center.horizontal + 30, 6, 12)
    rect(posArr[pos], center.horizontal - 30, 6, 12)
}

function drawIntCirclip(pos) {
  // Draws external circlip schematic at position 0 to 3
  let posArr = [offset.left - 18, offset.left + 18, offset.right - 18, offset.right + 18]
  fill(100, 100, 255)
    rect(posArr[pos], center.horizontal + 65, 6, 12)
    rect(posArr[pos], center.horizontal - 65, 6, 12)
}
function setup() {
  // Canvas Setup
  var canvasWidth = 0.95 * document.getElementById('model').offsetWidth;
  var canvasHeight = 400;
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('model')
  background(240, 240, 255)

  // Shape settings
  var bearingLoc = [canvasWidth*0.25, canvasWidth*0.75, canvasHeight*0.38, canvasHeight*0.62];
  var shaftLoc = [canvasWidth*0.5, canvasHeight*0.5];
  rectMode(CENTER)
  ellipseMode(CENTER)

  // Initial model setup
  drawHousing(bearingLoc, shaftLoc, 12)
  drawBearing(bearingLoc, 12)
  drawShaft(shaftLoc, 0.9 * canvasWidth)
}

function draw() {

}

function drawHousing(housingOffset, housingCenter) {
  // Draws 2D bearing housings
  for (var i=0; i<=1; i++) {
    fill(240, 240, 240)
    rect(housingOffset[i], housingCenter[1], 60, 180)
    fill(200, 200, 200)
      rect(housingOffset[i], housingOffset[2] - 30, 60, 24)
      rect(housingOffset[i], housingOffset[3] + 30, 60, 24)
    fill(255, 255, 255)
  }
}

function drawBearing(bearingCenter, ballSize) {
  // Draws 2D bearing schematic
  for (var i=0; i<=1; i++) {
    for (var j=2; j<=3; j++) {
      rect(bearingCenter[i], bearingCenter[j] - ballSize, 30, 12)
      rect(bearingCenter[i], bearingCenter[j] + ballSize, 30, 12)
      ellipse(bearingCenter[i], bearingCenter[j], ballSize*1.5, ballSize*1.5)
    }
  }
}

function drawShaft(shaftCenter, shaftWidth) {
  // Draws 2D shaft schematic
  rect(shaftCenter[0], shaftCenter[1], shaftWidth, 60)

  // Draws centerline
  var prev = 6;
  for (var i=0; i<shaftWidth + 20; i+=20) {
      line(prev + 4, shaftCenter[1], prev + 16, shaftCenter[1])
      point(prev + 20, shaftCenter[1])
      prev += 20;
  }
  line(prev + 4, shaftCenter[1], prev + 16, shaftCenter[1])
}
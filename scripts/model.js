class Default {
  // Includes functions to render the default bearing-shaft arrangement
  constructor() {
    this.render = function() {
      drawBearing(offset.left, shaft.diameter);
      drawBearing(offset.right, shaft.diameter);
      drawShaft('default');
      drawShoulder(offset.left, shaft.diameter, 'default');
      drawShoulder(offset.right, shaft.diameter, 'default');
      drawCentreline(centre.horizontal, shaft.long);
    }
  }
}

class Constraint {
  // Includes functions to render all constraint types at each location
  constructor(type, location) {
    var updateRender = function() {}, 
        updatePosition = function() {};
    var pos, typeColour, rate, redRGB;

    this.resetHighlight = function() {
      rate = 5, redRGB = 45;
    }
    this.resetHighlight();

    this.init = function() {
      switch(type) {
        case 'circlip':
          updateRender = function() {
            drawCirclip(location, false);
          }
          updatePosition = function() {
            return pos = drawCirclip(location, true);
          }
          typeColour = 100;
        break
        case 'collar':
          updateRender = function() {
            drawCollar(location, false);
          }
          updatePosition = function() {
            return pos = drawCollar(location, true);
          }
          typeColour = 255;
        break
        case 'shoulder':
          updateRender = function() {
            drawShoulder(location);
          }
          typeColour = 255;
        break
        case 'spacer':
          updateRender = function() {
            drawSpacer(false);
          }
          updatePosition = function() {
            return pos = drawSpacer(true);
          }
          typeColour = 100;
        break
      }
    }
    this.init();

    this.render = function() {
      fill(typeColour, typeColour, typeColour)
      updateRender();
    }

    this.highlight = function() {
      if (state[location] == 'empty' && !(type == 'spacer' && (state[1] != 'empty' || state[2] != 'empty'))) {
        [redRGB, rate] = highlightConstraint([redRGB, rate], updateRender);
        if (held) {
          if (checkHover(updatePosition())) {
            model.run = model.run.concat(this);
            state[location] = type;
            if (type == 'spacer') {
              state[2] = 'spacer';
            }
          }
        }
      }
    }
  }
}

function setup() {
  // Canvas setup
  canvas = {
    width: 0.95 * document.getElementById('model.ID').offsetWidth,
    height: 400,
  }
  canvas.dimensions = createCanvas(canvas.width, canvas.height);
  canvas.dimensions.parent('model.ID');

  // Dimensioning and location
  shaft = {
    long: canvas.width * 0.9,
    diameter: 60,
  }
  centre = {
    horizontal: canvas.height * 0.5,
    vertical: canvas.width * 0.5,
  }
  offset = {
    top: centre.horizontal + shaft.diameter/2 + 20,
    bottom: centre.horizontal - shaft.diameter/2 - 20,
    left: canvas.width * 0.25,
    right: canvas.width * 0.75,
  }

  // Initialising model
  rectMode(CENTER);
  ellipseMode(CENTER);

  held = false;
  state = [], hover = [];
  model.circlip = [], model.collar = [], model.spacer = [], model.shoulder = [];

  for (let i=0; i<8; i++) {
    model.circlip[i] = new Constraint('circlip', i);
    model.collar[i] = new Constraint('collar', i);
    model.spacer[i] = new Constraint('spacer', i);
    model.shoulder[i] = new Constraint('shoulder', i);
  }

  model.default = [new Default()];
  resetModel();
}

function draw() {
  background(240, 240, 255)

  // Display run array
  for (let i=0; i<model.run.length; i++) {
    model.run[i].render();
  }
  for (let i=0; i<model.runHighlight.length; i++){
    model.runHighlight[i].highlight();
  }

  // Resets held status at the end of each cycle
  if (held) {
    held = false;
  }
}

function mouseClicked() {
  // p5 function that triggers when the mouse is pressed and released
  held = true;
}

function resetModel() {
  // Reset model render
  model.run = model.default;
  model.runHighlight = [];
  for (let i =0; i<8; i++) {
    state[i] = 'empty';
    model.circlip[i].resetHighlight();
    model.collar[i].resetHighlight();
    model.spacer[i].resetHighlight();
    model.shoulder[i].resetHighlight();    
  }
}

function feature(type) {
  // Assigns constraint type
  model.runHighlight = [];
  switch (type) {
    case 'intCirclip':
      model.runHighlight = model.circlip.slice(0,4);
    break
    case 'extCirclip':
      model.runHighlight = model.circlip.slice(4,8);
    break
    case 'collar':
      model.runHighlight = model.collar.slice(0,4);
    break
    case 'spacer':
      model.runHighlight = model.spacer.slice(1,2);
    break
    case 'shoulder':
      model.runHighlight = model.shoulder.slice(4,8);
    break
  }
}

function highlightConstraint(colour, render) {
  // Updates constraint highlight colour
  stroke('red');
  fill(255, colour[0] += colour[1], 45, 150);
  render();
  stroke('black');
  if (colour[0] >= 255) {
    colour[1] = -5;
  }
  if (colour[0] <= 45) {
    colour[1] = 5;
  }
  return colour;
}

function checkHover(pos) {
  // Returns true if the mouse is within the position object parameters
  let margin = 5;
  if (mouseX > pos.x - pos.long/2 - margin && mouseX < pos.x + pos.long/2 + margin &&
        mouseY > centre.horizontal - pos.shift - pos.high/2 - margin &&
          mouseY < centre.horizontal + pos.shift + pos.high/2 + margin) {
    held = false;
    return true;
  }
}

function drawBearing(x, diameter) {
  // Draws the bearing and default housing at a given x location
  let shapeColor = ['black', 'white'], outlineSize = [2, 0],
      y = [centre.horizontal + diameter/2 + 21, centre.horizontal - diameter/2 - 20];
  fill(240, 240, 240);
    rect(x, centre.horizontal, 70, 160, 2, 2, 2, 2);
  noStroke();
  for (let i=0; i<=1; i++) {
    for (let j=0; j<=1; j++) {
      fill(shapeColor[i]);
        rect(x + 0.5, y[j] - 16, 40 + outlineSize[i], 12  + outlineSize[i], 1, 1, 1, 1);
        rect(x + 0.5, y[j] + 16, 40 + outlineSize[i], 12 + outlineSize[i], 1, 1, 1, 1);
        ellipse(x + 0.5, y[j], 24 + outlineSize[i], 24 + outlineSize[i]);
    }
  }
  fill('white');
  stroke('black');
}

function drawCentreline(y, length) {
  // Draws centreline at y for a given length
  let prev = canvas.width * 0.025 - 4;
  stroke('black');
  for (let i=0; i<length+20; i+=20) {
    line(prev + 4, y, prev + 16, y)
    point(prev + 20, y)
    prev += 20;
  }
  line(prev + 4, y, prev + 16, y)
}

function drawCirclip(location, returnPos) {
  // Draws circlip at x for a given location
  let x = [offset.left - 24, offset.left + 24, offset.right - 24, offset.right + 24],
      shift = 30;
  if (location > 3) {
    shift = 72;
    location -= 4;
  }
  if (returnPos) {
    return {x: x[location], shift: shift, long: 6, high: 12};
  }
  else {
    rect(x[location], centre.horizontal + shift, 6, 12, 1, 1, 1, 1);
    rect(x[location], centre.horizontal - shift, 6, 12, 1, 1, 1, 1);
  }
}

function drawCollar(location, returnPos) {
  // Draws collar at x for a given location
  let long = canvas.width * 0.2 - 20,
      x = [offset.left - 20.5 - long/2, offset.left + 20.5 + long/2,
           offset.right - 20.5 - long/2, offset.right + 20.5 + long/2];
  if ((location == 1 && state[2] == 'collar') || (location == 2 && state[1] == 'collar')) {
    x[location] = centre.vertical;
    long = canvas.width * 0.5 - 41;
  }
  if (returnPos) {
    return {x: x[location], shift: 0, long: long, high: shaft.diameter + 30};
  }
  else {
    rect(x[location], centre.horizontal, long, shaft.diameter + 30, 1, 1, 1, 1);
    drawCentreline(centre.horizontal, shaft.long);
  }
}

function drawShaft(stepped) {
  if (stepped == 'default') {
    rect(centre.vertical, centre.horizontal, shaft.long, shaft.diameter, 3, 3, 3, 3);
  }
  else {
  }
}

function drawShoulder(x, diameter, location) {
  // Draws bearing housing and shoulder at x for a given shaft diameter and location
  if (location == 'default') {
    fill(200, 200, 200);
      rect(x, centre.horizontal + diameter/2 + 54, 70, 24, 2, 2, 0, 0);
      rect(x, centre.horizontal - diameter/2 - 54, 70, 24, 0, 0, 2, 2);
    fill('white')
  }
  else {

  }
}

function drawSpacer(returnPos) {
  // Draws spacer at location 1 and 2
  if (returnPos) {
    return {x:centre.vertical, shift: 0, high: shaft.diameter + 25, long: canvas.width * 0.5 - 41};
  }
  else {
    rect(centre.vertical, centre.horizontal - shaft.diameter/2 - 7.5, canvas.width * 0.5 - 41, 15, 1, 1, 1, 1);
    rect(centre.vertical, centre.horizontal + shaft.diameter/2 + 7.5, canvas.width * 0.5 - 41, 15, 1, 1, 1, 1);
    drawCentreline(centre.horizontal, shaft.long);
  }
}
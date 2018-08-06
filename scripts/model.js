class Default {
  // Includes functions to render the default bearing-shaft arrangement
  constructor() {
    this.render = function() {
      drawBearing(offset.left, shaft.diameter);
      drawBearing(offset.right, shaft.diameter);
      drawShaft('default');
      drawHousing(offset.left, shaft.diameter, 'default');
      drawHousing(offset.right, shaft.diameter, 'default');
      drawCentreline(centre.horizontal, shaft.long);
    }
  }
}

class Constraint {
  // Includes functions to render all constraint types at each location
  constructor(type, location) {
    var updateRender = function() {}, 
        updatePosition = function() {},
        updatePreview = function() {};
    var pos, rate, redRGB;

    this.resetHighlight = function() {
      rate = 5, redRGB = 45;
    }
    this.resetHighlight();

    this.init = function() {
      switch(type) {
        case 'circlip':
          updateRender = function() {
            fill(100, 100, 100)
              drawCirclip(location, false);
          }
          updatePreview = function() {
            drawCirclip(location, false);
          }
          updatePosition = function() {
            return pos = drawCirclip(location, true);
          }
        break
        case 'collar':
          updateRender = function() {
            fill('white')
            if ((location == 1 && state[2] == 'collar') || (location == 2 && state[1] == 'collar')) {
              drawCollar(location, false, true);
            }
            else {
              drawCollar(location, false, false);
            }
          }
          updatePreview = function() {
            drawCollar(location, false, false);
          }
          updatePosition = function() {
            return pos = drawCollar(location, true);
          }
        break
        case 'shoulder':
          updateRender = function() {
            fill(200, 200, 200)
              drawHousing(0, 0, location);
          }
          updatePreview = function() {
            drawShoulder(location, false);
          }
          updatePosition = function() {
            return pos = drawShoulder(location, true);
          }
        break
        case 'spacer':
          updateRender = function() {
            fill(100, 100, 100)
              drawSpacer(false);
            state[2] = 'spacer';
          }
          updatePreview = function() {
            drawSpacer(false);
          }
          updatePosition = function() {
            return pos = drawSpacer(true);
          }
        break
      }
    }
    this.init();

    this.render = function() {
      updateRender();
    }

    this.preview = function() {
      updatePreview();
    }

    this.highlight = function() {
      if (state[location] == 'empty' && !(type == 'spacer' && (state[1] != 'empty' || state[2] != 'empty'))) {
        [redRGB, rate] = highlightConstraint([redRGB, rate], updatePreview);
        if (held) {
          if (checkHover(updatePosition())) {
            model.run = model.run.concat(this);
            state[location] = type;
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

function mouseClicked() {
  // p5 function that triggers when the mouse is pressed and released
  held = true;
}

function highlightConstraint(colour, preview) {
  // Updates constraint highlight colour
  stroke('red');
  fill(255, colour[0] += colour[1], 45, 150);
  preview();
  stroke('black');
  if (colour[0] >= 255 || colour[0] <= 45) {
    colour[1] *= -1;
  }
  return colour;
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
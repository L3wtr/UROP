/* Default class to render the bearing-shaft arrangement */
class Default {
  constructor(layer) {
    let updateRender = function() {};

    this.init = function() {
      switch(basic.layer[layer]) {
        case 'back':
          updateRender = function() {
            drawBack(basic.stepped, basic.merged);
          }
        break
        case 'bearing':
          updateRender = function() {
            drawBearing(pos.offset.left, false);
            drawBearing(pos.offset.right, basic.stepped);
          }
        break
        case 'housing':
          updateRender = function() {
            drawBasicHousing(pos.offset.left, basic.merged);
            drawBasicHousing(pos.offset.right, basic.merged);
          }
        break
        case 'shaft':
          updateRender = function() {
            drawShaft(basic.stepped);
          }
        break
        case 'line':
          updateRender = function() {
            drawCentreline(pos.centre.y, canvas.dim.x * 0.95);
          }
        break
      }
    }
    this.init();

    this.render = function() {
      updateRender();
    }
  }
}

/* Constraint class to render all constraint types at each location */
class Constraint {
  constructor(type, location) {
    let updateRender = function() {}, 
        updatePosition = function() {},
        updatePreview = function() {};
    let position, rate, redRGB;

    this.resetHighlight = function() {
      rate = 5, redRGB = 45;
    }
    this.resetHighlight();

    this.init = function() {
      switch(type) {
        case 'circlip':
          updateRender = function() {
            fill(100, 100, 100);
            drawCirclip(location, basic.stepped);
          }
          updatePreview = function() {
            if (!basic.stepped || location != 2) {
              drawCirclip(location, basic.stepped);
            }
          }
          updatePosition = function() {
            return position = drawCirclip(location, basic.stepped, true);
          }
        break
        case 'collar':
          updateRender = function() {
            fill('white');
            if ((location == 1 && state[2] == 'collar') || (location == 2 && state[1] == 'collar')) {
              drawCollar(location, true);
            }
            else {
              drawCollar(location, false);
            }
          }
          updatePreview = function() {
            if (!basic.stepped || location == 0) {
              drawCollar(location, false);
            }
          }
          updatePosition = function() {
            return position = drawCollar(location, false, true);
          }
        break
        case 'spacer':
          updateRender = function() {
            let stateIndex = 0;
            if (location > 3) {
              stateIndex = 4;
              basic.merged = true;
            } 
            fill(100, 100, 100);
            drawSpacer(location, basic.stepped);
            state[2 + stateIndex] = 'spacer';
          }
          updatePreview = function() {
            let stateIndex = 0;
            if (location > 3) {
              stateIndex = 4;
            } 
            if(state[1 + stateIndex] == 'empty' && state[2 + stateIndex] == 'empty') {
              drawSpacer(location, basic.stepped)
            }
          }
          updatePosition = function() {
            return position = drawSpacer(location, basic.stepped, true);
          }
        break
        case 'shoulder':
          updateRender = function() {
            fill(200, 200, 200)
            drawCustomHousing(location, basic.stepped);
          }
          updatePreview = function() {
            drawShoulder(location, basic.stepped);
          }
          updatePosition = function() {
            return position = drawShoulder(location, basic.stepped, true);
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
      if (state[location] == 'empty') {
        [redRGB, rate] = highlightConstraint([redRGB, rate], updatePreview);
        if (held) {
          if (checkHover(updatePosition())) {
            design.run[location] = this;
            state[location] = type;
          }
        }
      }
    }
  }
}

/* Setup function runs once on startup */
function setup() {
  // Model dimensioning (to scale with screen width)
  canvas = {
    dim: {
      x: 0.95 * document.getElementById('model.ID').offsetWidth,
      y: 400,
    },
  };
  canvas.dimensions = createCanvas(canvas.dim.x, canvas.dim.y);
  canvas.dimensions.parent('model.ID');

  shaft = {
    dim: {
      x: canvas.dim.x * 0.9,
    },
    dia: {
      straight: 70,
      stepped: 38,
    },
  };

  pos = {
    centre: {
      x: canvas.dim.x * 0.5,
      y: canvas.dim.y * 0.5,
    },
    offset: {
      up: canvas.dim.y * 0.5 - shaft.dia.straight - 20,
      down: canvas.dim.y * 0.5 + shaft.dia.straight + 20, 
      left: canvas.dim.x * 0.25,
      right: canvas.dim.x * 0.75,
    },
  };

  basic = {
    stepped: false,
    merged: false,
    layer: ['back', 'bearing', 'housing', 'shaft', 'line'],
  };

  // Initialising model
  rectMode(CENTER);
  ellipseMode(CENTER);

  held = false;
  state = [];

  design = [];
  design.default = [], design.run = [];
  typeName = ['circlip', 'collar', 'spacer', 'shoulder'];

  for (let i=0; i<typeName.length; i++) {
    design[typeName[i]] = [];
    for (let j=0; j<8; j++) {
      design[typeName[i]][j] = new Constraint(typeName[i], j);
    }
  }

  initialise();
  reset();
}

/* Draw function loops indefinitely following setup */
function draw() {
  background(240, 240, 255);

  for (let i=0; i<basic.layer.length; i++) {
    design.default[i].render();
  }

  for (let i=0; i<design.run.length; i++) {
    if (design.run[i] != undefined) {
      design.run[i].render();
    }
  }

  for (let i=0; i<design.runHighlight.length; i++) {
    design.runHighlight[i].highlight();
  }

  if (held) {
    held = false;
  }

  updateBearingTable();
}

/* Initialises design models with latest parameters */
function initialise() {
  for (let i=0; i<basic.layer.length; i++) {
    design.default[i] = new Default(i);
  }
}

/* Resets design model */
function reset() {
  design.run = [];
  design.runHighlight = [];
  basic.merged = false;
  for (let i =0; i<8; i++) {
    state[i] = 'empty';   
  }
  updateStyle();
}

/* Assigns constraint type */
function feature(type) {
  design.runHighlight = [];
  switch (type) {
    case 'intCirclip':
      design.runHighlight = design.circlip.slice(4,8);
    break
    case 'extCirclip':
      design.runHighlight = design.circlip.slice(0,4);
    break
    case 'collar':
      design.runHighlight = design.collar.slice(0,4);
    break
    case 'inSpacer':
      design.runHighlight = design.spacer.slice(1,2);
    break
    case 'outSpacer':
      design.runHighlight = design.spacer.slice(5,6);
    break
    case 'shoulder':
      design.runHighlight = design.shoulder.slice(4,8);
    break
  }
}

/* Updates the chosen shaft style */
function updateStyle() {
  let shaftCheckbox = document.getElementById("shaft");
  if (shaftCheckbox.checked) {
    basic.stepped = true;
    removeConstraint('collar', [1, 3]);
    removeConstraint('spacer', [1]);
    removeConstraint('all', [2]);
    state[2] = 'collar';
  }
  else {
    basic.stepped = false;
    state[2] = 'empty';
  }
  
  for (let i=0; i<typeName.length; i++) {
    for (let j=0; j<8; j++) {
      design[typeName[i]][j].resetHighlight();
    }
  }
  initialise();
}

/* Removes a constraint at a given array of locations */ 
function removeConstraint(type, locations) {
  for (let i=0; i<locations.length; i++) {
    if (type == 'all' || state[locations[i]] == type) {
      state[locations[i]] = 'empty';
      design.run[locations[i]] = undefined;
    }
  }
}

/* p5 function that triggers when the mouse is pressed and released */
function mouseClicked() {
  held = true;
}

/* Returns true if the mouse is within the position object parameters */
function checkHover(position) {
  let margin = 5;
  if (mouseX > position.x - position.long/2 - margin && mouseX < position.x + position.long/2 + margin &&
        mouseY > pos.centre.y - position.shift - position.high/2 - margin &&
          mouseY < pos.centre.y + position.shift + position.high/2 + margin) {
    held = false;
    return true;
  }
}

/* Updates constraint highlight colour */
function highlightConstraint(colour, preview) {
  stroke('red');
  fill(255, colour[0] += colour[1], 45, 150);
  preview();
  stroke('black');
  if (colour[0] >= 255 || colour[0] <= 45) {
    colour[1] *= -1;
  }
  return colour;
}
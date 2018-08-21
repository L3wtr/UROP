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
            drawShaft(pos.centre.x, basic.stepped);
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
              return true;
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
              return true;
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
              if (!flag.alert && !basic.merged) {
                if (confirm('This will merge the bearing housings. Do you wish to continue?')) {
                  basic.merged = true;
                  document.getElementById('housing').checked = true;
                  flag.alert = true;
                }
                else {
                  removeConstraint('spacer', [5, 6]);
                }
              }
            }
            if (basic.merged || location < 3) {
              fill(100, 100, 100);
              drawSpacer(location, basic.stepped);
              state[2 + stateIndex] = 'spacer';
            }
          }
          updatePreview = function() {
            let stateIndex = 0;
            if (location > 3) {
              stateIndex = 4;
            } 
            if(state[1 + stateIndex] == 'empty' && state[2 + stateIndex] == 'empty') {
              drawSpacer(location, basic.stepped)
              return true;
            }
          }
          updatePosition = function() {
            return position = drawSpacer(location, basic.stepped, true);
          }
        break
        case 'shoulder':
          updateRender = function() {
            fill(200, 200, 200)

            if (((location == 5 && state[6] == 'shoulder') || (location == 6 && state[5] == 'shoulder')) && basic.merged) {
              drawCustomHousing(location, basic.stepped, true);
            }
            else {
              drawCustomHousing(location, basic.stepped, false);
            }
          }
          updatePreview = function() {
            drawShoulder(location, basic.stepped);
            return true;
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
        if(checkHover(updatePosition(), true)) {
          flag.hand = true;
        }
        if (flag.held && updatePreview()) {
          if (checkHover(updatePosition(), false)) {
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

  mode = 'design';
  flag = {
    held: false,
    hand: false,
    press: false,
    alert: false,
  };
  drag = {
    hover: false,
    origin: 0,
    x: 0,
    part: undefined,
  };

  initialise();
  reset();
}

/* Draw function loops indefinitely following setup */
function draw() {
  // Default model
  background(240, 240, 255);
  for (let i=0; i<basic.layer.length; i++) {
    design.default[i].render();
  }
  for (let i=0; i<design.run.length; i++) {
    if (design.run[i] != undefined) {
      design.run[i].render();
    }
  }

  // Model modes
  switch (mode) {
    case 'design':
      for (let i=0; i<design.runHighlight.length; i++) {
        design.runHighlight[i].highlight();
      }
    break
    case 'drag':
      dragPosition();
    break
  }

  // Mouse click and hover checks
  if (flag.held) {
    flag.held = false;
  }
  if (flag.hand) {
    flag.hand = false;
    cursor(HAND);
  }
  else {
    cursor(ARROW);
  }

  // Update user information
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

/* Updates model mode */
function updateMode() {
  let modeCheck = document.querySelector('input[name="mode.ID"]:checked').value;
  mode = modeCheck;
  design.runHighlight = []
}

/* Updates the chosen shaft style */
function updateStyle() {
  let stepCheck = document.querySelector('input[name="shaft.ID"]:checked').value;
  if (stepCheck == 'stepped') {
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

/* Updates bearing housing (merged or unmerged) */
function updateHousing() {
  let mergeCheck = document.getElementById('housing');
  if (mergeCheck.checked) {
    basic.merged = true;
  }
  else {
    basic.merged = false;
    flag.alert = false;
    removeConstraint('spacer', [5, 6]);
  }

  for (let i=0; i<typeName.length; i++) {
    for (let j=0; j<8; j++) {
      design[typeName[i]][j].resetHighlight();
    }
  }
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
  flag.held = true;
  drag.x = 0;
}

/* p5 function that triggers when the mouse is pressed */
function mousePressed() {
  drag.origin = mouseX;
  flag.press = true;
}

/* p5 function that triggers when the mouse is dragged */
function mouseDragged() {
  if (mode == 'drag' && drag.hover) {
    drag.x = mouseX - drag.origin;
  }
}

/* Returns true if the mouse is within the position object parameters */
function checkHover(position, pointer) {
  let margin = 5;
  if (mouseX > position.x - position.long/2 - margin && mouseX < position.x + position.long/2 + margin &&
        mouseY > pos.centre.y - position.shift - position.high/2 - margin &&
          mouseY < pos.centre.y + position.shift + position.high/2 + margin) {
    if (!pointer) {
      flag.held = false;
    }
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

/* Returns the relevant component (part) corresponding to the drag x-coordinate */
function dragPosition() {
  let part = ['shaft', 'right', 'shaft', 'left'];
  let selected = [checkHover({x: pos.centre.x + drag.x, shift: -5, long: shaft.dim.x, high: shaft.dia.stepped}, true),
                  checkHover({x: pos.offset.right + drag.x, shift: shaft.dia.straight/2 + 14, long: 42, high: 60}, true),
                  checkHover({x: pos.centre.x - canvas.dim.x * 0.1 - 12.5 + drag.x, shift: -5, long: canvas.dim.x * 0.7 - 25, high: shaft.dia.straight}, true),
                  checkHover({x: pos.offset.left + drag.x, shift: shaft.dia.straight/2 + 14, long: 42, high: 60}, true)];
  if (basic.stepped) {
    selected[1] = checkHover({x: pos.offset.right + drag.x, shift: shaft.dia.straight/2 + 14, long: 50.5, high: 60}, true);
  }                  

  for (let i=0; i<selected.length; i++) {
    if (selected[i]) {
      flag.hand = true;
      if (flag.press) {
        drag.hover = true;
        drag.part = part[i];
        break;
      }
    }
    drag.hover = false;
  }
  if (!drag.hover) {
    flag.press = false;
  }
}
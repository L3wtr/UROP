/* Base class to render the bearing-shaft arrangement */
class Base {
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
            if ((location == 1 && con.tag[2] == 'collar') || (location == 2 && con.tag[1] == 'collar')) {
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
            if (location > 3) {
              if (!flag.alert && !basic.merged) {
                if (confirm('This will merge the bearing housings. Do you wish to continue?')) {
                  document.getElementById('housing').checked = true;
                  basic.merged = true;
                  flag.alert = true;
                }
                else {
                  removeConstraint(type, [5, 6]);
                }
              }
            }
            if (basic.merged || location < 3) {
              fill(100, 100, 100);
              drawSpacer(location, basic.stepped);
            }
          }
          updatePreview = function() {
            if(con.tag[location] == 'empty' && con.tag[location + 1] == 'empty') {
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

            if (((location == 5 && con.tag[6] == 'shoulder') || (location == 6 && con.tag[5] == 'shoulder')) && basic.merged) {
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
      if (con.tag[location] == 'empty') {
        [redRGB, rate] = highlightPreview([redRGB, rate], updatePreview);
        if(checkHover(updatePosition(), true)) {
          flag.hand = true;
        }
        if (flag.held && updatePreview()) {
          if (checkHover(updatePosition(), false)) {
            updateConstraint(type, location);
            design.run[location] = this;
            flag.warning = true;
          }
        }
      }
    }
  }
}

/* Drag class to render the dragged components */
class Drag {
  constructor(part) {
    let hover = function() {},
        direction = function() {};
    let face = [false, false]; // Defines which sides of each part are constrained; [left, right]

    this.init = function() {
      switch (part) {
        case 'shaft':
          hover = function() {
            let isHovering = false; // Returns true if any of the hover conditions are met
            if (basic.stepped) {
              isHovering = checkHover({x: pos.centre.x + move.x, shift: -5, long: shaft.dim.x, high: shaft.dia.stepped}, true);
              if (!isHovering) {
                isHovering = checkHover({x: pos.centre.x - canvas.dim.x * 0.1 - 12.5 + move.x, shift: -5, long: canvas.dim.x * 0.7 - 25, high: shaft.dia.straight}, true);
              }            
            }
            else {
              isHovering = checkHover({x: pos.centre.x + move.x, shift: -5, long: shaft.dim.x, high: shaft.dia.straight}, true);
            }
            return isHovering;
          }
          direction = function(x) {
            let sign = 1;
            for (let i=0; i<4; i++) {
              if (con.state[i] && con.state[4+i+sign] && sign*move.x > 0) {
                return x;
              }
              sign *= -1;
            }
            return x + move.x;
          }
        break
        case 'leftBearing':
          hover = function() {
            return checkHover({x: pos.offset.left + move.x, shift: shaft.dia.straight/2 + 14, long: 42, high: 60}, true, true);
          }
          direction = function(x) {
            let sign = 1;
            for (let i=0; i<2; i++) {
              if (!con.state[4+i] && sign*move.x < 0) {
                x += move.x;
              }
              sign *= -1;
            }
            return x;
          }
        break
        case 'rightBearing':
          hover = function() {
            if (basic.stepped) {
              return checkHover({x: pos.offset.right + move.x, shift: shaft.dia.straight/2 + 14, long: 50.5, high: 60}, true, true);
            }
            else {
              return checkHover({x: pos.offset.right + move.x, shift: shaft.dia.straight/2 + 14, long: 42, high: 60}, true, true);
            } 
          }
          direction = function (x) {
            let sign = 1;
            for (let i=0; i<2; i++) {
              if (!con.state[6+i] && sign*move.x < 0) {
                x += move.x;
              }
              sign *= -1;
            }
            return x;
          }
        break 
      }
    }
    this.init();

    this.selected = function() {
      if (hover()) {
        flag.hand = true;
        this.part = true;
      }
      else {
        this.part = false;
      }
    }

    this.drawX = function(x) {
      return direction(x);
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

  // Initialising model
  rectMode(CENTER);
  ellipseMode(CENTER);

  basic = {
    stepped: false,
    merged: false,
    message: undefined,
    assembly: [],
    layer: ['back', 'bearing', 'housing', 'shaft', 'line'],
  };
  con = { // Constraint status (tag defines the type of constraint; state defines the constrained status)
    tag: [],
    state: [],
  };

  design = [];
  design.base = [], design.run = [];
  typeName = ['circlip', 'collar', 'spacer', 'shoulder']; // Constraint types

  for (let i=0; i<typeName.length; i++) {
    design[typeName[i]] = [];
    for (let j=0; j<8; j++) {
      design[typeName[i]][j] = new Constraint(typeName[i], j);
    }
  }
  for (let i=0; i<basic.layer.length; i++) {
    design.base[i] = new Base(i);
  }

  mode = 'design';
  flag = {
    held: false,
    hand: false,
    motion: false, // Drag mode flag: if true, update move coordinates to allow drag motion
    alert: false, // Merge alert flag: if true, hide merge housing warning
    warning: true, // User warning flag: if true, update warning boxes
  };
  move = {
    origin: 0,
    x: 0,
  };

  design.motion = undefined;
  design.drag = [];
  partName = ['shaft', 'leftBearing', 'rightBearing'];

  for (let i=0; i<partName.length; i++) {
    design.drag[i] = new Drag(partName[i]);
  }

  reset();
}

/* Draw function loops indefinitely following setup */
function draw() {
  // Base model
  if (mode == 'design') {
    background(240, 240, 255);
  }
  else {
    background(230, 250, 250);
  }

  for (let i=0; i<basic.layer.length; i++) {
    design.base[i].render();
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
      for (let i=0; i<design.drag.length; i++) {
        design.drag[i].selected();
      }
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
  updateAssembly();
}

/* Resets design model */
function reset() {
  design.run = [];
  design.runHighlight = [];
  for (let i =0; i<8; i++) {
    updateConstraint('empty', i);
  }
  updateStyle();

  // Reset warnings
  basic.message = undefined;
  basic.assembly = [];
  removeWarning('all');
  flag.warning = true;
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
    removeConstraint('collar', [1, 2, 3]);
    removeConstraint('spacer', [1, 2]);
    removeConstraint('all', 2);
    updateConstraint('collar', 2);
  }
  else {
    basic.stepped = false;
    updateConstraint('empty', 2)
  }
  
  for (let i=0; i<typeName.length; i++) {
    for (let j=0; j<8; j++) {
      design[typeName[i]][j].resetHighlight();
    }
  }
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

/* p5 function that triggers when the mouse is pressed and released */
function mouseClicked() {
  flag.held = true;
  move.x = 0;
}

/* p5 function that triggers when the mouse is pressed */
function mousePressed() {
  move.origin = mouseX;
}

/* p5 function that triggers when the mouse is dragged */
function mouseDragged() {
  if (mode == 'drag') {
    move.x = mouseX - move.origin;
  }
}

/* Returns true if the mouse is within the position object parameters */
function checkHover(position, pointer, inner) {
  let margin = 5;
  if (mouseX > position.x - position.long/2 - margin && mouseX < position.x + position.long/2 + margin &&
        mouseY > pos.centre.y - position.shift - position.high/2 - margin &&
          mouseY < pos.centre.y + position.shift + position.high/2 + margin) {
    if (!pointer) {
      flag.held = false;
    }
    if (inner) { // ### NEEDS WORK ###
      if ((mouseY < pos.centre.y - position.shift + position.high/2 && mouseY > pos.centre.y - position.shift - position.high/2) ||
            (mouseY > pos.centre.y + position.shift - position.high/2 && mouseY < pos.centre.y + position.shift + position.high/2) ) {
        return true;
      }
    }
    else {
      return true;
    }
  }
}

/* Update the constraint status of a constraint type */
function updateConstraint(type, location) {
  con.tag[location] = type;
  if (type == 'spacer') {
    con.tag[location + 1] = type;
  }

  if (type == 'empty' || type == 'spacer') {
    con.state[location] = false;
  }
  else {
    con.state[location] = true;
  }

  [1, 5].forEach(function(i) {
    if (con.state[i-1] && con.state[i+2] && con.tag[i] == 'spacer') {
      con.state[i] = true;
      con.state[i+1] = true;
    }
  });
}

/* Removes a constraint at a given location */ 
function removeConstraint(type, location) {
  if (location.constructor !== Array ) {
    location = [location];
  }

  for (let i=0; i<location.length; i++) {
    if (type == 'all' || con.tag[location[i]] == type) {
      updateConstraint('empty', location[i]);
      design.run[location[i]] = undefined;
    }
  }
}

/* Updates constraint preview highlight colour */
function highlightPreview(colour, preview) {
  stroke('red');
  fill(255, colour[0] += colour[1], 45, 150);
  preview();
  stroke('black');

  if (colour[0] >= 255 || colour[0] <= 45) {
    colour[1] *= -1;
  }
  return colour;
}

/* Determines the constraint drag logic and returns the relevant x coordinate */
function constraintLogic(x, part) {
  let limits = [0, 4, 0, 2, 2, 4];
  let sign = 1;
  for (let i=limits[2*partName.indexOf(part)]; i<limits[2*partName.indexOf(part)+1]; i++) {
    if (con.state[i] && sign*move.x > 0) {
      return design.drag[partName.indexOf('shaft')].drawX(x); 
    }
    else {
      if (design.drag[partName.indexOf(part)].part){
        return design.drag[partName.indexOf(part)].drawX(x); 
      }
    }
    sign *= -1;
  }
  return x;
}
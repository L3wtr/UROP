class Housing {
  // Renders bearing housing based on left and right constraints, and x coordinate
  constructor(x, left, right) {
    this.x = x;
    this.left = left;
    this.right = right;

    this.render = function() {
      fill(240, 240, 240);
        rect(x, centre.horizontal, 70, 160, 2, 2, 2, 2);
        ballAndRace(x, offset.top);
        ballAndRace(x, offset.bottom);
      fill(200, 200, 200);
        rect(x, offset.top + 34, 70, 24, 2, 2, 0, 0);
        rect(x, offset.bottom - 34, 70, 24, 0, 0, 2, 2);
      fill('white');
    }
  }
}

class Shaft {
  // Renders shaft and centreline based on left and right constraints
  constructor(leftleft, leftright, rightleft, rightright) {
    this.leftleft = leftleft;
    this.leftright = leftright;
    this.rightleft = rightleft;
    this.rightright = rightright;

    this.render = function() {
      rect(centre.vertical, centre.horizontal, centre.length, 60, 3, 3, 3, 3);
      centreline(centre.horizontal, centre.length);
    }
  }
}

class Circlip {
  // Renders circlip (internal or external) based on x coordinate and position
  constructor(x, fit) {
    this.x = x;
    this.fit = fit;

    this.render = function() {
      fill(100, 100, 255);
        rect(x, centre.horizontal + fit, 6, 12, 1, 1, 1, 1);
        rect(x, centre.horizontal - fit, 6, 12, 1, 1, 1, 1);
    }

    this.highlight = function() {
      stroke('red');
      fill(255, 0, 0, 20);
        rect(x, centre.horizontal + fit, boxsize, boxsize, 5, 5, 5, 5);
        rect(x, centre.horizontal - fit, boxsize, boxsize, 5, 5, 5, 5);
      stroke('black');
    }

    this.checkOver = function() {
      if (mouseIsPressed) {
        if (mouseOver(this.x, this.fit)) {
          model.run = model.run.concat(this);
        }
        else {
          highlightCount++;
          if (highlightCount > model.runHighlight.length) {
            resetHighlight();
          }
        }
      }
    }
  }
}

function setup() {
  // Canvas Setup
  canvas = {
    width: 0.95 * document.getElementById('model.ID').offsetWidth,
    height: 400,
  }
  canvas.dimensions = createCanvas(canvas.width, canvas.height);
  canvas.dimensions.parent('model.ID');

  // Position coordinates
  rectMode(CENTER);
  ellipseMode(CENTER);
  centre = {
    horizontal: canvas.height * 0.5,
    vertical: canvas.width * 0.5,
    length: canvas.width * 0.9,
  }
  offset = {
    top: centre.horizontal + 50,
    bottom: centre.horizontal - 51,
    left: canvas.width * 0.25,
    right: canvas.width * 0.75,
  }
  shift = {
    left: -24,
    right: 24,
    internal: 30,
    external: 72,
  }
  boxsize = 20;
  highlightCount = 0; /* Global included to prevent highlight from resetting before completion */


  console.log(centre);
  console.log(offset);
  console.log(shift);

  // Models initialisation
  model.housing = [
    new Housing(offset.left, false, false),
    new Housing(offset.right, false, false),
  ]
  model.shaft = [
    new Shaft(false, false, false, false),
  ]
  model.circlip = [
    new Circlip(offset.left + shift.left, shift.internal),
    new Circlip(offset.left + shift.right, shift.internal),
    new Circlip(offset.right + shift.left, shift.internal),
    new Circlip(offset.right + shift.right, shift.internal),
    new Circlip(offset.left + shift.left, shift.external),
    new Circlip(offset.left + shift.right, shift.external),
    new Circlip(offset.right + shift.left, shift.external),
    new Circlip(offset.right + shift.right, shift.external),
  ]

  // Set default model
  model.reset = model.housing.slice(0,2).concat(model.shaft.slice(0,1));
  resetDraw();
}

function draw() {
  background(240, 240, 255)

  // Display run array
  for (let i=0; i<model.run.length; i++) {
    model.run[i].render();
  }

  // Display highlight array
  for (let i=0; i<model.runHighlight.length; i++){
    model.runHighlight[i].highlight();
    model.runHighlight[i].checkOver();
  }
}

function resetDraw() {
  // Resets model render
  model.run = model.reset;
  model.runHighlight = [];
}

function resetHighlight() {
  // Resets highlight render
  highlightCount = 0;
  model.runHighlight = [];
}

function feature(constraint) {
  // Assigns constraint type
  model.runHighlight = [];
  switch (constraint) {
    case 'intCirclip':
      model.runHighlight = model.circlip.slice(0,4);
    break
    case 'extCirclip':
      model.runHighlight = model.circlip.slice(4,8);
    break
  }
}

function mouseOver(x, fit) {
  // Returns true if mouse is over given box size
  if (mouseX > x - boxsize/2 && mouseX < x + boxsize/2 &&
      mouseY > centre.horizontal + fit - boxsize/2 && mouseY < centre.horizontal + fit + boxsize/2) {
    return true;
  }
  else if (mouseX > x - boxsize/2 && mouseX < x + boxsize/2 &&
           mouseY > centre.horizontal - fit - boxsize/2 && mouseY < centre.horizontal - fit + boxsize/2) {
    return true;
  }
  else {
    return false;
  }
}

function centreline(y, length) {
  // Draws centreline at a given y location for a given length
  let prev = 11;
    for (let i=0; i<length + 20; i+=20) {
      line(prev + 4, y, prev + 16, y)
      point(prev + 20, y)
      prev += 20;
    }
    line(prev + 4, y, prev + 16, y)
}

function ballAndRace(x, y) {
  // Draws the bearing ball and race at a given x and y location
  let shapeColor = ['black', 'white'];
  let outlineSize = [2, 0];
  
  noStroke();
  for (let i=0; i<=1; i++) {
    fill(shapeColor[i]);
    rect(x + 0.5, y - 16, 40 + outlineSize[i], 12  + outlineSize[i], 1, 1, 1, 1);
    rect(x + 0.5, y + 16, 40 + outlineSize[i], 12 + outlineSize[i], 1, 1, 1, 1);
    ellipse(x + 0.5, y, 24 + outlineSize[i], 24 + outlineSize[i]);
  }
  stroke('black');
}
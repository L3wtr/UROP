class Housing {
  // Renders bearing housing based on left and right constraints, and x coordinate
  constructor(x, left, right) {
    this.x = x;
    this.left = left;
    this.right = right;

    this.render = function() {
      fill(240, 240, 240);
        rect(x, centre.horizontal, 60, 180);
      fill(200, 200, 200);
        rect(x, offset.bottom - 30, 60, 24);
        rect(x, offset.top + 30, 60, 24);
      fill('white');

      ballAndRace(x, offset.top);
      ballAndRace(x, offset.bottom);
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
      rect(centre.vertical, centre.horizontal, centre.length, 60);
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
        rect(x, centre.horizontal + fit, 6, 12);
        rect(x, centre.horizontal - fit, 6, 12);
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
  offset = {
    top: canvas.height * 0.62,
    bottom: canvas.height * 0.38,
    left: canvas.width * 0.25,
    right: canvas.width * 0.75,
  }
  centre = {
    horizontal: canvas.height * 0.5,
    vertical: canvas.width * 0.5,
    length: 0.9 * canvas.width,
  }
  shift = {
    left: -18,
    right: +18,
    internal: 30,
    external: 65,
  }
  boxsize = 20;
  highlightCount = 0; /* Global included to prevent highlight from resetting before completion */

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
  // Model render
  background(240, 240, 255)

  for (let i=0; i<model.run.length; i++) {
    model.run[i].render();
  }

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
  // Assigns constraint
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
    console.log('Yo1')
    return true;
  }
  else if (mouseX > x - boxsize/2 && mouseX < x + boxsize/2 &&
           mouseY > centre.horizontal - fit - boxsize/2 && mouseY < centre.horizontal - fit + boxsize/2) {
    console.log('Yo2')
    return true;
  }
  else {
    console.log('Fail')
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
      rect(x, y - 12, 30, 12)
      rect(x, y + 12, 30, 12)
      ellipse(x, y, 18, 18)
}
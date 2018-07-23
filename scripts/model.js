class Bearing {
  // Renders bearing (inner race, outer race and ball) based on x, y coordinates
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.render = function() {
      rect(x, y - 12, 30, 12)
      rect(x, y + 12, 30, 12)
      ellipse(x, y, 18, 18)
    }
  }
}

class Housing {
  // Renders bearing housing based on left and right constraints, and x coordinate
  constructor(x, left, right) {
    this.x = x;
    this.left = left;
    this.right = right;

    this.render = function() {
      fill(240, 240, 240)
        rect(x, centre.horizontal, 60, 180)
      fill(200, 200, 200)
        rect(x, offset.bottom - 30, 60, 24)
        rect(x, offset.top + 30, 60, 24)
      fill(255, 255, 255)
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
      rect(centre.vertical, centre.horizontal, centre.length, 60)
      centreline(centre.horizontal, centre.length)
    }
  }
}

class Circlip {
  // Renders circlip (internal or external) based on x coordinate and position
  constructor(x, type) {
    this.x = x;
    this.type = type;

    this.render = function() {
      fill(100, 100, 255)
      rect(x, centre.horizontal + type, 6, 12)
      rect(x, centre.horizontal - type, 6, 12)
    }
  }
}

function setup() {
  // Canvas Setup
  canvas = {
    width: 0.95 * document.getElementById('model').offsetWidth,
    height: 400,
  }
  canvas.dimensions = createCanvas(canvas.width, canvas.height),
  canvas.dimensions.parent('model')

  // Position coordinates
  rectMode(CENTER)
  ellipseMode(CENTER)
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

  // Models initialisation
  model.housing = [
    new Housing(offset.left, false, false),
    new Housing(offset.right, false, false),
  ]
  model.bearing = [
    new Bearing(offset.left, offset.top),
    new Bearing(offset.right, offset.top),
    new Bearing(offset.left, offset.bottom),
    new Bearing(offset.right, offset.bottom),
  ]
  model.shaft = [
    new Shaft(false, false, false, false),
  ]
  model.circlip = [
    new Circlip(offset.left + shift.left, shift.internal),
    new Circlip(offset.left + shift.right, shift.internal),
    new Circlip(offset.left + shift.left, shift.external),
    new Circlip(offset.left + shift.right, shift.external),
    new Circlip(offset.right + shift.left, shift.internal),
    new Circlip(offset.right + shift.right, shift.internal),
    new Circlip(offset.right + shift.left, shift.external),
    new Circlip(offset.right + shift.right, shift.external),
  ]

  // Set default model
  model.reset = model.housing.slice(0,2).concat(model.bearing.slice(0,4)).concat(model.shaft.slice(0,1));
  model.run = model.reset;
}

function draw() {
  // Model render
  background(240, 240, 255)

  for (let i=0; i<model.run.length; i++) {
    model.run[i].render();
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
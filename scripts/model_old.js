class Base {
  // Renders bearing housing based on left and right constraints, and x coordinate
  constructor(x, left, right) {
    this.render = function() {
      fill(240, 240, 240);
        rect(x, centre.horizontal, 70, 160, 2, 2, 2, 2);
        drawBearing(x, offset.top);
        drawBearing(x, offset.bottom);
      fill(200, 200, 200);
        rect(x, offset.top + 34, 70, 24, 2, 2, 0, 0);
        rect(x, offset.bottom - 34, 70, 24, 0, 0, 2, 2);
      fill('white');
        rect(centre.vertical, centre.horizontal, centre.length, 60, 3, 3, 3, 3); // Shaft
        centreline(centre.horizontal, centre.length);
    }
  }
}

class Collar {
  // Renders shaft and centreline based on left and right constraints
  constructor(x, sign, location) {
    let colourRate, highlightColour;
    this.colourReset = function() {
      colourRate = 5;
      highlightColour = 45;
    }
    this.colourReset();

    this.render = function() {
      if (!occupied[location]) {
        fill('white');
        switch(location) {
          case 0:
            rect(offset.left - 21 - (canvas.width * 0.2 - 21)/2, centre.horizontal, canvas.width * 0.2 - 21, 75);
            setOccupation(location, 'collar');
          break
          case 1:
            if (constraint[2] == 'collar') {
              console.log('Yo1')
            }
            else {
              rect(offset.left + 21 + (canvas.width * 0.2 - 21)/2, centre.horizontal, canvas.width * 0.2 - 21, 75);
              setOccupation(location, 'collar');
            }
          break
          case 2:
            if (constraint[1] == 'collar') {
              console.log('Yo2')
            }
            else {
              rect(offset.right - 21 - (canvas.width * 0.2 - 21)/2, centre.horizontal, canvas.width * 0.2 - 21, 75);
              setOccupation(location, 'collar');
            }
          break
          case 3:
            rect(offset.right + 21 + (canvas.width * 0.2 - 21)/2, centre.horizontal, canvas.width * 0.2 - 21, 75);
            setOccupation(location, 'collar');
          break
          centreline(centre.horizontal, centre.length);
        }
      }
    }

    this.highlight = function() {
      if (!occupied[location]) {
        stroke('red');
        fill(255, highlightColour += colourRate, 45, 200);
          drawCollar(x, sign);
        stroke('black'); 
       
        // Highlight colour changes
        if (highlightColour >= 255) {
          colourRate = -5;
        }
        if (highlightColour <= 45) {
          colourRate = 5;
        }
      }
    }
  }
}

class Circlip {
  // Renders circlip (internal or external) based on x coordinate and position
  constructor(x, fit, location) {
    let colourRate, highlightColour;
    this.colourReset = function() {
      colourRate = 5;
      highlightColour = 45;
    }
    this.colourReset();

    this.render = function() {
      fill(100, 100, 255);
        drawCirclip(x, fit);
    }

    this.highlight = function() {
      if (!occupied[location]) {
        stroke('red');
        fill(255, highlightColour += colourRate, 45, 200);
          drawCirclip(x, fit);
        stroke('black'); 
        
        // Highlight colour changes
        if (highlightColour >= 255) {
          colourRate = -5;
        }
        if (highlightColour <= 45) {
          colourRate = 5;
        }
      }
    }

    this.checkOver = function() {
      if (mouseIsPressed) {
        if (mouseOver(x, fit, 10, 10)) {
          model.run = model.run.concat(this);
          setOccupation(location, 'circlip');
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
    bottom: centre.horizontal - 50,
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
  occupied = [];
  constraint = [];

  // Models initialisation
  model.housing = [
    new Base(offset.left, false, false),
    new Base(offset.right, false, false),
  ]
  model.shaft = [
    new Collar(offset.left, -1, 0),
    new Collar(offset.left, 1, 1),
    new Collar(offset.right, -1, 2),
    new Collar(offset.right, 1, 3),
  ]
  model.circlip = [
    new Circlip(offset.left + shift.left, shift.internal, 0),
    new Circlip(offset.left + shift.right, shift.internal, 1),
    new Circlip(offset.right + shift.left, shift.internal, 2),
    new Circlip(offset.right + shift.right, shift.internal, 3),
    new Circlip(offset.left + shift.left, shift.external, 4),
    new Circlip(offset.left + shift.right, shift.external, 5),
    new Circlip(offset.right + shift.left, shift.external, 6),
    new Circlip(offset.right + shift.right, shift.external, 7),
  ]

  // Set default model
  model.reset = model.housing.slice(0,2);
  resetDraw();
}

function draw() {
  background(240, 240, 255)
          console.log('Test')

  // Display run array
  for (let i=0; i<model.run.length; i++) {
    model.run[i].render();
  }

  // Display highlight array
  for (let i=0; i<model.runHighlight.length; i++){
    model.runHighlight[i].highlight();
    //model.runHighlight[i].checkOver();
  }
/*
  model.shaft[0].render();
  model.shaft[1].render();
  model.shaft[2].render();
  model.shaft[3].render();*/
}

function resetDraw() {
  // Resets model render
  model.run = model.reset;
  model.runHighlight = [];

  for (let i =0; i<8; i++) {
    occupied[i] = false;
    constraint[i] = 'empty';
    model.circlip[i].colourReset();
  }
}

function resetHighlight() {
  // Resets highlight render
  highlightCount = 0;
  model.runHighlight = [];
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
      model.runHighlight = model.shaft.slice(0,4);
    break
  }
}

function mouseOver(x, fit, xbuffer, ybuffer) {
  // Returns true if mouse is over given box size
  if (mouseX > x - xbuffer && mouseX < x + xbuffer &&
      mouseY > centre.horizontal + fit - ybuffer && mouseY < centre.horizontal + fit + ybuffer) {
    return true;
  }
  else if (mouseX > x - xbuffer && mouseX < x + xbuffer &&
           mouseY > centre.horizontal - fit - ybuffer && mouseY < centre.horizontal - fit + ybuffer) {
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

function drawBearing(x, y) {
  // Draws the bearing ball and race at a given x and y location
  let fillColor = ['black', 'white'], outlineSize = [2, 0];
  noStroke();
  for (let i=0; i<=1; i++) {
    fill(fillColor[i]);
      rect(x + 0.5, y - 16, 40 + outlineSize[i], 12  + outlineSize[i], 1, 1, 1, 1);
      rect(x + 0.5, y + 16, 40 + outlineSize[i], 12 + outlineSize[i], 1, 1, 1, 1);
    ellipse(x + 0.5, y, 24 + outlineSize[i], 24 + outlineSize[i]);
  }
  stroke('black');
}

function drawCirclip(x, fit) {
  // Draws circlip shape
  rect(x, centre.horizontal + fit, 6, 12, 1, 1, 1, 1);
  rect(x, centre.horizontal - fit, 6, 12, 1, 1, 1, 1);
}

function drawCollar(x, sign) {
  // Draws collar shape
  rect(x + sign*21 + sign*(canvas.width * 0.2 - 21)/2, centre.horizontal, canvas.width * 0.2 - 21, 75, 3, 3, 3, 3 );
}

function setOccupation(location, constraint) {
  // Denotes which constraint locations are occupied
  occupied[location] = true;
  constraint[location] = constraint;
}
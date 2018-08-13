/* Draws bearing housing back (either merged or not merged) */
function drawBack(stepped, merged) {
  fill(240, 240, 240);
  if (merged) {
    rect(pos.centre.x, pos.centre.y, 0.5 * canvas.dim.x + 80, shaft.dia.straight/2 + 150, 2, 2, 2, 2);
  }
  else {
    rect(pos.offset.left, pos.centre.y, 80, shaft.dia.straight/2 + 150, 2, 2, 2, 2);
    rect(pos.offset.right, pos.centre.y, 80, shaft.dia.straight/2 + 150, 2, 2, 2, 2);
  }
  fill('white');
}

/* Draws bearing at a given x location for stepped and non-stepped shafts */
function drawBearing(x, stepped) {
  let shapeColor = ['black', 'white'], 
      outline = [2, 0],
      y = [pos.centre.y + shaft.dia.straight/2 + 23, pos.centre.y - shaft.dia.straight/2 - 22];    

  noStroke();
  if (stepped) {
    for (let i=0; i<2; i++) {
      let sign = -1;
      for (let j=0; j<2; j++) {
        fill(shapeColor[i]);
        rect(x + 0.5, y[j] - sign*14.5, 48 + outline[i], 15 + outline[i], 1, 1, 1, 1);
        rect(x + 0.5, y[j] + sign*25.5, 48 + outline[i], 15 + outline[i], 1, 1, 1, 1);
        ellipse(x + 0.5, y[j] + sign*5.5, 28 + outline[i], 28 + outline[i]);
        sign = 1;
      }
    }
  }
  else {
    for (let i=0; i<2; i++) {
      for (let j=0; j<2; j++) {
        fill(shapeColor[i]);
        rect(x + 0.5, y[j] - 16, 40 + outline[i], 12 + outline[i], 1, 1, 1, 1);
        rect(x + 0.5, y[j] + 16, 40 + outline[i], 12 + outline[i], 1, 1, 1, 1);
        ellipse(x + 0.5, y[j], 24 + outline[i], 24 + outline[i]);
      }
    }
  }
  stroke('black');
}

/* Draws centreline at y for a given length */ // ### NEEDS IMPROVING ###
function drawCentreline(y, length) {
  let prev = canvas.dim.x * 0.025 - 4;
  stroke('black');

  for (let i=0; i<length+20; i+=20) {
    line(prev + 4, y, prev + 16, y);
    point(prev + 20, y);
    prev += 20;
  }
  line(prev + 4, y, prev + 16, y);
}

/* Draws circlip at a given location */
function drawCirclip(location, returnPosition) {
  let x = [pos.offset.left - 24, pos.offset.left + 24, pos.offset.right - 24, pos.offset.right + 24],
      shift = 30;

  if (location == 3 && basic.stepped) {
      shift -= (shaft.dia.straight - shaft.dia.stepped)/2; 
  }

  if (location > 3) {
    shift += 45;
    location -= 4;
  }

  if (basic.stepped) {
    x[2] -= 4;
    x[3] += 4;
  }

  if (returnPosition) {
    return {x: x[location], shift: shift, high: 12, long: 6};
  }
  else {
    rect(x[location], pos.centre.y + shift, 6, 12, 1, 1, 1, 1);
    rect(x[location], pos.centre.y - shift, 6, 12, 1, 1, 1, 1);
  }
}

/* Draws bearing housing */
function drawHousing(x, stepped, merged) {
  fill(200, 200, 200);
  if (merged) {
    rect(pos.centre.x, pos.centre.y + shaft.dia.straight/2 + 57, 0.5 * canvas.dim.x + 80, 24);
    rect(pos.centre.x, pos.centre.y - shaft.dia.straight/2 - 57, 0.5 * canvas.dim.x + 80, 24);
  }
  else {
    rect(x, pos.centre.y + shaft.dia.straight/2 + 57, 80, 24);
    rect(x, pos.centre.y - shaft.dia.straight/2 - 57, 80, 24);
  }
  fill('white');
}

/* Draws shaft for stepped and non-stepped modes */
function drawShaft(stepped) {
  if (stepped) {
    rect(pos.centre.x, pos.centre.y, shaft.dim.x, shaft.dia.stepped, 3, 3, 3, 3);
    rect(pos.centre.x - canvas.dim.x * 0.1 - 12.5, pos.centre.y, canvas.dim.x * 0.7 - 25, shaft.dia.straight, 3, 3, 3, 3);
  }
  else {
    rect(pos.centre.x, pos.centre.y, shaft.dim.x, shaft.dia.straight, 3, 3, 3, 3);
  }
}
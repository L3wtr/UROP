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

  if (isStepped && (location == 3 || location > 5)) {
    shift -= (shaft.diameter - shaft.stepped)/2;  
  }

  if (location > 3) {
    shift += 42;
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

function drawCollar(location, returnPos, merge) {
  // Draws collar at x for a given location
  let long = canvas.width * 0.2 - 20,
      x = [offset.left - 20.5 - long/2, offset.left + 20.5 + long/2,
           offset.right - 20.5 - long/2, offset.right + 20.5 + long/2];

  if (merge) {
    x[location] = centre.vertical;
    long = canvas.width * 0.5 - 41;
  }

  if (returnPos) {
    return {x: x[location], shift: 0, long: long, high: shaft.diameter + 22};
  }
  else {
    rect(x[location], centre.horizontal, long, shaft.diameter + 22, 2, 2, 2, 2);
    drawCentreline(centre.horizontal, shaft.long);
  }
}

function drawHousing(x, diameter, location) {
  // Draws bearing housing and shoulder at x for a given shaft diameter
  let shift = offset.left,
      stateIndex = 4,
      step = 0;

  if (typeof location == 'string') {
    fill(200, 200, 200);
      rect(x, centre.horizontal + diameter/2 + 54, 70, 24);
      rect(x, centre.horizontal - diameter/2 - 54, 70, 24);
    fill('white')
  }
  else {
    if (location > 5) {
      shift = offset.right;
      stateIndex += 2;
      if (isStepped) {
        step = -(shaft.diameter - shaft.stepped)/2;
      }
    }
    for (i=-1; i<2; i+=2) {
      beginShape();
        vertex(shift + 35.5, centre.horizontal + i*shaft.diameter/2 + i*(42 + i*0.5) + i*step);
        vertex(shift + 35.5, centre.horizontal + i*shaft.diameter/2 + i*(66 + i*0.5) + i*step);
        vertex(shift - 34.5, centre.horizontal + i*shaft.diameter/2 + i*(66 + i*0.5) + i*step);
        vertex(shift - 34.5, centre.horizontal + i*shaft.diameter/2 + i*(42 + i*0.5) + i*step);
        if (state[stateIndex] == 'shoulder') {
          vertex(shift - 34.5, centre.horizontal + i*shaft.diameter/2 + i*(30 + i*0.5) + i*step);
          vertex(shift - 20, centre.horizontal + i*shaft.diameter/2 + i*(30 + i*0.5) + i*step);
          vertex(shift - 20, centre.horizontal + i*shaft.diameter/2 + i*(42 + i*0.5) + i*step);
        }
        if (state[stateIndex + 1] == 'shoulder') {
          vertex(shift + 21, centre.horizontal + i*shaft.diameter/2 + i*(42 + i*0.5) + i*step);
          vertex(shift + 21, centre.horizontal + i*shaft.diameter/2 + i*(30 + i*0.5) + i*step);
          vertex(shift + 35.5, centre.horizontal + i*shaft.diameter/2 + i*(30 + i*0.5) + i*step);
        }
      endShape(CLOSE);
    }
  }
}

function drawShaft(type) {
  // Draws a given shaft (straight or stepped)
  if (type == 'straight') {
    rect(centre.vertical, centre.horizontal, shaft.long, shaft.diameter, 3, 3, 3, 3);
  }
  else {
    rect(centre.vertical, centre.horizontal, shaft.long, shaft.stepped, 3, 3, 3, 3);
    rect(centre.vertical - canvas.width * 0.1 - 10.5, centre.horizontal, canvas.width * 0.7 - 20.5, shaft.diameter, 3, 3, 3, 3);
  }
}

function drawShoulder(location, returnPos) {
  // Draws housing shoulder at location
  let x = [offset.left - 27.5, offset.left + 27.5, offset.right - 27.5, offset.right + 27.5],
      shift = 66;
  location -= 4;

  if (isStepped && location > 1) {
    shift -= (shaft.diameter - shaft.stepped)/2;
  }

  if (returnPos) {
    return {x: x[location], shift: shift, long: 14, high: 12};
  }
  else {
    rect(x[location], centre.horizontal + shift, 14, 12);
    rect(x[location], centre.horizontal - shift, 14, 12);
  }
}

function drawSpacer(returnPos) {
  // Draws spacer at location 1 and 2
  if (returnPos) {
    return {x:centre.vertical, shift: 0, high: shaft.diameter + 20, long: canvas.width * 0.5 - 41};
  }
  else {
    rect(centre.vertical, centre.horizontal - shaft.diameter/2 - 5.5, canvas.width * 0.5 - 41, 11, 2, 2, 2, 2);
    rect(centre.vertical, centre.horizontal + shaft.diameter/2 + 5.5, canvas.width * 0.5 - 41, 11, 2, 2, 2, 2);
    drawCentreline(centre.horizontal, shaft.long);
  }
}
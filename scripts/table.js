function updateBearingTable() {
  // Updates values and conditions in the bearing table
  let count = [0, 0, 0, 0],
      index;             
  for (let i=0; i<8; i++) {
    if (i%2 == 0 && state[i] != 'empty') { // i = 0, 2, 4, 6
      index = i/2;
      count[index] ++;
    }
    else if (i%2 != 0 && state[i] != 'empty') { // i = 1, 3, 5, 7
      index = (i-1)/2;
      count[index] ++;
    }

    // Update constraint count
    let conString = count.toString().split(',');
    let bearingCount = [document.getElementById('leftInt'), document.getElementById('rightInt'), 
                        document.getElementById('leftExt'), document.getElementById('rightExt')];
    for (let i=0; i<4; i++) {
      bearingCount[i].textContent = conString[i] + '/2';
    }
  }    
    
  // Update bearing condition
  let condition = [document.getElementById('leftCond'), document.getElementById('rightCond')]; 
  for (let i=0; i<2; i++) {
    if (count[i] && count[i+2] == 2) {
      condition[i].textContent = 'Fixed';
    }
    else {
      condition[i].textContent = 'Floating';
    }
  }
}
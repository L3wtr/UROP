/* Updates values and conditions in the bearing table */
function updateBearingTable() {
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
    for (let i=0; i<count.length; i++) {
      bearingCount[i].textContent = conString[i] + '/2';
    }
  }    
    
  // Update bearing condition
  let condition = ['Floating', 'Undetermined', 'Fixed'],
      bearingCon = [document.getElementById('leftIntCon'), document.getElementById('rightIntCon'), 
                   document.getElementById('leftExtCon'), document.getElementById('rightExtCon')];
  for (let i=0; i<count.length; i++) {
    bearingCon[i].textContent = condition[count[i]];
  }

  // Update constraint status
  let countSum = count.reduce((total, amount) => total + amount);
  let status = document.getElementById('status'),
      box = document.getElementById("round-box");

  for (let i = 0; i<count.length; i++) {
    if (countSum < 6 ){
      status.textContent = 'Under Constrained';
      box.style.backgroundColor = "#ffcccc";
    }
    else if (countSum > 6) {
      status.textContent = 'Over Constrained';
      box.style.backgroundColor = "#ffcccc";
    }
    else {
      if(count[i] == 0) {
        status.textContent = 'Adequately Constrained';
        box.style.backgroundColor = "#ccffcc";
        break;
      }
      else {
        status.textContent = 'Inadequately Constrained';
        box.style.backgroundColor = "#ffffcc";
      }       
    }
  }
}
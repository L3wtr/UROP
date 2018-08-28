/* Updates values and conditions in the bearing table */
function updateBearingTable() {
  let count = [0, 0, 0, 0],
      index;             
  for (let i=0; i<8; i++) {
    if (i%2 == 0 && con.state[i]) { // i = 0, 2, 4, 6
      index = i/2;
      count[index] ++;
    }
    else if (i%2 != 0 && con.state[i]) { // i = 1, 3, 5, 7
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
      box = document.getElementById('round-box');

  if (flag.warning) {
    for (let i = 0; i<count.length; i++) {
      if (countSum < 6 ) {
        warningBox('constraint', 'The system is under constrained.');
      }
      else if (countSum > 6) {
        warningBox('constraint', 'The system is over constrained.');
      }
      else {
        removeWarning('constraint');
      }
    }
    flag.warning = false;
  }
}

/* Warns users of possible assembly errors */
function updateAssembly() {
  for (let i=0; i<4; i++) { // i = 0, 1, 2, 3
    if (!basic.stepped && ((con.tag[0] == 'collar'&& con.tag[3] =='collar' ) || (con.tag [i] == 'collar' && con.tag[i+2] == 'collar') ||
        (i%2 == 0 && con.tag[i] == 'collar' && con.tag[i+1] =='collar'))) {
      warningBox('shaft', 'Bearings cannot be assembled with the shaft.');
    }
  }

  if (basic.merged) {
    for (let i=4; i<8; i++) { // i = 4, 5, 6, 7
      if ((con.tag[4] == 'shoulder'&& con.tag[7] =='shoulder' ) || (con.tag [i] == 'shoulder' && con.tag[i+2] == 'shoulder') ||
          (i%2 == 0 && con.tag[i] == 'shoulder' && con.tag[i+1] =='shoulder')) {
        warningBox('merged', 'Bearings cannot be assembled with the housing.');
      }
    }
  }
  else {
    if(con.tag[4] == 'shoulder' && con.tag[5] =='shoulder') {
      warningBox('left', 'Bearings cannot be assembled with the left housing.');
    }
    if (con.tag[6] == 'shoulder' && con.tag[7] =='shoulder') {
      warningBox('right', 'Bearings cannot be assembled with the right housing.');
    }
  }  
}

/* Appends warning boxes to the index page using JQuery */
function warningBox(type, message) {
  let warning = $('<div class="round-box"><b>Warning: </b>' + message + '</div>').hide(0).delay(200).show(400);
  warning.css('backgroundColor', '#ffcccc');
  $(warning).addClass(type);

  switch (type) {
    case 'constraint': 
      if (message != basic.message) {
        basic.message = message;
        $('.constraint').hide(400);
        $('#bearing-table').after(warning);
      }
    break 
    case 'shaft':
      if (type != basic.assembly[0]) {
        $('#bearing-table').after(warning);
        basic.assembly[0] = type;
      }
    break
    case 'merged':
      if (type != basic.assembly[1]) {
        $('.right').hide(400);
        $('.left').hide(400);
        $('#bearing-table').after(warning);
        basic.assembly[1] = type;
      }
    break
    case 'left':
      if (type != basic.assembly[2]) {
        $('#bearing-table').after(warning);
        basic.assembly[2] = type;
      }
    break
    case 'right':
      if (type != basic.assembly[3]) {
        $('#bearing-table').after(warning);
        basic.assembly[3] = type;
      }
    break 
  }
}

/* Removes specified JQuery warning boxes */
function removeWarning(type) {
  if (type == 'all') {
    $('.round-box').hide(400);
  }
  else {
    $('.' + type).hide(400);
  }
}

/* ### THINGS TO WORK ON ###

  # Improve the warningBox function:
  Reduce reliance on switch and reduce repetition of code

  # Improve the update functions:
  Try to avoid using for loops with i, while reducing repetition of code

  # Fix overall constraint warning:
  Add more sophisticated cases for total number of constraints = 6

*/
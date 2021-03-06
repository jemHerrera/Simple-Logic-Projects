document.addEventListener('DOMContentLoaded', function(){
  let input = document.querySelector('#input');
  /*
  array keeps track of what's going on,
  [0] sign of first number (+/-)
  [1] the first number
  [2] the operator (+, - * or /)
  [3] sign second number
  [4] the second number
  [5] indicates if % is applied on first number
  [6] indicates if % is applied on second number

  ..note that the type number elements is string, to make it easier to concatenate
  */
  let array = ['', '0','','','', false, false];

// create click listeners on all the numbers, including dot(.)
  let nums = document.querySelectorAll('.btn-dark');
  nums.forEach(function(num){
    num.addEventListener('click', function(event){
      //function to add number to array
      function addNum(index){
        if(array[index] === '0') array[index]=num.textContent;
        else {
          if(num.textContent === '.' && /\./.test(array[index]));
          else array[index]+=num.textContent;
        }
      }
      if(array[2] === '') addNum(1);
      else addNum(4);
      applyInput();
    });
  });

// create click listeners on AC, % and +/-
  let extras = document.querySelectorAll('.btn-secondary');
  extras.forEach(function(extra){
    extra.addEventListener('click', function(event){
      // if ac is clicked
      if(extra.textContent === 'AC') array = ['', '0','','','', false, false];

      // else if +/- is clicked
      else if(extra.textContent === '+/-'){
        //function to change sign of num
        function changeSign(index){
          if (array[index]==='') array[index] = '-';
          else array[index] = '';
        }
        if(array[2] === '') changeSign(0);
        else changeSign(3);
      }

      // else (% is clicked)
      else {
        //function to turn num to percent or vice-versa
        function percent(index, index2){
          let length = /\.\d+/.exec(array[index]);
          if (!length) length = 0;
          else length = length[0].length-1;
          if(array[index2] == false) {
            array[index] = String((array[index]/100).toFixed(length+2));
            array[index2] = true;
          }
          else {
            array[index] = String((array[index]*100).toFixed(length-2));
            array[index2] = false;
          }
        }
        if (array[2] === '')percent(1,5);
        else percent(4,6)
      }
      applyInput();
    });
  });

// create click listeners on operators (+-*/=)
  let operators = document.querySelectorAll('.btn-primary');
  operators.forEach(function(operator){
    operator.addEventListener('click', function(event){

      //add the operator if only first number is inputted
      if(array[4] ===  ''){
       if (operator.textContent != '=') array[2] = operator.textContent;
      }

      //use resolve function if the array is complete
      else{
        let resolved = resolve(array);
        if(/\./.test(resolved)) resolved = String(parseFloat(resolved).toFixed(2));
        if(resolved == '0.00') resolved = 'too small';
        if(operator.textContent != '=') array = ['', resolved, operator.textContent,'','', false, false];
        else array = ['', resolved, '','','', false, false];
      }
      applyInput();
    });
  });


  //FUNCTIONS.

  //convert array to readable string
  function convertArr(arr){
    return arr.slice(0,5).join("");
  }

  //show numbers on the screen
  function applyInput(){
    if(convertArr(array).length > 8 && convertArr(array).length <= 16) {
      input.style.fontSize = '2rem';
      input.style.marginBottom = '5%';
      input.textContent = (convertArr(array));
    }
    else if(convertArr(array).length > 16) input.textContent = 'Digit Limit Reached';
    else {
      input.style.fontSize = '4rem';
      input.textContent = (convertArr(array));
    }
  }

  //takes array as argument, and returns the solved value
  function resolve([sign1, num1, operator, sign2, num2, percent1, percent2]){
    if (/\./.test(num1)) {
      num1 = parseFloat(num1);
    }
    else num1 = parseInt(num1);
    if (/\./.test(num2)) {
      num2 = parseFloat(num2);
    }
    else num2 = parseInt(num2);
    if(sign1 === '-') num1 *= -1;
    if(sign2 === '-') num2 *= -1;
    if(operator == '+') return String(num1+num2);
    else if(operator == '−') return String(num1-num2);
    else if(operator == '×') return String(num1*num2);
    else {
      if (num2 == 0) return 'Error';
      else return String(num1/num2);
    }
  }
});
class CalculatorController {
  constructor() { 
    this._displayCalculator = "0";
    this._currentDate;
    this.initialize();
  } // The constructor execs every method or function in the Class, you only have to atribute with "this"

  initialize() {
    let displayCalculatorElement = document.querySelector("#display")
    let dateElement = document.querySelector("#date")
    let timeElement = document.querySelector("#time")
    
    displayCalculatorElement.innerHTML = "1234" 
    dateElement.innerHTML = "19/07/23"
    timeElement.innerHTML = "21:09"
  }

  get displayCalculator() {
    return this._displayCalculator
  }

  set displayCalculator(value) {
    this._displayCalculator = value
  }

  get currentDate() {
    return this._currentDate
  }

  set currentDate(value) {
    this._currentDate = value
  }
}
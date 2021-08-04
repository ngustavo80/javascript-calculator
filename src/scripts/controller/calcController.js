class CalcController {
  constructor() {
    this._audio = new Audio('../../click.mp3')
    this._audioEnabled = false
    this._lastOperator = ''
    this._lastNumber = ''
    this._operation = []
    this._locale = 'en-UK'
    this._displayCalcEl = document.querySelector('#display')
    this._dateEl = document.querySelector('#date')
    this._timeEl = document.querySelector('#time')
    this._currentDate
    this.initialize()
    this.initButtonsEvents()
    this.initKeyboard()
  }

  pasteFromClipboard() {
    document.addEventListener('paste', e => {
      let text = e.clipboardData.getData('Text')

      this.displayCalc = parseFloat(text)
    })
  }

  copyToClipboard() {
    let input = document.createElement('input')

    input.value = this.displayCalc

    document.body.appendChild(input)

    input.select()

    document.execCommand("Copy")

    input.remove()
  }

  initialize() {
    this.setDisplayDateTime()

    setInterval(() => {
      this.setDisplayDateTime()
    }, 1000)

    this.setLastNumberToDisplay()
    this.pasteFromClipboard()

    document.querySelectorAll('.btn-ac').forEach( button => {
      button.addEventListener('dblclick', e => {
        this.toggleAudio()
      })
    })
  }

  toggleAudio() {
    this._audioEnabled = !this._audioEnabled
  }

  playAudio() {
    if (this._audioEnabled) {
      this._audio.currentTime = 0
      this._audio.play()
    }
  }

  addEventListenerAll(element, events, f) {
    events.split(' ').forEach(event => {
      element.addEventListener(event, f, false)
    })
  }

  initKeyboard() {
    document.addEventListener('keyup', e => {
      this.playAudio()

      switch (e.key) {
        case 'Escape':
          this.clearAll()
        break
  
        case 'Backspace':
          this.clearEntry()
        break

        case '+':
        case '-':
        case '/':
        case '*':
        case '%':
          this.addOperation(e.key)
        break
  
        case '=':
        case 'Enter':
          this.calc()
        break
  
        case '.':
        case ',':
          this.addDot()
        break
  
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(e.key))
        break
        
        case 'c':
          if (e.ctrlKey) this.copyToClipboard()
        break
      }
    })
  }

  clearAll() {
    this._operation = ['0']
    this.setLastNumberToDisplay()
  }

  clearEntry() {
    this._operation.pop()
    this.setLastNumberToDisplay()
  }
  
  getLastOperation() {
    return this._operation[this._operation.length - 1]
  }
  
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value
  }
  
  isOperator(value) {
    return (['+', '-', '*', '%', '/'].indexOf(value) > -1)
  }

  pushOperation(value) {
    this._operation.push(value)

    if(this._operation.length > 3) {
      this.calc()
    }
  }

  getResult() {
    try {
      return eval(this._operation.join(" "))
    } catch(e) {
      this.setError()
    }
  }
  
  calc() {
    let last = ''

    this._lastOperator = this.getLastItem()

    if (this._operation.length < 3) {
      let firstItem = this._operation[0]
      this._operation = [firstItem, this._lastOperator, this._lastNumber]
    }

    if (this._operation.length > 3) {
      last = this._operation.pop()

      this._lastNumber = this.getResult()
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false)
    }

    let result = this.getResult()

    if (last == '%') {
      result /= 100
      this._operation = [result]
    } else {
      this._operation = [result]

      if (last) this._operation.push(last)
    }

    this.setLastNumberToDisplay()
  }

  getLastItem(isOperator = true) {
    let lastItem

    this._operation.map(operation => {
        if (this.isOperator(operation) == isOperator) {
          lastItem = operation
          return
      }
    })

    if (!lastItem) {
      lastItem = (isOperator) ? this._lastOperator : this._lastNumber
    }

    return lastItem
  }

  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false)
    
    this.displayCalc = lastNumber
  }

  addOperation(value) {
    

    if(isNaN(this.getLastOperation())) {
      
      if (this.isOperator(value)) {
        this.setLastOperation(value)
      } else {
        this.pushOperation(value)
        this.setLastNumberToDisplay()
      }

    } else if(this.isOperator(value)) {
      this.pushOperation(value)
    } else {
      let newValue = this.getLastOperation().toString() + value.toString()
      this.setLastOperation(newValue)

      this.setLastNumberToDisplay()
    }
  }

  setError() {
    this.displayCalc = "Error"
  }

  addDot() {
    let lastOperation = this.getLastOperation()
    
    if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation('0.')
    } else {
      this.setLastOperation(lastOperation.toString() + '.')
    }

    this.setLastNumberToDisplay()
  }

  execButton(value) {
    this.playAudio()

    switch (value) {
      case 'ac':
        this.clearAll()
      break

      case 'ce':
        this.clearEntry()
      break

      case 'soma':
        this.addOperation('+')
      break

      case 'subtracao':
        this.addOperation('-')
      break

      case 'divisao':
        this.addOperation('/')
      break

      case 'multiplicacao':
        this.addOperation('*')
      break

      case 'porcento':
        this.addOperation('%')
      break

      case 'igual':
        this.calc()
      break

      case 'ponto':
        this.addDot()
      break

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        this.addOperation(parseInt(value))
      break

      default:
        this.setError()
      break
    }
  }

  initButtonsEvents() {
    let buttons = document.querySelectorAll('#buttons > g, #parts > g')

    buttons.forEach((button, index) => {
      this.addEventListenerAll(button, 'click drag', e => {
        let textButton = button.className.baseVal.replace('btn-', '')

        this.execButton(textButton)
      })
    })
  }

  setDisplayDateTime () {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    })
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale)
  }

  get displayTime() {
    return this._timeEl.innerHTML
  }

  set displayTime(value) {
    return this._timeEl.innerHTML = value
  }

  get displayDate() {
    return this._dateEl.innerHTML
  }

  set displayDate(value) {
    return this._dateEl.innerHTML = value
  }
  
  get displayCalc() {
    return this._displayCalcEl.innerHTML
  }

  set displayCalc(value) {
    this._displayCalcEl.innerHTML = value
  }

  get currentDate() {
    return new Date()
  }

  set currentDate(value) {
    this._currentDate = value
  }
}
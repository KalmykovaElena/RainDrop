const board = document.querySelector('.wrapper__game-board')
const water = document.querySelector('.water')
const startGame = document.querySelector('.startGame')
const game = document.querySelector('.game')
let count = document.querySelector('.wrapper__count-count')
let expression = []
let maxNumber = 20
let waterPosition = 20
let countFalls = 0
const display = document.querySelector('.display')
const digits = document.querySelectorAll('.number')
const clearButton = document.querySelector(('.clear'))
const deleteButton = document.querySelector(('.delete'))
const enterButton = document.querySelector(('.enter'))
let score = document.querySelectorAll(('.score'))
const modal = document.querySelector(('.modal-window'))
const restart = document.querySelector('.restart')
let deleteDrop
let correctAnswersTotalNumber = 0
let correctAnswers = 0
let movesNumber = 0
let speedOfDrop = 8
let objAnswers = {}


startGame.addEventListener('click', () => {
    startGame.parentElement.classList.add('hideGame')
    game.classList.remove('hideGame')
    startNewGame()
})
let drop
let dropWidth
function createDrop(colorStyle) {
    drop = document.createElement('div')
    drop.classList.add('drop')
    drop.id = `${Date.now()}`
    createCalculation()

    drop.dataset.answer = rightAnswer().toString()

    drop.style.left = `${generatePosition() }px`
if(colorStyle){
    drop.style.backgroundColor=colorStyle
}
    drop.innerHTML = `<div>${expression[0]}</div>
                  <div class="sign" style="position: absolute; left:5%;font-weight: bold;font-size: 5rem">${expression[1]}</div>
                  <div>${expression[2]}</div>`
    drop.style.animationDuration = speedOfDrop + 's'
    board.append(drop)
    dropWidth=drop.getBoundingClientRect().width
    console.log(dropWidth)

    movesNumber++

    deleteDrop = (drops) => drops.forEach(drop => drop.remove())
    drop.addEventListener('animationend', (event) => {
        event.target.remove()
        expression = []
        if (count.innerHTML > 0) {
            count.innerHTML--
        }
        countFalls++
        correctAnswers = 0
        if (countFalls == 3) finishGame()


        board.style.height = board.getBoundingClientRect().height - waterPosition + 'px'

        water.style.height = water.getBoundingClientRect().height + waterPosition + 'px'
        waterPosition += 20
        playSound('./audio/jg-032316-sfx-feedback-incorrect-25.mp3')
        createDrop()
    });
}

createDrop()
function generatePosition(){
    let positions= Array.from(document.querySelectorAll('.drop')).map(e=>{
        return e=[+e.getBoundingClientRect().x-dropWidth,+e.getBoundingClientRect().x+dropWidth]
    })
    let l=randomNumber(0, board.getBoundingClientRect().width - dropWidth);
    while(positions.some(e=>e[0]<l && e[1]>l)){
        l=randomNumber(0, board.getBoundingClientRect().width - dropWidth);
    }
    return l
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function finishGame() {
    deleteDrop(document.querySelectorAll('.drop'))
    playSound('./audio/e285e54b799801b.mp3')
    modal.classList.remove('hide')
    board.parentElement.parentElement.style.display = 'none'
    score[0].innerHTML = count.innerHTML
    score[1].innerHTML = movesNumber
    score[2].innerHTML = correctAnswersTotalNumber
}

function createCalculation() {
    let number = randomNumber(0, maxNumber)
    let number2 = randomNumber(0, maxNumber)
    const signs = ['+', '-','*','÷']
    let sign
    if(movesNumber<10) {
        sign = signs[randomNumber(0, 1)]
    }else if(  movesNumber<20){
        sign = signs[randomNumber(0, 2)]
    }else{
        sign = signs[randomNumber(0, 3)]
    }
    if (sign == '-') {
        number > number2 ? expression = [...expression, number, sign, number2] : expression = [...expression, number2, sign, number]
    }
    else if(sign =='*'){
        number2= randomNumber(0, 10)
        expression = [...expression, number, sign, number2]
    }
    else if(sign =='÷'){
 number = randomNumber(0, 20)
 number2 = randomNumber(0, 10)
        number*=number2
        expression = [...expression, number, sign, number2]
    }
    else {
        expression = [...expression, number, sign, number2]
    }

    return expression
}

digits.forEach(digit => {
    digit.addEventListener('click', (e) => {
        display.value == 0 ? display.value = e.target.textContent : display.value += e.target.textContent
    })
})
document.addEventListener('keydown', (e) => {

    if (isFinite(+e.key)) {
        display.value == 0 ? display.value = e.key : display.value += e.key
    }
    if (e.key == 'Enter') {
        e.preventDefault()
        checkAnswer()
    }
    if (e.key == 'Backspace') {
        display.value = display.value.slice(0, display.value.length - 1)
    }
})
clearButton.addEventListener('click', clearDisplay)

function clearDisplay() {
    display.value = 0
}

deleteButton.addEventListener('click', () => {
    display.value = display.value.slice(0, display.value.length - 1)
})
enterButton.addEventListener('click', checkAnswer)

function checkAnswer() {

    if (correctAnswers>0&&correctAnswers % 3 === 0) {
        setTimeout(()=>{
            console.log(1)
            expression=[]
            createDrop()
        },3000)
        speedOfDrop--
    }
    if (correctAnswers>0&&correctAnswers % 5 === 0) {
        maxNumber+=10
        setTimeout(()=>{
            expression=[]
            createDrop('orange')
        },2000)

    }

    let scoresNumber = 10
    let drops = Array.from(document.querySelectorAll('.drop'))

    let isRightAnswer = drops.some(e => e.dataset.answer == display.value)
    if (isRightAnswer) {
        playSound('./audio/line_open.mp3')
        let currentDrop = drops.filter(e => e.dataset.answer == display.value)[0]
      if(currentDrop.style.backgroundColor ==='orange'){
          deleteDrop(document.querySelectorAll('.drop'))
          speedOfDrop = 8
          createDrop()
      }else{
          board.removeChild(document.getElementById(currentDrop.id));
      }
        count.innerHTML = (+count.innerHTML + scoresNumber + correctAnswers)
        correctAnswers++
        correctAnswersTotalNumber++
        expression = []
        createDrop()
    } else {
        correctAnswers = 0
        speedOfDrop = 8
        playSound('./audio/jg-032316-sfx-feedback-incorrect-25.mp3')
    }
    clearDisplay()

    return isRightAnswer
}
function playSound(soundObj) {

    let sound = new Audio(soundObj)
    // let sound = document.getElementById(soundObj);
    sound.play();
}
function rightAnswer() {
    let ans = 0;
    switch (expression[1]) {

        case '+':
            return Number(expression[0]) + Number(expression[2]);
        case '-':
            return Number(expression[0]) - Number(expression[2]);
        case '*':
            return Number(expression[0]) * Number(expression[2]);
        case '÷':
            return Number(expression[0])/ Number(expression[2]);
    }
}

function startNewGame() {
    countFalls = 0
    correctAnswersTotalNumber = 0
    correctAnswers = 0
    movesNumber = 0
    deleteDrop(document.querySelectorAll('.drop'))
    clearDisplay()
    modal.classList.add('hide')
    board.parentElement.parentElement.style.display = 'flex'
    count.innerHTML = '0'
    board.style.height = `70vh`
    water.style.height = '30vh'
    waterPosition = 20
    speedOfDrop = 8
    createDrop()
}

restart.addEventListener('click', startNewGame)

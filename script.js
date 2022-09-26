const board = document.querySelector('.wrapper__game-board')
const water = document.querySelector('.water')
const startGame=document.querySelector('.startGame')
const game=document.querySelector('.game')
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
let speedOfDrop=8
startGame.addEventListener('click',()=>{
    startGame.parentElement.classList.add('hideGame')
    game.classList.remove('hideGame')
    startNewGame()
})

function createDrop() {
    const drop = document.createElement('div')
    drop.classList.add('drop')
    drop.style.left = `${randomNumber(0, board.getBoundingClientRect().width - 150)}px`
    createCalculation()
    drop.innerHTML = `<div>${expression[0]}</div>
                  <div style="position: absolute; left:20px;font-weight: bold;font-size: 5rem">${expression[1]}</div>
                  <div>${expression[2]}</div>`
    drop.style.animationDuration=speedOfDrop+'s'
    board.append(drop)
    movesNumber++
    deleteDrop = () => drop.remove()
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
        createDrop()
    });
}

createDrop()

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function finishGame() {
    deleteDrop()
    modal.classList.remove('hide')
    board.parentElement.parentElement.style.display = 'none'
    score[0].innerHTML = count.innerHTML
    score[1].innerHTML = movesNumber
    score[2].innerHTML = correctAnswersTotalNumber
}

function createCalculation() {
    let number = randomNumber(0, maxNumber)
    let number2 = randomNumber(0, maxNumber)
    const signs = ['+', '-']
    let sign = signs[randomNumber(0, signs.length - 1)]
    if (sign == '-') {
        number > number2 ? expression = [...expression, number, sign, number2] : expression = [...expression, number2, sign, number]
    } else {
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
    let scoresNumber = 10
    let isRightAnswer = display.value == rightAnswer()
    if (isRightAnswer) {
    board.firstElementChild.style.animationDuration=3+'s'
        count.innerHTML = (+count.innerHTML + scoresNumber + correctAnswers)
        correctAnswers++
        correctAnswersTotalNumber++
        correctAnswers%3==0 && speedOfDrop--
        console.log(speedOfDrop)
        board.firstChild.remove()
        expression = []
        createDrop()
        // clearDisplay()
    } else {
        correctAnswers = 0
        speedOfDrop=8
    }
    clearDisplay()
    return isRightAnswer
}

function rightAnswer() {

    switch (expression[1]) {
        case '+':
            return Number(expression[0]) + Number(expression[2]);
        case '-':
            return Number(expression[0]) - Number(expression[2]);
    }
}
function startNewGame(){
    countFalls = 0
    correctAnswersTotalNumber = 0
    correctAnswers = 0
    movesNumber = 0
    deleteDrop()
    clearDisplay()
    modal.classList.add('hide')
    board.parentElement.parentElement.style.display = 'flex'
    count.innerHTML = '0'
    board.style.height = `70vh`
    water.style.height='30vh'
    waterPosition = 20
    speedOfDrop=8
    createDrop()
}
restart.addEventListener('click',startNewGame)
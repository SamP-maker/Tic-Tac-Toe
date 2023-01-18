
const Player = (sign) =>{


    let _sign = sign

    const getSign = ()=>{
        return _sign
    }

    const setSign = (sign,active)=>{
        _sign = sign;
        const p = document.querySelector(`.btn-p.${sign.toLowerCase()}`);
        if(active){
            p.classList.add('selected');
            p.classList.remove('not-selected');
        }
    
    }

    return {getSign,setSign}
}




const gameBoard = (()=>{
let _board = Array(9)

const getField = (num)=> _board[num]



/**
     * Changes the sign of the field to the sign of the player
     * @param {*} num number of field in the array from 0 to 8 sstarting from left top
     * @param {*} player the player who changes the field
     */

const setField = (player,num)=>{
    let htmlField = document.querySelector(`.board button:nth-child(${num+1}) p `);
    htmlField.textContent = player.getSign();
    htmlField.classList.add('filled-in')
    _board[num] = player.getSign();

 

}

const clear = () =>{
   for(let i = 0; i< _board.length; i++){
    _board[i] = undefined
   }
}


   return {getField,setField,clear}

})();

const gameController = (() =>{
const _humanPlayer = Player('X');


const _sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

 /**
     * Checks if a player has filled a row.
     * If someone filled a row it returns true, else it returns false.
     * @param {gameBoard} board - call with the gameBoard
     */
 const _checkForRows = (board) => {
    for (let i = 0; i < 3; i++) {
        let row = []
        for (let j = i * 3; j < i * 3 + 3; j++) {
            row.push(board.getField(j));
        }

        if (row.every(field => field == 'X') || row.every(field => field == 'O')) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if a player has filled a column.
 * If someone filled a column it returns true, else it returns false.
 * @param {gameBoard} board - call with the gameBoard
 */
const _checkForColumns = (board) => {
    for (let i = 0; i < 3; i++) {
        let column = []
        for (let j = 0; j < 3; j++) {
            column.push(board.getField(i + 3 * j));
        }

        if (column.every(field => field == 'X') || column.every(field => field == 'O')) {
            return true;
        }
    }
    return false;
}


/**
 * Checks if a player has filled a diagonal.
 * If someone filled a diagonal it returns true, else it returns false.
 * @param {gameBoard} board - call with the gameBoard
 */
const _checkForDiagonals = (board) => {
    diagonal1 = [board.getField(0), board.getField(4), board.getField(8)];
    diagonal2 = [board.getField(6), board.getField(4), board.getField(2)];
    if (diagonal1.every(field => field == 'X') || diagonal1.every(field => field == 'O')) {
        return true;
    }
    else if (diagonal2.every(field => field == 'X') || diagonal2.every(field => field == 'O')) {
        return true;
    }
}

const checkForWin = (board) => {
    if (_checkForRows(board) || _checkForColumns(board) || _checkForDiagonals(board)) {
        return true;
    }
    return false;
}

/**
 * Checks if the game is a draw.
 * If its a draw it returns true, else it returns false.
 * @param {gameBoard} board 
 */
const checkForDraw = (board) => {
    if (checkForWin(board)) {
        return false;
    }
    for (let i = 0; i < 9; i++) {
        const field = board.getField(i);
        if (field == undefined) {
            return false;
        }
    }
    return true;
}

/**
     * changes the sign of the Human player to 'sing' and the AI players to the other sign.
     * @param {string} sign - 'X' or 'O'
     */
const changeSign = (sign) => {
const x = document.querySelector(`.btn-p.x`);
const o = document.querySelector(`.btn-p.o`);

    if (sign == 'X') {
        _humanPlayer.setSign('O', true);
        
        x.classList.add('not-selected')
        
    }
    else if (sign == 'O') {
        _humanPlayer.setSign('X', true);
        o.classList.add('not-selected')
    }
    else throw 'Incorrect sign';

    console.log(_humanPlayer.getSign)
}

 /**
     * Steps the player to the field, and checks if the game has come to an end.
     * If the game if finished it disables the buttons.
     * @param {int} num - the index of the field which the player clicked
     */

const playerStep = (num) =>{
    const field = gameBoard.getField(num);
    if (field == undefined) {
        gameBoard.setField(_humanPlayer, num);
        if (checkForWin(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame(_humanPlayer.getSign());    
            })();  
        }
        else if (checkForDraw(gameBoard)) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame("Draw");
    
            })();  
        }else{
            gameDisplay.deactivate();
            (async () => {
                await _sleep(1+ (Math.random() * 1));
                changeSign(_humanPlayer.getSign())
                if (!checkForWin(gameBoard)) {
                    gameDisplay.activate();
                }
            })();
        }

    }
    else {
        console.log('Already Filled')
    }

}


const endGame = function(sign){

    const field = document.querySelector('.field');
    field.classList.remove('unblur');
    field.classList.add('blur');

    const winElements = document.querySelectorAll('h1')

    if (sign == "Draw") {
        winElements[3].classList.remove('hide');
        console.log("Its a draw");
    }
    else {
        console.log(`The winner is player ${sign}`);
        winElements[0].classList.remove('hide');
        if(sign.toLowerCase() == 'x'){
            winElements[1].classList.remove('hide');
        }
        else{
            winElements[2].classList.remove('hide');
        }
    }
    console.log('deactivate');
    gameDisplay.deactivate();
    gameDisplay.restartHTML();
    
}

const restart = async ()=>{

    const field = document.querySelector('.field');
    const announcement = document.querySelectorAll('h1')
    field.classList.add('unblur');


     gameBoard.clear();
     gameDisplay.clear();
    
     console.log('restart');
     gameDisplay.activate();

     field.classList.remove('blur');
     
announcement.forEach(index => index.classList.add('hide'));




document.body.removeEventListener('click', gameController.restart
 );





}


return {
    checkForDraw,
    checkForWin,
    changeSign,
    playerStep,
    endGame, 
    restart
}
    
})();



const gameDisplay = (() =>{

const htmlBoard = Array.from(document.querySelectorAll(`button.btn-f`))
const restart = document.querySelector('.restart')
const x = document.querySelector(`.x`)
const o = document.querySelector(`.o`)



    const deactivate = () =>{
        htmlBoard.forEach(index => {index.setAttribute('disabled', '')})
    }


    const activate = () =>{
        htmlBoard.forEach(index => {index.removeAttribute('disabled')})
    }

    const clear = () =>{
        htmlBoard.forEach( field => {
            
            const p = field.childNodes[0];
            p.textContent = '';
            p.classList = [];
    })


    }


    const _changePlayerSign = (sign) =>{
        gameController.changeSign(sign)
        gameController.restart()
    }


    const restartHTML = () =>{
        const body = document.querySelector(`body`);
        body.addEventListener('click', gameController.restart
        );
    }



const init = (()=>{


for(let i = 0; i < htmlBoard.length; i++){
    field = htmlBoard[i];
    
    field.addEventListener('click',gameController.playerStep.bind(field,i));
}

x.addEventListener('click', _changePlayerSign.bind(this,'X'))
o.addEventListener('click', _changePlayerSign.bind(this,'O'))
restart.addEventListener('click', gameController.restart)
    
})();



return{
    deactivate,
 activate,
 clear,
 restartHTML,
 

}

})();


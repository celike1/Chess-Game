// to look for a document that has id = gameboard
const gameBoard = document.querySelector("#gameboard")

const playerDisplay= document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")

const width = 8
let playerGo = 'white'
playerDisplay.textContent = 'white'


//the state we are going to have in the beginning
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard(){
    startPieces.forEach((startPiece, i) =>{
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        //if a square has a piece then make it draggable
        square.firstChild && square.firstChild.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        const row = Math.floor((63-i)/8)+1
        //every other row.
        if (row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "beige" : "brown")
            //other row
        }else{
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }

        if (i<=15){
            square.firstChild.firstChild.classList.add('white')
        }

        if (i>=48){
            square.firstChild.firstChild.classList.add('black')
        }
        gameBoard.append(square)
    })
}
createBoard()

//grab every class square
const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square =>{
    //when the dragstart event starts call dragstart
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)})

//starts as null
let startPositionId
let draggedElement
function dragStart(e){
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e){
    //we wanna make sure we dragging and dropping to the square itself.
    e.stopPropagation()

    //checking if something is taken (the place you drop has a piece)
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const opponentGo = playerGo === 'black' ? 'white' : 'black'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    const valid = checkIfValid(e.target)

     if (correctGo) {
         if (takenByOpponent && valid){
             //replace the element
             e.target.parentNode.append(draggedElement)
             e.target.remove()
             checkForWin()
             changePlayer()
             return
         }
         //just taken
         if (taken && !takenByOpponent) {
             infoDisplay.textContent = 'Not valid move. Try again'
             setTimeout(() =>infoDisplay.textContent = '', 2000)
             return
         }
         //nothing is in the square, a valid move
         if (valid){
             e.target.append(draggedElement)
             checkForWin()
             changePlayer()
             return
         }

    }

}

function checkIfValid(target){
    //when we are dropping to a square get square id if that does not exist
    //get the target's parent node.(which is the square id)
    const targetId = Number (target.getAttribute('square-id')) ||
        Number(target.parentNode.getAttribute('square-id'))
    const startId = Number (startPositionId)
    const piece = draggedElement.id
    console.log('targetId',targetId)
    console.log('s',startId)
    console.log('p',piece)

    switch (piece){
        case 'pawn':
            const starterRow = [8,9,10,11,12,13,14,15]
            if (starterRow.includes(startId) && startId + width *2 === targetId ||
                startId + width === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
                startId + width - 1 === targetId &&
                document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId &&
                document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild
            ) {
                return true
            }
            break;
        case  'knight' :
            if (
                startId + width * 2 - 1 === targetId ||
                startId + width * 2 + 1 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId + width - 2 === targetId ||
                startId + width + 2 === targetId
            ){
                return true
            }
            break;
        case  'bishop':
            if (
                startId + width + 1 === targetId ||
                //making sure nothing is in the path
                startId + width * 2 +2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ||
                startId + width * 3 +3  === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild||
                startId + width * 4 +4  === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild||
                startId + width * 5 +5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 + 4}"]`).firstChild ||
                startId + width * 6 +6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 + 5}"]`).firstChild||
                startId + width * 7 +7 === targetId&& !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *6 + 6}"]`).firstChild ||

                //doing the other direction
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width -1}"]`).firstChild ||
                startId - width * 3 - 3  === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild||
                startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild||
                startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 - 4}"]`).firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 - 5}"]`).firstChild||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *6 - 6}"]`).firstChild ||


                //going backwards
                startId - width + 1 === targetId ||
                startId - width * 2 + 2  === targetId && !document.querySelector(`[square-id = "${startId - width +1}"]`).firstChild ||
                startId - width * 3 + 3  === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild||
                startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild||
                startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 + 4}"]`).firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 + 5}"]`).firstChild||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *6 + 6}"]`).firstChild ||

                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width -1}"]`).firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild||
                startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild||
                startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 - 4}"]`).firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 - 5}"]`).firstChild||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *6 - 6}"]`).firstChild

        ){
                return true
            }
        break;

        case 'rook':
            if (
                startId + width  === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild||
                startId + width * 4 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild||
                startId + width * 5 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4}"]`).firstChild||
                startId + width * 6 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5}"]`).firstChild||
                startId + width * 7 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *6}"]`).firstChild ||

                startId - width  === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild||
                startId - width * 4 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild||
                startId - width * 5 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4}"]`).firstChild||
                startId - width * 6 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5}"]`).firstChild||
                startId - width * 7 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *6}"]`).firstChild ||

                startId + 1  === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild||
                startId +  4 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild||
                startId +  5 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild||
                startId +  6 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild||
                startId +  7 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`).firstChild ||

                startId - 1  === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild||
                startId -  4 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild||
                startId -  5 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild||
                startId -  6 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild||
                startId -  7 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`).firstChild

            ){
                return true
            }
            break;

        case  'queen' :

            if (
                //bishop's moves

                startId + width + 1 === targetId ||
                //making sure nothing is in the path
                startId + width * 2 +2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ||
                startId + width * 3 +3  === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild||
                startId + width * 4 +4  === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild||
                startId + width * 5 +5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 + 4}"]`).firstChild ||
                startId + width * 6 +6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 + 5}"]`).firstChild||
                startId + width * 7 +7 === targetId&& !document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *6 + 6}"]`).firstChild ||

                //doing the other direction
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width -1}"]`).firstChild ||
                startId - width * 3 - 3  === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild||
                startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild||
                startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 - 4}"]`).firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 - 5}"]`).firstChild||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *6 - 6}"]`).firstChild ||


                //going backwards
                startId - width + 1 === targetId ||
                startId - width * 2 + 2  === targetId && !document.querySelector(`[square-id = "${startId - width +1}"]`).firstChild ||
                startId - width * 3 + 3  === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild||
                startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild||
                startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 + 4}"]`).firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 + 5}"]`).firstChild||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 + 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3 + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4 + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5 + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *6 + 6}"]`).firstChild ||

                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width -1}"]`).firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild||
                startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild||
                startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 - 4}"]`).firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 - 5}"]`).firstChild||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 - 2}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3 - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4 - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5 - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *6 - 6}"]`).firstChild||

                //now rook's moves

                startId + width  === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`).firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild||
                startId + width * 4 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild||
                startId + width * 5 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4}"]`).firstChild||
                startId + width * 6 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5}"]`).firstChild||
                startId + width * 7 === targetId  && !document.querySelector(`[square-id = "${startId + width }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + width *6}"]`).firstChild ||

                startId - width  === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`).firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild||
                startId - width * 4 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild||
                startId - width * 5 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4}"]`).firstChild||
                startId - width * 6 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5}"]`).firstChild||
                startId - width * 7 === targetId  && !document.querySelector(`[square-id = "${startId - width }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - width *6}"]`).firstChild ||

                startId + 1  === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`).firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild||
                startId +  4 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild||
                startId +  5 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild||
                startId +  6 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild||
                startId +  7 === targetId  && !document.querySelector(`[square-id = "${startId + 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`).firstChild ||

                startId - 1  === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`).firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild||
                startId -  4 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild||
                startId -  5 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild||
                startId -  6 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild||
                startId -  7 === targetId  && !document.querySelector(`[square-id = "${startId - 1 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 2 }"]`).firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`).firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`).firstChild

            ){
                return true
            }
            break;

        case 'king':
            if(
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width + 1 === targetId ||
                startId - width - 1 === targetId
            ){
                return true
            }

    }


}

function changePlayer(){
    if (playerGo === "white"){
        reverseIds()
        playerGo = "black"
        playerDisplay.textContent = "black"
    }else{
        revertIds()
        playerGo = "white"
        playerDisplay.textContent = "white"
    }
}


function  reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', (width * width -1) -i))

}

function  revertIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', i))

}


function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'))
    if(!kings.some(king => king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = "Black player wins. Slayy black player!!!"
        const  allSquares = document.querySelectorAll('.square')
        //now we cannot drag stuff anymore
        allSquares.forEach(square =>square.firstChild?.setAttribute('draggable', false))
    }

    if(!kings.some(king => king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = "White player wins. Slayy white player!!!"
        const  allSquares = document.querySelectorAll('.square')
        //now we cannot drag stuff anymore
        allSquares.forEach(square =>square.firstChild?.setAttribute('draggable', false))
    }

}
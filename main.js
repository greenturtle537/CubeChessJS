import {CanvasWindow, TextWindow, KeyBehaviour} from 'https://files.glitchtech.top/GE.js';
const canvasWindow = new CanvasWindow(640, 384, main); // Allows for a 80x24 text grid with 8x16 characters
let gameWindow;

function main() {
    const menuBehaviour = (textWindow=null) => {
        let menuPos = 0;
        document.addEventListener("keydown", function(event) {
            const key = event.key;
            if  ((key === "w" || key === "s") && (menuPos != -1 && menuPos != 3)) {
                textWindow.drawText(">", 0, 0+(16*(menuPos+1)), 0);
            }
            if ( key === "w" && menuPos != 0) {
                menuPos--;
                textWindow.drawText(">", 0, 0+(16*(menuPos+1)), 15);
            } else if (key === "s" && menuPos != 2) {
                menuPos++;
                textWindow.drawText(">", 0, 0+(16*(menuPos+1)), 15);
            } else if (key === "Enter") {
                if (menuPos === 0) {
                    // Start
                    textWindow.drawText("An Error Occured", 272, 0, 12);
                    textWindow.clearScreen();
                    introSeq();
                } else if (menuPos === 1) {
                    // Options
                    textWindow.drawText("An Error Occured", 272, 0, 12);
                } else if (menuPos === 2) {
                    // Exit
                    textWindow.drawText("An Error Occured", 272, 0, 12);
                }
            }
        });
    }
    const chessBehaviour = (textWindow=null) => {
        let menuPos = 0;
        document.addEventListener("keydown", function(event) {
            const key = event.key;
        });
    }

    gameWindow = new TextWindow(640, 384, 0, 0, 0, 0, false, menuBehaviour);

    mainMenu();
}



function mainMenu() {
    //This is the main menu
    gameWindow.drawText("Main Menu", 288, 0);
    gameWindow.drawText("> Play Chess", 0, 16);
    gameWindow.drawText("> Options", 0, 32);
    gameWindow.drawText("> Exit", 0, 48);
}

function introSeq() {
    gameWindow.drawText("Welcome to Chess", 288, 8);
    gameWindow.drawText("Press Enter to Continue", 256, 24);
    document.addEventListener("keydown", function(event) {
        const key = event.key;
        if (key != null) {
            gameWindow.clearScreen();
            game();
        }
    });
}

function game() {
    let gameWindow = new TextWindow(640, 384, 0, 0, 0, 0, false, null);
    gameWindow.drawText("Chess", 288, 0);

    let chessBoard = initChessBoard([
        [1, 2, 3, 4, 5, 3, 2, 1],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [6, 6, 6, 6, 6, 6, 6, 6],
        [1, 2, 3, 4, 5, 3, 2, 1]
    ]);

    const chessPieces = {
        0: ["   ", "   ", "   "], // Empty
        1: ["   ", "   ", "   "], // Empty
        2: ["   ", "   ", "   "], // Empty
        3: ["   ", "   ", "   "], // Empty
        4: ["   ", "   ", "   "], // Empty
        5: ["   ", "   ", "   "], // Empty
        6: [" o ", " U ", "[_]"], // Pawn
    }

    renderChessBoard(gameWindow, chessBoard, chessPieces);

};

function initChessBoard(startingChessBoard) {
    let chessBoard = [];
    for (let i = 0; i < 8; i++) {
        chessBoard[i] = [];
        for (let j = 0; j < 8; j++) {
            chessBoard[i][j] = startingChessBoard[i][j];
        }
    }
    return chessBoard;
}

function renderChessBoard(chessWindow, chessBoard, chessPieces) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let chessPiece = chessPieces[chessBoard[i][j]];
            chessWindow.drawText(chessPiece[0], i*24, j*48);
            chessWindow.drawText(chessPiece[1], i*24, j*48+8);
            chessWindow.drawText(chessPiece[2], i*24, j*48+16);
        }
    }
}
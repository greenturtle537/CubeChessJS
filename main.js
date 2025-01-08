import {CanvasWindow, TextWindow, KeyBehaviour} from 'https://files.glitchtech.top/GE.js';
const canvasWindow = new CanvasWindow(640, 384, main); // Allows for a 80x24 text grid with 8x16 characters
let gameWindow;

function main() {
    const menuBehaviour = (textWindow=null) => {
        let menuPos = 0;
        document.addEventListener("keydown", function(event) {
            const key = event.key;
            if  ((key === "w" || key === "s") && (menuPos != -1 && menuPos != 3)) {
                textWindow.drawText(">", 0, 0+(16*(menuPos+1)));
            }
            if ( key === "w" && menuPos != 0) {
                menuPos--;
                textWindow.drawText(">", 0, 0+(16*(menuPos+1)), [15,0]);
            } else if (key === "s" && menuPos != 2) {
                menuPos++;
                textWindow.drawText(">", 0, 0+(16*(menuPos+1)), [15,0]);
            } else if (key === "Enter") {
                if (menuPos === 0) {
                    // Start
                    textWindow.drawText("An Error Occured", 272, [0, 12]);
                    textWindow.clearScreen();
                    selectionMenu();
                } else if (menuPos === 1) {
                    // Options
                    textWindow.drawText("An Error Occured", 272, [0, 12]);
                } else if (menuPos === 2) {
                    // Exit
                    textWindow.drawText("An Error Occured", 272, [0, 12]);
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
    gameWindow.drawText("> Main Menu", 288, 0);
    gameWindow.drawText("> Play Chess", 0, 16);
    gameWindow.drawText("> Options", 0, 32);
    gameWindow.drawText("> Exit", 0, 48);
}

async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

async function getAllChess() {
    return await loadJSON('https://files.glitchtech.top/CubeChess/chess.json');
}

class ChessRuleset {
    constructor(version) {
        this.version = version;
        this.globalData = null;
        this.boardData = null;
        this.piecesData = null;
        this.pieces = {};
    }
    async load() {
        this.globalData = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/global.json`);
        this.boardData = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/${this.globalData.board}`);
        this.piecesData = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/${this.globalData.pieces}`);
        for (const [key, url] of Object.entries(this.piecesData)) {
            const piece = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/${url}`);
            this.pieces[key] = piece;
        }
    }
}

function selectionMenu() {
    gameWindow.drawText("Welcome to Chess", 288, 8);
    gameWindow.drawText("Select a Chess Version (number) to continue", 256, 24);
    getAllChess().then((versions) => {
        versions.forEach((version, index) => {
            gameWindow.drawText(`${index}: ${version.name}`, 0, 40 + index * 16);
        });
        document.addEventListener("keydown", function(event) {
            const key = event.key;
            const selectedIndex = parseInt(key, 10);
            if (!isNaN(selectedIndex) && versions[selectedIndex]) {
                gameWindow.clearScreen();
                gameWindow.drawText("Loading...", 288, 0);
                const chessRuleset = new ChessRuleset(versions[selectedIndex]);
                chessRuleset.load().then(() => {
                    game(chessRuleset);
                });
            }
        });
    });
}

function game(chessRuleset) {
    let gameWindow = new TextWindow(640, 384, 0, 0, 0, 0, false, null);
    gameWindow.drawText("=== Chess ===", 288, 0);

    let chessBoard = initChessBoard(chessRuleset.boardData);

    const chessPieces = {
        "blank": ["   ", "   ", "   "], // Empty
        "rook": ["╚╬╝", ") (", "[_]"], // Rook
        "knight": ["T\\ ", "|\\)", "[_]"], // Knight
        "bishop": ["(+)", ") (", "[_]"], // Bishop
        "queen": [" . ", ") (", "[_]"], // Queen
        "king": [" ┼ ", ") (", "[_]"], // King
        "pawn": ["   ", " o ", "[_]"], // Pawn
    }

    renderChessBoard(gameWindow, chessBoard, chessPieces);

};

function initChessBoard(boardData) {
    let startingChessBoard = boardData["attributes"]["setup"];
    let players = boardData["attributes"]["players"];
    let pattern = boardData["attributes"]["pattern"];

    let chessBoard = [];
    for (let i = 0; i < 8; i++) {
        chessBoard[i] = [];
        for (let j = 0; j < 8; j++) {
            for (let player in players) {
                let player_delimiter = players[player]["delimiter"];
                if (startingChessBoard[j][i].includes(player_delimiter)) {
                    let separatedValue = startingChessBoard[j][i].replace(player_delimiter, '');
                    chessBoard[i][j] = {
                        "tile": {
                            "x": i,
                            "y": j,
                            "pattern": pattern["setup"][i][j]
                        },
                        "piece": {
                            "player": player_delimiter,
                            "pieceName": separatedValue,
                            "color": players[player]["color"],
                        }
                    }
                }
            }
        }
    }
    console.log(chessBoard);
    return chessBoard;
}

function renderChessBoard(chessWindow, chessBoard, chessPieces) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let chessPiece = chessPieces[chessBoard[i][j]["piece"]["pieceName"]];
            //console.log(`${chessPiece}  ${i}  ${j}`);
            chessWindow.drawText(chessPiece[0], i*24, j*48, [15,0]);
            chessWindow.drawText(chessPiece[1], i*24, j*48+16, [15,0]);
            chessWindow.drawText(chessPiece[2], i*24, j*48+32, [15,0]);
        }
    }
}
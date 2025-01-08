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

Object.prototype.merge = function(target) {
    let merged = {};
    // First, copy all properties from this object
    for (const key in this) {
        if (this.hasOwnProperty(key)) {
            merged[key] = this[key];
        }
    }
    // Then add or skip properties from target
    for (const key in target) {
        if (!(key in merged)) {
            merged[key] = target[key];
        }
    }
    return merged;
};

class ChessRuleset {
    constructor(version, allVersions) {
        this.version = version;
        this.allVersions = allVersions;
        this.globalData = {};
        this.boardData = {};
        this.piecesData = {};
        this.pieces = {};
        this.subRulesets = [];
    }
    async load() {
        this.globalData = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/global.json`);
        console.log(this.globalData);
        for (var i=0; i < this.globalData["dependencies"].length; i++) {
            let depedency = this.globalData["dependencies"][i];
            console.log(depedency);
            for (var j=0; j < this.allVersions.length; j++) {
                let version = this.allVersions[j];
                if (version["identifier"] === depedency["identifier"]) {
                    this.subRulesets.push(new ChessRuleset(version, allVersions));
                    this.subRulesets[this.subRulesets.length - 1].rulesetLoad();
                }
            }
        }
    }

    async rulesetLoad() {
        this.boardData.merge(await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/${this.globalData.board}`));
        this.piecesData = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/${this.globalData.pieces}`);
        for (const [key, url] of Object.entries(this.piecesData)) {
            const piece = await loadJSON(`https://files.glitchtech.top/CubeChess/${this.version["alias"]}/${url}`);
            this.pieces[key] = piece;
        }
        console.log(this.boardData);
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
                const chessRuleset = new ChessRuleset(versions[selectedIndex],versions);
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

    renderChessBoard(gameWindow, chessBoard, chessRuleset);

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
                            "pattern": pattern["colors"][pattern["setup"][i][j]], // Super awesome pattern system
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

function renderChessBoard(chessWindow, chessBoard, chessRuleset) {
    let chessPieces = chessRuleset.pieces;
    let boardData = chessRuleset.boardData["attributes"];
    for (let i = 0; i < boardData["height"]; i++) {
        for (let j = 0; j < boardData["width"]; j++) {
            let chessPiece = chessPieces[chessBoard[i][j]["piece"]["pieceName"]]["sprite"];
            let tileColor = chessBoard[i][j]["tile"]["pattern"];
            let pieceColor = chessBoard[i][j]["piece"]["color"];
            let color = [tileColor, pieceColor];

            for (let k = 0; k < boardData["tileHeight"]; k++) {
                let rowOffset = k * 16;
                let spaces = ' '.repeat(boardData["tileWidth"]);
                chessWindow.drawText(spaces, i*(boardData["tileWidth"]*8), j*(boardData["tileHeight"]*16)+rowOffset, color);
                console.log(spaces);
            }

            let pieceYOffset = 16*boardData["pieceYOffset"];
            let pieceXOffset = 8*boardData["pieceXOffset"];

            for (let k = 0; k < boardData["pieceHeight"]; k++) {
                let rowOffset = k * 16;
                // We do not check for pieceWidth because in Freakbob we trust
                chessWindow.drawText(chessPiece[k], i*(boardData["tileWidth"]*8)+pieceXOffset, j*(boardData["tileHeight"]*16)+rowOffset+pieceYOffset, color);
            }
            
        }
    }
}
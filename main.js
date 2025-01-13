import {CanvasWindow, TextWindow, KeyBehaviour} from 'https://files.glitchtech.top/GE.js';
import {ChessGame} from "./ChessGame.js";
const canvasWindow = new CanvasWindow(640, 384, main); // Allows for a 80x24 text grid with 8x16 characters
let gameWindow;

function main() {
    const menuBehaviour = (textWindow=null, params=null) => {
        let menuPos = 0;
        document.addEventListener("keydown", function(event) {
            const key = event.key;
            if  ((key === "w" || key === "s") && (params.menuPos != -1 && params.menuPos != 3)) {
                textWindow.drawText(">", 0, 0+(16*(params.menuPos+1)));
            }
            if ( key === "w" && params.menuPos != 0) {
                params.menuPos--;
                textWindow.drawText(">", 0, 0+(16*(params.menuPos+1)), [15,0]);
            } else if (key === "s" && params.menuPos != 2) {
                params.menuPos++;
                textWindow.drawText(">", 0, 0+(16*(params.menuPos+1)), [15,0]);
            } else if (key === "Enter") {
                if (params.menuPos === 0) {
                    // Start
                    textWindow.drawText("An Error Occured", 272, [0, 12]);
                    textWindow.clearScreen();
                    selectionMenu();
                } else if (params.menuPos === 1) {
                    // Options
                    textWindow.drawText("An Error Occured", 272, [0, 12]);
                } else if (params.menuPos === 2) {
                    // Exit
                    textWindow.drawText("An Error Occured", 272, [0, 12]);
                }
            }
        });
    }

    gameWindow = new TextWindow(640, 384, 0, 0, 0, 0, false, "", menuBehaviour, {menuPos: 0});
    const gameWindow = new TextWindow({
        width: 640,
        height: 384,
        x: 0,
        y: 0,
        rows: 0,
        cols: 0,
        editable: false,
        text: "",
        keyRules: menuBehaviour,
        keyRulesParameters: {menuPos: 0}
     });
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
        console.log(this.pieces);
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

async function game(chessRuleset) {
    let chessGame = new ChessGame(chessRuleset);
    chessGame.render();
}
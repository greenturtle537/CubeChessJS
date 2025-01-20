import {TextWindow, KeyBehaviour} from 'https://files.glitchtech.top/GE.js';

class ChessGame {
    static gameplayController = (chessGame=null) => {
        document.addEventListener("keydown", function(event) {
            const key = event.key;
            chessGame.renderChessTile(chessGame.cursorX, chessGame.cursorY, 2);
            switch (key) {
                case "w":
                    if (chessGame.cursorY > 0) chessGame.cursorY--;
                    break;
                case "s":
                    if (chessGame.cursorY < 7) chessGame.cursorY++;
                    break;
                case "a":
                    if (chessGame.cursorX > 0) chessGame.cursorX--;
                    break;
                case "d":
                    if (chessGame.cursorX < 7) chessGame.cursorX++;
                    break;
                case "Enter":
                    chessGame.selectedX = chessGame.cursorX;
                    chessGame.selectedY = chessGame.cursorY;
                    break;
                case "Backspace":
                    chessGame.selectedX = null;
                    chessGame.selectedY = null;
                    break;
            }
        });
    }

    constructor(chessRuleset) {
        this.chessRuleset = chessRuleset;
        this.boardData = this.chessRuleset.boardData["attributes"];
        this.pieces = this.chessRuleset.pieces;
        this.chessBoard = this.initChessBoard(this.boardData);
        this.width = this.boardData["width"] * this.boardData["tileWidth"] * 8;
        this.height = this.boardData["height"] * this.boardData["tileHeight"] * 16;
        console.log(this.width, this.height);
        //TODO: Make chess window below solely dependent on size of board
        this.chessWindow = new TextWindow({
            width: 640, 
            height: this.height, 
            x: 0, 
            y: 0, 
            rows: 0, 
            cols: 0, 
            editable: false, 
            text: ""
        });

        this.cursorX = 0;
        this.cursorY = 0;
        this.selectionX = null;
        this.selectionY = null;
    }

    render() {
        for (let i = 0; i < this.boardData["height"]; i++) {
            for (let j = 0; j < this.boardData["width"]; j++) {
                this.renderChessTile(i, j);
            }
        }
    }

    initChessBoard() {
        let startingChessBoard = this.boardData["setup"];
        let players = this.boardData["players"];
        let pattern = this.boardData["pattern"];
    
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
        return chessBoard;
    }

    renderChessTile(i, j, backgroundColor=null) {
        let chessPiece = this.pieces[this.chessBoard[i][j]["piece"]["pieceName"]]["sprite"];
        let tileColor = this.chessBoard[i][j]["tile"]["pattern"];
    
        if (backgroundColor != null) {
            tileColor = backgroundColor;
        }
    
        let pieceColor = this.chessBoard[i][j]["piece"]["color"];
        let color = [tileColor, pieceColor];
    
        for (let k = 0; k < this.boardData["tileHeight"]; k++) {
            let rowOffset = k * 16;
            let spaces = ' '.repeat(this.boardData["tileWidth"]);
            this.chessWindow.drawText(spaces, i*(this.boardData["tileWidth"]*8), j*(this.boardData["tileHeight"]*16)+rowOffset, color);
            console.log(spaces);
        }
    
        let pieceYOffset = 16*this.boardData["pieceYOffset"];
        let pieceXOffset = 8*this.boardData["pieceXOffset"];
    
        for (let k = 0; k < this.boardData["pieceHeight"]; k++) {
            let rowOffset = k * 16;
            // We do not check for pieceWidth because in Freakbob we trust
            this.chessWindow.drawText(chessPiece[k], i*(this.boardData["tileWidth"]*8)+pieceXOffset, j*(this.boardData["tileHeight"]*16)+rowOffset+pieceYOffset, color);
        }
    }
}

export {ChessGame};
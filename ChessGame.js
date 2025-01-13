class ChessGame {
    constructor(chessRuleset) {
        this.chessRuleset = chessRuleset;
        this.boardData = this.chessRuleset.boardData["attributes"];
        this.pieces = this.chessRuleset.pieces;
        this.chessBoard = this.initChessBoard(this.boardData);
        this.width = this.boardData["width"] * this.boardData["tileWidth"] * 8;
        this.height = this.boardData["height"] * this.boardData["tileHeight"] * 16;
        console.log(this.width, this.height);
        //TODO: Make chess window below solely dependent on size of board
        this.chessWindow = new TextWindow(640, this.height, 0, 0, 0, 0, false, null);
    }

    render() {
        for (let i = 0; i < this.boardData["height"]; i++) {
            for (let j = 0; j < this.boardData["width"]; j++) {
                renderChessTile(i, j);
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
        let chessPiece = this.chessPieces[this.chessBoard[i][j]["piece"]["pieceName"]]["sprite"];
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
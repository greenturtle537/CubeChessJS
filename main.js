import {CanvasWindow, TextWindow, KeyBehaviour} from 'https://files.glitchtech.top/GE.js';
const canvasWindow = new CanvasWindow(640, 384, main); // Allows for a 80x24 text grid with 8x16 characters
let textWindow;
function main() {
    const menuBehaviour = (textWindow=null) => {
        let menuPos = 0;
        let typingOn = false;
        let overflowNotPermitted = true;
        let typingPositionX = 0;
        let typingPositionY = 0;
        let command = "";
        let flag = 1;
        
        console.log("KeyListener Loaded");
        document.addEventListener("keydown", function(event) {
            const key = event.key;
    
            if (flag === 1) {
                if  ((key === "w" || key === "s") && (menuPos != -1 && menuPos != 4)) {
                    textWindow.drawText(">", 0, 0+(16*(menuPos+1)), 0);
                    console.log("drawn");
                }
                if ( key === "w" && menuPos != 0) {
                    menuPos--;
                    textWindow.drawText(">", 0, 0+(16*(menuPos+1)), 15);
                } else if (key === "s" && menuPos != 3) {
                    menuPos++;
                    textWindow.drawText(">", 0, 0+(16*(menuPos+1)), 15);
                } else if (key === "Enter") {
                    if (menuPos === 0) {
                        // Start
                        textWindow.drawText("An Error Occured", 272, 0, 12);
                        flag++;
                        textWindow.clearScreen();
                        introSeq();
                    } else if (menuPos === 1) {
                        // Load
                    } else if (menuPos === 2) {
                        // Options
                        textWindow.drawText("An Error Occured", 272, 0, 12);
                    } else if (menuPos === 3) {
                        // Exit
                        textWindow.drawText("An Error Occured", 272, 0, 12);
                    }
                }
            } else if (flag === 2) {
                if (typingOn && overflowNotPermitted) {
                    if (key.length === 1 && typingPositionX < 640) {
                        textWindow.drawText(key, typingPositionX, typingPositionY);
                        typingPositionX += 8;
                        command += key;
                    } else if (key === "Backspace" && typingPositionX > 0) {
                        typingPositionX -= 8;
                        textWindow.drawText(" ", typingPositionX, typingPositionY);
                        command = command.slice(0, -1);
                    } else if (key === "Enter") {
                        textWindow.drawText("                                                                                ", 0, typingPositionY);
                        typingPositionX = 0;
                        //evalCommand(command);
                    }
                } else if (typingOn && !overflowNotPermitted) {
                    if (key.length === 1) {
                        // Handle single character input here
                        if (typingOn) {
                        textWindow.drawText(key, typingPositionX, typingPositionY);
                        typingPositionX += 8;
                        if (typingPositionX >= 632) {
                            typingPositionX = 0;
                            typingPositionY += 8;
                        }
                        }
                    }
                }
            }
        });
    }

    textWindow = new TextWindow(640, 384, 0, 0, 0, 0, false, menuBehaviour);

    mainMenu();
}



function mainMenu() {
    //This is the main menu
    textWindow.drawText("Main Menu", 288, 8);
    textWindow.drawText("> Play Chess", 0, 16);
    textWindow.drawText("Load", 16, 32, 0);
    textWindow.drawText(">", 0, 32, 0);
    textWindow.drawText("> Options", 0, 48);
    textWindow.drawText("> Exit", 0, 64);
}


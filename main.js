import {CanvasWindow} from 'https://files.glitchtech.top/GE.js';
const canvasWindow = new CanvasWindow(640, 384, main); // Allows for a 80x24 text grid with 8x16 characters
const textWindow = new TextWindow(640, 384, 0, 0, 0, 0, false, KeyBehaviour.getBehaviour("menu"));

function main() {
    mainMenu();
}

function mainMenu() {
    //This is the main menu
    textWindow.drawText("Main Menu", 288, 8);
    textWindow.drawText("> Start", 0, 16);
    textWindow.drawText("Load", 16, 32, 9);
    textWindow.drawText(">", 0, 32, 0);
    textWindow.drawText("> Options", 0, 48);
    textWindow.drawText("> Exit", 0, 64);
}
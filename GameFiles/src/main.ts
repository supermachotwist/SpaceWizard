import Game from "./Wolfie2D/Loop/Game";
import Level1 from "./space_wizard/Scenes/Level1";
import Splash from "./space_wizard/Scenes/Splash";

import GameLevel from "./space_wizard/Scenes/Gamelevel";
// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    runTests();

    // Set up options for our game
    let options = {
        canvasSize: {x: 1200, y: 800},          // The size of the game
        clearColor: {r: 0, g: 0, b: 0},   // The color the game clears to
        inputs: [
            {name: "up", keys: ["w"]},
            {name: "down", keys: ["s"]},
            {name: "left", keys: ["a"]},
            {name: "right", keys: ["d"]},
            {name: "slot1", keys: ["1"]},
            {name: "slot2", keys: ["2"]},
            {name: "slot3", keys: ["3"]},
            {name: "slot4", keys: ["4"]},
            {name: "pause", keys: ["escape"]}
        ],
    }

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(Splash, {});
})();

function runTests(){};
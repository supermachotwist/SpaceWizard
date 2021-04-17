import Game from "./Wolfie2D/Loop/Game";
import default_scene from "./default_scene";
import Splash from "./SpaceWizard/Scene/Splash";
import AudioDemo from "./demos/AudioDemo";
import MainMenu from "./SpaceWizard/Scene/MainMenu";




// The main function is your entrypoint into Wolfie2D. Specify your first scene and any options here.
(function main(){
    // Run any tests
    // runTests();
    console.log("hi");
    // Set up options for our game
    let options = {
        canvasSize: {x: 500, y: 500},          // The size of the game
        clearColor: {r: 32, g: 32, b: 52},   // The color the game clears to
        useWebGL: false
    }

    

    // Create a game with the options specified
    const game = new Game(options);

    // Start our game
    game.start(Splash, {});
})();

function runTests(){};
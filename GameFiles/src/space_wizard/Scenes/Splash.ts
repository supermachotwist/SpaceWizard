import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import MainMenu from "./MainMenu";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Color from "../../Wolfie2D/Utils/Color";



//Displays the splash screen
//when the user clicks on the screen
//
//possible any button, but click only might be better because 
//the mouse is a core component of gameplay
//
//todo: add click to continue on the screen
//
//chrome has this dumb issue where you need user input before audio plays
//idk how to deal with it. 
export default class Splash extends Scene {
    private logo: Sprite;
    animatedSprite: AnimatedSprite;
    loadScene(): void {
        //Splash Screen Sound?
        // use the "/"
       // this.load.audio("splashMusic", "space_wizard_assets/sounds/Splash.mp3");
        this.load.image("splash", "space_wizard_assets/images/Space Wizard Logo.png");

        //Load music and sound effects
        this.load.audio("mainMenuMusic", "space_wizard_assets/music/menu music.wav");
        this.load.audio("levelMusic", "space_wizard_assets/music/level music.wav");

    }

    unloadScene():void{
        this.load.keepAudio("mainMenuMusic");
        this.load.keepAudio("levelMusic");
    }

    startScene(): void {
        this.addUILayer("splashScreen");
        this.logo = this.add.sprite("splash", "splashScreen")
        let center = this.viewport.getCenter();
        this.logo.position.set(center.x, center.y);
        this.viewport.setFocus(this.viewport.getHalfSize());

        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, { key: "splashMusic", loop: false, holdReference: true });

        let clickToContinue = <Label> this.add.uiElement(UIElementType.LABEL,"splashScreen",{position: new Vec2(center.x,center.y+200),text:"Click To Start"});
        clickToContinue.textColor = Color.WHITE;

    }

    updateScene(): void {
        if (Input.isMousePressed()) {
          //  this.emitter.fireEvent(GameEventType.PLAY_MUSIC, { key: "splashMusic", loop: false, holdReference: true });
            this.sceneManager.changeToScene(MainMenu, {}, {});
        }

    }
}

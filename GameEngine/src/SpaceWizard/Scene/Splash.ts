import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Scene from "../../Wolfie2D/Scene/Scene";
import MainMenu from "./MainMenu";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";



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
export default class Splash extends Scene{
    private logo: Sprite;
    animatedSprite: AnimatedSprite;
    loadScene():void{
        console.log("hi");
        //Splash Screen Sound?
        // use the "/"
        this.load.audio("splashMusic","SpaceWizard_assets/sounds/Splash.mp3");
        this.load.image("splash","SpaceWizard_assets/images/Splash.png");
        
    }

    startScene():void{
        this.addUILayer("splashScreen");
        this.logo = this.add.sprite("splash","splashScreen")

        //viewport
        let center = this.viewport.getCenter();
        this.logo.position.set(center.x,center.y);
        this.viewport.setFocus(this.viewport.getHalfSize());

        //set the background
        // this.addParallaxLayer("bg", new Vec2(0.5, 1), -1);
        // let bg = this.add.sprite("splash","splash")
        // bg.position.set(bg.size.x/2, bg.size.y/2);

        this.emitter.fireEvent(GameEventType.PLAY_MUSIC,{key:"splashMusic",loop:false,holdReference:true});

        
    }

    updateScene():void{
        if(Input.isMousePressed()){
            this.sceneManager.changeToScene(MainMenu,{},{});

            this.emitter.fireEvent(GameEventType.PLAY_MUSIC,{key:"splashMusic",loop:false,holdReference:true});
        }
        
    }
    }

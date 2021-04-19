import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";


export default class MainMenu extends Scene {
    private background:Sprite;
    animatedSprite: AnimatedSprite;

    //its taking a while to load because of the mp3, which like 4 minutes long
    loadScene():void{
        this.load.image("mainMenuBackground","space_wizard_assets/images/MainMenu.png");
        //this.load.audio("mainMenuMusic","space_wizard_assets/sounds/PlaceholderMusic.mp3");
    }

    startScene():void{
        this.addUILayer("mainMenu");
        this.background = this.add.sprite("mainMenuBackground","mainMenu");

        let center = this.viewport.getCenter();
        this.background.position.set(center.x,center.y);
        this.viewport.setFocus(this.viewport.getHalfSize());

        //this.emitter.fireEvent(GameEventType.PLAY_MUSIC,{key:"mainMenuMusic",loop:true,holdReference:true});
        
        //make button!
        //make left right button(also work with arrrow/wasd keys)
        //make play button, which changes its content when changing level,also, when 
        //make setting buttons, which shows setting
        //make help buttons, which shows the help page

        let midpoint = this.viewport.getHalfSize();
        //Play Button
        //Click on this will start the level
        let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"mainMenu",{ position:new Vec2(midpoint.x,midpoint.y),text:"Level 1"});
        playButton.backgroundColor = Color.BLACK;
        playButton.borderColor = Color.BLACK;
        playButton.borderRadius = 10;
        playButton.setPadding(new Vec2(50, 10));
        playButton.font = "PixelSimple";
        playButton.onClick = () => {
            console.log("Play!");
        }

        //Setting Button
        //Clicking on this will open the setting menu
        //how do I make the setting menu?
        //new layers I guess
        let settingButton = <Button> this.add.uiElement(UIElementType.BUTTON,"mainMenu",{
                        position:new Vec2()
        })

        
    }

    updateScene():void{
        
    }

    unloadScene():void{
        //unload music here
        //this.emitter.fireEvent(GameEventType.STOP_SOUND,{key:"mainMenu"});

    }
}
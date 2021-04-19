import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./Level1";


export default class MainMenu extends Scene {
    private background:Sprite;
    animatedSprite: AnimatedSprite;
    setting:boolean;

    loadScene():void{
        this.load.image("mainMenuBackground","space_wizard_assets/images/MainMenu.png");
        //this.load.audio("mainMenuMusic","space_wizard_assets/sounds/PlaceholderMusic.mp3");
    }

    startScene():void{
        this.addLayer("mainMenu",1);
        this.addLayer("mainMenuBackground",0);
        this.addLayer("settingMenuBackGround",2);
        this.addLayer("settingMenu",3);
        this.background = this.add.sprite("mainMenuBackground","mainMenuBackground");

        let center = this.viewport.getCenter();
        this.background.position.set(center.x,center.y);
        this.viewport.setFocus(this.viewport.getHalfSize());

        let midpoint = this.viewport.getHalfSize();
        //Play Button
        //Click on this will start the level
        this.makePlayButton();
        this.makeHelpButton();
        this.makeSettingButton();
    
        
    }

    updateScene():void{
        
    }

    unloadScene():void{
        //unload music here
        //this.emitter.fireEvent(GameEventType.STOP_SOUND,{key:"mainMenu"});

    }

    makePlayButton():Button{
        let midpoint = this.viewport.getCenter();
        let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"mainMenu",{ position:new Vec2(midpoint.x,midpoint.y),text:"Demo Level"});
        playButton.backgroundColor = Color.BLACK;
        playButton.borderColor = Color.BLACK;
        playButton.borderRadius = 10;
        playButton.setPadding(new Vec2(50, 10));
        playButton.font = "PixelSimple";
        playButton.onClick = () => {
            console.log("Activated Play Button");
            this.setting?{}:this.sceneManager.changeToScene(Level1,{},{});
        }
        return playButton;
    }

    makeHelpButton():Button{
        let midpoint = this.viewport.getCenter();
        let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"mainMenu",{ position:new Vec2(midpoint.x,midpoint.y+60),text:"Help"});
        playButton.backgroundColor = Color.BLACK;
        playButton.borderColor = Color.BLACK;
        playButton.borderRadius = 10;
        playButton.setPadding(new Vec2(50, 10));
        playButton.font = "PixelSimple";
        playButton.onClick = () => {
            console.log("Activated Help Butto");
            this.createHelpMenu();
        }
        return playButton;

    }

    makeSettingButton():Button{
        let midpoint = this.viewport.getCenter();
        let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"mainMenu",{ position:new Vec2(midpoint.x,midpoint.y+120),text:"Setting"});
        playButton.backgroundColor = Color.BLACK;
        playButton.borderColor = Color.BLACK;
        playButton.borderRadius = 10;
        playButton.setPadding(new Vec2(50, 10));
        playButton.font = "PixelSimple";
        playButton.onClick = () => {
            this.createSettingMenu();
        }
        return playButton;
    }

    createSettingMenu(){
        this.setting = true;
        let center = this.viewport.getCenter();
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y),size:new Vec2(1000,500)});
        settingBackground.color = Color.WHITE;

        let musicSliderLabel = <UIElement> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x-400,center.y),text:"muusic"});
        let musicSlider = <UIElement> this.add.uiElement(UIElementType.SLIDER,"settingMenu",{position: new Vec2(center.x-100,center.y)});
        musicSlider.backgroundColor = Color.GREEN; //there might be a bug with the slider, idk
        musicSliderLabel.backgroundColor=Color.BLUE;

        let exitButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y+200),text:"exit"});
        exitButton.onClick = () =>{
            this.setting=false;
            musicSlider.destroy();
            exitButton.destroy();
            musicSliderLabel.destroy();
            settingBackground.destroy();
            console.log("Exit Setting");
        }

    }

    createHelpMenu(){
        this.setting = true;
        let center = this.viewport.getCenter();
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y),size:new Vec2(1000,500)});
        settingBackground.color = Color.WHITE;

        let helpTitle = <UIElement> this.add.uiElement(UIElementType.LABEL,"settingMenu", {position: new Vec2(center.x, center.y-200), text:"Help"});
        let helptext = "Click to shoot fireballs, placeholder Text...";
        let helpBody = <UIElement> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y),text:helptext});

        let exitButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y+200),text:"exit"});
        exitButton.onClick = () =>{
            this.setting=false;
            helpTitle.destroy();
            exitButton.destroy();
            helpBody.destroy();
            settingBackground.destroy();
            console.log("Exit Setting");
        }
    }
}
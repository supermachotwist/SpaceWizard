import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import LevelSelection from "./Level Selection";
import Level1 from "./Level1";


export default class MainMenu extends Scene {
    private background:Sprite;
    animatedSprite: AnimatedSprite;
    setting:boolean;

    loadScene():void{
        this.load.image("mainMenuBackground","space_wizard_assets/images/Space Wizard Logo.png");

        // Tower Spritesheets
        this.load.spritesheet("explosionTower", "space_wizard_assets/spritesheets/ExplosionTower.json");
        this.load.spritesheet("forkTower", "space_wizard_assets/spritesheets/ForkTower.json");
        this.load.spritesheet("pierceTower", "space_wizard_assets/spritesheets/PierceTower.json");
        
        //Load music and sound effects
        this.load.audio("mainMenuMusic", "space_wizard_assets/music/menu music.wav");
    }

    startScene():void{
        this.addLayer("mainMenu",1);
        this.addLayer("mainMenuBackground",0);
        this.addLayer("settingMenuBackGround",2);
        this.addLayer("settingMenu",3);
        this.background = this.add.sprite("mainMenuBackground","mainMenuBackground");

        let center = this.viewport.getCenter();
        this.background.position.set(center.x,center.y-200);
        this.viewport.setFocus(this.viewport.getHalfSize());

        let midpoint = this.viewport.getHalfSize();
        //Play Button
        //Click on this will start the level
        this.makePlayButton();
        this.makeHelpButton();
        this.makeSettingButton();

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "mainMenuMusic", loop: true, holdReference: true});
    }

    updateScene():void{ 
    }

    unloadScene():void{
    }

    makePlayButton():Button{
        let midpoint = this.viewport.getCenter();
        let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"mainMenu",{ position:new Vec2(midpoint.x,midpoint.y),text:"Level Selection"});
        playButton.backgroundColor = Color.BLACK;
        playButton.borderColor = Color.BLACK;
        playButton.borderRadius = 10;
        playButton.setPadding(new Vec2(50, 10));
        playButton.font = "PixelSimple";
        playButton.onClick = () => {
            console.log("Activated Play Button");
            this.setting?{}:this.sceneManager.changeToScene(LevelSelection,{},{});
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
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y),size:new Vec2(1200,800)});
        settingBackground.color = Color.BLACK;
        settingBackground.borderColor = new Color(53, 53, 53);
        settingBackground.setBorderWidth(24);

        let helpTitle = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu", {position: new Vec2(center.x, center.y- 300), text:"Help"});
        let helptext = "Point and click at your enemies to shoot projectiles at that position.";
        let helpBody1 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y - 250),text:helptext});
        helpBody1.setTextColor(Color.WHITE);
        helptext = "Choosing your spells using the number keys.";
        let helpBody2 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y - 200),text:helptext});
        helpBody2.setTextColor(Color.WHITE);
        helptext = "1-Asteroid Spell";
        let helpBody3 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y - 150),text:helptext});
        helpBody3.setTextColor(Color.WHITE);
        helptext = "2-Ice Comet Spell";
        let helpBody4 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y - 100),text:helptext});
        helpBody4.setTextColor(Color.WHITE);
        helptext = "3-Laser Spell";
        let helpBody5 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y - 50),text:helptext});
        helpBody5.setTextColor(Color.WHITE);
        helptext = "P key - pauses the game and opens popup option menu.";
        let helpBody6 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y + 0),text:helptext});
        helpBody6.setTextColor(Color.WHITE);
        helptext = "Move over powerups to gain new spells.";
        let helpBody7 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y + 50),text:helptext});
        helpBody7.setTextColor(Color.WHITE);
        helptext = "Kill all enemies in a single stage to progress to the next level";
        let helpBody8 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y + 100),text:helptext});
        helpBody8.setTextColor(Color.WHITE);
        helptext = "Shoot through the Pierce, Fork, and Explosion towers to augment your projectile";
        let helpBody9 = <Label> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x,center.y + 150),text:helptext});
        helpBody9.setTextColor(Color.WHITE);

        // Tower Sprites
        let pierceTower = this.add.animatedSprite("pierceTower", "settingMenu");
        pierceTower.position.set(300, 700);
        pierceTower.animation.play("ACTIVE", true);

        let forkTower = this.add.animatedSprite("forkTower", "settingMenu");
        forkTower.position.set(600, 700);
        forkTower.animation.play("ACTIVE", true);

        let explosionTower = this.add.animatedSprite("explosionTower", "settingMenu");
        explosionTower.position.set(900, 700);
        explosionTower.animation.play("ACTIVE", true);

        let exitButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y + 200),text:"EXIT"});
        exitButton.setBackgroundColor(new Color(53, 53, 53));
        exitButton.setPadding(new Vec2(50, 10));
        exitButton.onClick = () =>{
            this.setting=false;
            helpTitle.destroy();
            exitButton.destroy();
            helpBody1.destroy();
            helpBody2.destroy();
            helpBody3.destroy();
            helpBody4.destroy();
            helpBody5.destroy();
            helpBody6.destroy();
            helpBody7.destroy();
            helpBody8.destroy();
            helpBody9.destroy();
            pierceTower.destroy();
            forkTower.destroy();
            explosionTower.destroy();
            settingBackground.destroy();
            console.log("Exit Setting");
        }
    }
}
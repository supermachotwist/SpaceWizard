import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Level4 from "./Level4";
import Level5 from "./Level5";
import Level7 from "./Level7";
import Level6 from "./Level6";
import MainMenu from "./MainMenu";

export default class LevelSelection extends Scene {

    // Cheats
    private infiniteLives: boolean;
    private infiniteMana: boolean;
    private allSpells: boolean;
    private infiniteStardust: boolean;

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
        this.infiniteStardust = init.infiniteStardust
    }

    loadScene():void{
        super.loadScene();
    }

    startScene():void{

        this.addLayer("background", 1);
        this.addLayer("primary", 100);

        // Create background image
        let background = this.add.animatedSprite("background", "background");

        let center = this.viewport.getCenter();
        background.position.set(center.x, center.y);
        background.scale.set(4,4);
        background.animation.play("PLAY", true);
        
        // Create level selection buttons
        this.createLevelSelection();

        // Create return button
        this.createReturnButton();
    }

    unloadScene():void{
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "mainMenuMusic"});
        this.load.keepAudio("mainMenuMusic");
        this.load.keepAudio("levelMusic");
        this.load.keepSpritesheet("background");
    }

    createLevelSelection():void{
        let midpoint = this.viewport.getCenter();
        let level1 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x - 300,midpoint.y - 35),text:"Level 1"});
        level1.backgroundColor = new Color(73, 73, 73, 0.5);
        level1.borderColor = Color.BLACK;
        level1.borderRadius = 10;
        level1.setPadding(new Vec2(50, 10));
        level1.font = "AstroSpace";
        level1.onClick = () => {
            console.log("Activated Level1 Button");
            this.sceneManager.changeToScene(Level1,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }

        let level2 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y - 35),text:"Level 2"});
        level2.backgroundColor = new Color(73, 73, 73, 0.5);
        level2.borderColor = Color.BLACK;
        level2.borderRadius = 10;
        level2.setPadding(new Vec2(50, 10));
        level2.font = "AstroSpace";
        level2.onClick = () => {
            console.log("Activated Level2 Button");
            this.sceneManager.changeToScene(Level2,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }

        let level3 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x + 300,midpoint.y - 35),text:"Level 3"});
        level3.backgroundColor = new Color(73, 73, 73, 0.5);
        level3.borderColor = Color.BLACK;
        level3.borderRadius = 10;
        level3.setPadding(new Vec2(50, 10));
        level3.font = "AstroSpace";
        level3.onClick = () => {
            console.log("Activated Level3 Button");
            this.sceneManager.changeToScene(Level3,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }

        let level4 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x - 300,midpoint.y + 25),text:"Level 4"});
        level4.backgroundColor = new Color(73, 73, 73, 0.5);
        level4.borderColor = Color.BLACK;
        level4.borderRadius = 10;
        level4.setPadding(new Vec2(50, 10));
        level4.font = "AstroSpace";
        level4.onClick = () => {
            console.log("Activated Level4 Button");
            this.sceneManager.changeToScene(Level4,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }

        let level5 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y + 25),text:"Level 5"});
        level5.backgroundColor = new Color(73, 73, 73, 0.5);
        level5.borderColor = Color.BLACK;
        level5.borderRadius = 10;
        level5.setPadding(new Vec2(50, 10));
        level5.font = "AstroSpace";
        level5.onClick = () => {
            console.log("Activated Level5 Button");
            this.sceneManager.changeToScene(Level5,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }

        let level6 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x + 300,midpoint.y + 25),text:"Level 6"});
        level6.backgroundColor = new Color(73, 73, 73, 0.5);
        level6.borderColor = Color.BLACK;
        level6.borderRadius = 10;
        level6.setPadding(new Vec2(50, 10));
        level6.font = "AstroSpace";
        level6.onClick = () => {
            console.log("Activated Level6 Button");
            this.sceneManager.changeToScene(Level6,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }

        let level7 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y - 95),text:"Endless Mode"});
        level7.backgroundColor = new Color(73, 73, 73, 0.5);
        level7.borderColor = Color.BLACK;
        level7.borderRadius = 10;
        level7.setPadding(new Vec2(50, 10));
        level7.font = "AstroSpace";
        level7.onClick = () => {
            console.log("Activated Level7 Button");
            this.sceneManager.changeToScene(Level7,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells,
                infiniteStardust: this.infiniteStardust
            },{});
        }
    }

    createReturnButton():void{
        let midpoint = this.viewport.getCenter();
        let returnButton = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y + 85),text:"Return to Main Menu"});
        returnButton.backgroundColor = new Color(73, 73, 73, 0.5);
        returnButton.borderColor = Color.BLACK;
        returnButton.borderRadius = 10;
        returnButton.setPadding(new Vec2(50, 10));
        returnButton.font = "AstroSpace";
        returnButton.onClick = () => {
            console.log("Activated Return Button");
            this.sceneManager.changeToScene(MainMenu,{},{});
        }
    }

}
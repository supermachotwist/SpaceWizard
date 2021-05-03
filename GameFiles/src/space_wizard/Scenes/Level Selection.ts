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
import Level6 from "./Level6";
import MainMenu from "./MainMenu";

export default class LevelSelection extends Scene {

    // Cheats
    private infiniteLives: boolean;
    private infiniteMana: boolean;
    private allSpells: boolean;

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
    }

    loadScene():void{
    }

    startScene():void{

        this.addLayer("background", 1);
        this.addLayer("primary", 100);

        // Create background image
        let background = this.add.sprite("background", "background");

        let center = this.viewport.getCenter();
        background.position.set(center.x, center.y);
        
        // Create level selection buttons
        this.createLevelSelection();

        // Create return button
        this.createReturnButton();
    }

    unloadScene():void{
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "mainMenuMusic"});
    }

    createLevelSelection():void{
        let midpoint = this.viewport.getCenter();
        let level1 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x - 200,midpoint.y - 35),text:"Level 1"});
        level1.backgroundColor = Color.BLACK;
        level1.borderColor = Color.BLACK;
        level1.borderRadius = 10;
        level1.setPadding(new Vec2(50, 10));
        level1.font = "PixelSimple";
        level1.onClick = () => {
            console.log("Activated Level1 Button");
            this.sceneManager.changeToScene(Level1,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
        }

        let level2 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y - 35),text:"Level 2"});
        level2.backgroundColor = Color.BLACK;
        level2.borderColor = Color.BLACK;
        level2.borderRadius = 10;
        level2.setPadding(new Vec2(50, 10));
        level2.font = "PixelSimple";
        level2.onClick = () => {
            console.log("Activated Level2 Button");
            this.sceneManager.changeToScene(Level2,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
        }

        let level3 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x + 200,midpoint.y - 35),text:"Level 3"});
        level3.backgroundColor = Color.BLACK;
        level3.borderColor = Color.BLACK;
        level3.borderRadius = 10;
        level3.setPadding(new Vec2(50, 10));
        level3.font = "PixelSimple";
        level3.onClick = () => {
            console.log("Activated Level3 Button");
            this.sceneManager.changeToScene(Level3,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
        }

        let level4 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x - 200,midpoint.y + 25),text:"Level 4"});
        level4.backgroundColor = Color.BLACK;
        level4.borderColor = Color.BLACK;
        level4.borderRadius = 10;
        level4.setPadding(new Vec2(50, 10));
        level4.font = "PixelSimple";
        level4.onClick = () => {
            console.log("Activated Level4 Button");
            this.sceneManager.changeToScene(Level4,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
        }

        let level5 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y + 25),text:"Level 5"});
        level5.backgroundColor = Color.BLACK;
        level5.borderColor = Color.BLACK;
        level5.borderRadius = 10;
        level5.setPadding(new Vec2(50, 10));
        level5.font = "PixelSimple";
        level5.onClick = () => {
            console.log("Activated Level5 Button");
            this.sceneManager.changeToScene(Level5,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
        }

        let level6 = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x + 200,midpoint.y + 25),text:"Level 6"});
        level6.backgroundColor = Color.BLACK;
        level6.borderColor = Color.BLACK;
        level6.borderRadius = 10;
        level6.setPadding(new Vec2(50, 10));
        level6.font = "PixelSimple";
        level6.onClick = () => {
            console.log("Activated Level6 Button");
            this.sceneManager.changeToScene(Level6,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
        }
    }

    createReturnButton():void{
        let midpoint = this.viewport.getCenter();
        let returnButton = <Button> this.add.uiElement(UIElementType.BUTTON,"primary",{ position:new Vec2(midpoint.x,midpoint.y + 85),text:"Return to Main Menu"});
        returnButton.backgroundColor = Color.BLACK;
        returnButton.borderColor = Color.BLACK;
        returnButton.borderRadius = 10;
        returnButton.setPadding(new Vec2(50, 10));
        returnButton.font = "PixelSimple";
        returnButton.onClick = () => {
            console.log("Activated Return Button");
            this.sceneManager.changeToScene(MainMenu,{},{});
        }
    }

}
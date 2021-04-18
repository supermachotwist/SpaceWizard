import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Graphic from "../../Wolfie2D/Nodes/Graphic";


export default class GameLevel extends Scene{
    //big x and big y for % of screen
    private x = this.viewport.getCenter().x*2;
    private y = this.viewport.getCenter().y*2;

    private healthBar:Graphic;  //I dont think graphic works with healthbars
    private manaBar:Graphic; //not sure

    //these number should from the player character, not sure how to handle it
    private health:number=100;
    private mana:number=100; 
    private minBar:Vec2;//position of 0 in health bar
    private maxBar:Vec2;//position of 100 in health bar

    //something every level needs to load?
    loadScene(){
        this.loadUIFiles();
    }

    //something everylevel need to initiate, like ui
    startScene(){
        this.addUILayer("UI");
        this.drawHealthAndMana("UI");
        this.updateHealthAndMana(-50,0);
    }

    //you know 
    updateScene(){

    }

    //UI Stuff
    //Just Health and Mana
    //Cooldown System
    //that line from sprite to cursor when button is pressed

    //do need to connect it to the player character

    //loads the stuff for the UI
    loadUIFiles(){
        //health and mana

        //spells
        //spell icon, line assist?
    }

    //draw health and mana bar for setup
    drawHealthAndMana(layer:string){
        this.minBar = new Vec2(this.x*0.1, this.y*0.95-15);
        this.maxBar = new Vec2(this.x*0.9, this.y*0.95-15); //this is really jank, fix it later by using var 
        this.healthBar = this.add.graphic(GraphicType.RECT,layer,{position: new Vec2(this.x*0.5, this.y*0.95-15), size: new Vec2(this.x*0.8, 10)});
        this.manaBar = this.add.graphic(GraphicType.RECT,layer,{position: new Vec2(this.x*0.5, this.y*0.95), size: new Vec2(this.x*0.8, 10)});
        this.manaBar.setColor(Color.BLUE);
        this.healthBar.
    }

    //draw health and mana bars as X/100
    //caps at 100%
    //idk how to make a healthbar, its not changing.
    updateHealthAndMana(deltaHealth:number,deltaMana:number){
        // this.health= this.health+deltaHealth;
        // this.mana = this.mana+deltaMana;

        // let percentHealth = this.health/100;
        // let percentMana = this.mana/100;

        // //cap to 100 percent
        // percentHealth>1 ? percentHealth=1 : percentHealth;
        // percentMana>1 ? percentMana=1 :percentMana; 

        // //waitt.....
        // // I can just change the size of the healthbar, and then shift the position by the size
        // let newX = this.x * percentHealth;
        // this.healthBar.position.x = newX;
        // this.healthBar.scaleX = percentHealth;
        // this.healthBar = this.add.graphic(GraphicType.RECT,"UI",{position: new Vec2(newX, this.y*0.95-20), size: new Vec2(percentHealth, 10)});
        // //just want to move the
    }

    //render spells casted to cooldown, and reduce cooldown for all spells?
    //not too sure how to reduce cooldown, maybe a percentage kind of thing
    //maybe draw the assist line here
    drawSpell(spell1:boolean){

    }

}
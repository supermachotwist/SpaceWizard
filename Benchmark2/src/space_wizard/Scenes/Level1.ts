import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import GameLevel from "./Gamelevel";



export default class Level extends GameLevel {
    // The player
    private player: AnimatedSprite;
    // Logo
    private logo: Sprite;

    //temp stuff for the demo, idk how we are handling some of these infos
    private healthBar:Graphic; 
    private manaBar:Graphic;
    private health:number=100;
    private mana:number=100;

    private spell_1_Cooldown:number=1;//sec? or frames, maybe frames would be neat

    loadScene(): void {
        this.load.spritesheet("player", "space_wizard_assets/spritesheets/WizardPlayer.json");
        this.load.image("logo", "space_wizard_assets/images/Space Wizard Logo.png");

        this.loadUIFiles();
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        let center = this.viewport.getCenter();

        this.addUILayer("UI");
        this.healthBar = this.add.graphic(GraphicType.RECT,"UI",{position: new Vec2(center.x, center.y*2-30), size: new Vec2(500, 10)});
        this.manaBar = this.add.graphic(GraphicType.RECT,"UI",{position: new Vec2(center.x, center.y*2-10), size: new Vec2(500, 10)});
        this.manaBar.setColor(Color.BLUE);



        // Create any game objects here. For example, to add the sprite we previously loaded:

        // First, create a layer for it to go on
        this.addLayer("primary");

        // The first argument is the key we specified in "this.load.image"
        // The second argument is the name of the layer
        this.logo = this.add.sprite("logo", "primary");

        // Now, let's make sure our logo is in a good position
        //let center = this.viewport.getCenter();
        this.logo.position.set(center.x, center.y);

        this.initializePlayer();

        
    }

    initializePlayer(): void {
        // Get center of viewport
        let center = this.viewport.getCenter();

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(center.x, center.y + 100);
        this.player.addAI(PlayerController,{});

        // Start player is idle animation on loop
        this.player.animation.play("IDLE", true);
    }

    //UI Stuff
    //What do I need?
    //Just Health and Mana
    //Cooldown System
    //that line from sprite to cursor when button is pressed
    //thats should be about it

    //I think I need to attack these code to the player character
    //I think for now I will just stick it here for the demo

    //loads the stuff for the UI
    loadUIFiles(){
        //health and mana

        //spells
        //spell icon, line assist?
    }

    //draw health and mana bar for setup
    drawHealthAndMana(layer:string){
        this.healthBar = this.add.graphic(GraphicType.RECT,layer,{position: new Vec2(0, 0), size: new Vec2(100, 100)});
    }

    //draw health and mana bars as X/100
    //caps at 100%
    updateHealthAndMana(deltaHealth:number,deltaMana:number){
        this.health= this.health+deltaHealth;
        this.mana = this.mana+deltaMana;

        let percentHealth = this.health/100;
        let percentMana = this.mana/100;

        //cap to 100 percent
        percentHealth>1 ? percentHealth=1 : percentHealth;
        percentMana>1 ? percentMana=1 :percentMana; 

        //draw the box, how hard can it be?
    }

    //render spells casted to cooldown, and reduce cooldown for all spells?
    //not too sure how to reduce cooldown, maybe a percentage kind of thing
    //maybe draw the assist line here
    drawSpell(spell1:boolean){

    }



}
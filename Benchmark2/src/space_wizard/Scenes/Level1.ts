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



export default class Level1 extends Scene {
    // The player
    private player: AnimatedSprite;
    

    // Logo
    private logo: Sprite;

    loadScene(): void {
        this.load.spritesheet("player", "space_wizard_assets/spritesheets/WizardPlayer.json");
        this.load.image("logo", "space_wizard_assets/images/Space Wizard Logo.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        // Create any game objects here. For example, to add the sprite we previously loaded:

        // First, create a layer for it to go on
        this.addLayer("primary");

        // The first argument is the key we specified in "this.load.image"
        // The second argument is the name of the layer
        this.logo = this.add.sprite("logo", "primary");

        // Now, let's make sure our logo is in a good position
        let center = this.viewport.getCenter();
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

    //draw health and mana bars 
    loadHealthAndMana(){
        
    }

    //render changes in health/mana
    //
    updateHealthAndMana(deltaHealth:number,deltaMana:number){

    }

    //load the required files for spellsUI
    //this include spell icon, and that line assist thing, I think, idk
    loadSpellsUI(){

    }

    //render spells casted to cooldown, and reduce cooldown for all spells?
    //not too sure how to reduce cooldown, maybe a percentage kind of thing
    //maybe draw the assist line. 
    updateSpell(spell1:boolean){

    }



}
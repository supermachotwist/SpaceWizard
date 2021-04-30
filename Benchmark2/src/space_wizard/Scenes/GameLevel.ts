import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import SpellManager from "../GameSystems/Spells/SpellManager";
import Spell from "../GameSystems/Spells/Spell";
import Meteor from "../GameSystems/Spells/SpellTypes/Meteor";
import Tower from "../GameSystems/Towers/Tower";
import ExplosionTower from "../GameSystems/Towers/ExplosionTower";
import ForkTower from "../GameSystems/Towers/ForkTower";
import PierceTower from "../GameSystems/Towers/PierceTower";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import EnemyAI from "../AI/EnemyAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Enemy from "../GameSystems/Enemys/Enemy";
import ArrayUtils from "../../Wolfie2D/Utils/ArrayUtils";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import {space_wizard_events, space_wizard_names} from "../space_wizard_events";
import Comet from "../GameSystems/Spells/SpellTypes/Comet";
import SpriteShaderType from "../../Wolfie2D/Rendering/WebGLRendering/ShaderTypes/SpriteShaderType";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";
import enemySpaceship from "../GameSystems/Enemys/EnemyTypes/EnemySpaceship";
import EnemyType from "../GameSystems/Enemys/EnemyType";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";



export default class GameLevel extends Scene {
    // The player
    player: AnimatedSprite;

    // Logo
    private logo: Sprite;

    /** A list of towers in the game world */
    private towers: Array<Tower>;

    /** A list of enemies in the game world */
    private enemies: Array<Enemy>;

    // The position graph for navmesh
    private graph: PositionGraph;

    private paused: boolean;

    protected healthCountLabel: Label;

    loadScene(): void {
        this.load.spritesheet("player", "space_wizard_assets/spritesheets/WizardPlayer.json");

        // Spell Spritesheets
        this.load.spritesheet("meteor", "space_wizard_assets/spritesheets/meteor.json");
        this.load.spritesheet("comet", "space_wizard_assets/spritesheets/comet.json");

        // Tower Spritesheets
        this.load.spritesheet("explosionTower", "space_wizard_assets/spritesheets/ExplosionTower.json");
        this.load.spritesheet("forkTower", "space_wizard_assets/spritesheets/ForkTower.json");
        this.load.spritesheet("pierceTower", "space_wizard_assets/spritesheets/PierceTower.json");

        // Enemy Spritesheets
        this.load.spritesheet("enemySpaceship", "space_wizard_assets/spritesheets/enemy_spaceship.json");
        this.load.spritesheet("enemyProjectile", "space_wizard_assets/spritesheets/EnemyProjectile.json");
        
        this.load.image("logo", "space_wizard_assets/images/Space Wizard Logo.png");
        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteorSprite", "space_wizard_assets/sprites/meteor.png");
        this.load.image("cometSprite", "space_wizard_assets/sprites/comet.png");
        this.load.image("cookiePlanet", "space_wizard_assets/images/Cookie Planet.png");

        this.load.object("towerData", "space_wizard_assets/data/towers.json");
        this.load.object("enemyData", "space_wizard_assets/data/enemies.json");

        // Navmesh for Enemies
        this.load.object("navmesh", "space_wizard_assets/data/navmesh.json");

        // Sound Effects
        this.load.audio("laser", "space_wizard_assets/sound effect/laser.wav");
        this.load.audio("bubbles", "space_wizard_assets/sound effect/bubbles.wav");
        this.load.audio("bang", "space_wizard_assets/sound effect/bang.wav");
        this.load.audio("spaceship", "space_wizard_assets/sound effect/spaceship.wav");
        this.load.audio("thunder", "space_wizard_assets/sound effect/thunder.wav");
        this.load.audio("playerDamage", "space_wizard_assets/sound effect/player damage.wav");

        // Level music
        this.load.audio("levelMusic", "space_wizard_assets/music/level music.wav");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        // Initialize array of towers
        this.towers = new Array();

        // Initialize array of enemies
        this.enemies = new Array();

        this.paused = false;

        this.subscribeToEvents();

        this.initLayers();

        this.createBackground();

        this.initializePlayer();

        this.addUI();

        this.spawnEnemies();

        this.spawnTowers();

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "levelMusic", loop: true, holdReference: true});
    }

    unloadScene():void{
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "levelMusic"});
    }

    getEnemies(): Array<Enemy>{
        return this.enemies;
    }

    initLayers(): void {
        this.addLayer("settingMenu",100);
        this.addLayer("settingMenuBackGround",99);
        this.addLayer("primary", 50);
        this.addLayer("background", 0);

        // Add a layer for UI
        this.addUILayer("UI");
    }

    createBackground(): void {
        // The first argument is the key we specified in "this.load.image"
        // The second argument is the name of the layer
        this.logo = this.add.sprite("logo", "background");

        // Now, let's make sure our logo is in a good position
        let center = this.viewport.getCenter();
        this.logo.position.set(center.x, center.y);
        // this.settingButton();

        // Create the cookie planet background
        let cookiePlanet = this.add.sprite("cookiePlanet", "background");
        cookiePlanet.scale.scale(10);
        cookiePlanet.position.set(center.x, center.y + this.viewport.getHalfSize().y - 64);
    }

    spawnEnemies(): void {

        // Get the enemy data
        let enemyData = this.load.getObject("enemyData");

        for (let enemy of enemyData.enemies) {
            let enemySprite;
            // Spawn appropriate enemy
            if (enemy.type == "enemySpaceship"){
                enemySprite = this.add.animatedSprite("enemySpaceship", "primary");
                enemySprite.scale.scale(0.5);
            }
            // Add collision to sprite
            enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
            enemySprite.position.set(enemy.position[0], enemy.position[1]);

            let enemyType = new enemySpaceship();
            let enemyClass = new Enemy(enemySprite, "enemySpaceship", enemyType);
            enemySprite.addAI(EnemyAI, {
                player: this.player,
                enemy: enemyClass
            });
            enemySprite.animation.play("IDLE", true);
            this.enemies.push(enemyClass);
        }
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new SpellManager(this, 4, "inventorySlot", new Vec2(64,760), 48);

        // Add Meteor spell
        let meteorSprite = this.add.sprite("meteorSprite", "primary");
        meteorSprite.scale.scale(2.8);
        let startingSpell = new Spell(meteorSprite, new Meteor(), this.towers, this.enemies);
        inventory.addItem(startingSpell);

        // Add Comet spell
        inventory.changeSlot(1);
        let cometSprite = this.add.sprite("cometSprite", "primary");
        cometSprite.scale.scale(2.8);
        cometSprite.rotation += Math.PI/4;
        let secondSpell = new Spell(cometSprite, new Comet(), this.towers, this.enemies);
        inventory.addItem(secondSpell);

        // Get center of viewport
        let center = this.viewport.getCenter();

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(center.x, center.y + 300);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(20, 20)));
        this.player.addAI(PlayerController,{
            inventory: inventory,
            speed:300
        });

        // Start player is idle animation on loop
        this.player.animation.play("IDLE", true);
    }

    updateScene(deltaT: number) {
        if (this.enemies.length == 0){
            this.spawnEnemies();
        }
        if (Input.isPressed("pause")){
            if (!this.paused){
                this.createPauseMenu();
            }
        }

        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case space_wizard_events.PLAYER_DAMAGE: {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "playerDamage", loop: false, holdReference: false});
                    if ((<PlayerController> this.player.ai).damage()) {
                       this.gameover();
                    }
                    else {
                        this.healthCountLabel.text = "Health: " + (<PlayerController>this.player.ai).health;
                    }
                }
            }
        }
    }

    isPaused(): boolean {
        return this.paused;
    }

    gameover(): void {
        this.sceneManager.changeToScene(MainMenu, {}, {});
    }

    spawnTowers(): void {
        // Get the tower data
        let towerData = this.load.getObject("towerData");

        for(let tower of towerData.towers){
            if(tower.type === "explosion"){
                let explosionTowerSprite = this.add.animatedSprite("explosionTower", "primary");
                // Add collision to sprite
                explosionTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
                // ExplosionTower(sprite, radius)
                let explosionTower = new ExplosionTower(explosionTowerSprite, 64);
                // Add tower to scene
                explosionTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
                explosionTower.playAnimation();
                this.towers.push(explosionTower);
            } else if (tower.type === "fork"){
                let forkTowerSprite = this.add.animatedSprite("forkTower", "primary");
                // Add collision to sprite
                forkTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
                // ForkTower(sprite, radius)
                let forkTower = new ForkTower(forkTowerSprite, 64);
                // Add tower to scene
                forkTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
                forkTower.playAnimation();
                this.towers.push(forkTower);
            } else if (tower.type === "pierce"){
                let pierceTowerSprite = this.add.animatedSprite("pierceTower", "primary");
                // Add collision to sprite
                pierceTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
                // PierceTower(sprite, radius)
                let pierceTower = new PierceTower(pierceTowerSprite, 64);
                // Add tower to scene
                pierceTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
                pierceTower.playAnimation();
                this.towers.push(pierceTower);
            }
        }        
    }

    createNavmesh(): void {
        // Add a layer to display the graph
        let gLayer = this.addLayer("graph");
        gLayer.setHidden(true);

        let navmeshData = this.load.getObject("navmesh");

         // Create the graph
        this.graph = new PositionGraph();

        // Add all nodes to our graph
        for(let node of navmeshData.nodes){
            this.graph.addPositionedNode(new Vec2(node[0], node[1]));
            this.add.graphic(GraphicType.POINT, "graph", {position: new Vec2(node[0], node[1])})
        }

        // Add all edges to our graph
        for(let edge of navmeshData.edges){
            this.graph.addEdge(edge[0], edge[1]);
            this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(edge[0]), end: this.graph.getNodePosition(edge[1])})
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        this.navManager.addNavigableEntity(space_wizard_names.NAVMESH, navmesh);
    }

    createPauseMenu():void{
        this.paused = true;
        let center = this.viewport.getCenter();
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y),size:new Vec2(900,600)});
        settingBackground.color = new Color(73, 73, 73, 0.5);
        settingBackground.borderColor = new Color(53, 53, 53, 0.5);
        settingBackground.setBorderWidth(24);

        // Exit button
        let exitButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y + 50),text:"EXIT"});
        exitButton.setBackgroundColor(new Color(53, 53, 53));
        exitButton.setPadding(new Vec2(50, 10));
        exitButton.onClick = () =>{
            settingBackground.destroy();
            resumeButton.destroy();
            exitButton.destroy();
            this.sceneManager.changeToScene(MainMenu, {}, {});
            console.log("Exit to Menu");
        }

        // Resume button
        let resumeButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y - 50),text:"RESUME"});
        resumeButton.setBackgroundColor(new Color(53, 53, 53));
        resumeButton.setPadding(new Vec2(50, 10));
        resumeButton.onClick = () =>{
            settingBackground.destroy();
            resumeButton.destroy();
            exitButton.destroy();
            this.paused = false;
            console.log("Resume Game");
        }
    }

    addUI(): void {
        this.healthCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 700), text: "Lives: " + (<PlayerController> this.player.ai).health});
        this.healthCountLabel.textColor = Color.WHITE
    }

    protected subscribeToEvents(){
        this.receiver.subscribe([
            space_wizard_events.PLAYER_DAMAGE,
        ]);
    }

    //replace button with a image at a later date
    // settingButton(){
    //     let midpoint = this.viewport.getCenter();
    //     let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{ position:new Vec2(midpoint.x,midpoint.y+120),text:"Setting"});
    //     playButton.backgroundColor = Color.BLACK;
    //     playButton.borderColor = Color.BLACK;
    //     playButton.borderRadius = 10;
    //     playButton.setPadding(new Vec2(50, 10));
    //     playButton.font = "PixelSimple";
    //     playButton.onClick = () => {
    //         this.createSettingMenu();
    //     }
    //     return playButton;
    // }

    //wait, how to pause game????
    
    // createSettingMenu(){
    //     let center = this.viewport.getCenter();

    //     let musicSliderLabel = <UIElement> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x-400,center.y),text:"muusic"});
    //     let musicSlider = <UIElement> this.add.uiElement(UIElementType.SLIDER,"settingMenu",{position: new Vec2(center.x-100,center.y)});
    //     musicSlider.backgroundColor = Color.GREEN; //there might be a bug with the slider, idk
    //     musicSliderLabel.backgroundColor=Color.BLUE;
    //     // let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenu",{position:new Vec2(center.x,center.y),size:new Vec2(1000,500)});
    //     // settingBackground.color = Color.WHITE;

    //     let exitButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y+200),text:"exit"});
    //     exitButton.onClick = () =>{
    //         musicSlider.destroy();
    //         exitButton.destroy();
    //         musicSliderLabel.destroy();
    //       //  settingBackground.destroy();
    //         console.log("Exit Setting");
    //     }
    // }
    
}
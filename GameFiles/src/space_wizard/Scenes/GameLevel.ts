import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import SpellManager from "../GameSystems/Spells/SpellManager";
import Spell from "../GameSystems/Spells/Spell";
import Meteor from "../GameSystems/Spells/SpellTypes/Meteor";
import Laser from "../GameSystems/Spells/SpellTypes/Laser";
import Tower from "../GameSystems/Towers/Tower";
import ExplosionTower from "../GameSystems/Towers/ExplosionTower";
import ForkTower from "../GameSystems/Towers/ForkTower";
import PierceTower from "../GameSystems/Towers/PierceTower";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import EnemyAI from "../AI/EnemyAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Enemy from "../GameSystems/Enemys/Enemy";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import {space_wizard_events, space_wizard_names} from "../space_wizard_events";
import Comet from "../GameSystems/Spells/SpellTypes/Comet";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";
import enemySpaceship from "../GameSystems/Enemys/EnemyTypes/EnemySpaceship";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Blackhole from "../GameSystems/Spells/SpellTypes/Blackhole";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import enemyUFO from "../GameSystems/Enemys/EnemyTypes/EnemyUFO";
import shieldEnemy from "../GameSystems/Enemys/EnemyTypes/ShieldEnemy";



export default class GameLevel extends Scene {
    // The player
    player: AnimatedSprite;

    /** A list of towers in the game world */
    private towers: Array<Tower>;

    /** A list of enemies in the game world */
    private enemies: Array<Enemy>;

    // The position graph for navmesh
    private graph: PositionGraph;

    private paused: boolean;

    protected healthCountLabel: Label;

    protected manaCountLabel: Label;

    protected manaBar: Rect;

    private infiniteLives: boolean;

    private infiniteMana: boolean;

    private allSpells: boolean;

    private wave: number;

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
    }

    loadScene(): void {
        this.load.spritesheet("player", "space_wizard_assets/spritesheets/WizardPlayer.json");

        // Spell Spritesheets
        this.load.spritesheet("meteor", "space_wizard_assets/spritesheets/meteor.json");
        this.load.spritesheet("comet", "space_wizard_assets/spritesheets/comet.json");
        this.load.spritesheet("laser", "space_wizard_assets/spritesheets/laser.json");
        this.load.spritesheet("blackhole", "space_wizard_assets/spritesheets/blackhole.json");

        // Tower Spritesheets
        this.load.spritesheet("explosionTower", "space_wizard_assets/spritesheets/ExplosionTower.json");
        this.load.spritesheet("forkTower", "space_wizard_assets/spritesheets/ForkTower.json");
        this.load.spritesheet("pierceTower", "space_wizard_assets/spritesheets/PierceTower.json");

        // Enemy Spritesheets
        this.load.spritesheet("enemyUFO", "space_wizard_assets/spritesheets/UFO.json");
        this.load.spritesheet("enemySpaceship", "space_wizard_assets/spritesheets/enemy_spaceship.json");
        this.load.spritesheet("shieldEnemy", "space_wizard_assets/spritesheets/shield_enemy.json");
        this.load.spritesheet("enemyProjectile", "space_wizard_assets/spritesheets/EnemyProjectile.json");
        
        this.load.image("cookiePlanet", "space_wizard_assets/images/Cookie Planet.png");
        this.load.image("space", "space_wizard_assets/images/Space.png");

        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteorSprite", "space_wizard_assets/sprites/meteor.png");
        this.load.image("cometSprite", "space_wizard_assets/sprites/comet.png");
        this.load.image("laserSprite", "space_wizard_assets/sprites/laser.png");
        this.load.image("blackholeSprite", "space_wizard_assets/sprites/blackhole.png");

        this.load.object("towerData", "space_wizard_assets/data/towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl1_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl1_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl1_wave3.json");

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
        // Initialize wave number
        this.wave = 3;

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
        this.addLayer("spell", 51);
        this.addLayer("primary", 50);
        this.addLayer("cookie", 1);
        this.addLayer("background", 0);

        // Add a layer for UI
        this.addUILayer("UI");
    }

    createBackground(): void {
        let background = this.add.sprite("space", "background");

        // Now, let's make sure our logo is in a good position
        let center = this.viewport.getCenter();
        background.position.set(center.x, center.y);

        // Create the cookie planet background
        let cookiePlanet = this.add.sprite("cookiePlanet", "cookie");
        cookiePlanet.scale.scale(10);
        cookiePlanet.position.set(center.x, center.y + this.viewport.getHalfSize().y - 64);
    }

    spawnEnemies(): void {
        let enemyData;
        // Get the enemy data
        if (this.wave%3 == 1){
            enemyData = this.load.getObject("wave1");
        } else if (this.wave%3 == 2){
            enemyData = this.load.getObject("wave2");
        } else if (this.wave%3 == 0){
            enemyData = this.load.getObject("wave3");
        }

        for (let enemy of enemyData.enemies) {
            let enemySprite;
            let enemyType;
            // Spawn appropriate enemy
            if (enemy.type == "enemySpaceship") {
                enemySprite = this.add.animatedSprite("enemySpaceship", "primary");
                enemySprite.scale.scale(0.5);
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new enemySpaceship();
            }
            else if (enemy.type == "enemyUFO") {
                enemySprite = this.add.animatedSprite("enemyUFO", "primary");
                // Add collision to sprite
                enemySprite.scale.scale(2);
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(20, 20)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new enemyUFO();
            }
            else if (enemy.type == "shieldEnemy") {
                enemySprite = this.add.animatedSprite("shieldEnemy", "primary");
                // Add collision to sprite
                enemySprite.scale.scale(2);
                enemySprite.addPhysics(new Circle(Vec2.ZERO, 32));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new shieldEnemy();
            }
            
            let enemyClass = new Enemy(enemySprite, enemyType);
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

        if (this.allSpells){
            // Add Comet spell
            inventory.changeSlot(1);
            let cometSprite = this.add.sprite("cometSprite", "primary");
            cometSprite.scale.scale(2.8);
            cometSprite.rotation += Math.PI/4;
            let secondSpell = new Spell(cometSprite, new Comet(), this.towers, this.enemies);
            inventory.addItem(secondSpell);

            // Add Laser spell
            inventory.changeSlot(2);
            let laserSprite = this.add.sprite("laserSprite", "primary");
            laserSprite.scale.scale(2.8);
            laserSprite.rotation += Math.PI/4;
            let thirdSpell = new Spell(laserSprite, new Laser(), this.towers, this.enemies);
            inventory.addItem(thirdSpell);

            // Add Blackhole spell
            inventory.changeSlot(3);
            let blackholeSprite = this.add.sprite("blackholeSprite", "primary");
            blackholeSprite.scale.scale(2.8);
            blackholeSprite.rotation += Math.PI/4;
            let fourthSpell = new Spell(blackholeSprite, new Blackhole(), this.towers, this.enemies);
            inventory.addItem(fourthSpell);

            inventory.changeSlot(0);
        }

        // Get center of viewport
        let center = this.viewport.getCenter();

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.scale(0.5);
        this.player.position.set(center.x, center.y + 300);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(25, 25)));
        this.player.addAI(PlayerController,{
            inventory: inventory,
            speed:300
        });

        // Start player is idle animation on loop
        this.player.animation.play("IDLE", true);
    }

    updateScene(deltaT: number) {
        if (this.enemies.length == 0){
            this.wave += 1;
            this.spawnEnemies();
        }
        if (Input.isPressed("pause")){
            if (!this.paused){
                this.createPauseMenu();
            }
        }

        if (this.infiniteMana){
            (<PlayerController>this.player.ai).mana = 1000;
        }
        let mana = (<PlayerController>this.player.ai).mana;
        this.manaCountLabel.text = "Mana: " + mana;
        this.manaBar.size.x = mana/1000 * 300;
        this.manaBar.position.x = (mana/1000 * 300)/2 + 25;

        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case space_wizard_events.PLAYER_DAMAGE: {
                    if (this.infiniteLives) {
                        break;
                    }
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "playerDamage", loop: false, holdReference: false});
                    if ((<PlayerController> this.player.ai).damage()) {
                        this.player.animation.playIfNotAlready("DEATH", false, space_wizard_events.GAME_OVER);
                    }
                    else {
                        if (!this.player.animation.isPlaying("DEATH")){
                            this.player.animation.playIfNotAlready("DAMAGE", false);
                        }
                        this.healthCountLabel.text = "Health: " + (<PlayerController>this.player.ai).health;
                    }
                    break;
                }
                case space_wizard_events.GAME_OVER:{
                    this.sceneManager.changeToScene(MainMenu,{},{});
                    break;
                }
            }
        }
    }

    isPaused(): boolean {
        return this.paused;
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

    createPauseMenu():void{
        this.paused = true;
        let center = this.viewport.getCenter();
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y),size:new Vec2(900,600)});
        settingBackground.color = new Color(73, 73, 73, 0.5);
        settingBackground.borderColor = new Color(53, 53, 53, 0.5);
        settingBackground.setBorderWidth(24);

        // Mute button
        let muteButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y),text:"MUTE"});
        muteButton.setBackgroundColor(new Color(53, 53, 53));
        muteButton.setPadding(new Vec2(50, 10));
        muteButton.onClick = () =>{
            if (muteButton.text == "MUTE") {
                muteButton.text = "UNMUTE";
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "levelMusic"});
            } else {
                muteButton.text = "MUTE";
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "levelMusic", loop: true, holdReference: true});
            }
        }

        // Exit button
        let exitButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y + 100),text:"EXIT"});
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
        let resumeButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y - 100),text:"RESUME"});
        resumeButton.setBackgroundColor(new Color(53, 53, 53));
        resumeButton.setPadding(new Vec2(50, 10));
        resumeButton.onClick = () =>{
            settingBackground.destroy();
            resumeButton.destroy();
            exitButton.destroy();
            muteButton.destroy();
            this.paused = false;
            console.log("Resume Game");
        }
    }

    addUI(): void {
        this.healthCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 700), text: "Lives: " + (<PlayerController> this.player.ai).health});
        this.healthCountLabel.textColor = Color.WHITE;

        this.manaCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(100, 650), text: "Mana: " + (<PlayerController>this.player.ai).mana});
        this.manaCountLabel.textColor = Color.WHITE;

        this.manaBar = <Rect>this.add.graphic(GraphicType.RECT, "UI", {position: new Vec2(175,675), size: new Vec2(300, 8)});
        this.manaBar.color = Color.BLUE;
        
    }

    protected subscribeToEvents(){
        this.receiver.subscribe([
            space_wizard_events.PLAYER_DAMAGE,
            space_wizard_events.GAME_OVER
        ]);
    }
    
}
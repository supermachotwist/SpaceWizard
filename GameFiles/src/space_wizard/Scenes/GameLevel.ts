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
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import CurrencyAI from "../AI/CurrencyAI";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import stargateEnemy from "../GameSystems/Enemys/EnemyTypes/Stargate";
import Deathstar from "../GameSystems/Enemys/EnemyTypes/DeathStar";
import Bulletman from "../GameSystems/Enemys/EnemyTypes/Bulletman";
import spikeEnemy from "../GameSystems/Enemys/EnemyTypes/SpikeEnemy";
import disruptor from "../GameSystems/Enemys/EnemyTypes/Disruptor";


export default class GameLevel extends Scene {
    // The player
    player: AnimatedSprite;

    /** A list of towers in the game world */
    towers: Array<Tower>;

    /** A list of enemies in the game world */
    enemies: Array<Enemy>;

    /** A list of currency in the game world */
    currency: Array<AnimatedSprite>;

    // The position graph for navmesh
    graph: PositionGraph;

    paused: boolean;

    nextLevel: new (...args: any) => GameLevel;

    waveEnd: boolean;

    // Levels for all the spells
    meteorLevel: number;
    laserLevel: number;
    cometLevel: number;
    blackholeLevel: number;
    speedLevel: number;
    manaRegenLevel: number;
    rangeLevel: number;

    // Tower levels
    forkLevel: number;
    explosionLevel: number;
    pierceLevel: number;

    // UI Components
    protected healthCountLabel: Label;
    protected manaCountLabel: Label;
    protected waveLabel: Label;
    protected currencyLabel: Label;
    protected currencyCount: number;
    protected shopButton: Button;
    protected levelEndLabel: Label;
    protected waveEndLabel: Label;

    background: Sprite;

    infiniteLives: boolean;
    infiniteMana: boolean;
    allSpells: boolean;
    infiniteStardust: boolean;

    wave: number;

    inventory: SpellManager;

    /** A list of items in the game world */
    items: Array<Sprite>;

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
        this.infiniteStardust = init.infiniteStardust,

        this.meteorLevel = init.meteorLevel;
        this.laserLevel = init.laserLevel;
        this.cometLevel = init.cometLevel;
        this.blackholeLevel = init.blackholeLevel;

        this.forkLevel = init.forkLevel;
        this.pierceLevel = init.pierceLevel;
        this.explosionLevel = init.explosionLevel;

        this.speedLevel = init.speedLevel;
        this.rangeLevel = init.rangeLevel;
        this.manaRegenLevel = init.manaRegenLevel;

        this.currencyCount = init.currencyCount;
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
        this.load.spritesheet("stargate", "space_wizard_assets/spritesheets/stargate.json");
        this.load.spritesheet("bulletman", "space_wizard_assets/spritesheets/bulletman.json");
        this.load.spritesheet("deathstar", "space_wizard_assets/spritesheets/DeathStar.json");
        this.load.spritesheet("disruptor", "space_wizard_assets/spritesheets/disruptor.json");
        this.load.spritesheet("spikeEnemy", "space_wizard_assets/spritesheets/spike_enemy.json");
        this.load.spritesheet("enemyProjectile", "space_wizard_assets/spritesheets/EnemyProjectile.json");

        // Currency Spritesheet
        this.load.spritesheet("stardust", "space_wizard_assets/spritesheets/Stardust.json");
        
        this.load.image("cookiePlanet", "space_wizard_assets/images/Cookie Planet.png");
        this.load.image("space", "space_wizard_assets/images/Space.png");
        this.load.image("spaceUI", "space_wizard_assets/images/SpaceUI.png");

        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteorSprite", "space_wizard_assets/sprites/meteor.png");
        this.load.image("cometSprite", "space_wizard_assets/sprites/comet.png");
        this.load.image("laserSprite", "space_wizard_assets/sprites/laser.png");
        this.load.image("blackholeSprite", "space_wizard_assets/sprites/blackhole.png");

        this.load.object("towerData", "space_wizard_assets/data/lvl1_towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl1_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl1_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl1_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl1_wave4.json");
        this.load.object("wave5", "space_wizard_assets/data/lvl1_wave5.json");
        this.load.object("wave6", "space_wizard_assets/data/lvl1_wave6.json");
        this.load.object("wave7", "space_wizard_assets/data/lvl1_wave7.json");
        this.load.object("wave8", "space_wizard_assets/data/lvl1_wave8.json");
        this.load.object("wave9", "space_wizard_assets/data/lvl1_wave9.json");
        this.load.object("wave10", "space_wizard_assets/data/lvl1_wave10.json");

        // Navmesh for Enemies
        this.load.object("navmesh", "space_wizard_assets/data/navmesh.json");

        // Sound Effects
        this.load.audio("laser", "space_wizard_assets/sound effect/laser.wav");
        this.load.audio("bubbles", "space_wizard_assets/sound effect/bubbles.wav");
        this.load.audio("bang", "space_wizard_assets/sound effect/bang.wav");
        this.load.audio("spaceship", "space_wizard_assets/sound effect/spaceship.wav");
        this.load.audio("thunder", "space_wizard_assets/sound effect/thunder.wav");
        this.load.audio("playerDamage", "space_wizard_assets/sound effect/player damage.wav");
        this.load.audio("pickupStardust", "space_wizard_assets/sound effect/pickupStardust.wav");
        this.load.audio("death", "space_wizard_assets/sound effect/deathSound.wav");
        this.load.audio("purchase", "space_wizard_assets/sound effect/cash_register.mp3");
        this.load.audio("decline", "space_wizard_assets/sound effect/decline.wav");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        // Initialize wave number
        this.wave = 1;

        this.waveEnd = false;

        // Initialize spells levels
        if (!this.meteorLevel) {
            this.meteorLevel = 0;
        }
        if (!this.laserLevel){
            this.laserLevel = 0;
        }
        if (!this.cometLevel){
            this.cometLevel = 0;
        }
        if (!this.blackholeLevel){
            this.blackholeLevel = 0;
        }

        if (!this.currencyCount){
            this.currencyCount = 0;
        }

        // Tower Levels
        if (!this.forkLevel){
            this.forkLevel = 1;
        }
        if (!this.pierceLevel){
            this.pierceLevel = 1;
        }
        if (!this.explosionLevel){
            this.explosionLevel = 1;
        }

        // Character levels
        if (!this.speedLevel){
            this.speedLevel = 1;
        }
        if (!this.manaRegenLevel){
            this.manaRegenLevel = 1;
        }
        if (!this.rangeLevel){
            this.rangeLevel = 1;
        }

        // Initialize array of towers
        this.towers = new Array();

        // Initialize array of enemies
        this.enemies = new Array();

        // Initialize array of item drops
        this.items = new Array();

        // Initialize array of currency drops
        this.currency = new Array;

        this.paused = false;

        this.subscribeToEvents();

        this.initLayers();

        this.createBackground();

        this.initializePlayer();

        this.addUI();

        this.spawnEnemies();

        this.spawnTowers();

        this.viewport.follow(this.player);

        this.viewport.setBounds(0,0, this.background.boundary.right, this.background.boundary.bottom);

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "levelMusic", loop: true, holdReference: true});
    }

    unloadScene():void{
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "levelMusic"});
        this.viewport.follow(null);
        this.load.keepAudio("mainMenuMusic");
        this.load.keepAudio("levelMusic");

        this.load.keepSpritesheet("stardust");
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
        this.background = this.add.sprite("space", "background");

        // Now, let's make sure our logo is in a good position
        this.background.scale.set(2,2);
        let center = this.background.boundary.getHalfSize();
        this.background.position.set(center.x, center.y);

        // Create the cookie planet background
        let cookiePlanet = this.add.sprite("cookiePlanet", "cookie");
        cookiePlanet.scale.scale(20);
        cookiePlanet.position.set(center.x, 2*center.y  - 200);
    }

    spawnEnemies(): void {
        let enemyData;
        // Get the enemy data
        if (this.wave == 1){
            enemyData = this.load.getObject("wave1");
        } else if (this.wave == 2){
            enemyData = this.load.getObject("wave2");
        } else if (this.wave == 3){
            enemyData = this.load.getObject("wave3");
        } else if (this.wave == 4){
            enemyData = this.load.getObject("wave4");
        } else if (this.wave == 5){
            enemyData = this.load.getObject("wave5");
        } else if (this.wave == 6){
            enemyData = this.load.getObject("wave6");
        } else if (this.wave == 7){
            enemyData = this.load.getObject("wave7");
        } else if (this.wave == 8){
            enemyData = this.load.getObject("wave8");
        } else if (this.wave == 9){
            enemyData = this.load.getObject("wave9");
        } else if (this.wave == 10){
            enemyData = this.load.getObject("wave10");
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
            else if(enemy.type == "stargate") {
                enemySprite = this.add.animatedSprite("stargate", "primary");
                enemySprite.scale.scale(3);
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new stargateEnemy();
            }
            else if(enemy.type == "deathstar") {
                enemySprite = this.add.animatedSprite("deathstar", "primary");
                enemySprite.scale.scale(2);
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new Deathstar();
            }
            else if (enemy.type == "bulletman"){
                enemySprite = this.add.animatedSprite("bulletman", "primary");
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new Bulletman()
            }
            else if (enemy.type == "spikeEnemy"){
                enemySprite = this.add.animatedSprite("spikeEnemy", "primary");
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new spikeEnemy();
            }
            else if (enemy.type == "disruptor"){
                enemySprite = this.add.animatedSprite("disruptor", "primary");
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(20, 20)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new disruptor();
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
        this.inventory = new SpellManager(this, 4, "inventorySlot", new Vec2(64,755.2), 48);

        if (this.allSpells){
            // Add Laser spell
            this.laserLevel++;
            this.inventory.changeSlot(0);
            let laserSprite = this.add.sprite("laserSprite", "primary");
            laserSprite.scale.scale(2.8);
            laserSprite.rotation += Math.PI/4;
            let thirdSpell = new Spell(laserSprite, new Laser(), this.towers, this.enemies);
            this.inventory.addItem(thirdSpell);

            // Add Comet spell
            this.inventory.changeSlot(1);
            let cometSprite = this.add.sprite("cometSprite", "primary");
            cometSprite.scale.scale(2.8);
            cometSprite.rotation += Math.PI/4;
            let secondSpell = new Spell(cometSprite, new Comet(), this.towers, this.enemies);
            this.inventory.addItem(secondSpell);

            // Add Meteor spell
            this.inventory.changeSlot(2);
            let meteorSprite = this.add.sprite("meteorSprite", "primary");
            meteorSprite.scale.scale(2.8);
            let startingSpell = new Spell(meteorSprite, new Meteor(), this.towers, this.enemies);
            this.inventory.addItem(startingSpell);

            // Add Blackhole spell
            this.inventory.changeSlot(3);
            let blackholeSprite = this.add.sprite("blackholeSprite", "primary");
            blackholeSprite.scale.scale(2.8);
            blackholeSprite.rotation += Math.PI/4;
            let fourthSpell = new Spell(blackholeSprite, new Blackhole(), this.towers, this.enemies);
            this.inventory.addItem(fourthSpell);

            this.inventory.changeSlot(0);
        }
        else {
            // Bring laser spell up to previous upgrade par
            if (this.laserLevel == 0){
                // Add Laser spell
                this.laserLevel++;
                this.inventory.changeSlot(0);
                let laserSprite = this.add.sprite("laserSprite", "primary");
                laserSprite.scale.scale(2.8);
                laserSprite.rotation += Math.PI/4;
                let thirdSpell = new Spell(laserSprite, new Laser(), this.towers, this.enemies);
                this.inventory.addItem(thirdSpell);
            }
            else {
                // Add Laser spell
                this.laserLevel++;
                this.inventory.changeSlot(0);
                let laserSprite = this.add.sprite("laserSprite", "primary");
                laserSprite.scale.scale(2.8);
                laserSprite.rotation += Math.PI/4;
                let thirdSpell = new Spell(laserSprite, new Laser(), this.towers, this.enemies);
                thirdSpell.incDamage(this.laserLevel - 1);
                this.inventory.addItem(thirdSpell);
            }
            
            if (this.cometLevel > 0){
                // Add Comet spell
                this.inventory.changeSlot(1);
                let cometSprite = this.add.sprite("cometSprite", "primary");
                cometSprite.scale.scale(2.8);
                cometSprite.rotation += Math.PI/4;
                let secondSpell = new Spell(cometSprite, new Comet(), this.towers, this.enemies);
                secondSpell.incDamage(5 * (this.cometLevel - 1));
                this.inventory.addItem(secondSpell);
            }

            if (this.meteorLevel > 0){
                // Add Meteor spell
                this.inventory.changeSlot(2);
                let meteorSprite = this.add.sprite("meteorSprite", "primary");
                meteorSprite.scale.scale(2.8);
                let startingSpell = new Spell(meteorSprite, new Meteor(), this.towers, this.enemies);
                startingSpell.incDamage(this.meteorLevel - 1);
                this.inventory.addItem(startingSpell);
            }

            if (this.blackholeLevel > 0){
                // Add Blackhole spell
                this.inventory.changeSlot(3);
                let blackholeSprite = this.add.sprite("blackholeSprite", "primary");
                blackholeSprite.scale.scale(2.8);
                blackholeSprite.rotation += Math.PI/4;
                let fourthSpell = new Spell(blackholeSprite, new Blackhole(), this.towers, this.enemies);
                fourthSpell.incDamage(5 * (this.blackholeLevel - 1));
                this.inventory.addItem(fourthSpell);
            }
        }

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.scale(0.5);
        this.player.position.set(1200, 1500);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(25, 25)));
        this.player.addAI(PlayerController,{
            inventory: this.inventory,
            speed:300 + ((this.speedLevel - 1) * 50)
        });

        // Start player is idle animation on loop
        this.player.animation.play("IDLE", true);
    }

    updateScene(deltaT: number) {
        if (Input.isPressed("pause")){
            if (!this.paused){
                this.createPauseMenu();
            }
        }

        if (this.infiniteMana){
            (<PlayerController>this.player.ai).mana = 1000;
        }

        for (let enemy of this.enemies){
            if (enemy.dead){
                // Remove enemy from list in place
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
            }
        }

        let mana = (<PlayerController>this.player.ai).mana;
        this.manaCountLabel.text = "Mana: " + mana;

        this.currencyLabel.text = "Stardust: " + this.currencyCount;

        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){
                case space_wizard_events.PLAYER_DAMAGE: {
                    if (this.infiniteLives) {
                        break;
                    }
                    if ((<PlayerController> this.player.ai).damage()) {
                        this.healthCountLabel.text = "Health: " + (<PlayerController>this.player.ai).health;
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
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "death", loop: false, holdReference: false});
                    this.createGameOverScreen();
                    break;
                }
                case space_wizard_events.PICKUP_STARDUST: {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "pickupStardust", loop: false, holdReference: false});
                    this.currencyCount += 1;
                    this.currencyLabel.text = "Stardust: " + this.currencyCount;
                    break;
                }
                case space_wizard_events.WAVE_END:{
                    this.wave++;
                    this.waveEndLabel.tweens.play("slideIn");
                    break;
                }
                case space_wizard_events.SPAWN_ENEMIES:{
                    this.spawnEnemies();
                    this.waveEnd = false;
                    break;
                }
                case space_wizard_events.LEVEL_END:{
                    this.levelEndLabel.tweens.play("slideIn");
                    break;
                }
                case space_wizard_events.SPAWN_BULLETMAN:{
                    console.log("sup");
                    break;
                }
                case space_wizard_events.NEXT_LEVEL:{
                    this.sceneManager.changeToScene(this.nextLevel,{
                        infiniteLives: this.infiniteLives,
                        infiniteMana: this.infiniteMana,
                        allSpells: this.allSpells,
                        infiniteStardust: this.infiniteStardust,

                        meteorLevel: this.meteorLevel,
                        cometLevel: this.cometLevel,
                        laserLevel: this.laserLevel,
                        blackholeLevel: this.blackholeLevel,

                        forkLevel: this.forkLevel,
                        pierceLevel: this.pierceLevel,
                        explosionLevel: this.explosionLevel,

                        speedLevel: this.speedLevel,
                        rangeLevel: this.rangeLevel,
                        manaRegenLevel: this.manaRegenLevel,

                        currencyCount: this.currencyCount
                    },{});
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
        this.viewport.follow(null);

        let center = new Vec2(600, 400);
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
            this.viewport.follow(this.player);
            this.paused = false;
            console.log("Resume Game");
        }
    }

    createNextLevel(): void {
        this.shopButton = <Button> this.add.uiElement(UIElementType.BUTTON,"UI",{position:new Vec2(1100, 675),text:"SHOP"});
        this.shopButton.setBackgroundColor(new Color(53, 53, 53));
        this.shopButton.setPadding(new Vec2(30, 12));
        this.shopButton.font = "AstroSpace";
        this.shopButton.fontSize -= 6;
        this.shopButton.onClick = () =>{
            this.createShop();
            this.shopButton.destroy();
        }    
    }

    createShop(): void {
        this.paused = true;
        this.viewport.follow(null);

        let center = new Vec2(600, 400);
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y - 64),size:new Vec2(1200, 736)});
        settingBackground.color = new Color(73, 73, 73, 0.5);
        settingBackground.borderColor = new Color(53, 53, 53, 0.5);
        settingBackground.setBorderWidth(24);

        let shopLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(center.x, 100), text: "Shop"});
        shopLabel.textColor = Color.WHITE;
        shopLabel.font = "AstroSpace";

        let laserButton:Button;
        let meteorButton:Button;
        let cometButton:Button;
        let blackholeButton:Button;

        let prevSpell = this.inventory.getSlot();
        let curSpell:Spell;

        // Create laser upgrade button
        if (this.laserLevel == 0){
            laserButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 200),text:"Buy Laser: 30"});
            laserButton.setBackgroundColor(new Color(53, 53, 53));
            laserButton.setPadding(new Vec2(50, 30));
            laserButton.font = "AstroSpace";
            laserButton.fontSize -= 6;
            laserButton.onClick = () =>{
                if (this.laserLevel == 0){
                    if (this.currencyCount >= 30 || this.infiniteStardust){
                        // Add Laser spell
                        if (!this.infiniteStardust){
                            this.currencyCount -= 30;
                        }
                        this.laserLevel++;
                        this.inventory.changeSlot(0);
                        let laserSprite = this.add.sprite("laserSprite", "primary");
                        laserSprite.scale.scale(2.8);
                        laserSprite.rotation += Math.PI/4;
                        let thirdSpell = new Spell(laserSprite, new Laser(), this.towers, this.enemies);
                        this.inventory.addItem(thirdSpell);
                        laserButton.text = "Laser lvl" + this.laserLevel + ": " + this.laserLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
                else {
                    if (this.currencyCount >= this.laserLevel * 20 || this.infiniteStardust){
                        this.inventory.changeSlot(0);
                        curSpell = this.inventory.getItem();
                        curSpell.incDamage(1);
                        if (!this.infiniteStardust){
                            this.currencyCount -= this.laserLevel * 20;
                        }
                        this.laserLevel++;
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                        laserButton.text = "Laser lvl" + this.laserLevel + ": " + this.laserLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
            }
        }
        else {
            laserButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 200),text:"Laser lvl" + this.laserLevel + ": " + this.laserLevel * 20});
            laserButton.setBackgroundColor(new Color(53, 53, 53));
            laserButton.setPadding(new Vec2(50, 30));
            laserButton.font = "AstroSpace";
            laserButton.fontSize -= 6;
            laserButton.onClick = () =>{
                if (this.currencyCount >= this.laserLevel * 20 || this.infiniteStardust){
                    this.inventory.changeSlot(0);
                    curSpell = this.inventory.getItem();
                    curSpell.incDamage(1);
                    if (!this.infiniteStardust){
                        this.currencyCount -= this.laserLevel * 20;
                    }
                    this.laserLevel++;
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                    laserButton.text = "Laser lvl" + this.laserLevel + ": " + this.laserLevel * 20;
                }
                else {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                }
            }
        }

        // Create meteor upgrade button
        if (this.meteorLevel == 0){
            meteorButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 400),text:"Buy Meteor: 30"});
            meteorButton.setBackgroundColor(new Color(53, 53, 53));
            meteorButton.setPadding(new Vec2(50, 30));
            meteorButton.font = "AstroSpace";
            meteorButton.fontSize -= 6;
            meteorButton.onClick = () =>{
                if (this.meteorLevel == 0){
                    if (this.currencyCount >= 30 || this.infiniteStardust){
                        // Add meteor spell
                        if (!this.infiniteStardust){
                            this.currencyCount -= 30;
                        }
                        this.meteorLevel++;
                        this.inventory.changeSlot(2);
                        let meteorSprite = this.add.sprite("meteorSprite", "primary");
                        meteorSprite.scale.scale(2.8);
                        meteorSprite.rotation += Math.PI/4;
                        let thirdSpell = new Spell(meteorSprite, new Meteor(), this.towers, this.enemies);
                        this.inventory.addItem(thirdSpell);
                        meteorButton.text = "Meteor lvl" + this.meteorLevel + ": " + this.meteorLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
                else {
                    if (this.currencyCount >= this.meteorLevel * 20 || this.infiniteStardust){
                        this.inventory.changeSlot(2);
                        curSpell = this.inventory.getItem();
                        curSpell.incDamage(1);
                        if (!this.infiniteStardust){
                            this.currencyCount -= this.meteorLevel * 20;
                        }
                        this.meteorLevel++;
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                        meteorButton.text = "Meteor lvl" + this.meteorLevel + ": " + this.meteorLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
            }
        }
        else {
            meteorButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 400),text:"Meteor lvl" + this.meteorLevel + ": " + this.meteorLevel * 20});
            meteorButton.setBackgroundColor(new Color(53, 53, 53));
            meteorButton.setPadding(new Vec2(50, 30));
            meteorButton.font = "AstroSpace";
            meteorButton.fontSize -= 6;
            meteorButton.onClick = () =>{
                if (this.currencyCount >= this.meteorLevel * 20 || this.infiniteStardust){
                    this.inventory.changeSlot(2);
                    curSpell = this.inventory.getItem();
                    curSpell.incDamage(1);
                    if (!this.infiniteStardust){
                        this.currencyCount -= this.meteorLevel * 20;
                    }
                    this.meteorLevel++;
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                    meteorButton.text = "Meteor lvl" + this.meteorLevel + ": " + this.meteorLevel * 20;
                }
                else {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                }
            }
        }

        // Create comet upgrade button
        if (this.cometLevel == 0){
            cometButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 300),text:"Buy Comet: 30"});
            cometButton.setBackgroundColor(new Color(53, 53, 53));
            cometButton.setPadding(new Vec2(50, 30));
            cometButton.font = "AstroSpace";
            cometButton.fontSize -= 6;
            cometButton.onClick = () =>{
                if (this.cometLevel == 0){
                    if (this.currencyCount >= 30 || this.infiniteStardust){
                        // Add comet spell
                        if (!this.infiniteStardust){
                            this.currencyCount -= 30;
                        }
                        this.cometLevel++;
                        this.inventory.changeSlot(1);
                        let cometSprite = this.add.sprite("cometSprite", "primary");
                        cometSprite.scale.scale(2.8);
                        cometSprite.rotation += Math.PI/4;
                        let thirdSpell = new Spell(cometSprite, new Comet(), this.towers, this.enemies);
                        this.inventory.addItem(thirdSpell);
                        cometButton.text = "Comet lvl" + this.cometLevel + ": " + this.cometLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
                else {
                    if (this.currencyCount >= this.cometLevel * 20 || this.infiniteStardust){
                        this.inventory.changeSlot(1);
                        curSpell = this.inventory.getItem();
                        curSpell.incDamage(5);
                        if (!this.infiniteStardust){
                            this.currencyCount -= this.cometLevel * 20;
                        }
                        this.cometLevel++;
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                        cometButton.text = "Comet lvl" + this.cometLevel + ": " + this.cometLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
            }
        }
        else {
            cometButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 300),text:"Comet lvl" + this.cometLevel + ": " + this.cometLevel * 20});
            cometButton.setBackgroundColor(new Color(53, 53, 53));
            cometButton.setPadding(new Vec2(50, 30));
            cometButton.font = "AstroSpace";
            cometButton.fontSize -= 6;
            cometButton.onClick = () =>{
                if (this.currencyCount >= this.cometLevel * 20 || this.infiniteStardust){
                    this.inventory.changeSlot(1);
                    curSpell = this.inventory.getItem();
                    curSpell.incDamage(5);
                    if (!this.infiniteStardust){
                        this.currencyCount -= this.cometLevel * 20;
                    }
                    this.cometLevel++;
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                    cometButton.text = "Comet lvl" + this.cometLevel + ": " + this.cometLevel * 20;
                }
                else {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                }
            }
        }

        // Create blackhole upgrade button
        if (this.blackholeLevel == 0){
            blackholeButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 500),text:"Buy Blackhole: 30"});
            blackholeButton.setBackgroundColor(new Color(53, 53, 53));
            blackholeButton.setPadding(new Vec2(50, 30));
            blackholeButton.font = "AstroSpace";
            blackholeButton.fontSize -= 6;
            blackholeButton.onClick = () =>{
                if (this.blackholeLevel == 0){
                    if (this.currencyCount >= 30 || this.infiniteStardust){
                        // Add blackhole spell
                        if (!this.infiniteStardust){
                            this.currencyCount -= 30;
                        }
                        this.blackholeLevel++;
                        this.inventory.changeSlot(3);
                        let blackholeSprite = this.add.sprite("blackholeSprite", "primary");
                        blackholeSprite.scale.scale(2.8);
                        blackholeSprite.rotation += Math.PI/4;
                        let thirdSpell = new Spell(blackholeSprite, new Blackhole(), this.towers, this.enemies);
                        this.inventory.addItem(thirdSpell);
                        blackholeButton.text = "Blackhole lvl" + this.blackholeLevel + ": " + this.blackholeLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
                else {
                    if (this.currencyCount >= this.blackholeLevel * 20 || this.infiniteStardust){
                        this.inventory.changeSlot(3);
                        curSpell = this.inventory.getItem();
                        curSpell.incDamage(5);
                        if (!this.infiniteStardust){
                            this.currencyCount -= this.blackholeLevel * 20;
                        }
                        this.blackholeLevel++;
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                        blackholeButton.text = "Blackhole lvl" + this.blackholeLevel + ": " + this.blackholeLevel * 20;
                    }
                    else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                    }
                }
            }
        }
        else {
            blackholeButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x - 400, 500),text:"Blackhole lvl" + this.blackholeLevel + ": " + this.blackholeLevel * 20});
            blackholeButton.setBackgroundColor(new Color(53, 53, 53));
            blackholeButton.setPadding(new Vec2(50, 30));
            blackholeButton.font = "AstroSpace";
            blackholeButton.fontSize -= 6;
            blackholeButton.onClick = () =>{
                if (this.currencyCount >= this.blackholeLevel * 20 || this.infiniteStardust){
                    this.inventory.changeSlot(3);
                    curSpell = this.inventory.getItem();
                    curSpell.incDamage(5);
                    if (!this.infiniteStardust){
                        this.currencyCount -= this.blackholeLevel * 20;
                    }
                    this.blackholeLevel++;
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
                    blackholeButton.text = "Blackhole lvl" + this.blackholeLevel + ": " + this.blackholeLevel * 20;
                }
                else {
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
                }
            }
        }
        this.inventory.changeSlot(prevSpell);

        let forkButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x, 200),text:"Fork Tower lvl" + this.forkLevel + ": " + this.forkLevel * 30});
        forkButton.setBackgroundColor(new Color(53, 53, 53));
        forkButton.setPadding(new Vec2(50, 30));
        forkButton.font = "AstroSpace";
        forkButton.fontSize -= 6;
        forkButton.onClick = () =>{
            if (this.currencyCount >= this.forkLevel * 30 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= this.forkLevel * 30
                }
                this.forkLevel++;
                forkButton.text = "Fork Tower lvl" + this.forkLevel + ": " + this.forkLevel * 30;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let pierceButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x, 300),text:"Pierce Tower lvl" + this.pierceLevel + ": " + this.pierceLevel * 30});
        pierceButton.setBackgroundColor(new Color(53, 53, 53));
        pierceButton.setPadding(new Vec2(50, 30));
        pierceButton.font = "AstroSpace";
        pierceButton.fontSize -= 6;
        pierceButton.onClick = () =>{
            if (this.currencyCount >= this.pierceLevel * 30 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= this.pierceLevel * 30
                }
                this.pierceLevel++;
                pierceButton.text = "Pierce Tower lvl" + this.pierceLevel + ": " + this.pierceLevel * 30;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let explosionButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x, 400),text:"Explosion Tower lvl" + this.explosionLevel + ": " + this.explosionLevel * 30});
        explosionButton.setBackgroundColor(new Color(53, 53, 53));
        explosionButton.setPadding(new Vec2(50, 30));
        explosionButton.font = "AstroSpace";
        explosionButton.fontSize -= 6;
        explosionButton.onClick = () =>{
            if (this.currencyCount >= this.explosionLevel * 30 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= this.explosionLevel * 30;
                }
                this.explosionLevel++;
                explosionButton.text = "Explosion Tower lvl" + this.explosionLevel + ": " + this.explosionLevel * 30;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let healthButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x, 500),text:"First Aid Kit: " + 20});
        healthButton.setBackgroundColor(new Color(53, 53, 53));
        healthButton.setPadding(new Vec2(50, 30));
        healthButton.font = "AstroSpace";
        healthButton.fontSize -= 6;
        healthButton.onClick = () =>{
            if (this.currencyCount >= 20 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= 20;
                }
                (<PlayerController>this.player.ai).health++;
                this.healthCountLabel.text = "Health: " + (<PlayerController>this.player.ai).health;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let speedButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x + 400, 200),text:"Speed lvl" + this.speedLevel + ": " + this.speedLevel * 20});
        speedButton.setBackgroundColor(new Color(53, 53, 53));
        speedButton.setPadding(new Vec2(50, 30));
        speedButton.font = "AstroSpace";
        speedButton.fontSize -= 6;
        speedButton.onClick = () =>{
            if (this.currencyCount >= this.speedLevel * 20 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= this.speedLevel * 20;
                }
                (<PlayerController> this.player.ai).incSpeed(50);
                this.speedLevel++;
                speedButton.text = "Speed lvl" + this.speedLevel + ": " + this.speedLevel * 20;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let manaRegenButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x + 400, 300),text:"Mana Regen lvl" + this.manaRegenLevel + ": " + this.manaRegenLevel * 20});
        manaRegenButton.setBackgroundColor(new Color(53, 53, 53));
        manaRegenButton.setPadding(new Vec2(50, 30));
        manaRegenButton.font = "AstroSpace";
        manaRegenButton.fontSize -= 6;
        manaRegenButton.onClick = () =>{
            if (this.currencyCount >= this.manaRegenLevel * 20 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= this.manaRegenLevel * 20;
                }
                (<PlayerController> this.player.ai).incManaRegenRate();
                this.manaRegenLevel++;
                manaRegenButton.text = "Mana Regen lvl" + this.manaRegenLevel + ": " + this.manaRegenLevel * 20;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let rangeButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x + 400, 400),text:"Range lvl" + this.rangeLevel + ": " + this.rangeLevel * 20});
        rangeButton.setBackgroundColor(new Color(53, 53, 53));
        rangeButton.setPadding(new Vec2(50, 30));
        rangeButton.font = "AstroSpace";
        rangeButton.fontSize -= 6;
        rangeButton.onClick = () =>{
            if (this.currencyCount >= this.rangeLevel * 20 || this.infiniteStardust){
                if (!this.infiniteStardust){
                    this.currencyCount -= this.rangeLevel * 20;
                }
                this.rangeLevel++;
                rangeButton.text = "Range lvl" + this.rangeLevel + ": " + this.rangeLevel * 20;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "purchase", loop: false, holdReference: false});
            }
            else {
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "decline", loop: false, holdReference: false});
            }
        }

        let resumeButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y + 200),text:"RESUME"});
        resumeButton.setBackgroundColor(new Color(53, 53, 53));
        resumeButton.setPadding(new Vec2(50, 10));
        resumeButton.font = "AstroSpace";
        resumeButton.fontSize -= 6;
        resumeButton.onClick = () =>{
            settingBackground.destroy();
            shopLabel.destroy();
            resumeButton.destroy();
            laserButton.destroy();
            meteorButton.destroy();
            cometButton.destroy();
            blackholeButton.destroy();
            forkButton.destroy();
            pierceButton.destroy();
            explosionButton.destroy();
            healthButton.destroy();
            speedButton.destroy();
            manaRegenButton.destroy();
            rangeButton.destroy();

            this.createNextLevel();

            (<PlayerController>this.player.ai).immunityTimer.start();
            this.viewport.follow(this.player);
            this.paused = false;
            console.log("Next Wave Game");
        }
    }

    createGameOverScreen():void{
        this.paused = true;
        this.viewport.follow(null);

        //this.shopButton.destroy();

        let center = new Vec2(600, 400);
        let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenuBackGround",{position:new Vec2(center.x,center.y),size:new Vec2(900,600)});
        settingBackground.color = new Color(73, 73, 73, 0.5);
        settingBackground.borderColor = new Color(53, 53, 53, 0.5);
        settingBackground.setBorderWidth(24);

        // Go back to menu button
        let muteButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y),text:"Go Back to Menu"});
        muteButton.setBackgroundColor(new Color(53, 53, 53));
        muteButton.setPadding(new Vec2(50, 10));
        muteButton.onClick = () =>{
            this.sceneManager.changeToScene(MainMenu,{},{});
        }
    }

    addUI(): void {
        let spaceUI = this.add.sprite("spaceUI", "UI");
        spaceUI.position.set(600, 755.2);
        spaceUI.scale.set(4, 1.4);

        this.healthCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(432, 760), text: "Health: " + (<PlayerController> this.player.ai).health});
        this.healthCountLabel.textColor = Color.RED;
        this.healthCountLabel.font = "AstroSpace";

        this.manaCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(616, 760), text: "Mana: " + (<PlayerController>this.player.ai).mana});
        this.manaCountLabel.textColor = Color.BLUE;
        this.manaCountLabel.font = "AstroSpace";

        this.currencyLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(832, 760), text: "Stardust: " + this.currencyCount});
        this.currencyLabel.textColor = Color.WHITE;
        this.currencyLabel.font = "AstroSpace";

        this.waveLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(1064, 760), text: "Wave: " + this.wave + "/4"});
        this.waveLabel.textColor = new Color(91,91,91,1);
        this.waveLabel.font = "AstroSpace";

        // End of wave label (start off screen)
        this.waveEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-1200, 300), text: "Wave Complete"});
        this.waveEndLabel.size.set(1200, 60);
        this.waveEndLabel.borderRadius = 0;
        this.waveEndLabel.backgroundColor = new Color(34, 32, 52);
        this.waveEndLabel.textColor = Color.WHITE;
        this.waveEndLabel.fontSize = 48;
        this.waveEndLabel.font = "AstroSpace";

        // Add a tween to move the label on screen
        this.waveEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 2000,
            reverseOnComplete: true,
            onEnd: space_wizard_events.SPAWN_ENEMIES,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -1200,
                    end: 600,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(-1200, 300), text: "Level Complete"});
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "AstroSpace";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 2000,
            onEnd: space_wizard_events.NEXT_LEVEL,
            reverseOnComplete: true,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -1200,
                    end: 600,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.createNextLevel();
    }

    protected subscribeToEvents(){
        this.receiver.subscribe([
            space_wizard_events.PLAYER_DAMAGE,
            space_wizard_events.GAME_OVER,
            space_wizard_events.PICKUP_STARDUST,
            space_wizard_events.WAVE_END,
            space_wizard_events.SPAWN_ENEMIES,
            space_wizard_events.LEVEL_END,
            space_wizard_events.NEXT_LEVEL
        ]);
    }
    
}
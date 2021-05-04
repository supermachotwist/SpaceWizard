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
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Blackhole from "../GameSystems/Spells/SpellTypes/Blackhole";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import spikeEnemy from "../GameSystems/Enemys/EnemyTypes/SpikeEnemy";
import disruptor from "../GameSystems/Enemys/EnemyTypes/Disruptor";
import GameLevel from "./Gamelevel";
import Level4 from "./Level4";
import Bulletman from "../GameSystems/Enemys/EnemyTypes/Bulletman";



export default class level5 extends GameLevel {

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
        console.log("loaded spells");
        // Tower Spritesheets
        this.load.spritesheet("explosionTower", "space_wizard_assets/spritesheets/ExplosionTower.json");
        this.load.spritesheet("forkTower", "space_wizard_assets/spritesheets/ForkTower.json");
        this.load.spritesheet("pierceTower", "space_wizard_assets/spritesheets/PierceTower.json");
        console.log("loaded tower");

        // Enemy Spritesheets
        this.load.spritesheet("bulletman", "space_wizard_assets/spritesheets/bulletman.json");
        this.load.spritesheet("enemyProjectile", "space_wizard_assets/spritesheets/EnemyProjectile.json");

        this.load.image("cookiePlanet", "space_wizard_assets/images/Cookie Planet.png");
        this.load.image("space", "space_wizard_assets/images/Space.png");

        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteorSprite", "space_wizard_assets/sprites/meteor.png");
        this.load.image("cometSprite", "space_wizard_assets/sprites/comet.png");
        this.load.image("laserSprite", "space_wizard_assets/sprites/laser.png");
        this.load.image("blackholeSprite", "space_wizard_assets/sprites/blackhole.png");

        this.load.object("towerData", "space_wizard_assets/data/lvl3_towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl5_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl5_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl5_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl5_wave4.json");

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
        this.wave = 1;

        // Initialize array of towers
        this.towers = new Array();

        // Initialize array of enemies
        this.enemies = new Array();

        // Initialize array of item drops
        this.items = new Array();

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

    spawnEnemies(): void {
        console.log("in spawn enemies");
        let enemyData;
        // Get the enemy data
        if (this.wave%4 == 1){
            enemyData = this.load.getObject("wave1");
        } else if (this.wave%4 == 2){
            enemyData = this.load.getObject("wave2");
        } else if (this.wave%4 == 3){
            enemyData = this.load.getObject("wave3");
        } else if (this.wave%4 == 0){
            enemyData = this.load.getObject("wave4");
        }

        for (let enemy of enemyData.enemies) {
            let enemySprite;
            let enemyType;
            let towerData = this.load.getObject("towerData");
            // Spawn appropriate enemy
            if (enemy.type == "bulletman"){
                console.log("hi");
                enemySprite = this.add.animatedSprite("bulletman", "primary");
                // Add collision to sprite
                enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
                enemySprite.position.set(enemy.position[0], enemy.position[1]);

                enemyType = new Bulletman();

            }
            
            let enemyClass = new Enemy(enemySprite, enemyType, enemy.loot);
            enemySprite.addAI(EnemyAI, {
                player: this.player,
                enemy: enemyClass,
                towerData: towerData
            });
            enemySprite.animation.play("IDLE", true);
            this.enemies.push(enemyClass);
        }
    }

    updateScene(deltaT: number) {
        if (this.enemies.length == 0){
            this.wave += 1;
            if (this.wave == 5){
                this.sceneManager.changeToScene(MainMenu,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
            }
            else {
                this.waveLabel.text = "Wave: " + this.wave + "/4";
                this.spawnEnemies();
            }
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
}
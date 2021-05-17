import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import EnemyAI from "../AI/EnemyAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Enemy from "../GameSystems/Enemys/Enemy";
import MainMenu from "./MainMenu";
import spikeEnemy from "../GameSystems/Enemys/EnemyTypes/SpikeEnemy";
import disruptor from "../GameSystems/Enemys/EnemyTypes/Disruptor";
import GameLevel from "./Gamelevel";
import { space_wizard_events } from "../space_wizard_events";
import Level4 from "./Level4";




export default class Level3 extends GameLevel {

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
    }

    loadScene(): void {
        super.loadScene();

        // Enemy Spritesheets
        this.load.spritesheet("disruptor", "space_wizard_assets/spritesheets/disruptor.json");
        this.load.spritesheet("spikeEnemy", "space_wizard_assets/spritesheets/spike_enemy.json");
        this.load.spritesheet("enemyProjectile", "space_wizard_assets/spritesheets/EnemyProjectile.json");
        

        this.load.object("towerData", "space_wizard_assets/data/lvl3_towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl3_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl3_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl3_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl3_wave4.json");

        this.load.image("space", "space_wizard_assets/images/Space_Alternate.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
    }

    spawnEnemies(): void {
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
            if (enemy.type == "spikeEnemy"){
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

    initializePlayer(): void {
        super.initializePlayer();
        this.player.position.set(1200, 750);
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        if (this.enemies.length == 0){
            this.createShop();
            this.wave += 1;
            if (this.wave == 5){
                this.sceneManager.changeToScene(Level4,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
            this.emitter.fireEvent(space_wizard_events.LEVEL_END);
            }
            else {
                this.waveLabel.text = "Wave: " + this.wave + "/4";
                this.spawnEnemies();
                this.emitter.fireEvent(space_wizard_events.WAVE_END);
            }
        }
    }
}
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import EnemyAI from "../AI/EnemyAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Enemy from "../GameSystems/Enemys/Enemy";
import MainMenu from "./MainMenu";
import enemyUFO from "../GameSystems/Enemys/EnemyTypes/EnemyUFO";
import enemySpaceship from "../GameSystems/Enemys/EnemyTypes/EnemySpaceship";
import spikeEnemy from "../GameSystems/Enemys/EnemyTypes/SpikeEnemy";
import disruptor from "../GameSystems/Enemys/EnemyTypes/Disruptor";
import EnemyProjectileController from "../AI/EnemyProjectileController";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import GameLevel from "./Gamelevel";
import Timer from "../../Wolfie2D/Timing/Timer";
import { space_wizard_events } from "../space_wizard_events";
import level5 from "./Level5";

export default class Level4 extends GameLevel {

    asteroidTimer: Timer;

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
    }

    loadScene(): void {
        super.loadScene();

        // Enemy Spritesheets
        this.load.spritesheet("enemyUFO", "space_wizard_assets/spritesheets/UFO.json");
        this.load.spritesheet("enemySpaceship", "space_wizard_assets/spritesheets/enemy_spaceship.json");
        this.load.spritesheet("disruptor", "space_wizard_assets/spritesheets/disruptor.json");
        this.load.spritesheet("spikeEnemy", "space_wizard_assets/spritesheets/spike_enemy.json");
        this.load.spritesheet("asteroid", "space_wizard_assets/spritesheets/asteroid.json");
        this.load.spritesheet("enemyProjectile", "space_wizard_assets/spritesheets/EnemyProjectile.json");
        

        this.load.object("towerData", "space_wizard_assets/data/lvl4_towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl4_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl4_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl4_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl4_wave4.json");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
        this.asteroidTimer = new Timer(2000);

        this.nextLevel = level5;
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
        this.player.position.set(600, 400);
    }
    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        this.waveLabel.text = "Wave: " + this.wave + "/4";
        if (this.enemies.length == 0 && !this.waveEnd){
            this.waveEnd = true;
            if (this.wave == 4){
                this.emitter.fireEvent(space_wizard_events.LEVEL_END);
            }
            else {
                this.emitter.fireEvent(space_wizard_events.WAVE_END);
            }
        }

        if (this.asteroidTimer.isStopped()){
            this.spawnAsteroid(new Vec2(Math.random() * 1100 + 50,  64));
            this.asteroidTimer.start();
        }
    }

    spawnAsteroid(position: Vec2){
        let rand = Math.random();
        let projectileSprite = this.add.animatedSprite("asteroid", "primary");
        projectileSprite.scale.scale(rand * 2 + 0.5);
        projectileSprite.position.set(position.x, position.y);
        projectileSprite.addPhysics(new Circle(Vec2.ZERO, 50));
        //asteroid will go in a random diagonal direction
        let direction = new Vec2(-1, -1);
        if (rand < .25)
            direction = new Vec2(1, -1);
        if (rand >= .25 && rand < .5)
            direction = new Vec2(1, 1);
        if (rand >= .5 && rand < .75)
            direction = new Vec2(-1, 1);
        let speed = 200 * this.wave;
        //asteroids get faster w/ each wave 
        projectileSprite.addAI(EnemyProjectileController, {
            speed: speed,
            direction: direction,
            player: this.player
        })
        
        // Add tween for spinning asteroid
        projectileSprite.tweens.add("spin", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: "rotation",
                    resetOnComplete: false,
                    start: 0,
                    end: 6.28,
                    ease: EaseFunctionType.OUT_SINE
                }
            ],
            reverseOnComplete: false,
        });
        projectileSprite.tweens.play("spin", true);
    }
}


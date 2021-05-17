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

        this.load.image("space", "space_wizard_assets/images/Space_Alternate.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
        this.asteroidTimer = new Timer(2000);

        this.nextLevel = level5;
    }

    initializePlayer(): void {
        super.initializePlayer();
        this.player.position.set(1200, 900);
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
            this.spawnAsteroid(new Vec2(Math.random() * 2200 + 50,  300));
            this.asteroidTimer.start();
        }
    }

    spawnAsteroid(position: Vec2){
        let rand = Math.random();
        let projectileSprite = this.add.animatedSprite("asteroid", "primary");
        projectileSprite.scale.scale(rand * 4 + 0.5);
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


import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import EnemyProjectileController from "../AI/EnemyProjectileController";
import { space_wizard_events } from "../space_wizard_events";
import GameLevel from "./Gamelevel";
import Level1 from "./Level1";
import Level3 from "./Level3";
import MainMenu from "./MainMenu";



export default class Level2 extends GameLevel {

    asteroidTimer: Timer;

    loadScene(): void {
        super.loadScene();
        this.load.object("wave1", "space_wizard_assets/data/lvl2_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl2_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl2_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl2_wave4.json");
        this.load.object("wave5", "space_wizard_assets/data/lvl2_wave5.json");
        this.load.object("wave6", "space_wizard_assets/data/lvl2_wave6.json");
        this.load.object("wave7", "space_wizard_assets/data/lvl2_wave7.json");
        this.load.object("wave8", "space_wizard_assets/data/lvl2_wave8.json");
        this.load.object("wave9", "space_wizard_assets/data/lvl2_wave9.json");
        this.load.object("wave10", "space_wizard_assets/data/lvl2_wave10.json");

        this.load.spritesheet("background","space_wizard_assets/spritesheets/AsteroidBelt.json");
        this.load.spritesheet("asteroid", "space_wizard_assets/spritesheets/asteroid.json");
    }

    startScene(): void {
        super.startScene();
        this.asteroidTimer = new Timer(1000);
        this.nextLevel = Level3;
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        this.waveLabel.text = "Wave: " + this.wave + "/10";
        if (this.enemies.length == 0 && !this.waveEnd){
            this.waveEnd = true;
            if (this.wave == 10){
                this.emitter.fireEvent(space_wizard_events.LEVEL_END);
            }
            else {
                this.emitter.fireEvent(space_wizard_events.WAVE_END);
            }
        }

        if (this.asteroidTimer.isStopped()){
            this.spawnAsteroid(new Vec2(Math.random() * 2300 + 50,  64));
            this.asteroidTimer.start();
        }
    }

    spawnAsteroid(position: Vec2){
        let rand = Math.random();
        let projectileSprite = this.add.animatedSprite("asteroid", "primary");
        projectileSprite.scale.scale(rand * 2 + 0.5);
        projectileSprite.position.set(position.x, position.y);
        projectileSprite.addPhysics(new Circle(Vec2.ZERO, 20 * rand * 2 + 0.5));
        projectileSprite.addAI(EnemyProjectileController, {
            speed: 300,
            direction: Vec2.DOWN,
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

    createBackground(): void {
        this.background = this.add.animatedSprite("background", "background");
        this.background.position.set(1200, 800);
        this.background.scale.set(8,8);
        (<AnimatedSprite>this.background).animation.play("PLAY", true);
    }
}
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Timer from "../../Wolfie2D/Timing/Timer";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import EnemyProjectileController from "../AI/EnemyProjectileController";
import GameLevel from "./Gamelevel";
import Level1 from "./Level1";
import MainMenu from "./MainMenu";



export default class Level2 extends GameLevel {

    asteroidTimer: Timer;

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
        this.load.spritesheet("asteroid", "space_wizard_assets/spritesheets/asteroid.json");
        
        this.load.image("cookiePlanet", "space_wizard_assets/images/Cookie Planet.png");
        this.load.image("space", "space_wizard_assets/images/Asteroid Belt.png");

        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteorSprite", "space_wizard_assets/sprites/meteor.png");
        this.load.image("cometSprite", "space_wizard_assets/sprites/comet.png");
        this.load.image("laserSprite", "space_wizard_assets/sprites/laser.png");
        this.load.image("blackholeSprite", "space_wizard_assets/sprites/blackhole.png");

        this.load.object("towerData", "space_wizard_assets/data/towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl1_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl1_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl1_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl1_wave4.json");

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

    startScene(): void {
        super.startScene();
        this.asteroidTimer = new Timer(2000);
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

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
        this.background = this.add.sprite("space", "background");

        // Now, let's make sure our logo is in a good position
        this.background.scale.set(2,2);
        let center = this.background.boundary.getHalfSize();
        this.background.position.set(center.x, center.y);
    }

}
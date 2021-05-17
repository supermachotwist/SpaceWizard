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

    loadScene(): void {
        super.loadScene();

        this.load.object("towerData", "space_wizard_assets/data/lvl3_towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl3_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl3_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl3_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl3_wave4.json");
        this.load.object("wave5", "space_wizard_assets/data/lvl3_wave5.json");
        this.load.object("wave6", "space_wizard_assets/data/lvl3_wave6.json");
        this.load.object("wave7", "space_wizard_assets/data/lvl3_wave7.json");
        this.load.object("wave8", "space_wizard_assets/data/lvl3_wave8.json");
        this.load.object("wave9", "space_wizard_assets/data/lvl3_wave9.json");
        this.load.object("wave10", "space_wizard_assets/data/lvl3_wave10.json");

        this.load.image("space", "space_wizard_assets/images/Space_Alternate.png");
        this.load.image("planet", "space_wizard_assets/images/Red Planet.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
        this.nextLevel = Level4;

    }

    initializePlayer(): void {
        super.initializePlayer();
        this.player.position.set(1200, 900);
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
    }

    createBackground(): void {
        this.background = this.add.sprite("space", "background");

        // Now, let's make sure our logo is in a good position
        this.background.scale.set(2,2);
        let center = this.background.boundary.getHalfSize();
        this.background.position.set(center.x, center.y);

        // Create the cookie planet background
        let redPlanet = this.add.sprite("planet", "cookie");
        redPlanet.scale.scale(8);
        redPlanet.position.set(center.x, center.y);
    }
}
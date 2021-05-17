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
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
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
    }
}
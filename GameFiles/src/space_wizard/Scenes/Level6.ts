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
import Level3 from "./Level3";
import Level6 from "./Level6";



export default class level6 extends GameLevel {

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
    }

    loadScene(): void {
        super.loadScene();

        // Enemy Spritesheets
        this.load.spritesheet("bulletman", "space_wizard_assets/spritesheets/bulletman.json");

        this.load.object("towerData", "space_wizard_assets/data/lvl3_towers.json");
        this.load.object("wave1", "space_wizard_assets/data/lvl5_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl5_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl5_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl5_wave4.json");
        this.load.image("spaceBack", "space_wizard_assets/images/Level6Background.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
        this.nextLevel = Level6;
    }

    createBackground(): void {
        this.background = this.add.sprite("spaceBack", "background");

        // Now, let's make sure our logo is in a good position
        this.background.scale.set(2,2);
        let center = this.background.boundary.getHalfSize();
        this.background.position.set(center.x, center.y);

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
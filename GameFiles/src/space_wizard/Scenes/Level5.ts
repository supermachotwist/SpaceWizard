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
import Level6 from "./Level7";



export default class level5 extends GameLevel {

    initScene(init: Record<string, any>):void {
        this.infiniteLives = init.infiniteLives;
        this.infiniteMana = init.infiniteMana;
        this.allSpells = init.allSpells;
    }
    
    createBackground(): void {
        this.background = this.add.sprite("spaceBack", "background");

        // Now, let's make sure our logo is in a good position
        this.background.scale.set(2,2);
        let center = this.background.boundary.getHalfSize();
        this.background.position.set(center.x, center.y);

        // Create the cookie planet background
        let cookiePlanet = this.add.sprite("cookiePlanet", "cookie");
        cookiePlanet.scale.scale(20);
        cookiePlanet.position.set(center.x, 2*center.y  - 64);
    }

    loadScene(): void {
        super.loadScene();

        this.load.object("wave1", "space_wizard_assets/data/lvl5_wave1.json");
        this.load.object("wave2", "space_wizard_assets/data/lvl5_wave2.json");
        this.load.object("wave3", "space_wizard_assets/data/lvl5_wave3.json");
        this.load.object("wave4", "space_wizard_assets/data/lvl5_wave4.json");
        this.load.object("wave5", "space_wizard_assets/data/lvl5_wave5.json");
        this.load.object("wave6", "space_wizard_assets/data/lvl5_wave6.json");
        this.load.object("wave7", "space_wizard_assets/data/lvl5_wave7.json");
        this.load.object("wave8", "space_wizard_assets/data/lvl5_wave8.json");
        this.load.object("wave9", "space_wizard_assets/data/lvl5_wave9.json");
        this.load.object("wave10", "space_wizard_assets/data/lvl5_wave10.json");
        this.load.image("spaceBack", "space_wizard_assets/images/Level5Background.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {
        super.startScene();
        this.nextLevel = Level6;
    }
}
import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import SpellManager from "../GameSystems/Spells/SpellManager";
import Spell from "../GameSystems/Spells/Spell";
import Meteor from "../GameSystems/Spells/SpellTypes/Meteor";
import Tower from "../GameSystems/Towers/Tower";
import ExplosionTower from "../GameSystems/Towers/ExplosionTower";
import ForkTower from "../GameSystems/Towers/ForkTower";
import PierceTower from "../GameSystems/Towers/PierceTower";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import EnemyAI from "../AI/EnemyAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Enemy from "../GameSystems/Enemys/Enemy";
import ArrayUtils from "../../Wolfie2D/Utils/ArrayUtils";
import UIElement from "../../Wolfie2D/Nodes/UIElement";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";



export default class GameLevel extends Scene {
    // The player
    private player: AnimatedSprite;

    // Logo
    private logo: Sprite;

    /** A list of towers in the game world */
    private towers: Array<Tower>;

    /** A list of enemies in the game world */
    private enemies: Array<Enemy>;

    loadScene(): void {
        this.load.spritesheet("player", "space_wizard_assets/spritesheets/WizardPlayer.json");
        this.load.spritesheet("meteor", "space_wizard_assets/spritesheets/meteor.json");

        // Tower Spritesheets
        this.load.spritesheet("explosionTower", "space_wizard_assets/spritesheets/ExplosionTower.json");
        this.load.spritesheet("forkTower", "space_wizard_assets/spritesheets/ForkTower.json");
        this.load.spritesheet("pierceTower", "space_wizard_assets/spritesheets/PierceTower.json");

        // Enemy Spritesheets
        this.load.spritesheet("enemySpaceship", "space_wizard_assets/spritesheets/enemy_spaceship.json");
        
        this.load.image("logo", "space_wizard_assets/images/Space Wizard Logo.png");
        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteor", "space_wizard_assets/sprites/meteor.png");

        this.load.object("towerData", "space_wizard_assets/data/towers.json");
        this.load.object("enemyData", "space_wizard_assets/data/enemies.json")
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {

        // First, create a layer for it to go on
        this.addLayer("settingMenu",100);
        this.addLayer("primary", 50);
        this.addLayer("background", 0);

        // The first argument is the key we specified in "this.load.image"
        // The second argument is the name of the layer
        this.logo = this.add.sprite("logo", "background");

        // Now, let's make sure our logo is in a good position
        let center = this.viewport.getCenter();
        this.logo.position.set(center.x, center.y);
        // this.settingButton();


        // Initialize array of towers
        this.towers = new Array();

        // Initialize array of enemies
        this.enemies = new Array();

        this.spawnEnemies();

        this.spawnTowers();

        this.initializePlayer();
    }

    spawnEnemies(): void {

        // Get the enemy data
        let enemyData = this.load.getObject("enemyData");

        for (let enemy of enemyData.enemies) {
            let enemySprite = this.add.animatedSprite("enemySpaceship", "primary");
            enemySprite.scale.scale(0.5);
            // Add collision to sprite
            enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 32)));
            enemySprite.position.set(enemy.position[0], enemy.position[1]);
            let enemySpaceship = new Enemy(enemySprite, "enemySpaceship")
            enemySprite.addAI(EnemyAI, {
                player: this.player,
                enemy: enemySpaceship
            });
            enemySprite.animation.play("IDLE", true);
            this.enemies.push(enemySpaceship);
        }
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new SpellManager(this, 4, "inventorySlot", new Vec2(16, 16), 4);
        let fireballSprite = this.add.sprite("meteor", "primary");
        let startingSpell = new Spell(fireballSprite, new Meteor(), this.towers, this.enemies);
        inventory.addItem(startingSpell);

        // Get center of viewport
        let center = this.viewport.getCenter();

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(center.x, center.y + 100);
        this.player.addAI(PlayerController,{
            inventory: inventory
        });

        // Start player is idle animation on loop
        this.player.animation.play("IDLE", true);
    }

    updateScene(deltaT: number) {
    }

    spawnTowers(): void {
        // Get the tower data
        let towerData = this.load.getObject("towerData");

        for(let tower of towerData.towers){
            if(tower.type === "explosion"){
                let explosionTowerSprite = this.add.animatedSprite("explosionTower", "primary");
                // Add collision to sprite
                explosionTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
                // ExplosionTower(sprite, radius)
                let explosionTower = new ExplosionTower(explosionTowerSprite, 64);
                // Add tower to scene
                explosionTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
                explosionTower.playAnimation();
                this.towers.push(explosionTower);
            } else if (tower.type === "fork"){
                let forkTowerSprite = this.add.animatedSprite("forkTower", "primary");
                // Add collision to sprite
                forkTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
                // ForkTower(sprite, radius)
                let forkTower = new ForkTower(forkTowerSprite, 64);
                // Add tower to scene
                forkTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
                forkTower.playAnimation();
                this.towers.push(forkTower);
            } else if (tower.type === "pierce"){
                let pierceTowerSprite = this.add.animatedSprite("pierceTower", "primary");
                // Add collision to sprite
                pierceTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
                // PierceTower(sprite, radius)
                let pierceTower = new PierceTower(pierceTowerSprite, 64);
                // Add tower to scene
                pierceTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
                pierceTower.playAnimation();
                this.towers.push(pierceTower);
            }
        }        
    }

    //replace button with a image at a later date
    // settingButton(){
    //     let midpoint = this.viewport.getCenter();
    //     let playButton = <Button> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{ position:new Vec2(midpoint.x,midpoint.y+120),text:"Setting"});
    //     playButton.backgroundColor = Color.BLACK;
    //     playButton.borderColor = Color.BLACK;
    //     playButton.borderRadius = 10;
    //     playButton.setPadding(new Vec2(50, 10));
    //     playButton.font = "PixelSimple";
    //     playButton.onClick = () => {
    //         this.createSettingMenu();
    //     }
    //     return playButton;
    // }

    //wait, how to pause game????
    
    // createSettingMenu(){
    //     let center = this.viewport.getCenter();

    //     let musicSliderLabel = <UIElement> this.add.uiElement(UIElementType.LABEL,"settingMenu",{position: new Vec2(center.x-400,center.y),text:"muusic"});
    //     let musicSlider = <UIElement> this.add.uiElement(UIElementType.SLIDER,"settingMenu",{position: new Vec2(center.x-100,center.y)});
    //     musicSlider.backgroundColor = Color.GREEN; //there might be a bug with the slider, idk
    //     musicSliderLabel.backgroundColor=Color.BLUE;
    //     // let settingBackground = <Rect>this.add.graphic(GraphicType.RECT,"settingMenu",{position:new Vec2(center.x,center.y),size:new Vec2(1000,500)});
    //     // settingBackground.color = Color.WHITE;

    //     let exitButton = <UIElement> this.add.uiElement(UIElementType.BUTTON,"settingMenu",{position:new Vec2(center.x,center.y+200),text:"exit"});
    //     exitButton.onClick = () =>{
    //         musicSlider.destroy();
    //         exitButton.destroy();
    //         musicSliderLabel.destroy();
    //       //  settingBackground.destroy();
    //         console.log("Exit Setting");
    //     }
    // }
    
}
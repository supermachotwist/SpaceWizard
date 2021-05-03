import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Circle from "../../../Wolfie2D/DataTypes/Shapes/Circle";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import EnemyProjectileController from "../../AI/EnemyProjectileController";
import GameLevel from "../../Scenes/Gamelevel";
import EnemyType from "./EnemyType";

/** Enemy Class mainly controls */
export default class Enemy {

    emitter: Emitter;

    // Type of the enemy
    type: EnemyType;

    // The enemy sprite
    owner: AnimatedSprite;

    // Display name to show on UI
    displayName: String;

    // Movement Speed
    speed: number;

    // Enemy health
    health: number;

    // If the enemy is dead
    dead: boolean;

    // Cooldown timer for enemy attack
    cooldownTimer: Timer;

    // Spell to drop on death
    loot: String;

    // Status effects for enemies
    slowedTimer: Timer;
    burningTimer: Timer;

    constructor(owner: AnimatedSprite, enemyType: EnemyType, loot: String){
        this.owner = owner;
        this.type = enemyType;
        this.displayName = this.type.displayName;
        this.speed = this.type.speed;
        this.health = this.type.health;
        this.loot = loot;
        this.dead = false;

        this.slowedTimer = new Timer(5000);
        this.burningTimer = new Timer(5000);

        this.cooldownTimer = new Timer(enemyType.cooldown);

        this.emitter = new Emitter();
    }

    moveSprite(position: Vec2, layer?: string){
        // Change the layer if needed
        if(layer){
            let currentLayer = this.owner.getLayer();
            currentLayer.removeNode(this.owner);
            let newLayer = this.owner.getScene().getLayer(layer);
            newLayer.addNode(this.owner);
            this.owner.setLayer(newLayer);
        }

        // Move the sprite
        this.owner.position.copy(position);
    }

    // return value, whether or not the enemy died
    damage(damage: number): boolean
    {
        console.log("Took damage");
        this.health -= damage;
        this.owner.animation.playIfNotAlready("DAMAGE", false);
    
        if(this.health <= 0)
        {
            this.owner.animation.stop();
            this.owner.animation.queue("DYING", false);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bubbles", loop: false});
            this.dead = true;
            return true;
        }
        return false;
    }

    dropSpell():void {
        let spellSprite;
        if (this.loot == "Meteor"){
            spellSprite = this.owner.getScene().add.sprite("meteorSprite", "primary");
        } 
        else if(this.loot == "Comet"){
            spellSprite = this.owner.getScene().add.sprite("cometSprite", "primary");
        }
        else if(this.loot == "Laser"){
            spellSprite = this.owner.getScene().add.sprite("laserSprite", "primary");
        }
        else if(this.loot == "Blackhole"){
            spellSprite = this.owner.getScene().add.sprite("blackholeSprite", "primary");
        } else {
            return;
        }
        // Add spell to list of items on screen
        (<GameLevel>this.owner.getScene()).items.push(spellSprite);
        spellSprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(15, 15)));
        spellSprite.scale.scale(2);
        spellSprite.position = this.owner.position;
    }

    // Shoot a projectile in a specific direction
    shoot(direction: Vec2): void {
        let projectileSprite = this.owner.getScene().add.animatedSprite("enemyProjectile", "primary");
        projectileSprite.scale.scale(3);
        projectileSprite.position.set(this.owner.position.x, this.owner.position.y);
        projectileSprite.addPhysics(new Circle(Vec2.ZERO, 12));
        projectileSprite.addAI(EnemyProjectileController, {
            speed: 400,
            direction: direction,
            player: (<GameLevel> this.owner.getScene()).player
        })  
    }
}
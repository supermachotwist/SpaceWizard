import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import EnemyType from "./EnemyType";

/** Enemy Class mainly controls */
export default class Enemy {

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

    constructor(owner: AnimatedSprite, displayName: String, enemyType: EnemyType){
        this.owner = owner;
        this.displayName = displayName;
        this.type = enemyType;
        this.speed = 50;
        this.health = 50;
        this.dead = false;

        this.cooldownTimer = new Timer(enemyType.cooldown);
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
            this.dead = true;
            return true;
        }
        return false;
    }

    // Shoot a projectile in a specific direction
    shoot(direction: Vec2): void {
        if (this.cooldownTimer.isStopped()) {
            if (Math.random() < 0.01) {

            }
        }
    }
}
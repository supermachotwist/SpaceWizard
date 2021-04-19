import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import EnemyAI from "../../AI/EnemyAI";

/** Enemy Class mainly controls */
export default class Enemy {

    // The enemy sprite
    owner: AnimatedSprite;

    // Display name to show on UI
    displayName: String;

    // Movement Speed
    speed: number;

    // Enemy health
    health: number;

    constructor(owner: AnimatedSprite, displayName: String){
        this.owner = owner;
        this.displayName = displayName;
        this.speed = 100;
        this.health = 50;
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

    damage(damage: number): void 
    {
        console.log("Took damage");
        this.health -= damage;
    
        if(this.health <= 0)
        {
            this.owner.setAIActive(false, {});
            this.owner.isCollidable = false;
            this.owner.visible = false;
            this.owner.destroy();
        }
    }
}
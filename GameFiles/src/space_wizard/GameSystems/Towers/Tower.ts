import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";

/** Tower Class mainly controls the animation played for each tower */
export default class Tower {

    // The tower sprite
    owner: AnimatedSprite;

    // Range as a radius of a circle
    range: number;

    // Display name to show on UI
    displayName: String;

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

    playAnimation(){
        this.owner.animation.play("ACTIVE", true);
    }
}
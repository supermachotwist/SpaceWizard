import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";


export default class SpellController extends ControllerAI {

    // The spell player sprite
    owner: AnimatedSprite;

    // Speed of movement
    speed: number;

    // Damage
    damage: number;

    // Direction of movement
    direction: Vec2;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.speed = options.speed;
        this.direction = options.direction;
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
        // Rorate the meteor in the direction of movement
        this.owner.rotation = Vec2.UP.angleToCCW(this.direction) + Math.PI/2;

        // Move the meteor in direction of movement
        this.owner.move(this.direction.normalized().scale(this.speed * deltaT));

        if (this.owner.position.x < 16 || this.owner.position.x > 1200 - 16 || this.owner.position.y < 16 || this.owner.position.y > 800 - 16) {
            this.speed = 0;
            this.owner.animation.playIfNotAlready("EXPLOSION");
            // Only remove animatedSprite when explosion animation is finished
            if (!this.owner.animation.isPlaying("EXPLOSION")){
                this.owner.visible = false;
                this.owner.destroy();
            }
        } else {
            this.owner.animation.playIfNotAlready("MOVING", true);
        }
    }
}
import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import Enemy from "../GameSystems/Enemys/Enemy";
import Spell from "../GameSystems/Spells/Spell";
import Tower from "../GameSystems/Towers/Tower";
import GameLevel from "../Scenes/Gamelevel";
import { space_wizard_events } from "../space_wizard_events";
import EnemyAI from "./EnemyAI";


export default class EnemyProjectileController extends ControllerAI {
    // Emitter
    emitter: Emitter;

    // The spell player sprite
    owner: AnimatedSprite;

    // Speed of movement
    speed: number;

    // Direction of movement
    direction: Vec2;

    // Flag to tell whether projectile is dead or not
    dead: boolean;

    // Player to keep track of
    player: GameNode;

    // Enemy that the projectile came from
    enemy: Enemy;

    /** A list of enemies the tower has collided with */
    /** This is to prevent the projectile from hitting the same tower twice */

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        
        this.dead = false;

        this.speed = options.speed;
        this.direction = options.direction;
        this.player = options.player;

        // Initialize Emitter
        this.emitter = new Emitter();
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
        // Do nothing if game is paused
        let gamelevel = <GameLevel> this.owner.getScene();
        if (gamelevel.isPaused()){
            return;
        }

        if (!this.dead){
            // Move the projectile in direction of movement
            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));

            // Detonate the spell on impact with side of screen
            let boundary = (<GameLevel>this.owner.getScene()).background.boundary;
            let view = (<GameLevel>this.owner.getScene()).getViewport().getView();
            if (this.owner.imageId == "asteroid") {
                if (this.owner.position.x < boundary.left + 16 || this.owner.position.x > boundary.right - 16 || this.owner.position.y < boundary.top + 16 || this.owner.position.y > boundary.bottom - 16) {
                    this.destroyProjectile();
                } else {
                    this.owner.animation.playIfNotAlready("MOVING", true);
                }
            }
            else {
                if (this.owner.position.x < view.left + 16 || this.owner.position.x > view.right - 16 || this.owner.position.y < view.top + 16 || this.owner.position.y > view.bottom - 16) {
                    this.destroyProjectile();
                } else {
                    this.owner.animation.playIfNotAlready("MOVING", true);
                }
            }
            
            // If the projectile hits the player
            if (this.owner.collisionShape.overlaps(this.player.collisionShape)) {
                this.destroyProjectile();
                this.emitter.fireEvent(space_wizard_events.PLAYER_DAMAGE);
            }
        }
        // Only remove animatedSprite when explosion animation is finished
        else if (this.dead && !this.owner.animation.isPlaying("EXPLOSION")) {
            this.owner.visible = false;
            this.owner.destroy();
        }    
    }

    destroyProjectile(scale:number=1): void {
        this.owner.animation.playIfNotAlready("EXPLOSION");
        this.speed = 0;
        this.dead = true;
    }
}
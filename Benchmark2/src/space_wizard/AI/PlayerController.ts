import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import SpellManager from "../GameSystems/Spells/SpellManager";
import { space_wizard_events } from "../space_wizard_events";
import GameLevel from "../Scenes/Gamelevel";
import Emitter from "../../Wolfie2D/Events/Emitter";


export default class PlayerController implements AI {
    // Emmiter for when player takes damage
    emitter: Emitter;

    // Player health
    health: number;

    // The actual player sprite
    owner: AnimatedSprite;

    // Attacking
    private lookDirection: Vec2;

    // Direction of movement
    private direction: Vec2;

    // The spells of the player
    private inventory: SpellManager;

    // Speed of player
    private speed: number;

    immunityTimer: Timer;


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.lookDirection = Vec2.ZERO;
        this.direction = Vec2.ZERO;
        this.health = 5;
        this.speed = options.speed;

        this.inventory = options.inventory;
        this.immunityTimer = new Timer(1000);
        this.emitter = new Emitter();
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    destroy(): void {}

    update(deltaT: number): void {
        // Do nothing if game is paused
        let gamelevel = <GameLevel> this.owner.getScene();
        if (gamelevel.isPaused()){
            return;
        }

        // Get the movement direction
        this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        this.direction.y = (Input.isPressed("up") ? -1 : 0) + (Input.isPressed("down") ? 1 : 0);

        // Move the player
        this.owner.move(this.direction.normalized().scale(this.speed * deltaT));

        if (this.owner.position.x >= 1168){
            this.owner.position.x = 1168;
        }
        if (this.owner.position.x <= 32){
            this.owner.position.x = 32;
        }
        /*if (this.owner.position.y <= 400){
            this.owner.position.y = 400;
        }*/
        if (this.owner.position.y >= 700){
            this.owner.position.y = 700;
        }

        if(Input.isMouseJustPressed()){
            this.owner.animation.play("FIRING");
            let spell = this.inventory.getItem();

            // If spell slot is not empty
            if (spell) {
                spell.use(this.owner, this.lookDirection);
            }
        }

        // Check for slot change
        if(Input.isJustPressed("slot1")){
            this.inventory.changeSlot(0);
        } else if(Input.isJustPressed("slot2")){
            this.inventory.changeSlot(1);
        } else if(Input.isJustPressed("slot3")){
            this.inventory.changeSlot(2);
        } else if(Input.isJustPressed("slot4")){
            this.inventory.changeSlot(3);
        }

        // Get the unit vector in the look direction
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());

        // Flip sprite when looking right
        if (this.lookDirection.x > 0){
            this.owner.invertX = true;
            this.owner.rotation = (Vec2.UP.angleToCCW(this.lookDirection) + Math.PI/2) * -1;
        } else {
            this.owner.invertX = false;
            this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection) - Math.PI/2;
        }
    }

    damage() {
        if (this.immunityTimer.isStopped()) {
            this.health -= 1;
            this.immunityTimer.start();
        }
        if (this.health <= 0) {
            return true;
        }
        return false;
    }
}
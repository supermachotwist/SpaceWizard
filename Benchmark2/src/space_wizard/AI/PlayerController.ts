import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../Wolfie2D/Timing/Timer";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import SpellManager from "../GameSystems/Spells/SpellManager";
import { space_wizard_events } from "../space_wizard_events";
import SpellController from "./SpellController";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";


export default class PlayerController implements AI {
    // Player health
    health: number;

    // The actual player sprite
    owner: AnimatedSprite;

    // Attacking
    private lookDirection: Vec2;

    // The spells of the player
    private inventory: SpellManager;


    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.lookDirection = Vec2.ZERO;
        this.health = 100;

        this.inventory = options.inventory;
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    destroy(): void {}

    update(deltaT: number): void {
        // Get the unit vector in the look direction
        this.lookDirection = this.owner.position.dirTo(Input.getGlobalMousePosition());

        if(Input.isMouseJustPressed()){
            let spell = this.inventory.getItem();

            // If spell slot is not empty
            if (spell) {
                spell.use(this.owner, this.lookDirection);
            }
        }

        if(Input.isMouseJustPressed()){
            this.owner.animation.play("FIRING");
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

        // Flip sprite when looking right
        if (this.lookDirection.x > 0){
            this.owner.invertX = true;
            this.owner.rotation = (Vec2.UP.angleToCCW(this.lookDirection) + Math.PI/2) * -1;
        } else {
            this.owner.invertX = false;
            this.owner.rotation = Vec2.UP.angleToCCW(this.lookDirection) - Math.PI/2;
        }
    }
}
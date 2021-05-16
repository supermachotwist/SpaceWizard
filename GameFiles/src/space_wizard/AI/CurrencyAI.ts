import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameLevel from "../Scenes/Gamelevel";
import { space_wizard_events } from "../space_wizard_events";

export default class CurrencyAI extends ControllerAI {

    // Location of player
    player: GameNode;

    owner: AnimatedSprite;

    emitter: Emitter;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;

        this.player = options.player;

        this.emitter = new Emitter();
    }

    update(deltaT: number): void {
        // Move towards player, the closer you are, the faster you are
        let distance = this.owner.position.distanceSqTo(this.player.position);
        let direction = this.owner.position.dirTo(this.player.position);
        let speed = 1/distance * 5000000;
        if (speed >= 1500){
            speed = 1500;
        }
        this.owner.move(direction.normalized().scale(deltaT * speed));

        /*
        for (let drop of (<GameLevel>this.owner.getScene()).currency){
            // Push enemies out of each other if they overlap
            if (this.owner.collisionShape.overlaps(drop.collisionShape)) {
                if (this.owner.collisionShape.center.x > drop.collisionShape.center.x){
                    this.owner.move(Vec2.RIGHT.scaled(100 * deltaT));
                }
                if (this.owner.collisionShape.center.x < drop.collisionShape.center.x){
                    this.owner.move(Vec2.LEFT.scaled(100 * deltaT));
                }
                if (this.owner.collisionShape.center.y > drop.collisionShape.center.y){
                    this.owner.move(Vec2.DOWN.scaled(100 * deltaT));
                }
                if (this.owner.collisionShape.center.y < drop.collisionShape.center.y){
                    this.owner.move(Vec2.UP.scaled(100 * deltaT));
                }
            }
        }
        */

        if (this.owner.collisionShape.overlaps(this.player.collisionShape)) {
            this.emitter.fireEvent(space_wizard_events.PICKUP_STARDUST);
            let currency = (<GameLevel>this.owner.getScene()).currency;
            currency.splice(currency.indexOf(this.owner), 1);
            this.owner.visible = false;
            this.owner.destroy();
        }
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}
}
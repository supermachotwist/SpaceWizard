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
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Spell from "../GameSystems/Spells/Spell";
import Comet from "../GameSystems/Spells/SpellTypes/Comet";
import Meteor from "../GameSystems/Spells/SpellTypes/Meteor";
import Laser from "../GameSystems/Spells/SpellTypes/Laser";
import Blackhole from "../GameSystems/Spells/SpellTypes/Blackhole";


export default class PlayerController implements AI {
    // Emmiter for when player takes damage
    emitter: Emitter;

    // Player health
    health: number;

    // Player mana
    mana: number;

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
        this.mana = 1000;

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

        this.mana += 3;
        if (this.mana > 1000) {
            this.mana = 1000;
        }

        this.owner.animation.queue("IDLE");

        // Get the movement direction
        this.direction.x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
        this.direction.y = (Input.isPressed("up") ? -1 : 0) + (Input.isPressed("down") ? 1 : 0);

        // Move the player
        this.owner.move(this.direction.normalized().scale(this.speed * deltaT));

        if (this.owner.position.x >= (<GameLevel>this.owner.getScene()).background.boundary.right){
            this.owner.position.x = (<GameLevel>this.owner.getScene()).background.boundary.right;
        }
        if (this.owner.position.x <= 32){
            this.owner.position.x = 32;
        }
        if (this.owner.position.y <= 32){
            this.owner.position.y = 32;
        }
        if (this.owner.position.y >= (<GameLevel>this.owner.getScene()).background.boundary.bottom){
            this.owner.position.y = (<GameLevel>this.owner.getScene()).background.boundary.bottom;
        }

        if(Input.isMouseJustPressed()){
            if (!this.owner.animation.isPlaying("DEATH")) {
                this.owner.animation.play("FIRING");
            }
            
            let spell = this.inventory.getItem();

            // If spell slot is not empty
            if (spell) {
                if (this.mana - spell.type.cost >= 0){
                    this.mana = this.mana - spell.type.cost;
                    spell.use(this.owner, this.lookDirection);
                }
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

        // Pickup spell if player walks over it
        for (let item of (<GameLevel>this.owner.getScene()).items){
            if (this.owner.collisionShape.overlaps(item.collisionShape)){
                let scene = <GameLevel>this.owner.getScene()
                let inventory = scene.inventory;
                let previousSlot = inventory.getSlot();
                if (item.imageId == "laserSprite"){
                    inventory.changeSlot(0);
                    let laserSprite = scene.add.sprite("laserSprite", "primary");
                    laserSprite.scale.scale(2.8);
                    laserSprite.rotation += Math.PI/4;
                    let spell = new Spell(laserSprite, new Laser(), scene.towers, scene.enemies);
                    this.inventory.addItem(spell);
                } else if (item.imageId == "cometSprite"){
                    inventory.changeSlot(1);
                    let cometSprite = scene.add.sprite("cometSprite", "primary");
                    cometSprite.scale.scale(2.8);
                    cometSprite.rotation += Math.PI/4;
                    let spell = new Spell(cometSprite, new Comet(), scene.towers, scene.enemies);
                    this.inventory.addItem(spell);
                } else if (item.imageId == "meteorSprite"){
                    inventory.changeSlot(2);
                    let meteorSprite = scene.add.sprite("meteorSprite", "primary");
                    meteorSprite.scale.scale(2.8);
                    meteorSprite.rotation += Math.PI/4;
                    let spell = new Spell(meteorSprite, new Meteor(), scene.towers, scene.enemies);
                    this.inventory.addItem(spell);
                } else if (item.imageId == "blackholeSprite"){
                    inventory.changeSlot(3);
                    let laserSprite = scene.add.sprite("blackholeSprite", "primary");
                    laserSprite.scale.scale(2.8);
                    laserSprite.rotation += Math.PI/4;
                    let spell = new Spell(laserSprite, new Blackhole(), scene.towers, scene.enemies);
                    this.inventory.addItem(spell);
                }
                this.inventory.changeSlot(previousSlot);
                item.visible = false;
                item.destroy();
            }
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
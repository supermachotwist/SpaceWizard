import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Enemy from "../GameSystems/Enemys/Enemy";
import Spell from "../GameSystems/Spells/Spell";
import Tower from "../GameSystems/Towers/Tower";
import EnemyAI from "./EnemyAI";


export default class SpellController extends ControllerAI {

    // The spell player sprite
    owner: AnimatedSprite;

    // Speed of movement
    speed: number;

    // Direction of movement
    direction: Vec2;

    // The spell this controller has a hold of
    spell: Spell;

    // Flag to tell whether spell is dead or not
    dead: boolean;

    // Size of explosion
    explosionSize: number;

    /** A list of enemies the tower has collided with */
    /** This is to prevent the tower from hitting the same tower twice */

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        
        this.dead = false;

        this.speed = options.speed;
        this.direction = options.direction;
        this.spell = options.spell;

        this.explosionSize = 1;
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
        if (!this.dead){
            // Rotate the meteor in the direction of movement
            this.owner.rotation = Vec2.UP.angleToCCW(this.direction) + Math.PI/2;

            // Move the meteor in direction of movement
            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));

            // See if the spell collides with the tower hitbox
            for (let tower of this.spell.towers){
                if (this.owner.collisionShape.overlaps(tower.owner.collisionShape)) {
                    if (tower.displayName === "ExplosionTower" && !this.spell.explosion){
                        this.spell.explosion = true;
                        let newCollsion = new AABB(Vec2.ZERO, this.owner.collisionShape.halfSize.scaled(5));
                        this.owner.collisionShape = newCollsion;
                        this.explosionSize = 5;
                    }
                    else if (tower.displayName === "PierceTower"){

                    }
                    else if (tower.displayName === "ForkTower" && !this.spell.fork){
                        // Do not fork again after forking once
                        this.spell.fork = true;
                        this.spell.use(this.owner, this.direction.rotateCCW(Math.PI/8).clone());
                        this.direction.rotateCCW(-1 * Math.PI/8);
                        this.spell.use(this.owner, this.direction.rotateCCW(-1 * Math.PI/8).clone());
                        this.destroySpell(0);
                    }
                }
            }

            // See if the spell colldies with an enemy
            for (let enemy of this.spell.enemies){
                if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape) && !this.spell.enemiesHit.includes(enemy)) {
                    enemy.damage(this.spell.damage);
                    this.spell.enemiesHit.push(enemy);
                    this.destroySpell(this.explosionSize);
                }
            }

            // Detonate the spell on impact with side of screen
            if (this.owner.position.x < 16 || this.owner.position.x > 1200 - 16 || this.owner.position.y < 16 || this.owner.position.y > 800 - 16) {
                this.destroySpell();
            } else {
                if (!this.owner.animation.isPlaying("EXPLOSION")) {
                    this.owner.animation.playIfNotAlready("MOVING", true);
                }
            }
        }
        // Only remove animatedSprite when explosion animation is finished
        else if (this.dead && !this.owner.animation.isPlaying("EXPLOSION")) {
            this.owner.visible = false;
            this.owner.destroy();
        }    
    }

    destroySpell(scale:number=1): void {
        this.speed = 0;
        this.owner.scale.scale(scale);
        this.owner.animation.playIfNotAlready("EXPLOSION");
        this.dead = true;
    }
}
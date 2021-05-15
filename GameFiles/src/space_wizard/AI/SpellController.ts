import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../Wolfie2D/Events/Emitter";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Enemy from "../GameSystems/Enemys/Enemy";
import Spell from "../GameSystems/Spells/Spell";
import Tower from "../GameSystems/Towers/Tower";
import GameLevel from "../Scenes/Gamelevel";
import EnemyAI from "./EnemyAI";


export default class SpellController extends ControllerAI {

    protected emitter: Emitter;

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

        this.emitter = new Emitter();
    }

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
        // Do nothing if game is pauseD
        let gamelevel = <GameLevel> this.owner.getScene();
        if (gamelevel.isPaused()){
            return;
        }

        if (!this.dead){
            // Rotate the meteor in the direction of movement
            this.owner.rotation = Vec2.UP.angleToCCW(this.direction) + Math.PI/2;


            // See if the spell collides with the tower hitbox
            for (let tower of this.spell.towers){
                if (this.owner.collisionShape.overlaps(tower.owner.collisionShape)) {
                    if (tower.displayName === "ExplosionTower" && !this.spell.explosion){
                        this.spell.explosion = true;
                        this.explosionSize = 5;
                    }
                    else if (tower.displayName === "PierceTower"){
                        this.spell.pierce = true;
                    }
                    else if (tower.displayName === "ForkTower" && !this.spell.fork){
                        // Do not fork again after forking once
                        this.spell.fork = true;
                        this.spell.use(this.owner, this.direction.rotateCCW(Math.PI/8).clone());
                        this.direction.rotateCCW(-1 * Math.PI/8);
                        this.spell.use(this.owner, this.direction.rotateCCW(-1 * Math.PI/8).clone());
                        this.direction.rotateCCW(Math.PI/8);
                    }
                }
            }

            this.checkEnemyCollision();

            // Detonate the spell on impact with side of screen
            if (this.owner.position.x < 16 || this.owner.position.x > (<GameLevel>this.owner.getScene()).background.boundary.right- 16 || this.owner.position.y < 16 || this.owner.position.y > (<GameLevel>this.owner.getScene()).background.boundary.bottom - 16) {
                this.destroySpell();
            } else {
                if (!this.owner.animation.isPlaying("EXPLOSION")) {
                    this.owner.animation.playIfNotAlready("MOVING", true);
                }
            }

            // Move the meteor in direction of movement
            this.owner.move(this.direction.normalized().scale(this.speed * deltaT));
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
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "thunder", loop: false});
    }

    checkEnemyCollision(): void {
        // Offset used to prevent enemys from being on top of each other when using blackhole
        let offset = 0;
        // See if the spell colldies with an enemy
        for (let enemy of this.spell.enemies){
            if (enemy.dead){
                // Remove enemy from list in place
                this.spell.enemies.splice(this.spell.enemies.indexOf(enemy), 1);
            }
            if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape) && this.spell.type.displayName == "Blackhole") {
                // Suck the enemies into the center of blackhole
                enemy.owner.position.x = this.owner.position.x + offset;
                enemy.owner.position.y = this.owner.position.y + offset;
            }
            if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape) && !this.spell.enemiesHit.includes(enemy)) {
                this.spell.enemiesHit.push(enemy);

                // If the enemy is a shield enemy. Check if the enemy is shielded
                if (enemy.type.displayName == "shieldEnemy"){
                    let x = enemy.owner.animation.getIndex();
                    if ((enemy.owner.animation.isPlaying("IDLE") || enemy.owner.animation.isPlaying("MOVING")) && enemy.owner.animation.getIndex() == 18 || enemy.owner.animation.isPlaying("DAMAGE")){
                        enemy.shoot(Vec2.UP);
                        enemy.shoot(new Vec2(1,1));
                        enemy.shoot(Vec2.RIGHT);
                        enemy.shoot(new Vec2(1, -1));
                        enemy.shoot(Vec2.DOWN);
                        enemy.shoot(new Vec2(-1, 1));
                        enemy.shoot(Vec2.LEFT);
                        enemy.shoot(new Vec2(-1, -1));
                        this.destroySpell(this.explosionSize);
                        continue;
                    }
                }
                
                // Handle spell special effects
                if (this.spell.type.displayName == "Fireball"){
                    enemy.burningTimer.start();
                }
                else if (this.spell.type.displayName == "Comet"){
                    enemy.slowedTimer.start();
                }

                // If the spell has an explosion status
                if (this.spell.explosion){
                    this.checkExplosionCollision();
                }
                if (enemy.damage(this.spell.damage)){
                    enemy.owner.animation.play("DYING", false);
                }
                if (!this.spell.pierce) {
                    this.destroySpell(this.explosionSize);
                }
                offset -= 1;
            }
        }
    }

    checkExplosionCollision(): void {
        // Offset used to prevent enemys from being on top of each other when using blackhole
        let offset = 1;
        // Increase give the spell area of affect
        this.owner.collisionShape.halfSize.scale(4);
        // See if the spell colldies with an enemy
        for (let enemy of this.spell.enemies){
            if (enemy.dead){
                continue;
            }
            if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape) && !this.spell.enemiesHit.includes(enemy)) {
                this.spell.enemiesHit.push(enemy);

                // Handle spell special effects
                if (this.spell.type.displayName == "Fireball"){
                    enemy.burningTimer.start();
                }
                else if (this.spell.type.displayName == "Comet"){
                    enemy.slowedTimer.start();
                }
                else if (this.spell.type.displayName == "Blackhole"){
                    // Suck the enemies into the center of blackhole
                    enemy.owner.position.x = this.owner.position.x + offset;
                    enemy.owner.position.y = this.owner.position.y + offset;
                }

                if (enemy.damage(this.spell.damage)){
                    enemy.owner.animation.play("DYING", false);
                }
                offset += 1;
            }
        }
    }
}
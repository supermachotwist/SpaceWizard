import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import Enemy from "../GameSystems/Enemys/Enemy";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import GameLevel from "../Scenes/Gamelevel";
import PlayerController from "./PlayerController";
import Emitter from "../../Wolfie2D/Events/Emitter";
import { space_wizard_events } from "../space_wizard_events";


export default class EnemyAI extends ControllerAI
{
    // Emitter
    emitter: Emitter;

    // The enemy sprite
    owner: AnimatedSprite;

    // Current movement direction
    private moveDirection: Vec2;

    // Reference to enemy that this AI controls
    enemy: Enemy;

    // Reference to wizard/player
    player: GameNode;

    // Route for enemies to follow
    private route: NavigationPath;

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    update(deltaT: number): void {
        // Do nothing if game is paused
        let gamelevel = <GameLevel> this.owner.getScene();
        if (gamelevel.isPaused()){
            return;
        }

        //If the enemy is burning
        if (!this.enemy.burningTimer.isStopped()){
            // Damage enemy per second
            this.enemy.damage(deltaT * 5);
        }

        // If the enemy is slowed
        if (!this.enemy.slowedTimer.isStopped()){
            // Slowdown enemy
            deltaT /= 2;
        }

        if (!this.enemy.dead){
            if(!this.owner.animation.isPlaying("DAMAGE") && !this.owner.animation.isPlaying("DYING")){
                this.owner.animation.playIfNotAlready("IDLE", true);
            }

            if (this.owner.collisionShape.overlaps(this.player.collisionShape)) {
                this.emitter.fireEvent(space_wizard_events.PLAYER_DAMAGE);
            }

            // Enemy Types. Change behavior of enemy based on their display name
            // enemySpaceship -> Follows player and shoots on a cooldown randomly
            if (this.enemy.type.displayName == "enemySpaceship"){
                // Look in the direction of the player
                let lookDirection = this.owner.position.dirTo(this.player.position);
                this.owner.rotation = (Vec2.UP.angleToCCW(lookDirection));

                // Move the enemy in direction of player
                this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT));

                // Enemy will occasionally shoot on cooldown
                if (this.enemy.cooldownTimer.isStopped()){
                    if (Math.random() < 0.01){
                        this.enemy.shoot(lookDirection);
                        this.enemy.cooldownTimer.start();
                    }
                }
            } 
            // Flies around randombly and shoots rapidly in 8 directions
            else if (this.enemy.type.displayName == "enemyUFO") {
                let viewport = this.enemy.owner.getScene().getViewport()
                let owner = this.enemy.owner;
                let xprob = 1200 - owner.position.x;
                let yprob = 800 - owner.position.y;
                xprob = (xprob/1200);
                yprob = (yprob/800);

                // Enemy will occasionally shoot on cooldown
                if (this.enemy.cooldownTimer.isStopped()){
                    let rand = Math.random();

                    if (rand < 0.01){
                        rand = Math.random();
                        if (rand >= xprob && rand >= yprob){
                            this.moveDirection = new Vec2(-1, -1);
                        }
                        else if (rand >= xprob && rand < yprob){
                            this.moveDirection = new Vec2(-1, 1);
                        }
                        else if (rand < xprob && rand < yprob){
                            this.moveDirection = new Vec2(1, 1);
                        }
                        else if (rand < xprob && rand >= yprob){
                            this.moveDirection = new Vec2(1, -1);
                        }
                        this.enemy.shoot(Vec2.UP);
                        this.enemy.shoot(Vec2.RIGHT);
                        this.enemy.shoot(Vec2.DOWN);
                        this.enemy.shoot(Vec2.LEFT);
                        this.enemy.cooldownTimer.start();
                    }
                }
                // Wrap the enemy around the stage
                if (this.owner.position.x > 1264) {
                    this.owner.position.x = -64;
                }
                if (this.owner.position.x < -64) {
                    this.owner.position.x = 1264;
                }
                if (this.owner.position.y > 864) {
                    this.owner.position.y = -64;
                }
                if (this.owner.position.y < -64) {
                    this.owner.position.y = 864;
                }

                // Move the enemy in direction of movement
                this.owner.move(this.moveDirection.normalized().scale(this.enemy.speed * deltaT));
            }

            this.overlapCheckAndFix(deltaT);
        
        }
        // Destroy dead enemy
        else if (this.enemy.dead && !this.owner.animation.isPlaying("DYING")){
            // Only destroy dead enemy when dying animation is done
            this.enemy.dropSpell();
            this.owner.visible = false;
            this.owner.destroy();
        }
    }

    overlapCheckAndFix(deltaT: number):void{
        for (let enemy of (<GameLevel>this.owner.getScene()).getEnemies()){
            if (this.enemy == enemy){
                continue;
            }
            // Push enemies out of each other if they overlap
            if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape)) {
                if (this.owner.collisionShape.center.x > enemy.owner.collisionShape.center.x){
                    this.owner.move(Vec2.RIGHT.scaled(this.enemy.speed * deltaT));
                }
                if (this.owner.collisionShape.center.x < enemy.owner.collisionShape.center.x){
                    this.owner.move(Vec2.LEFT.scaled(this.enemy.speed * deltaT));
                }
                if (this.owner.collisionShape.center.y > enemy.owner.collisionShape.center.y){
                    this.owner.move(Vec2.DOWN.scaled(this.enemy.speed * deltaT));
                }
                if (this.owner.collisionShape.center.y < enemy.owner.collisionShape.center.y){
                    this.owner.move(Vec2.UP.scaled(this.enemy.speed * deltaT));
                }
            }
        }
    }

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void 
    {
        this.owner = owner;
        this.moveDirection = Vec2.ZERO;

        this.player = options.player;
        this.enemy = options.enemy;

        this.emitter = new Emitter();
    }

}


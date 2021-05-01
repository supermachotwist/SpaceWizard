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
            
            //this.route = this.owner.getScene().getNavigationManager().getPath(space_wizard_names.NAVMESH, this.owner.position, /*Insert_end_pos_here*/);    
            //this.owner.moveOnPath(this.enemy.speed * deltaT, this.route);
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

                // Move the enemy in direction of movement
                this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT));

                // Enemy will occasionally shoot on cooldown
                if (this.enemy.cooldownTimer.isStopped){
                    if (Math.random() < 0.01){
                        this.enemy.shoot(lookDirection);
                        this.enemy.cooldownTimer.start();
                    }
                }

                for (let enemy of (<GameLevel>this.owner.getScene()).getEnemies()){
                    if (this.enemy == enemy){
                        continue;
                    }
                    // Push enemies out of each other if they overlap
                    if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape)) {
                        if (this.owner.collisionShape.center.x >= enemy.owner.collisionShape.x){
                            this.owner.move(Vec2.RIGHT.scaled(this.enemy.speed * deltaT));
                        }
                        if (this.owner.collisionShape.center.x < enemy.owner.collisionShape.x){
                            this.owner.move(Vec2.LEFT.scaled(this.enemy.speed * deltaT));
                        }
                        if (this.owner.collisionShape.center.y >= enemy.owner.collisionShape.y){
                            this.owner.move(Vec2.DOWN.scaled(this.enemy.speed * deltaT));
                        }
                        if (this.owner.collisionShape.center.y < enemy.owner.collisionShape.y){
                            this.owner.move(Vec2.UP.scaled(this.enemy.speed * deltaT));
                        }  
                    }
                }
            }   
        }
        // Destroy dead enemy
        else if (this.enemy.dead && !this.owner.animation.isPlaying("DYING")){
            // Only destroy dead enemy when dying animation is done
            this.owner.visible = false;
            this.owner.destroy();
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


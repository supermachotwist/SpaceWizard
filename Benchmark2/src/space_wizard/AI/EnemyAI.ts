import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import Enemy from "../GameSystems/Enemys/Enemy";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import {space_wizard_names} from "../space_wizard_events";
import GameLevel from "../Scenes/Gamelevel";


export default class EnemyAI extends ControllerAI
{

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

        if (!this.enemy.dead){
            if(!this.owner.animation.isPlaying("DAMAGE") && !this.owner.animation.isPlaying("DYING")){
                this.owner.animation.playIfNotAlready("IDLE", true);
            
            //this.route = this.owner.getScene().getNavigationManager().getPath(space_wizard_names.NAVMESH, this.owner.position, /*Insert_end_pos_here*/);    
            //this.owner.moveOnPath(this.enemy.speed * deltaT, this.route);
            }
            // Look in the direction of the player
            let lookDirection = this.owner.position.dirTo(this.player.position);
            this.owner.rotation = (Vec2.UP.angleToCCW(lookDirection));

            // Move the enemy in direction of movement
            this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT));
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
    }

}


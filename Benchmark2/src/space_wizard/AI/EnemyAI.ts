import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import AI from "../../Wolfie2D/DataTypes/Interfaces/AI";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import ControllerAI from "../../Wolfie2D/AI/ControllerAI";
import Enemy from "../GameSystems/Enemys/Enemy";

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

    activate(options: Record<string, any>): void {}

    handleEvent(event: GameEvent): void {}

    // The enemy does not do anything right now
    update(deltaT: number): void {
        if (!this.enemy.dead){
            if(!this.owner.animation.isPlaying("DAMAGE") && !this.owner.animation.isPlaying("DYING")){
                this.owner.animation.playIfNotAlready("IDLE", true);
            }
            // Look in the direction of the player
            let lookDirection = this.owner.position.dirTo(this.player.position);
            this.owner.rotation = (Vec2.UP.angleToCCW(lookDirection));

            // Move the enemy in direction of movement
            // this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT));
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

    getPlayerPosition(): Vec2 
    {
        let pos = this.player.position;

        // Get the new player location
        let start = this.owner.position.clone();
        let delta = pos.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, pos.x);
        let maxX = Math.max(start.x, pos.x);
        let minY = Math.min(start.y, pos.y);
        let maxY = Math.max(start.y, pos.y);

        // Get the wall tilemap
        let walls = <OrthogonalTilemap>this.owner.getScene().getLayer("Wall").getItems()[0];

        let minIndex = walls.getColRowAt(new Vec2(minX, minY));
        let maxIndex = walls.getColRowAt(new Vec2(maxX, maxY));

        let tileSize = walls.getTileSize();

        for(let col = minIndex.x; col <= maxIndex.x; col++){
            for(let row = minIndex.y; row <= maxIndex.y; row++){
                if(walls.isTileCollidable(col, row)){
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1/2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if(hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(pos)){
                        // We hit a wall, we can't see the player
                        return null;
                    }
                }
            }
        }
    }
}

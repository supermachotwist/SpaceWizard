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
import Spell from "../GameSystems/Spells/Spell";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";


export default class EnemyAI extends ControllerAI {
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

    towerData: Record<string, any>;

    spellData: Array<Spell>;

    spell: Spell

    burncount: number;

    mode: number = 0;

    timer: number = 0;

    placeHolder: Vec2;

    activate(options: Record<string, any>): void { }

    handleEvent(event: GameEvent): void { }

    update(deltaT: number): void {
        // Do nothing if game is paused
        let gamelevel = <GameLevel>this.owner.getScene();
        if (gamelevel.isPaused()) {
            return;
        }

        // Damage label timer
        for (let i = 0; i < this.enemy.damageNumber.length; i++) {
            if (this.enemy.labelTimer[i].isStopped()) {
                this.enemy.damageNumber[i].destroy();
                // Remove label from array of labels
                this.enemy.damageNumber.splice(i, 1);
                this.enemy.labelTimer.splice(i, 1);
                i--;
            }
        }

        //If the enemy is burning
        if (!this.enemy.burningTimer.isStopped()) {
            this.burncount += deltaT;
            // Damage enemy per second
            if (this.burncount >= 1) {
                this.enemy.damage(5 + (<GameLevel>this.enemy.owner.getScene()).meteorLevel * 2);
                this.burncount--;
            }
        }

        // If the enemy is slowed
        if (!this.enemy.slowedTimer.isStopped()) {
            // Slowdown enemy
            deltaT /= 2;
        }

        if (!this.enemy.dead) {
            if (!this.owner.animation.isPlaying("DAMAGE") && !this.owner.animation.isPlaying("DYING")) {
                this.owner.animation.playIfNotAlready("IDLE", true);
            }

            if (this.owner.collisionShape.overlaps(this.player.collisionShape)) {
                this.emitter.fireEvent(space_wizard_events.PLAYER_DAMAGE);
            }

            // Enemy Types. Change behavior of enemy based on their display name
            // enemySpaceship -> Follows player and shoots on a cooldown randomly
            if (this.enemy.type.displayName == "enemySpaceship") {
                // Look in the direction of the player
                let lookDirection = this.owner.position.dirTo(this.player.position);
                this.owner.rotation = (Vec2.UP.angleToCCW(lookDirection));

                // Move the enemy in direction of player
                this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT));

                // Enemy will occasionally shoot on cooldown
                if (this.enemy.cooldownTimer.isStopped()) {
                    if (Math.random() < 0.01) {
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
                xprob = (xprob / 1200);
                yprob = (yprob / 800);

                // Enemy will occasionally shoot on cooldown
                if (this.enemy.cooldownTimer.isStopped()) {
                    let rand = Math.random();

                    if (rand < 0.01) {
                        rand = Math.random();
                        if (rand >= xprob && rand >= yprob) {
                            this.moveDirection = new Vec2(-1, -1);
                        }
                        else if (rand >= xprob && rand < yprob) {
                            this.moveDirection = new Vec2(-1, 1);
                        }
                        else if (rand < xprob && rand < yprob) {
                            this.moveDirection = new Vec2(1, 1);
                        }
                        else if (rand < xprob && rand >= yprob) {
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
                if (this.owner.position.x > (<GameLevel>this.owner.getScene()).background.boundary.right + 64) {
                    this.owner.position.x = -64;
                }
                if (this.owner.position.x < -64) {
                    this.owner.position.x = (<GameLevel>this.owner.getScene()).background.boundary.right + 64;
                }
                if (this.owner.position.y > (<GameLevel>this.owner.getScene()).background.boundary.bottom + 64) {
                    this.owner.position.y = -64;
                }
                if (this.owner.position.y < -64) {
                    this.owner.position.y = (<GameLevel>this.owner.getScene()).background.boundary.bottom + 64;
                }

                // Move the enemy in direction of movement
                this.owner.move(this.moveDirection.normalized().scale(this.enemy.speed * deltaT));
            }

            else if (this.enemy.type.displayName == "shieldEnemy") {

            }

            // Fires a slower, larger, less frequent shot (make unique projectile later)
            // Has a random chance of deploying a disruptor on a tower on projectile collision (still needs implementing)
            else if (this.enemy.type.displayName == "spikeEnemy") {
                // Look in the direction of the player
                let lookDirection = this.owner.position.dirTo(this.player.position);
                this.owner.rotation = (Vec2.UP.angleToCCW(lookDirection));

                // Move the enemy in direction of movement
                this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT))
                this.owner.animation.playIfNotAlready("MOVING", true);

                // Enemy will occasionally shoot on cooldown
                if (this.enemy.cooldownTimer.isStopped) {
                    if (Math.random() < 0.005) {
                        this.enemy.shoot(lookDirection);
                        this.enemy.cooldownTimer.start();
                    }
                }
            }

            else if (this.enemy.type.displayName == "bulletman") {
                //just like a bullet in 5 minute :(
                let lookDirection = this.owner.position.dirTo(this.player.position);
                this.owner.rotation = (Vec2.UP.angleToCCW(lookDirection));
                this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT))
                if (this.enemy.cooldownTimer.isStopped) {
                    if (Math.random() < 0.005) {
                        this.enemy.cooldownTimer.start();
                        this.enemy.speed = this.enemy.speed * 1.2;
                        this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT));
                    }

                    else {
                        this.owner.move(lookDirection.normalized().scale(this.enemy.speed * deltaT))
                    }
                }

            }

            else if (this.enemy.type.displayName == "Head") {
                if(this.timer>=240){
                    console.log("This is the cooldown");
                this.emitter.fireEvent(space_wizard_events.SPAWN_BULLETMAN);
            this.timer=0;}
            else{
                this.timer++;
            }
            }

            // disruptor -> Disables tower function until it's destroyed
            else if (this.enemy.type.displayName == "disruptor") {
                /* for (let tower of this.towerData.towers)
                {
                    for (let sp of this.spellData.spells)
                    {
                        if(tower.type === "fork" || tower.type === "explosion"
                        || tower.type === "pierce")
                        {
                            if(sp.type == "meteor"|| sp.type === "comet"
                            || sp.type === "laser" || sp.type === "blackhole")
                            {
                                this.spell.fork = false;
                                this.spell.explosion = false;
                                this.spell.pierce = false;
                            }
                        }
                    }
                }*/

                let lookDirection = this.owner.position.dirTo(Vec2.ZERO);
                // Enemy shouldn't shoot (just enforces it)
                if (this.enemy.cooldownTimer.isStopped()) {
                    if (Math.random() < 0) {
                        this.enemy.shoot(lookDirection);
                        this.enemy.cooldownTimer.start();
                    }
                }

            }

            for (let enemy of (<GameLevel>this.owner.getScene()).getEnemies()) {
                if (this.enemy == enemy) {
                    continue;
                }
                // Push enemies out of each other if they overlap
                if (this.owner.collisionShape.overlaps(enemy.owner.collisionShape)) {
                    if (this.owner.collisionShape.center.x > enemy.owner.collisionShape.center.x) {
                        this.owner.move(Vec2.RIGHT.scaled(this.enemy.speed * deltaT));
                    }
                    if (this.owner.collisionShape.center.x < enemy.owner.collisionShape.center.x) {
                        this.owner.move(Vec2.LEFT.scaled(this.enemy.speed * deltaT));
                    }
                    if (this.owner.collisionShape.center.y > enemy.owner.collisionShape.center.y) {
                        this.owner.move(Vec2.DOWN.scaled(this.enemy.speed * deltaT));
                    }
                    if (this.owner.collisionShape.center.y < enemy.owner.collisionShape.center.y) {
                        this.owner.move(Vec2.UP.scaled(this.enemy.speed * deltaT));
                    }
                }
            }
        }
        // Destroy dead enemy
        else if (this.enemy.dead && !this.owner.animation.isPlaying("DYING")) {
            // Only destroy dead enemy when dying animation is done
            for (let label of this.enemy.damageNumber) {
                if (label != null) {
                    label.destroy();
                    label = null;
                }
            }
            this.owner.visible = false;
            this.owner.destroy();
        }
    }

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.moveDirection = Vec2.ZERO;

        this.player = options.player;
        this.enemy = options.enemy;

        this.emitter = new Emitter();

        this.burncount = 0;
    }

}


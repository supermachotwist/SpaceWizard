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
import enemySpaceship from "../GameSystems/Enemys/EnemyTypes/EnemySpaceship";
import enemyUFO from "../GameSystems/Enemys/EnemyTypes/EnemyUFO";
import Bulletman from "../GameSystems/Enemys/EnemyTypes/Bulletman";
import EnemyType from "../GameSystems/Enemys/EnemyType";


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
                        this.enemy.speed = this.enemy.speed*1.2;
                        if(this.enemy.speed>200){
                            this.enemy.speed =200;
                        }
                        this.enemy.owner.animation.playIfNotAlready("ATTACKING");
                        this.owner.move(lookDirection.normalized().scale(this.enemy.speed*deltaT));
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
            else if (this.enemy.type.displayName == "disruptor") 
            {
                for (let tower of (<GameLevel>this.owner.getScene()).towers)
                {
                    if (this.enemy.owner.collisionShape.overlaps(tower.owner.collisionShape)){
                        tower.stopAnimation();
                        tower.disabled = true;
                    }
                }                
            }

            else if (this.enemy.type.displayName == "deathstar"){
                let viewport = (<GameLevel>this.enemy.owner.getScene()).getViewport()
                // Bounce the enemy around the viewport
                if (viewport.includes(this.enemy.owner)) {
                    if (this.moveDirection.isZero()) {
                        this.moveDirection.set(1,1);
                    }
                    if (this.enemy.owner.position.x >= viewport.getView().right - 32){
                        this.moveDirection.x = -1;
                    }
                    if (this.enemy.owner.position.x < viewport.getView().left + 32){
                        this.moveDirection.x = 1;
                    }
                    if (this.enemy.owner.position.y >= viewport.getView().bottom - 100){
                        this.moveDirection.y = -1;
                    }
                    if (this.enemy.owner.position.y < viewport.getView().top + 32){
                        this.moveDirection.y = 1;
                    }
                    this.owner.move(this.moveDirection.normalized().scale(this.enemy.speed * deltaT))
                }
            }
            
            // Stargate -> periodically spawns enemies
            else if (this.enemy.type.displayName == "stargate"){
                if (this.enemy.cooldownTimer.isStopped() && (<GameLevel>this.owner.getScene()).getEnemies().length < 10){
                    let rand = Math.random();
                    let enemySprite: AnimatedSprite;
                    let enemyType: EnemyType;

                    

                    if (rand <= 0.33){
                        enemySprite = (<GameLevel>this.owner.getScene()).add.animatedSprite("bulletman", "primary");
                        // Add collision to sprite
                        enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(5, 5)));
                        enemySprite.position.set(this.enemy.owner.position.x, this.enemy.owner.position.y);

                        enemyType = new Bulletman();
                    }
                    else if (rand >= 0.66){
                        enemySprite = (<GameLevel>this.owner.getScene()).add.animatedSprite("enemyUFO", "primary");
                        // Add collision to sprite
                        enemySprite.scale.scale(2);
                        enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(20, 20)));
                        enemySprite.position.set(this.enemy.owner.position.x, this.enemy.owner.position.y);

                        enemyType = new enemyUFO();
                    }
                    else {
                        enemySprite = (<GameLevel>this.owner.getScene()).add.animatedSprite("enemySpaceship", "primary");
                        enemySprite.scale.scale(0.5);
                        // Add collision to sprite
                        enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
                        enemySprite.position.set(this.enemy.owner.position.x, this.enemy.owner.position.y);

                        enemyType = new enemySpaceship();
                    }
                    

                    let enemyClass = new Enemy(enemySprite, enemyType);
                    enemySprite.addAI(EnemyAI, {
                        player: this.player,
                        enemy: enemyClass
                    });
                    enemySprite.animation.play("IDLE", true);
                    (<GameLevel>this.owner.getScene()).enemies.push(enemyClass);
                    this.enemy.cooldownTimer.start();
                }
            }
            
            for (let enemy of (<GameLevel>this.owner.getScene()).getEnemies()){
                if (this.enemy == enemy || this.enemy.type.displayName == "stargate" || this.enemy.type.displayName == "deathstar"){
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
            if (this.enemy.displayName == "disruptor") {
                for (let tower of (<GameLevel>this.owner.getScene()).towers)
                {
                    if (this.enemy.owner.collisionShape.overlaps(tower.owner.collisionShape)){
                        tower.playAnimation();
                        tower.disabled = false;
                    }
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


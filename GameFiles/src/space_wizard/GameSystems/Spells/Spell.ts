import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import SpellController from "../../AI/SpellController";
import GameLevel from "../../Scenes/Gamelevel";
import Enemy from "../Enemys/Enemy";
import Tower from "../Towers/Tower";
import SpellType from "./SpellType";


export default class Spell {
    // For sound effects
    emitter: Emitter;

    /** The sprite that represents this spell in an inventory */
    sprite: Sprite;

    /** The type of this weapon */
    type: SpellType;

    /** The cooldown timer for this weapon's use */
    cooldownTimer: Timer;

    /** Limit the distance the spell can travel */
    distanceTimer: Timer;
    distance: number;

    towers: Array<Tower>;

    enemies: Array<Enemy>

    enemiesHit: Array<Enemy>

    // Damage
    damage: number;

    /** Whether Explosion, Fork and Pierce effects are active */
    explosion: boolean;
    fork: boolean;
    pierce: boolean;

    constructor(sprite: Sprite, type: SpellType, towers: Array<Tower>, enemies: Array<Enemy>, explosion:boolean=false, fork:boolean=false, pierce:boolean=false){
        this.sprite = sprite;

        // Set the weapon type
        this.type = type;

        // Create the cooldown timer
        this.cooldownTimer = new Timer(type.cooldown);

        // Limit the distance a spells can travel
        if (this.type.displayName == "Fireball" || this.type.displayName == "Comet"){
            this.distance = 500 * 1.5 + ((<GameLevel>this.sprite.getScene()).rangeLevel * 300);
        }
        else if (this.type.displayName == "Blackhole"){
            this.distance = 500 * 3 + ((<GameLevel>this.sprite.getScene()).rangeLevel * 600);
        }
        else if (this.type.displayName == "Laser") {
            this.distance = 500 + ((<GameLevel>this.sprite.getScene()).rangeLevel * 200);
        }
        this.distanceTimer = new Timer(this.distance);

        // All the towers on the map
        this.towers = towers;

        // All the enemies on the map
        this.enemies = enemies;

        this.damage = this.type.damage;

        this.enemiesHit = new Array();

        this.explosion = explosion;
        this.fork = fork;
        this.pierce = pierce;

        this.emitter = new Emitter();
    }

    incDamage(inc: number): void {
        this.type.damage += inc;
    }

    moveSprite(position: Vec2, layer?: string){
        // Change the layer if needed
        if(layer){
            let currentLayer = this.sprite.getLayer();
            currentLayer.removeNode(this.sprite);
            let newLayer = this.sprite.getScene().getLayer(layer);
            newLayer.addNode(this.sprite);
            this.sprite.setLayer(newLayer);
        }

        // Move the sprite
        this.sprite.position.copy(position);
    }

    use(owner: GameNode, lookDirection: Vec2): boolean{
        if (this.type.displayName == "Fireball"){
            // Shoot fireball when off cooldown
            if (this.cooldownTimer.isStopped() || this.fork){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bang", loop: false});
                let fireball = owner.getScene().add.animatedSprite("meteor", "spell");
                fireball.position.set(owner.position.x, owner.position.y);
                fireball.addPhysics(new AABB(Vec2.ZERO, new Vec2(15, 15)));
                fireball.addAI(SpellController,{
                    owner: fireball,
                    speed: 400,
                    direction: lookDirection,
                    spell: new Spell(this.sprite, this.type, this.towers, this.enemies, this.explosion, this.fork, this.pierce),
                    towers: this.towers
                });
                this.cooldownTimer.start();
                return true;
            }
            return false;
        }
        else if (this.type.displayName == "Comet"){
            // Shoot comet when off cooldown
            if (this.cooldownTimer.isStopped() || this.fork){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bang", loop: false});
                let comet = owner.getScene().add.animatedSprite("comet", "spell");
                comet.position.set(owner.position.x, owner.position.y);
                comet.addPhysics(new AABB(Vec2.ZERO, new Vec2(15, 15)));
                comet.addAI(SpellController,{
                    owner: comet,
                    speed: 400,
                    direction: lookDirection,
                    spell: new Spell(this.sprite, this.type, this.towers, this.enemies, this.explosion, this.fork, this.pierce),
                    towers: this.towers
                });
                this.cooldownTimer.start();
                return true;
            }
            return false;
        }
        else if (this.type.displayName == "Laser"){
            // Shoot laser when off cooldown
            if (this.cooldownTimer.isStopped() || this.fork){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bang", loop: false});
                let laser = owner.getScene().add.animatedSprite("laser", "spell");
                laser.position.set(owner.position.x, owner.position.y);
                laser.addPhysics(new AABB(Vec2.ZERO, new Vec2(15, 15)));
                laser.addAI(SpellController,{
                    owner: laser,
                    speed: 600,
                    direction: lookDirection,
                    spell: new Spell(this.sprite, this.type, this.towers, this.enemies, this.explosion, this.fork, this.pierce),
                    towers: this.towers
                });
                this.cooldownTimer.start();
                return true;
            }
            return false;
        }
        else if (this.type.displayName == "Blackhole"){
            // Shoot laser when off cooldown
            if (this.cooldownTimer.isStopped() || this.fork){
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "bang", loop: false});
                let blackhole = owner.getScene().add.animatedSprite("blackhole", "spell");
                blackhole.position.set(owner.position.x, owner.position.y);
                blackhole.scale.scale(2);
                blackhole.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
                blackhole.addAI(SpellController,{
                    owner: blackhole,
                    speed: 200,
                    direction: lookDirection,
                    spell: new Spell(this.sprite, this.type, this.towers, this.enemies, this.explosion, this.fork, this.pierce),
                    towers: this.towers
                });
                this.cooldownTimer.start();
                return true;
            }
            return false;
        }
    }
}
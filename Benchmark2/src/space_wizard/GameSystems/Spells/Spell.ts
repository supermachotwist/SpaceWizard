import AABB from "../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Timer from "../../../Wolfie2D/Timing/Timer";
import SpellController from "../../AI/SpellController";
import Tower from "../Towers/Tower";
import SpellType from "./SpellType";


export default class Spell {
    /** The sprite that represents this spell in an inventory */
    sprite: Sprite;

    /** The type of this weapon */
    type: SpellType;

    /** The cooldown timer for this weapon's use */
    cooldownTimer: Timer;

    towers: Array<Tower>;

    /** Whether Explosion, Fork and Pierce effects are active */
    explosion: boolean;
    fork: boolean;
    pierce: boolean;

    constructor(sprite: Sprite, type: SpellType, towers: Array<Tower>, explosion:boolean=false, fork:boolean=false, pierce:boolean=false){
        this.sprite = sprite;

        // Set the weapon type
        this.type = type;

        // Create the cooldown timer
        this.cooldownTimer = new Timer(type.cooldown);

        // All the towers on the map
        this.towers = towers;

        this.explosion = explosion;
        this.fork = fork;
        this.pierce = pierce;
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
                let fireball = owner.getScene().add.animatedSprite("meteor", "primary");
                fireball.position.set(owner.position.x, owner.position.y);
                fireball.addPhysics(new AABB(Vec2.ZERO, new Vec2(15, 15)));
                fireball.addAI(SpellController,{
                    owner: fireball,
                    speed: 200,
                    direction: lookDirection,
                    spell: new Spell(this.sprite, this.type, this.towers, this.explosion, this.fork, this.pierce),
                    towers: this.towers
                });
                this.cooldownTimer.start();
                return true;
            }
            return false;
        }
    }
}
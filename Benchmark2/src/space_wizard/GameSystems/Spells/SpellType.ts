import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Scene from "../../../Wolfie2D/Scene/Scene";

export default class SpellType {

    /** How much damage this weapon does */
    damage: number;

    /** Display name */
    displayName: string;

    /** The use cooldown of the weapon */
    cooldown: number;

    /** Increase damage */
    incDamage(inc: number): void {
        this.damage += inc;
    }

    /** Decrease Damage. Not less than zero */
    decDamage(inc: number): void {
        this.damage -= inc;
        if (this.damage < 0){
            this.damage = 0;
        }
    }

    /** Increase Cooldown */
    incCooldown(inc: number): void {
        this.cooldown += inc;
    }

    /** Decrease Cooldown */
    decCooldown(inc: number): void {
        this.cooldown -= inc;
        if (this.cooldown < 0){
            this.cooldown = 0;
        }
    }
}
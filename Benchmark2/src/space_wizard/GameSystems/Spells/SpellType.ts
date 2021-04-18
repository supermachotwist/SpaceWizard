import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Scene from "../../../Wolfie2D/Scene/Scene";

export default abstract class SpellType {
    /** The key for this sprite image */
    spriteKey: string;

    /** How much damage this weapon does */
    damage: number;

    /** Display name */
    displayName: string;

    /** The use cooldown of the weapon */
    cooldown: number;
}
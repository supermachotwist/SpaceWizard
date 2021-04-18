import SpellType from "../SpellType";
import Scene from "../../../../Wolfie2D/Scene/Scene";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";



export default class Fireball extends SpellType {

    constructor(){
        super();
        this.spriteKey = "meteor";
        this.damage = 5;
        this.displayName = "Fireball";
        this.cooldown = 300;
    }
    /**
     * Initializes this weapon type with data
     */
    initialize(options: Record<string, any>): void {
        this.spriteKey = "meteor";
        this.damage = options.damage;
        this.displayName = "Fireball";
        this.cooldown = options.cooldown;
    }
}

import SpellType from "../SpellType";


export default class Comet extends SpellType {

    constructor(){
        super();
        this.damage = 5;
        this.displayName = "Comet";
        this.cooldown = 300;
    }
    /**
     * Initializes this weapon type with data
     */
    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.displayName = "Comet";
        this.cooldown = options.cooldown;
    }
}
import SpellType from "../SpellType";

export default class Meteor extends SpellType {

    constructor(){
        super();
        this.damage = 5;
        this.displayName = "Fireball";
        this.cooldown = 0;
    }
    /**
     * Initializes this weapon type with data
     */
    initialize(options: Record<string, any>): void {
        this.damage = options.damage;
        this.displayName = "Fireball";
        this.cooldown = options.cooldown;
    }
}

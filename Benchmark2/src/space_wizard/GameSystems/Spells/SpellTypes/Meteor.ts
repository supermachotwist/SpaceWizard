import SpellType from "../SpellType";

export default class Meteor extends SpellType {

    constructor(){
        super();
        this.damage = 10;
        this.displayName = "Fireball";
        this.cooldown = 500;
    }
}

import SpellType from "../SpellType";

export default class Meteor extends SpellType {

    constructor(){
        super();
        this.damage = 5;
        this.displayName = "Fireball";
        this.cooldown = 300;
    }
}

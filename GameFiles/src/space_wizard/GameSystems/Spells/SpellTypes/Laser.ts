import SpellType from "../SpellType";


export default class Laser extends SpellType {

    constructor(){
        super();
        this.damage = 3;
        this.displayName = "Laser";
        this.cooldown = 0;
        this.cost = 25;
    }
}
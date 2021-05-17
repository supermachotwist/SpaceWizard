import SpellType from "../SpellType";


export default class Blackhole extends SpellType {

    constructor(){
        super();
        this.damage = 20;
        this.displayName = "Blackhole";
        this.cooldown = 500;
        this.cost = 200;
    }
}
import SpellType from "../SpellType";


export default class Comet extends SpellType {

    constructor(){
        super();
        this.damage = 10;
        this.displayName = "Comet";
        this.cooldown = 300;
        this.cost = 100;
    }
}
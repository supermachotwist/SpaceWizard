import EnemyType from "../EnemyType";

export default class spikeEnemy extends EnemyType {

    constructor(){
        super();
        this.displayName = "spikeEnemy";
        this.cooldown = 100;
        this.speed = 20;
        this.health = 100;
        this.drop = 5;
    }
}
import EnemyType from "../EnemyType";

export default class disruptor extends EnemyType {

    constructor(){
        super();
        this.displayName = "disruptor";
        this.cooldown = 0;
        this.speed = 0;
        this.health = 50;
        this.drop = 20;
    }
}
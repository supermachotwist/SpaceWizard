import EnemyType from "../EnemyType";

export default class stargateEnemy extends EnemyType {

    constructor(){
        super();
        this.displayName = "stargate";
        this.cooldown = 10000;
        this.speed = 0;
        this.health = 300;
        this.drop = 50;
    }
}
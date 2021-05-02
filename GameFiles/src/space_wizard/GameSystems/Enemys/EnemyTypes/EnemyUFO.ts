import EnemyType from "../EnemyType";

export default class enemyUFO extends EnemyType {

    constructor(){
        super();
        this.displayName = "enemyUFO";
        this.cooldown = 120;
        this.speed = 200;
        this.health = 30;
    }
}
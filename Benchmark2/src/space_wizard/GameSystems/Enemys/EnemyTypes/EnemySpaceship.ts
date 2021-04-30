import EnemyType from "../EnemyType";

export default class enemySpaceship extends EnemyType {

    constructor(){
        super();
        this.displayName = "enemySpaceship";
        this.cooldown = 10000;
        this.speed = 50;
        this.health = 50;
    }
}
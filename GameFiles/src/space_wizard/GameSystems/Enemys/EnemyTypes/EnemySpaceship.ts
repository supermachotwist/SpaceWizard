import EnemyType from "../EnemyType";

export default class enemySpaceship extends EnemyType {

    constructor(){
        super();
        this.displayName = "enemySpaceship";
        this.cooldown = 300;
        this.speed = 100;
        this.health = 50;
        this.drop = 20;
    }
}
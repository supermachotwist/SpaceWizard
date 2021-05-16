import EnemyType from "../EnemyType";

export default class shieldEnemy extends EnemyType {

    constructor(){
        super();
        this.displayName = "shieldEnemy";
        this.cooldown = 0;
        this.speed = 0;
        this.health = 30;
        this.drop = 10;
    }
}
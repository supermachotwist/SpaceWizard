import EnemyType from "../EnemyType";

export default class Bulletman extends EnemyType {

    constructor(){
        super();
        this.displayName = "Head";
        this.cooldown = 5000;
        this.speed = 0;
        this.health = 300;
        this.drop = 5;
    }
}
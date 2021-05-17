import EnemyType from "../EnemyType";

export default class Deathstar extends EnemyType {

    constructor(){
        super();
        this.displayName = "deathstar";
        this.cooldown = 0;
        this.speed = 500;
        this.health = 50;
        this.drop = 20;
    }
}
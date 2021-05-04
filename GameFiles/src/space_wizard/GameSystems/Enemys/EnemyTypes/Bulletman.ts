import EnemyType from "../EnemyType";

export default class Bulletman extends EnemyType {

    constructor(){
        super();
        this.displayName = "bulletman";
        this.cooldown = 0;
        this.speed = 100;
        this.health = 15;
    }
}
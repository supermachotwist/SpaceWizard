import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Tower from "./Tower";



export default class PierceTower extends Tower{
    
    /** Constructor */
    constructor(owner:AnimatedSprite, range:number) {
        super();
        this.owner = owner;
        this.range = range;
        this.displayName = "PierceTower";
    }
}
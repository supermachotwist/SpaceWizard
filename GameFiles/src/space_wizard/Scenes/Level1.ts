import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import RegistryManager from "../../Wolfie2D/Registry/RegistryManager";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Color from "../../Wolfie2D/Utils/Color";
import Input from "../../Wolfie2D/Input/Input";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import GameLevel from "./Gamelevel";
import Level2 from "./Level2";
import MainMenu from "./MainMenu";



export default class Level1 extends GameLevel {

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        if (this.enemies.length == 0){
            this.wave += 1;
            if (this.wave == 5){
                this.sceneManager.changeToScene(MainMenu,{
                infiniteLives: this.infiniteLives,
                infiniteMana: this.infiniteMana,
                allSpells: this.allSpells
            },{});
            }
            else {
                this.waveLabel.text = "Wave: " + this.wave + "/4";
                this.spawnEnemies();
            }
        }
    }
}
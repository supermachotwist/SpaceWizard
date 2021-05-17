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
import { space_wizard_events } from "../space_wizard_events";



export default class Level1 extends GameLevel {

    startScene(): void {
        super.startScene();
        this.nextLevel = Level2;
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        this.waveLabel.text = "Wave: " + this.wave + "/10";
        if (this.enemies.length == 0 && !this.waveEnd){
            this.waveEnd = true;
            if (this.wave == 10){
                this.emitter.fireEvent(space_wizard_events.LEVEL_END);
            }
            else {
                this.emitter.fireEvent(space_wizard_events.WAVE_END);
            }
        }
    }
}
import { space_wizard_events } from "../space_wizard_events";
import GameLevel from "./Gamelevel";
import Level1 from "./Level1";
import MainMenu from "./MainMenu";



export default class Level6 extends GameLevel {
    startScene(): void {
        super.startScene();
        this.nextLevel = Level1;
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
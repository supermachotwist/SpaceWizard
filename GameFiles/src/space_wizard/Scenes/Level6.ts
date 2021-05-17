import { space_wizard_events } from "../space_wizard_events";
import GameLevel from "./Gamelevel";
import Level1 from "./Level1";
import MainMenu from "./MainMenu";




export default class Level6 extends GameLevel {
    loadScene(): void {
        super.loadScene();

        this.load.object("wave1", "space_wizard_assets/data/lvl6_wave1.json");
        this.load.object("towerData", "space_wizard_assets/data/lvl6_towers.json");

        this.load.image("space", "space_wizard_assets/images/Space2.png");
        this.load.image("planet", "space_wizard_assets/images/Moon.png");
    }

    startScene(): void {
        super.startScene();
        this.nextLevel = Level1;
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        this.waveLabel.text = "Wave: " + this.wave + "/INF";
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

    createBackground(): void {
        this.background = this.add.sprite("space", "background");

        // Now, let's make sure our logo is in a good position
        this.background.scale.set(2,2);
        let center = this.background.boundary.getHalfSize();
        this.background.position.set(center.x, center.y);

        // Create the cookie planet background
        let redPlanet = this.add.sprite("planet", "cookie");
        redPlanet.scale.scale(8);
        redPlanet.position.set(center.x, center.y);
    }
}
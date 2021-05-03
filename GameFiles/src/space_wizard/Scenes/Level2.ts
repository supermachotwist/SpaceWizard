import GameLevel from "./Gamelevel";
import Level1 from "./Level1";



export default class Level2 extends GameLevel {
    updateScene(deltaT: number) {
        super.updateScene(deltaT);

        if (this.enemies.length == 0){
            this.wave += 1;
            if (this.wave == 5){
                this.sceneManager.changeToScene(Level1,{
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
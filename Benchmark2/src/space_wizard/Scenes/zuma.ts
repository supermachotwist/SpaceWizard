import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import ExplosionTower from "../GameSystems/Towers/ExplosionTower";
import ForkTower from "../GameSystems/Towers/ForkTower";
import PierceTower from "../GameSystems/Towers/PierceTower";
import Circle from "../../Wolfie2D/DataTypes/Shapes/Circle";
import MainMenu from "./MainMenu";
import basicLevel from "./basicLevel";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Enemy from "../GameSystems/Enemys/Enemy";
import enemySpaceship from "../GameSystems/Enemys/EnemyTypes/EnemySpaceship";



export default class zuma extends basicLevel {

    loadScene(): void {
        super.loadScene();
        this.load.spritesheet("zumaChain", "space_wizard_assets/spritesheets/zumaChain.json");
        this.load.spritesheet("zuma", "space_wizard_assets/spritesheets/zuma.json");
        this.load.object("zumaTower", "space_wizard_assets/data/zumaLevelData/towers.json");
        this.load.object("zumaData", "space_wizard_assets/data/zumaLevelData/enemies.json");
        //load your own enemies
    //load your tower positions
    //load your own music   
    }

    //should set up the enemies and the towers
    startScene(): void {
        super.startScene();
        this.spawnEnemies();
    }

    unloadScene():void{
    }


    spawnEnemies(): void {

        // Get the enemy data
        let enemyData = this.load.getObject("zumaData");
        for (let enemy of enemyData.enemies) {
            let enemySprite;
            console.log(enemy.type);
        //     // Spawn appropriate enemy
            if (enemy.type == "zumaChain"){
                enemySprite = this.add.animatedSprite("zumaChain", "primary");
                enemySprite.scale.scale(2);
            }
            if(enemy.type = "zuma"){
                enemySprite = this.add.animatedSprite("zuma", "primary");
                enemySprite.scale.scale(2);
            }
        //     // Add collision to sprite
            enemySprite.addPhysics(new AABB(Vec2.ZERO, new Vec2(30, 30)));
            enemySprite.position.set(enemy.position[0], enemy.position[1]);

        //     let enemyType = new enemySpaceship();
        //     let enemyClass = new Enemy(enemySprite, "zumaChain", enemyType);
        //     // enemySprite.addAI(EnemyAI, {
        //     //     player: this.player,
        //     //     enemy: enemyClass
        //     // });
        //     enemySprite.animation.play("STABLE", true);
        //     this.enemies.push(enemyClass);
        }
    }

    updateScene(deltaT: number) {
        super.updateScene(deltaT);
    }


    gameover(): void {
        this.sceneManager.changeToScene(MainMenu, {}, {});
    }

    spawnTowers(): void {
        // // Get the tower data
        // let towerData = this.load.getObject("towerData");

        // for(let tower of towerData.towers){
        //     if(tower.type === "explosion"){
        //         let explosionTowerSprite = this.add.animatedSprite("explosionTower", "primary");
        //         // Add collision to sprite
        //         explosionTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
        //         // ExplosionTower(sprite, radius)
        //         let explosionTower = new ExplosionTower(explosionTowerSprite, 64);
        //         // Add tower to scene
        //         explosionTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
        //         explosionTower.playAnimation();
        //         this.towers.push(explosionTower);
        //     } else if (tower.type === "fork"){
        //         let forkTowerSprite = this.add.animatedSprite("forkTower", "primary");
        //         // Add collision to sprite
        //         forkTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
        //         // ForkTower(sprite, radius)
        //         let forkTower = new ForkTower(forkTowerSprite, 64);
        //         // Add tower to scene
        //         forkTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
        //         forkTower.playAnimation();
        //         this.towers.push(forkTower);
        //     } else if (tower.type === "pierce"){
        //         let pierceTowerSprite = this.add.animatedSprite("pierceTower", "primary");
        //         // Add collision to sprite
        //         pierceTowerSprite.addPhysics(new Circle(Vec2.ZERO, 64));
        //         // PierceTower(sprite, radius)
        //         let pierceTower = new PierceTower(pierceTowerSprite, 64);
        //         // Add tower to scene
        //         pierceTower.moveSprite(new Vec2(tower.position[0], tower.position[1]));
        //         pierceTower.playAnimation();
        //         this.towers.push(pierceTower);
        //     }
        // }        
    }
    
}
import PlayerController from "../AI/PlayerController";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import SpellManager from "../GameSystems/Spells/SpellManager";
import Spell from "../GameSystems/Spells/Spell";
import Fireball from "../GameSystems/Spells/SpellTypes/Fireball";



export default class hw3_scene extends Scene {
    // The player
    private player: AnimatedSprite;

    // Logo
    private logo: Sprite;

    loadScene(): void {
        // Load any assets here. For example, to load an image (or a sprite):
        this.load.spritesheet("player", "space_wizard_assets/spritesheets/WizardPlayer.json");
        this.load.image("logo", "space_wizard_assets/images/Space Wizard Logo.png");
        this.load.spritesheet("meteor", "space_wizard_assets/spritesheets/meteor.json");
        this.load.image("inventorySlot", "space_wizard_assets/sprites/inventory.png");
        this.load.image("meteor", "space_wizard_assets/sprites/meteor.png");
    }

    // startScene() is where you should build any game objects you wish to have in your scene,
    // or where you should initialize any other things you will need in your scene
    // Once again, this occurs strictly after loadScene(), so anything you loaded there will be available
    startScene(): void {

        // First, create a layer for it to go on
        this.addLayer("primary", 50);
        this.addLayer("background", 0);

        // The first argument is the key we specified in "this.load.image"
        // The second argument is the name of the layer
        this.logo = this.add.sprite("logo", "background");

        // Now, let's make sure our logo is in a good position
        let center = this.viewport.getCenter();
        this.logo.position.set(center.x, center.y);

        this.initializePlayer();
    }

    initializePlayer(): void {
        // Create the inventory
        let inventory = new SpellManager(this, 4, "inventorySlot", new Vec2(16, 16), 4);
        let fireballSprite = this.add.sprite("meteor", "primary");
        let startingSpell = new Spell(fireballSprite, new Fireball());
        inventory.addItem(startingSpell);

        // Get center of viewport
        let center = this.viewport.getCenter();

        // Create the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.position.set(center.x, center.y + 100);
        this.player.addAI(PlayerController,{
            inventory: inventory
        });

        // Start player is idle animation on loop
        this.player.animation.play("IDLE", true);
    }

    updateScene(deltaT: number) {
    }
}
export default class Fish {
    constructor(image, x, y) {
        this.movement = new PIXI.Point()

        this.displayObject = PIXI.Sprite.from(`images/${image}.png`)
        this.displayObject.position.x = x
        this.displayObject.position.y = y
        this.displayObject.anchor.set(0.5)

        this.marqueed = false
        this.selected = false

        this.updateTint()
    }

    setMarqueed(value) {
        this.marqueed = value

        this.updateTint()
    }

    setSelected(value) {
        this.selected = value

        this.updateTint()
    }

    updateTint() {
        // this.displayObject.tint = this.marqueed || this.selected ? 0x0000ff : 0xff0000
    }
}

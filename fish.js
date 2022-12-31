class Fish {
    constructor(x, y) {
        this.movement = new PIXI.Point()

        this.displayObject = new PIXI.Graphics()
        this.displayObject.beginFill(0xffffff).drawRect(-50, -50, 100, 100)
        this.displayObject.position.x = x
        this.displayObject.position.y = y

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
        this.displayObject.tint = this.marqueed || this.selected ? 0x0000ff : 0xff0000
    }
}

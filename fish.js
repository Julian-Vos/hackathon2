export default class Fish {
    constructor(image, x, y) {
        this.movement = new PIXI.Point()
        this.ring = new PIXI.Graphics()

        const url = `images/${image}.png`

        PIXI.Assets.load(url).then((texture) => {
            this.ring.lineStyle(2, 0x0, 0.5).drawEllipse(0, 0, texture.width * 0.6, texture.height * 0.6)
            this.displayObject.addChild(this.ring)
        })

        this.displayObject = PIXI.Sprite.from(url)
        this.displayObject.anchor.set(0.5)
        this.displayObject.position.x = x
        this.displayObject.position.y = y
        this.displayObject.cursor = 'pointer'
        this.displayObject.interactive = true

        this.marqueed = false
        this.selected = false

        this.updateRing()
    }

    setMarqueed(value) {
        this.marqueed = value

        this.updateRing()
    }

    setSelected(value) {
        this.selected = value

        this.updateRing()
    }

    updateRing() {
        this.ring.visible = this.marqueed || this.selected
    }

    update(delta) {
        if (this.movement.x === 0 && this.movement.y === 0) return

        const step = this.movement.normalize().multiplyScalar(
            Math.min(delta * 250, this.movement.magnitude())
        )

        this.movement.subtract(step, this.movement)
        this.displayObject.position.add(step, this.displayObject.position)
    }
}

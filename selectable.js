export default class Selectable {
    constructor(image, x, y) {
        const url = `images/${image}.png`

        this.ring = new PIXI.Graphics()

        PIXI.Assets.load(url).then((texture) => {
            this.ring.lineStyle(2, 0x0, 0.5).drawEllipse(0, 0, texture.width * 0.6, texture.height * 0.6)

            this.displayObject.addChild(this.ring)
            this.displayObject.zIndex = y + texture.height / 2
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

    setSelected(value) {
        this.selected = value

        this.updateRing()
    }

    updateRing() {
        this.ring.visible = this.marqueed || this.selected
    }
}

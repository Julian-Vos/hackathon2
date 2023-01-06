export default class Selectable {
    constructor(images, x, y) {
        this.ring = new PIXI.Graphics()

        PIXI.Assets.load(`images/${images[0]}.png`).then((texture) => {
            this.ring.lineStyle(2, 0xffffff, 0.75).drawEllipse(
                0,
                (0.5 - this.displayObject.anchor.y) * texture.height,
                texture.width * 0.65,
                texture.height * 0.65
            )

            this.displayObject.addChild(this.ring)
            this.displayObject.zIndex = y
        })

        this.displayObject = images.length === 1
            ? PIXI.Sprite.from(`images/${images[0]}.png`)
            : PIXI.AnimatedSprite.fromImages(images.map((image) => {
                  return `images/${image}.png`
              }))

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

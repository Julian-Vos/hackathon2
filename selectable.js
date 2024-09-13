import { addSelected, removeSelected } from './ui.js'

export default class Selectable {
    constructor(images, x, y) {
        this.portrait = `images/${images[0]}.png`
        this.ring = new PIXI.Graphics()

        PIXI.Assets.load(this.portrait).then((texture) => {
            this.ring.ellipse(
                0,
                (0.5 - this.displayObject.anchor.y) * texture.height,
                texture.width * 0.65,
                texture.height * 0.65
            ).stroke({ width: 2, color: '0xffffff', alpha: 0.75 })

            this.displayObject.addChild(this.ring)
            this.displayObject.zIndex = y + (1 - this.displayObject.anchor.y) * texture.height
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
        if (value === this.selected) {
            return
        }

        this.selected = value

        if (this.selected) {
            addSelected(this.portrait, this.description)
        } else {
            removeSelected(this.portrait)
        }

        this.updateRing()
    }

    updateRing() {
        this.ring.visible = this.marqueed || this.selected
    }
}

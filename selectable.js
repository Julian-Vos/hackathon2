import { addSelected, removeSelected } from './ui.js'

export default class Selectable {
    constructor(images, x, y, anchorY) {
        this.displayObject = images.length === 1
            ? PIXI.Sprite.from(`images/${images[0]}.png`)
            : PIXI.AnimatedSprite.fromImages(images.map((image) => `images/${image}.png`))

        this.displayObject.x = x
        this.displayObject.y = y
        this.displayObject.zIndex = y + (1 - anchorY) * this.displayObject.texture.height
        this.displayObject.anchor.set(0.5, anchorY)
        this.displayObject.cursor = 'pointer'
        this.displayObject.interactive = true

        this.marqueed = false
        this.selected = false

        this.portrait = `images/${images[0]}.png`
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
        if ((this.marqueed || this.selected) === this.hasOwnProperty('ring')) return

        if (this.marqueed || this.selected) {
            this.ring = new PIXI.Graphics()
            this.ring.ellipse(
                0,
                (0.5 - this.displayObject.anchor.y) * this.displayObject.texture.height,
                this.displayObject.texture.width * 0.65,
                this.displayObject.texture.height * 0.65
            ).stroke({ width: 2, color: '0xffffff', alpha: 0.75 })

            this.displayObject.addChild(this.ring)
        } else {
            this.ring.removeFromParent()

            delete this.ring
        }
    }
}

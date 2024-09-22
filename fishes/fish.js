import Selectable from '../selectable.js'
import { setSelectedDescription } from '../ui.js'

export default class Fish extends Selectable {
    constructor(...args) {
        super(...args, 0.5)

        this.displayObject.alpha = 0

        this.phase = 0
        this.food = 0
        this.movement = new PIXI.Point()
        this.object = null
    }

    setMarqueed(value) {
        this.marqueed = value

        this.updateRing()
    }

    update(delta) {
        this.displayObject.alpha = Math.min(this.displayObject.alpha + delta * 0.5, 1)

        if (this.movement.x === 0 && this.movement.y === 0) {
            this.displayObject.y -= Math.sin(this.phase) * 2
            this.phase = (this.phase + delta * Math.PI) % (2 * Math.PI)
            this.displayObject.y += Math.sin(this.phase) * 2

            return
        }

        const hunger = delta * 0.4
        const eat = Math.min(hunger, this.food)
        const step = this.movement.normalize().multiplyScalar(
            Math.min((1 + eat / hunger) * delta * 250, this.movement.magnitude())
        )

        this.displayObject.position.add(step, this.displayObject.position)
        this.food -= eat
        this.movement.subtract(step, this.movement)

        if (this.movement.x === 0 && this.movement.y === 0) {
            if (this.object === null) {
                this.displayObject.gotoAndStop(0)
            } else {
                this.displayObject.animationSpeed = this.animationSpeed / 4
                this.displayObject.play()

                this.object.fishes.add(this)

                if (this.object.selected) {
                    setSelectedDescription(this.object.portrait)
                }
            }
        } else {
            this.displayObject.animationSpeed = this.animationSpeed
            this.displayObject.play()
        }
    }
}

import Selectable from '../selectable.js'

export default class Fish extends Selectable {
    constructor(...args) {
        super(...args)

        this.displayObject.anchor.set(0.5)
        this.displayObject.alpha = 0

        this.phase = 0
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
            this.displayObject.position.y -= Math.sin(this.phase) * 2
            this.phase = (this.phase + delta * Math.PI) % (2 * Math.PI)
            this.displayObject.position.y += Math.sin(this.phase) * 2

            return
        }

        const step = this.movement.normalize().multiplyScalar(
            Math.min(delta * 250, this.movement.magnitude())
        )

        this.displayObject.position.add(step, this.displayObject.position)
        this.movement.subtract(step, this.movement)

        if (this.movement.x === 0 && this.movement.y === 0) {
            if (this.object !== null) {
                this.object.fishes.add(this)

                if (this.object.displayObject.alpha < 1) {
                    this.displayObject.animationSpeed = 6 / 60

                    return
                }
            }

            this.displayObject.gotoAndStop(0)
        } else {
            this.displayObject.play()
            this.displayObject.animationSpeed = this.animationSpeed
        }
    }
}

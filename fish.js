import Selectable from './selectable.js'

export default class Fish extends Selectable {
    constructor(...args) {
        super(...args)

        this.movement = new PIXI.Point()
        this.resource = null
    }

    setMarqueed(value) {
        this.marqueed = value

        this.updateRing()
    }

    update(delta) {
        if (this.movement.x === 0 && this.movement.y === 0) return

        const step = this.movement.normalize().multiplyScalar(
            Math.min(delta * 250, this.movement.magnitude())
        )

        this.displayObject.position.add(step, this.displayObject.position)
        this.movement.subtract(step, this.movement)

        if (this.movement.x === 0 && this.movement.y === 0 && this.resource !== null) {
            this.resource.gatherers++
        }
    }
}

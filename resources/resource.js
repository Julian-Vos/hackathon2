import { add } from '../resources.js'
import Selectable from '../selectable.js'

export default class Resource extends Selectable {
    constructor(...args) {
        super(...args)

        this.displayObject.anchor.set(0.5, 1)

        this.fishes = new Set()
        this.unitsLeft = 10
    }

    update(delta) {
        const unitsGathered = Math.min(this.fishes.size * delta * 0.2, this.unitsLeft)

        add({ [this.constructor.name]: unitsGathered })

        return (this.unitsLeft -= unitsGathered) > 0
    }
}

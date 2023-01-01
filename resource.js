import { add } from '/resources.js'
import Selectable from './selectable.js'

export default class Resource extends Selectable {
    constructor(...args) {
        super(...args)

        this.displayObject.anchor.set(0.5, 1)

        this.gatherers = 0
        this.unitsLeft = 10
    }

    update(delta) {
        const unitsGathered = Math.min(this.gatherers * delta * 0.2, this.unitsLeft)

        add({ [this.constructor.name]: unitsGathered })

        return (this.unitsLeft -= unitsGathered) > 0
    }
}

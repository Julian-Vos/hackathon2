import Selectable from '../selectable.js'
import { addResources, removeSelected, setSelectedDescription } from '../ui.js'

export default class Resource extends Selectable {
    constructor(...args) {
        super(...args)

        this.displayObject.anchor.set(0.5, 1)

        this.fishes = new Set()
        this.units = 10

        this.description = () => `${this.constructor.name} (${Math.ceil(this.units)}/10)`
    }

    update(delta) {
        const previousUnits = this.units

        this.units = Math.max(this.units - this.fishes.size * delta * 0.2, 0)

        const ceiledUnits = Math.ceil(this.units)

        if (ceiledUnits < previousUnits) {
            addResources({ [this.constructor.name]: Math.ceil(previousUnits) - ceiledUnits })

            if (this.selected) {
                if (this.units > 0) {
                    setSelectedDescription(this.portrait)
                } else {
                    removeSelected(this.portrait)
                }
            }
        }

        return this.units > 0
    }
}

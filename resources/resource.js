import Selectable from '../selectable.js'
import { addResources, removeSelected, setSelectedDescription } from '../ui.js'

export default class Resource extends Selectable {
    constructor(maxUnits, ...args) {
        super(...args, 1)

        this.units = maxUnits
        this.fishes = new Set()

        this.description = () => `${this.constructor.name} (${Math.ceil(this.units)}/${maxUnits})`
    }

    update(delta) {
        const previousUnits = this.units

        this.units = Math.max(this.units - this.fishes.size * delta * 0.2, 0)

        const ceiledUnits = Math.ceil(this.units)

        if (ceiledUnits < previousUnits) {
            addResources({ [this.constructor.name]: Math.ceil(previousUnits) - ceiledUnits })

            if (ceiledUnits === 0) {
                for (const fish of this.fishes) {
                    fish.displayObject.gotoAndStop(0)
                    fish.object = null
                }

                if (this.selected) {
                    removeSelected(this.portrait)
                }

                return false
            } else if (this.selected) {
                setSelectedDescription(this.portrait)
            }
        }

        return true
    }
}

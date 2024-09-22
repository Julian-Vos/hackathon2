import Building from './building.js'
import { removeResources } from '../ui.js'

export default class Restaurant extends Building {
    static columns = 4
    static rows = 2
    static limit = 5

    constructor(...args) {
        super('serves plankton to fish to double their speed', ['structures/feedingspot'], ...args)

        this.units = 0
    }

    update(delta) {
        if (this.displayObject.alpha < 1) {
            return super.update(delta)
        }

        this.units += Math.min(this.fishes.size, this.constructor.limit) * delta * 0.4

        const flooredUnits = Math.floor(this.units)

        if (flooredUnits > 0) {
            if (removeResources({ Plankton: flooredUnits })) {
                const share = flooredUnits / this.fishes.size

                for (const fish of this.fishes) {
                    fish.food += share
                }
            }

            this.units -= flooredUnits
        }

        return true
    }
}

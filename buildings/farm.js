import Building from './building.js'
import { addResources } from '../ui.js'

export default class Farm extends Building {
    static columns = 3
    static rows = 2.5
    static limit = 5

    constructor(...args) {
        super('infinite supply of seaweed and coral', ['structures/weedfarm'], ...args)

        this.units = 0
    }

    update(delta) {
        if (this.displayObject.alpha < 1) {
            return super.update(delta)
        }

        this.units += Math.min(this.fishes.size, this.constructor.limit) * delta * 0.1

        const flooredUnits = Math.floor(this.units)

        if (flooredUnits > 0) {
            addResources({ Seaweed: flooredUnits, Coral: flooredUnits})

            this.units -= flooredUnits
        }

        return true
    }
}

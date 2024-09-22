import Building from './building.js'
import { addResources } from '../ui.js'

export default class Pit extends Building {
    static columns = 3.5
    static rows = 2
    static limit = 5

    constructor(...args) {
        super('infinite supply of rocks and shells', ['structures/stoneshellfarm'], ...args)

        this.units = 0
    }

    update(delta) {
        if (this.displayObject.alpha < 1) {
            return super.update(delta)
        }

        this.units += Math.min(this.fishes.size, this.constructor.limit) * delta * 0.1

        const flooredUnits = Math.floor(this.units)

        if (flooredUnits > 0) {
            addResources({ Rocks: flooredUnits, Shells: flooredUnits})

            this.units -= flooredUnits
        }

        return true
    }
}

import Building from './building.js'

export default class Farm extends Building {
    constructor(...args) {
        super(['structures/weedfarm'], ...args)

        this.gridWidth = 3
        this.gridHeight = 2.5
    }
}

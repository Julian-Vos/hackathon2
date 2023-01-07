import Building from './building.js'

export default class Mansion extends Building {
    constructor(...args) {
        super(['structures/bighouse'], ...args)

        this.gridWidth = 3.5
        this.gridHeight = 2
    }
}

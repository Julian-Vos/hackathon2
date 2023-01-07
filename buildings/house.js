import Building from './building.js'

export default class House extends Building {
    constructor(...args) {
        super(['structures/smallhouse'], ...args)

        this.gridWidth = 1.5
        this.gridHeight = 1
    }
}

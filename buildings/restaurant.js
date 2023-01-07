import Building from './building.js'

export default class Restaurant extends Building {
    constructor(...args) {
        super(['structures/feedingspot'], ...args)

        this.gridWidth = 4
        this.gridHeight = 2
    }
}

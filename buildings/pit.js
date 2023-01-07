import Building from './building.js'

export default class Pit extends Building {
    constructor(...args) {
        super(['structures/stoneshellfarm'], ...args)

        this.gridWidth = 3.5
        this.gridHeight = 2
    }
}

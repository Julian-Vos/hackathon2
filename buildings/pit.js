import Building from './building.js'

export default class Pit extends Building {
    static columns = 3.5
    static rows = 2

    constructor(...args) {
        super('infinite supply of rocks and shells', ['structures/stoneshellfarm'], ...args)
    }
}

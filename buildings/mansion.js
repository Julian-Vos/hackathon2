import Building from './building.js'

export default class Mansion extends Building {
    static columns = 3.5
    static rows = 2

    constructor(...args) {
        super('houses one angler', ['structures/bighouse'], ...args)
    }
}

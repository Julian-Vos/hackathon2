import Building from './building.js'

export default class House extends Building {
    static columns = 1.5
    static rows = 1

    constructor(...args) {
        super('houses two gatherers and one builder', ['structures/smallhouse'], ...args)
    }
}

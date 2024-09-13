import Building from './building.js'

export default class Farm extends Building {
    static columns = 3
    static rows = 2.5

    constructor(...args) {
        super('infinite supply of seaweed and coral', ['structures/weedfarm'], ...args)
    }
}

import Building from './building.js'

export default class Restaurant extends Building {
    static columns = 4
    static rows = 2

    constructor(...args) {
        super('serves plankton to fish to increase their speed', ['structures/feedingspot'], ...args)
    }
}

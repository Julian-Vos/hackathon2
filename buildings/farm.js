import Building from './building.js'

export default class Farm extends Building {
    constructor(...args) {
        super(['structures/weedfarm'], ...args)
    }
}

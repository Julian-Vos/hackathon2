import Building from './building.js'

export default class Mansion extends Building {
    constructor(...args) {
        super(['structures/mansion'], ...args)
    }
}

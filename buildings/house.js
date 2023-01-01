import Building from './building.js'

export default class House extends Building {
    constructor(...args) {
        super(['structures/smallhouse'], ...args)
    }
}

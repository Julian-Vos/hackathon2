import Building from './building.js'

export default class Pit extends Building {
    constructor(...args) {
        super(['structures/stoneshellfarm'], ...args)
    }
}

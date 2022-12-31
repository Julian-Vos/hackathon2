import Fish from './fish.js'

export default class Builder extends Fish {
    constructor(...args) {
        super('fishgameyellowfish', ...args)
    }
}

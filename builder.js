import Fish from './fish.js'

export default class Builder extends Fish {
    constructor(...args) {
        super([
            'fishies/yellow1',
            'fishies/yellow2',
            'fishies/yellow3',
            'fishies/yellow2',
            'fishies/yellow1'
        ], ...args)

        this.displayObject.animationSpeed = 24 / 60
    }
}

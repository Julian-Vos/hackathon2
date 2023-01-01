import Fish from './fish.js'

export default class Gatherer extends Fish {
    constructor(...args) {
        super([
            'fishies/blue1',
            'fishies/blue2',
            'fishies/blue3',
            'fishies/blue2',
            'fishies/blue1'
        ], ...args)

        this.displayObject.animationSpeed = 6 / 60
    }
}

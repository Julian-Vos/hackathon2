import Fish from './fish.js'

export default class Angler extends Fish {
    constructor(...args) {
        super([
            'fishies/angler1',
            'fishies/angler2',
            'fishies/angler3',
            'fishies/angler2',
            'fishies/angler1'
        ], ...args)

        this.displayObject.animationSpeed = 6 / 60
    }
}

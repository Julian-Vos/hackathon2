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

        this.animationSpeed = 6 / 60

        this.description = (count) => `Angler (${count}): lures new plankton to the city when fully gathered`
    }
}

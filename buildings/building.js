import Selectable from '../selectable.js'

export default class Building extends Selectable {
    constructor(...args) {
        super(...args)

        this.displayObject.anchor.set(0.5, 1)
    }

    update() {
        return true
    }
}

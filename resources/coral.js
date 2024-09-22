import Resource from './resource.js'

let variant = 0

export default class Coral extends Resource {
    constructor(...args) {
        super(10, [`items/coral${++variant}`], ...args)
    }
}

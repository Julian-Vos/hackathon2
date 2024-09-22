import Resource from './resource.js'

let variant = 0

export default class Rocks extends Resource {
    constructor(...args) {
        super(50, [`items/stone${++variant}`], ...args)
    }
}

import Resource from './resource.js'

export default class Plankton extends Resource {
    constructor(...args) {
        super(500, ['items/plankton'], ...args)
    }
}

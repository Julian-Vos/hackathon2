import Resource from './resource.js'

export default class Seaweed extends Resource {
    constructor(...args) {
        super(100, ['items/weed'], ...args)
    }
}

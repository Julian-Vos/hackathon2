import Resource from './resource.js'

export default class Shells extends Resource {
    constructor(...args) {
        super(50, ['items/shell'], ...args)
    }
}

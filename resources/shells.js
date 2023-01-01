import Resource from './resource.js'

export default class Shells extends Resource {
    constructor(...args) {
        super(['items/shell'], ...args)
    }
}

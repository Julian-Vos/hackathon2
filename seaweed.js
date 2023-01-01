import Resource from './resource.js'

export default class Seaweed extends Resource {
    constructor(...args) {
        super(['items/weed'], ...args)
    }
}

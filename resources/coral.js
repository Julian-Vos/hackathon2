import Resource from './resource.js'

export default class Coral extends Resource {
    constructor(...args) {
        super([`items/coral${1 + Math.floor(Math.random() * 3)}`], ...args)
    }
}

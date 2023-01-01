import Resource from './resource.js'

export default class Rocks extends Resource {
    constructor(...args) {
        super([`items/stone${1 + Math.floor(Math.random() * 2)}`], ...args)
    }
}

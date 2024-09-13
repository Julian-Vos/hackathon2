import Selectable from '../selectable.js'
import { setSelectedDescription } from '../ui.js'

const grid = Array.from({ length: 45 }, () => Array(15).fill(false))

export default class Building extends Selectable {
    constructor(descriptionSuffix, ...args) {
        super(...args)

        this.displayObject.anchor.set(0.5)

        this.fishes = new Set()

        this.description = () => {
            return this.displayObject.alpha < 1
                ? `${this.constructor.name} (under construction): ${descriptionSuffix}`
                : `${this.constructor.name}: ${descriptionSuffix}`
        }
    }

    moveToward(mouse) {
        this.column = Math.floor((mouse.x - 608) / 64) + this.constructor.columns % 1
        this.row = Math.floor((mouse.y - 1063) / 64) + this.constructor.rows % 1

        this.displayObject.position.set(608 + this.column * 64, 1063 + this.row * 64)
        this.displayObject.zIndex = this.displayObject.y + (1 - 0.5) * this.displayObject.height

        for (let c = this.column - this.constructor.columns; c < this.column + this.constructor.columns; c++) {
            for (let r = this.row - this.constructor.rows; r < this.row + this.constructor.rows; r++) {
                if (c < 0 || r < 0 || c >= 45 || r >= 15 || grid[c][r]) {
                    this.setValid(false)

                    return
                }
            }
        }

        this.setValid(true)
    }

    setValid(value) {
        this.valid = value

        this.displayObject.tint = this.valid ? 0xffffff : 0xff0000
    }

    updateGrid() {
        for (let c = this.column - this.constructor.columns; c < this.column + this.constructor.columns; c++) {
            for (let r = this.row - this.constructor.rows; r < this.row + this.constructor.rows; r++) {
                grid[c][r] = true
            }
        }
    }

    update(delta) {
        if (this.displayObject.alpha < 1) {
            this.displayObject.alpha += this.fishes.size * delta * 0.05

            if (this.displayObject.alpha >= 1) {
                this.displayObject.alpha = 1

                for (const fish of this.fishes) {
                    fish.displayObject.gotoAndStop(0)

                    fish.object = null
                }

                this.fishes.clear()

                this.builtCallback?.()

                if (this.selected) {
                    setSelectedDescription(this.portrait)
                }
            }

            this.ring.alpha = 1 / this.displayObject.alpha
        }

        return true
    }
}

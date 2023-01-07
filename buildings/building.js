import Selectable from '../selectable.js'

const grid = Array.from({ length: 45 }, () => Array(15).fill(false))

export default class Building extends Selectable {
    constructor(...args) {
        super(...args)

        this.displayObject.anchor.set(0.5)
    }

    moveToward(mouse) {
        this.gridX = Math.floor((mouse.x - 608) / 64) + this.gridWidth % 1
        this.gridY = Math.floor((mouse.y - 1063) / 64) + this.gridHeight % 1

        this.displayObject.position.set(608 + this.gridX * 64, 1063 + this.gridY * 64)
        this.displayObject.zIndex = this.displayObject.y + (1 - 0.5) * this.displayObject.height

        for (let c = this.gridX - this.gridWidth; c < this.gridX + this.gridWidth; c++) {
            for (let r = this.gridY - this.gridHeight; r < this.gridY + this.gridHeight; r++) {
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
        for (let c = this.gridX - this.gridWidth; c < this.gridX + this.gridWidth; c++) {
            for (let r = this.gridY - this.gridHeight; r < this.gridY + this.gridHeight; r++) {
                grid[c][r] = true
            }
        }
    }

    update() {
        return true
    }
}

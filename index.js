import Builder from './builder.js'
import Gatherer from './gatherer.js'

const app = new PIXI.Application({
    autoDensity: true,
    resizeTo: window,
    resolution: devicePixelRatio,
})

app.view.style.display = 'block'

app.view.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

const background = PIXI.Sprite.from('images/fishgamebackground.jpg')

background.y = -500

app.stage.addChild(background)

const fishes = []

for (let i = 0; i < 3; i++) {
    const fish = new (i < 2 ? Gatherer : Builder)(60 + i * 120, 60 + i * 120)

    fish.displayObject.interactive = true
    fish.displayObject.cursor = 'pointer'

    app.stage.addChild(fish.displayObject)

    fishes.push(fish)
}

const selectionCenter = new PIXI.Point()
const marquee = new PIXI.Graphics()

app.stage.addChild(marquee)

document.body.appendChild(app.view)

document.addEventListener('mousedown', (event) => {
    switch (event.button) {
        case 0: {
            marquee.position.set(event.x, event.y)

            app.stage.interactiveChildren = false

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
            document.addEventListener('keydown', onKeyDown)
        } break
        case 2: {
            for (const fish of fishes) {
                if (fish.selected) {
                    fish.movement.set(event.x - selectionCenter.x, event.y - selectionCenter.y)
                    fish.displayObject.position.add(fish.movement, fish.displayObject.position) // temporary
                }
            }

            selectionCenter.set(event.x, event.y)
        }
    }
})

function onMouseMove(event) { // on marquee update, not just move
    if (event.button !== 0) return

    marquee.clear()
    marquee.lineStyle(3).drawRect(
        Math.min(0, event.x - marquee.x),
        Math.min(0, event.y - marquee.y),
        Math.abs(event.x - marquee.x),
        Math.abs(event.y - marquee.y)
    )

    for (const fish of fishes) {
        fish.setMarqueed(fish.displayObject.x - 50 < Math.max(event.x, marquee.x) &&
                         fish.displayObject.y - 50 < Math.max(event.y, marquee.y) &&
                         fish.displayObject.x + 50 > Math.min(marquee.x, event.x) &&
                         fish.displayObject.y + 50 > Math.min(marquee.y, event.y))
    }
}

function onMouseUp(event) {
    if (event.button !== 0) return

    if (event.x === marquee.position.x && event.y === marquee.position.y) {
        onMouseMove(event)
    }

    let selectionCount = 0

    selectionCenter.set()

    for (const fish of fishes) {
        fish.setSelected(fish.marqueed)
        fish.setMarqueed(false)

        if (!fish.selected) continue

        selectionCount++

        selectionCenter.add(fish.displayObject.position, selectionCenter)
    }

    selectionCenter.multiplyScalar(1 / selectionCount, selectionCenter)

    clearMarquee()
}

function clearMarquee() {
    marquee.clear()

    app.stage.interactiveChildren = true

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('keydown', onKeyDown)
}

function onKeyDown(event) {
    if (event.key !== 'Escape') return

    for (const fish of fishes) {
        fish.setMarqueed(false)
    }

    clearMarquee()
}

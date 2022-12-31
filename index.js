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

const marquee = new PIXI.Graphics()
let mouseX
let mouseY
let selectionCount

app.stage.addChild(marquee)

document.body.appendChild(app.view)

document.addEventListener('mousedown', (event) => {
    switch (event.button) {
        case 0: {
            mouseX = event.x
            mouseY = event.y

            marquee.position.set(mouseX, mouseY)

            app.stage.interactiveChildren = false

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
            document.addEventListener('keydown', onKeyDown)
        } break
        case 2: {
            let selectionIndex = 0

            for (const fish of fishes) {
                if (!fish.selected) continue

                const angle = 0.5 * Math.PI - 2 * Math.PI / selectionCount * selectionIndex++

                fish.movement.set(
                    event.x - fish.displayObject.x + Math.cos(angle) * (selectionCount - 1) * 30,
                    event.y - fish.displayObject.y + Math.sin(angle) * (selectionCount - 1) * 30
                )

                if (fish.movement.x !== 0) {
                    fish.displayObject.scale.x = Math.sign(fish.movement.x)
                }
            }
        }
    }
})

function onMouseMove(event) {
    mouseX = event.x
    mouseY = event.y
}

function updateMarquee() {
    marquee.clear()
    marquee.lineStyle(3).drawRect(
        Math.min(0, mouseX - marquee.x),
        Math.min(0, mouseY - marquee.y),
        Math.abs(mouseX - marquee.x),
        Math.abs(mouseY - marquee.y)
    )

    for (const fish of fishes) {
        fish.setMarqueed(Math.max(mouseX, marquee.x) > fish.displayObject.x - fish.displayObject.width / 2 &&
                         Math.max(mouseY, marquee.y) > fish.displayObject.y - fish.displayObject.height / 2 &&
                         Math.min(marquee.x, mouseX) < fish.displayObject.x + fish.displayObject.width / 2 &&
                         Math.min(marquee.y, mouseY) < fish.displayObject.y + fish.displayObject.height / 2)
    }
}

function onMouseUp(event) {
    if (event.button !== 0) return

    updateMarquee()

    selectionCount = 0

    for (const fish of fishes) {
        if (fish.marqueed) {
            selectionCount++
        }

        fish.setSelected(fish.marqueed)
        fish.setMarqueed(false)
    }

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

let previousTime = performance.now()

function gameLoop() {
    let currentTime = performance.now()
    let delta = (currentTime - previousTime) / 1000

    previousTime = currentTime

    for (const fish of fishes) {
        fish.update(delta)
    }

    if (!app.stage.interactiveChildren) {
        updateMarquee()
    }

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

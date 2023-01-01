import Builder from './builder.js'
import Gatherer from './gatherer.js'
import Seaweed from './seaweed.js'

const app = new PIXI.Application({ autoDensity: true, resizeTo: window, resolution: devicePixelRatio })

app.view.style.display = 'block'

app.view.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

const background = PIXI.Sprite.from('images/fishgamebackground.jpg')

app.stage.addChild(background)

const objects = new Set()
const objectContainer = new PIXI.Container()
let selectedObject = null

objectContainer.sortableChildren = true

for (let i = 0; i < 3; i++) {
    const object = new Seaweed(500 + i * 50, 120 - i * 10)

    object.displayObject.on('mousedown', (event) => {
        event.preventDefault()

        object.setSelected(true)

        for (const fish of fishes) {
            fish.setSelected(false)
        }

        selectedObject?.setSelected(false)
        selectedObject = object
    })

    object.displayObject.on('rightdown', (event) => {
        event.preventDefault()

        for (const fish of fishes) {
            if (!fish.selected || fish instanceof Gatherer) continue

            fish.setSelected(false)

            selectionCount--
        }

        onMouseDown({ button: 2, x: object.displayObject.x, y: object.displayObject.y })

        for (const fish of fishes) {
            if (fish.selected) {
                fish.resource = object
            }
        }
    })

    objects.add(object)
    objectContainer.addChild(object.displayObject)
}

app.stage.addChild(objectContainer)

const fishes = new Set()
const fishContainer = new PIXI.Container()

for (let i = 0; i < 3; i++) {
    const fish = new (i < 2 ? Gatherer : Builder)(60 + i * 120, 60 + i * 120)

    fishes.add(fish)
    fishContainer.addChild(fish.displayObject)
}

app.stage.addChild(fishContainer)

const marquee = new PIXI.Graphics()
let mousePosition = new PIXI.Point()
let selectionCount = 0

app.stage.addChild(marquee)

document.body.appendChild(app.view)

document.addEventListener('mousedown', onMouseDown)

function onMouseDown(event) {
    switch (event.button) {
        case 0: {
            mousePosition.set(event.x, event.y)
            mousePosition.subtract(app.stage.position, marquee.position)

            app.stage.interactiveChildren = false

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        } break
        case 2: {
            const mouse = new PIXI.Point(event.x, event.y).subtract(app.stage.position)
            let selectionIndex = 0

            for (const fish of fishes) {
                if (!fish.selected) continue

                if (fish.movement.x === 0 && fish.movement.y === 0 && fish.resource !== null) {
                    fish.resource.gatherers--
                }

                fish.resource = null

                const angle = 0.5 * Math.PI - 2 * Math.PI / selectionCount * selectionIndex++

                mouse.subtract(fish.displayObject.position).add(
                    new PIXI.Point(Math.cos(angle), Math.sin(angle)).multiplyScalar((selectionCount - 1) * 30),
                    fish.movement
                )

                if (fish.movement.x !== 0) {
                    fish.displayObject.scale.x = Math.sign(fish.movement.x)
                }
            }
        }
    }
}

function onMouseMove(event) {
    mousePosition.set(event.x, event.y)
}

function updateMarquee() {
    const mouse = mousePosition.subtract(app.stage.position)

    marquee.clear()
    marquee.lineStyle(3).drawRect(
        Math.min(0, mouse.x - marquee.x),
        Math.min(0, mouse.y - marquee.y),
        Math.abs(mouse.x - marquee.x),
        Math.abs(mouse.y - marquee.y)
    )

    for (const fish of fishes) {
        fish.setMarqueed(Math.max(mouse.x, marquee.x) > fish.displayObject.x - fish.displayObject.width / 2 &&
                         Math.max(mouse.y, marquee.y) > fish.displayObject.y - fish.displayObject.height / 2 &&
                         Math.min(marquee.x, mouse.x) < fish.displayObject.x + fish.displayObject.width / 2 &&
                         Math.min(marquee.y, mouse.y) < fish.displayObject.y + fish.displayObject.height / 2)
    }
}

function onMouseUp(event) {
    if (event.button !== 0) return

    updateMarquee()

    selectedObject?.setSelected(false)
    selectedObject = null

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
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (app.stage.interactiveChildren) return

        for (const fish of fishes) {
            fish.setMarqueed(false)
        }

        clearMarquee()
    } else if (keyboard.hasOwnProperty(event.key) && !event.repeat) {
        keyboard[event.key] = 1
    }
})

document.addEventListener('keyup', (event) => {
    if (keyboard.hasOwnProperty(event.key)) {
        keyboard[event.key] = 0
    }
})

let keyboard = { ArrowLeft: 0, ArrowUp: 0, ArrowRight: 0, ArrowDown: 0 }
let previousTime = performance.now()

function gameLoop() {
    let currentTime = performance.now()
    let delta = (currentTime - previousTime) / 1000

    previousTime = currentTime

    app.stage.x = Math.max(Math.min(
        app.stage.x - (keyboard.ArrowRight - keyboard.ArrowLeft) * delta * 250
    , 0), app.view.width / devicePixelRatio - background.width)
    app.stage.y = Math.max(Math.min(
        app.stage.y - (keyboard.ArrowDown - keyboard.ArrowUp) * delta * 250
    , 0), app.view.height / devicePixelRatio - background.height)

    for (const fish of fishes) {
        fish.update(delta)
    }

    for (const object of objects) {
        if (object.update(delta)) continue

        if (object === selectedObject) {
            selectedObject = null
        }

        objects.delete(object)
        objectContainer.removeChild(object.displayObject)
    }

    if (!app.stage.interactiveChildren) {
        updateMarquee()
    }

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

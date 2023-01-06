import Angler from './fishes/angler.js'
import Builder from './fishes/builder.js'
import Coral from './resources/coral.js'
import Farm from './buildings/farm.js'
import Gatherer from './fishes/gatherer.js'
import House from './buildings/house.js'
import Mansion from './buildings/mansion.js'
import Pit from './buildings/pit.js'
import Plankton from './resources/plankton.js'
import Resource from './resources/resource.js'
import Restaurant from './buildings/restaurant.js'
import Rocks from './resources/rocks.js'
import Seaweed from './resources/seaweed.js'
import Shells from './resources/shells.js'

const app = new PIXI.Application({
    autoDensity: true,
    resizeTo: window,
    resolution: devicePixelRatio,
    view: document.querySelector('canvas'),
})

app.view.style.display = 'block'

app.view.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

app.view.previousElementSibling.addEventListener('mousedown', (event) => {
    event.currentTarget.remove()

    const music = new Audio(`audio/hackathon2_final.mp3`)

    music.loop = true
    music.play()

    previousTime = performance.now()

    requestAnimationFrame(gameLoop)

    app.stage.visible = true
}, { once: true })

app.stage.visible = false

const zoom = 4 / 3

app.stage.scale.set(1 / zoom)
app.stage.x = app.view.width / app.renderer.resolution / 2 - 2048 / zoom
app.stage.y = app.view.height / app.renderer.resolution / 2 - (1383 - 185 / 2) / zoom
app.stage.addChild(PIXI.Sprite.from('images/background.jpg'))

const objectContainer = new PIXI.Container()
const objects = new Set()
let selectedObject = null

objectContainer.sortableChildren = true

function createObject(constructor, x, y) {
    const object = new constructor(x, y)

    object.displayObject.on('mousedown', (event) => {
        event.preventDefault()

        for (const fish of fishes) {
            fish.setSelected(false)
        }

        selectedObject?.setSelected(false)
        selectedObject = object

        object.setSelected(true)
    })

    if (object instanceof Resource) {
        object.displayObject.on('rightdown', (event) => {
            event.preventDefault()

            for (const fish of fishes) {
                if (!fish.selected || fish instanceof Gatherer) continue

                fish.wasSelected = true
                fish.selected = false

                selectionCount--
            }

            onMouseDown({
                button: 2,
                x: (app.stage.x + object.displayObject.x / zoom),
                y: (app.stage.y + (object.displayObject.y - object.displayObject.height / 2) / zoom),
            })

            for (const fish of fishes) {
                if (fish.selected) {
                    fish.resource = object

                    fish.wasSelected = true
                    fish.selected = false

                    selectionCount--
                } else if (fish.wasSelected) {
                    delete fish.wasSelected

                    fish.selected = true

                    selectionCount++
                }
            }

            onMouseDown({ button: 2, x: event.x, y: event.y })

            for (const fish of fishes) {
                if (!fish.wasSelected) continue

                delete fish.wasSelected

                fish.selected = true

                selectionCount++
            }
        })
    } else if (constructor === House) {
        for (let i = 0; i < 3; i++) {
            const angle = 0.5 * Math.PI - 2 * Math.PI / 3 * i

            const fish = new (i === 0 ? Builder : Gatherer)(
                x + Math.cos(angle) * (3 - 1) * 50,
                y + Math.sin(angle) * (3 - 1) * 50 - 92.5
            )

            fish.displayObject.scale.set(zoom)

            fishContainer.addChild(fish.displayObject)
            fishes.add(fish)
        }
    }

    objectContainer.addChild(object.displayObject)
    objects.add(object)
}

app.stage.addChild(objectContainer)

const fishContainer = new PIXI.Container()
const fishes = new Set()

app.stage.addChild(fishContainer)
app.stage.addChild(PIXI.Sprite.from('images/backgroundedges.png'))

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
            mousePosition.subtract(app.stage.position).multiplyScalar(zoom, marquee.position)

            app.stage.interactiveChildren = false

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        } break
        case 2: {
            const mouse = new PIXI.Point(event.x, event.y).subtract(app.stage.position).multiplyScalar(zoom)
            let selectionIndex = 0

            for (const fish of fishes) {
                if (!fish.selected) continue

                if (fish.movement.x === 0 && fish.movement.y === 0 && fish.resource !== null) {
                    fish.resource.gatherers--
                }

                fish.resource = null

                const angle = 0.5 * Math.PI - 2 * Math.PI / selectionCount * selectionIndex++

                mouse.subtract(fish.displayObject.position).add(
                    new PIXI.Point(Math.cos(angle), Math.sin(angle)).multiplyScalar((selectionCount - 1) * 50),
                    fish.movement
                )

                if (fish.movement.x !== 0) {
                    fish.displayObject.scale.x = Math.sign(fish.movement.x) * zoom
                }
            }
        }
    }
}

function onMouseMove(event) {
    mousePosition.set(event.x, event.y)
}

function updateMarquee() {
    const mouse = mousePosition.subtract(app.stage.position).multiplyScalar(zoom)

    marquee.clear()
    marquee.lineStyle(3, 0xffffff, 0.75).drawRect(
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

let keyboard = { ArrowUp: 0, ArrowLeft: 0, ArrowDown: 0, ArrowRight: 0, w: 0, a: 0, s: 0, d: 0 }
let previousTime

function gameLoop() {
    let currentTime = performance.now()
    let delta = (currentTime - previousTime) / 1000

    previousTime = currentTime

    app.stage.x = Math.max(Math.min(
        app.stage.x - ((keyboard.ArrowRight || keyboard.d) - (keyboard.ArrowLeft || keyboard.a)) * delta * 250
    , 0), app.view.width / app.renderer.resolution - 4096 / zoom)
    app.stage.y = Math.max(Math.min(
        app.stage.y - ((keyboard.ArrowDown || keyboard.s) - (keyboard.ArrowUp || keyboard.w)) * delta * 250
    , 0), app.view.height / app.renderer.resolution - 2048 / zoom)

    for (const fish of fishes) {
        fish.update(delta)
    }

    for (const object of objects) {
        if (object.update(delta)) continue

        if (object === selectedObject) {
            selectedObject = null
        }

        objectContainer.removeChild(object.displayObject)
        objects.delete(object)
    }

    if (!app.stage.interactiveChildren) {
        updateMarquee()
    }

    requestAnimationFrame(gameLoop)
}

createObject(House, 2048, 1383)

for (let i = 0; i < 5; i++) {
    createObject(
        [Plankton, Seaweed, Rocks, Shells, Coral][i],
        736 + Math.floor(Math.random() * 2624),
        i === 0 ? 900 : (1159 + Math.floor(Math.random() * 832))
    )
}

import Farm from './buildings/farm.js'
import House from './buildings/house.js'
import Mansion from './buildings/mansion.js'
import Pit from './buildings/pit.js'
import Restaurant from './buildings/restaurant.js'
import Angler from './fishes/angler.js'
import Builder from './fishes/builder.js'
import Gatherer from './fishes/gatherer.js'
import Coral from './resources/coral.js'
import Plankton from './resources/plankton.js'
import Resource from './resources/resource.js'
import Rocks from './resources/rocks.js'
import Seaweed from './resources/seaweed.js'
import Shells from './resources/shells.js'
import { setBuildCallback } from './ui.js'

await PIXI.Assets.load([
    'images/background/background.jpg',
    'images/background/backgroundedges.png',
    'images/background/beam1.png',
    'images/background/beam2.png',
    'images/background/beam3.png',
    'images/fishies/angler1.png',
    'images/fishies/angler2.png',
    'images/fishies/angler3.png',
    'images/fishies/blue1.png',
    'images/fishies/blue2.png',
    'images/fishies/blue3.png',
    'images/fishies/yellow1.png',
    'images/fishies/yellow2.png',
    'images/fishies/yellow3.png',
    'images/items/coral1.png',
    'images/items/coral2.png',
    'images/items/coral3.png',
    'images/items/plankton.png',
    'images/items/shell.png',
    'images/items/stone1.png',
    'images/items/stone2.png',
    'images/items/weed.png',
    'images/structures/bighouse.png',
    'images/structures/feedingspot.png',
    'images/structures/smallhouse.png',
    'images/structures/stoneshellfarm.png',
    'images/structures/weedfarm.png',
])

const music = new Audio('audio/hackathon2_final.mp3')
const app = new PIXI.Application()

await app.init({
    autoDensity: true,
    resizeTo: window,
    resolution: devicePixelRatio,
    view: document.getElementsByTagName('canvas')[0],
})

app.canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

app.canvas.previousElementSibling.textContent = 'Click to play!'

app.canvas.previousElementSibling.addEventListener('mousedown', (event) => {
    event.stopPropagation()

    event.currentTarget.remove()

    mousePosition.set(event.x, event.y)

    music.volume = 0.25
    music.loop = true
    music.play()

    previousTime = performance.now()

    requestAnimationFrame(gameLoop)
}, { once: true })

const zoom = 4 / 3
const beams = []
let beaming = 0

app.stage.scale.set(1 / zoom)
app.stage.x = app.canvas.width / app.renderer.resolution / 2 - 2048 / zoom
app.stage.y = app.canvas.height / app.renderer.resolution / 2 - 1127 / zoom
app.stage.addChild(PIXI.Sprite.from('images/background/background.jpg'))

for (let i = 0; i < 3; i++) {
    const beam = PIXI.Sprite.from(`images/background/beam${i + 1}.png`)

    beam.visible = false
    beams.push(beam)

    app.stage.addChild(beam)
}

const objectContainer = new PIXI.Container()
const objects = new Set()
let objectClicked = false
let selectedObject = null

objectContainer.sortableChildren = true

app.stage.addChild(objectContainer)

function createObject(constructor, x, y) {
    const object = new constructor(x, y)

    objectContainer.addChild(object.displayObject)

    return object
}

function initializeObject(object) {
    objects.add(object)

    object.displayObject.on('mousedown', () => {
        objectClicked = true

        for (const fish of fishes) {
            fish.setSelected(false)
        }

        selectedObject?.setSelected(false)
        selectedObject = object

        object.setSelected(true)
    })

    object.displayObject.on('rightdown', (event) => {
        let constructors

        if (object.displayObject.alpha < 1) {
            constructors = [Builder]
        } else if (object instanceof House || object instanceof Mansion) {
            return
        } else if (object instanceof Restaurant) {
            constructors = [Angler, Builder, Gatherer]
        } else {
            constructors = [Gatherer]
        }

        event.preventDefault()

        for (const fish of fishes) {
            if (constructors.includes(fish.constructor) || !fish.selected) continue

            fish.wasSelected = true
            fish.selected = false

            selectionCount--
        }

        const yOffset = (0.5 - object.displayObject.anchor.y) * object.displayObject.height

        onMouseDown({
            button: 2,
            x: app.stage.x + object.displayObject.x / zoom,
            y: app.stage.y + (object.displayObject.y + yOffset) / zoom,
        })

        for (const fish of fishes) {
            if (fish.selected) {
                fish.object = object

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

    if (object instanceof Resource) return

    object.updateGrid()

    if (object.constructor === House) {
        object.builtCallback = () => {
            for (let i = 0; i < 3; i++) {
                const angle = 0.5 * Math.PI - 2 * Math.PI / 3 * i
                const distance = Math.pow((3 - 1), 0.75) * 50

                const fish = new (i === 0 ? Builder : Gatherer)(
                    object.displayObject.x + Math.cos(angle) * distance,
                    object.displayObject.y + Math.sin(angle) * distance
                )

                fish.displayObject.scale.set(zoom)

                fishContainer.addChild(fish.displayObject)
                fishes.add(fish)
            }
        }
    } else if (object.constructor === Mansion) {
        object.builtCallback = () => {
            const fish = new Angler(object.displayObject.x, object.displayObject.y)

            fish.displayObject.scale.set(zoom)

            fishContainer.addChild(fish.displayObject)
            fishes.add(fish)

            planktonLurers++
        }
    }
}

const fishContainer = new PIXI.Container()
const fishes = new Set()

app.stage.addChild(fishContainer)
app.stage.addChild(PIXI.Sprite.from('images/background/backgroundedges.png'))

document.body.appendChild(app.canvas)

let mousePosition = new PIXI.Point()
let selectionCount = 0
let marquee = null
let placement = null

document.addEventListener('mousedown', onMouseDown)

function onMouseDown(event) {
    switch (event.button) {
        case 0: {
            if (placement === null) {
                if (marquee !== null) {
                    removeMarquee()
                }

                marquee = new PIXI.Graphics()

                mousePosition.subtract(app.stage.position).multiplyScalar(zoom, marquee.position)

                app.stage.addChild(marquee)
                app.stage.interactiveChildren = false

                document.addEventListener('mouseup', onMouseUp)
            } else if (placement.valid) {
                initializeObject(placement)

                placement.displayObject.alpha = 0.32

                delete placement.onCancel

                placement = null

                app.stage.interactiveChildren = true
            }
        } break
        case 2: {
            const mouse = new PIXI.Point(event.x, event.y).subtract(app.stage.position).multiplyScalar(zoom)
            let selectionIndex = 0

            for (const fish of fishes) {
                if (!fish.selected) continue

                if (fish.movement.x === 0 && fish.movement.y === 0 && fish.object !== null) {
                    fish.object.fishes.delete(fish)
                }

                fish.object = null

                const angle = 0.5 * Math.PI - 2 * Math.PI / selectionCount * selectionIndex++
                const distance = Math.pow((selectionCount - 1), 0.75) * 50

                new PIXI.Point(
                    Math.min(Math.max(mouse.x + Math.cos(angle) * distance, 0), 4096),
                    Math.min(Math.max(mouse.y + Math.sin(angle) * distance, 0), 2048)
                ).subtract(fish.displayObject.position, fish.movement)

                if (fish.movement.x !== 0) {
                    fish.displayObject.scale.x = Math.sign(fish.movement.x) * zoom
                }
            }
        }
    }
}

document.addEventListener('mousemove', (event) => {
    mousePosition.set(event.x, event.y)
})

function updateMarquee() {
    const mouse = mousePosition.subtract(app.stage.position).multiplyScalar(zoom)

    marquee.clear()
    marquee.rect(
        Math.min(0, mouse.x - marquee.x),
        Math.min(0, mouse.y - marquee.y),
        Math.abs(mouse.x - marquee.x),
        Math.abs(mouse.y - marquee.y)
    ).stroke({ width: 3, color: 0xffffff, alpha: 0.75 })

    for (const fish of fishes) {
        fish.setMarqueed(Math.max(mouse.x, marquee.x) > fish.displayObject.x - fish.displayObject.width / 2 &&
                         Math.max(mouse.y, marquee.y) > fish.displayObject.y - fish.displayObject.height / 2 &&
                         Math.min(marquee.x, mouse.x) < fish.displayObject.x + fish.displayObject.width / 2 &&
                         Math.min(marquee.y, mouse.y) < fish.displayObject.y + fish.displayObject.height / 2)
    }
}

function updatePlacement() {
    placement.moveToward(mousePosition.subtract(app.stage.position).multiplyScalar(zoom))
}

function onMouseUp(event) {
    if (event.button !== 0) return

    selectionCount = 0

    for (const fish of fishes) {
        fish.setSelected(fish.marqueed)
        fish.setMarqueed(false)

        if (fish.selected) {
            selectionCount++
        }
    }

    if (selectionCount > 0 || !objectClicked) {
        selectedObject?.setSelected(false)
        selectedObject = null
    }

    objectClicked = false

    removeMarquee()
}

function removeMarquee() {
    marquee.removeFromParent()
    marquee = null

    app.stage.interactiveChildren = true

    document.removeEventListener('mouseup', onMouseUp)
}

function removePlacement() {
    placement.onCancel()
    placement.displayObject.removeFromParent()
    placement = null

    app.stage.interactiveChildren = true
}

setBuildCallback((index, onCancel) => {
    if (placement !== null) {
        removePlacement()
    }

    placement = createObject([House, Mansion, Farm, Pit, Restaurant][index])
    placement.onCancel = onCancel

    app.stage.interactiveChildren = false
})

document.addEventListener('keydown', (event) => {
    if (event.repeat) return

    if (event.key === 'Escape') {
        if (marquee !== null) {
            for (const fish of fishes) {
                fish.setMarqueed(false)
            }

            removeMarquee()
        } else if (placement !== null) {
            removePlacement()
        }
    } else if (event.key === 'f') {
        if (document.fullscreenElement === null) {
            document.documentElement.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    } else if (event.key === 'b') {
        for (const beam of beams) {
            beam.visible = !beam.visible
        }
    } else if (event.key === 'm') {
        music.volume = 0.25 - music.volume
    } else if (keyboard.hasOwnProperty(event.key)) {
        keyboard[event.key] = 1 / zoom
    }
})

document.addEventListener('keyup', (event) => {
    if (keyboard.hasOwnProperty(event.key)) {
        keyboard[event.key] = 0
    }
})

let keyboard = { ArrowUp: 0, ArrowLeft: 0, ArrowDown: 0, ArrowRight: 0, w: 0, a: 0, s: 0, d: 0 }
let planktonLurers = 0
let planktonLuring = 0
let previousTime

function gameLoop() {
    let currentTime = performance.now()
    let delta = (currentTime - previousTime) / 1000

    previousTime = currentTime

    app.stage.x = Math.max(Math.min(
        app.stage.x - ((keyboard.ArrowRight || keyboard.d) - (keyboard.ArrowLeft || keyboard.a)) * delta * 400
    , 0), app.canvas.width / app.renderer.resolution - 4096 / zoom)
    app.stage.y = Math.max(Math.min(
        app.stage.y - ((keyboard.ArrowDown || keyboard.s) - (keyboard.ArrowUp || keyboard.w)) * delta * 400
    , 0), app.canvas.height / app.renderer.resolution - 2048 / zoom)

    beaming = (beaming + delta * 0.2) % 1

    beams[0].alpha = 1 - Math.abs(beaming - 1 / 3) * 3
    beams[1].alpha = 1 - Math.abs(beaming - 2 / 3) * 3
    beams[2].alpha = 1 - Math.abs(beaming - Math.round(beaming)) * 3

    for (const fish of fishes) {
        fish.update(delta)
    }

    for (const object of objects) {
        if (object.update(delta)) continue

        if (object === selectedObject) {
            selectedObject = null
        }

        object.displayObject.removeFromParent()
        objects.delete(object)

        if (object instanceof Plankton) {
            planktonLuring = 1
        }
    }

    if (planktonLuring > 0) {
        planktonLuring -= planktonLurers * delta * 0.01

        if (planktonLuring <= 0) {
            let anglerSumX = 0

            for (const fish of fishes) {
                if (fish instanceof Angler) {
                    anglerSumX += fish.displayObject.x
                }
            }

            const planktonX = Math.min(Math.max(anglerSumX / planktonLurers, 736), 736 + 2624)

            initializeObject(createObject(Plankton, planktonX, 950))
        }
    }

    if (marquee !== null) {
        updateMarquee()
    } else if (placement !== null) {
        updatePlacement()
    }

    requestAnimationFrame(gameLoop)
}

for (let i = 0; i < 8; i++) {
    initializeObject(createObject(
        [Seaweed, Coral, Coral, Coral, Rocks, Rocks, Shells, Plankton][i],
        736 + Math.floor(Math.random() * 2624),
        i < 7 ? (1191 + Math.floor(Math.random() * 832)) : 950
    ))
}

const initialHouse = createObject(House, 2048, 1127)

initialHouse.moveToward(new PIXI.Point(2048, 1127))

initializeObject(initialHouse)

initialHouse.builtCallback()

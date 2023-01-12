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
    view: document.getElementsByTagName('canvas')[0],
})

app.view.style.display = 'block'

app.view.addEventListener('contextmenu', (event) => {
    event.preventDefault()
})

app.view.previousElementSibling.addEventListener('mousedown', (event) => {
    event.stopPropagation()
    event.currentTarget.remove()

    mousePosition.set(event.x, event.y)

    const music = new Audio('audio/hackathon2_final.mp3')

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
app.stage.y = app.view.height / app.renderer.resolution / 2 - 1383 / zoom
app.stage.addChild(PIXI.Sprite.from('images/background.jpg'))

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
        let constructor

        if (object instanceof Resource) {
            constructor = Gatherer
        } else if (object.displayObject.alpha < 1) {
            constructor = Builder
        } else {
            return
        }

        event.preventDefault()

        for (const fish of fishes) {
            if (!fish.selected || fish.constructor === constructor) continue

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
        }
    }
}

const fishContainer = new PIXI.Container()
const fishes = new Set()

app.stage.addChild(fishContainer)
app.stage.addChild(PIXI.Sprite.from('images/backgroundedges.png'))

document.body.appendChild(app.view)

let mousePosition = new PIXI.Point()
let selectionCount = 0
let marquee = null
let placement = null

document.addEventListener('mousedown', onMouseDown)

function onMouseDown(event) {
    switch (event.button) {
        case 0: {
            if (placement === null) {
                marquee = new PIXI.Graphics()

                mousePosition.subtract(app.stage.position).multiplyScalar(zoom, marquee.position)

                app.stage.addChild(marquee)
                app.stage.interactiveChildren = false

                document.addEventListener('mouseup', onMouseUp)
            } else {
                if (placement.valid) {
                    initializeObject(placement)

                    placement.ring.alpha = 3.125
                    placement.displayObject.alpha = 0.32
                } else {
                    placement.displayObject.removeFromParent()
                }

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
    placement.displayObject.removeFromParent()
    placement = null

    app.stage.interactiveChildren = true
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (marquee !== null) {
            for (const fish of fishes) {
                fish.setMarqueed(false)
            }

            removeMarquee()
        } else if (placement !== null) {
            removePlacement()
        }
    } else if (keyboard.hasOwnProperty(event.key) && !event.repeat) {
        keyboard[event.key] = 1 / zoom
    } else if (event.key >= '1' && event.key <= '5' && marquee === null) { // TEMPORARY
        if (placement !== null) {
            removePlacement()
        }

        placement = createObject([House, Mansion, Restaurant, Farm, Pit][event.key - 1])

        app.stage.interactiveChildren = false
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

        object.displayObject.removeFromParent()
        objects.delete(object)
    }

    if (marquee !== null) {
        updateMarquee()
    } else if (placement !== null) {
        updatePlacement()
    }

    requestAnimationFrame(gameLoop)
}

for (let i = 0; i < 5; i++) {
    initializeObject(createObject(
        [Plankton, Seaweed, Rocks, Shells, Coral][i],
        736 + Math.floor(Math.random() * 2624),
        i === 0 ? 950 : (1191 + Math.floor(Math.random() * 832))
    ))
}

const initialHouse = createObject(House, 2048, 1383)

initialHouse.moveToward(new PIXI.Point(2048, 1383))

initializeObject(initialHouse)

initialHouse.builtCallback()

const app = new PIXI.Application({
    autoDensity: true,
    backgroundColor: 0xd4f1f9,
    resizeTo: window,
    resolution: devicePixelRatio,
})

app.view.style.display = 'block'

document.body.appendChild(app.view)

const objects = []

for (let i = 0; i < 4; i++) {
    const fish = new Fish(60 + i * 120, 60 + i * 120)

    fish.displayObject.interactive = true
    fish.displayObject.cursor = 'pointer'

    app.stage.addChild(fish.displayObject)

    objects.push(fish)
}

const marquee = new PIXI.Graphics()

app.stage.addChild(marquee)

document.addEventListener('mousedown', (event) => {
    marquee.position.x = event.x
    marquee.position.y = event.y

    app.stage.interactiveChildren = false

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('keydown', onKeyDown)
})

function onMouseMove(event) {
    marquee.clear()
    marquee.lineStyle(3).drawRect(
        Math.min(0, event.x - marquee.x),
        Math.min(0, event.y - marquee.y),
        Math.abs(event.x - marquee.x),
        Math.abs(event.y - marquee.y)
    )

    for (const object of objects) {
        object.setMarqueed(object.displayObject.x - 50 < Math.max(event.x, marquee.x) &&
                           object.displayObject.y - 50 < Math.max(event.y, marquee.y) &&
                           object.displayObject.x + 50 > Math.min(marquee.x, event.x) &&
                           object.displayObject.y + 50 > Math.min(marquee.y, event.y))
    }
}

function onMouseUp(event) {
    if (event.x === marquee.position.x && event.y === marquee.position.y) {
        onMouseMove(event)
    }

    for (const object of objects) {
        object.setSelected(object.marqueed)
        object.setMarqueed(false)
    }

    hideMarquee()
}

function hideMarquee() {
    marquee.clear()

    app.stage.interactiveChildren = true

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('keydown', onKeyDown)
}

function onKeyDown(event) {
    if (event.key === 'Escape') {
        for (const object of objects) {
            object.setMarqueed(false)
        }

        hideMarquee()
    }
}

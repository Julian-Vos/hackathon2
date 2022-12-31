const app = new PIXI.Application({
    autoDensity: true,
    resizeTo: window,
    resolution: devicePixelRatio,
    useContextAlpha: false,
})

app.view.style.display = 'block'

document.body.appendChild(app.view)

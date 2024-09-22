document.getElementById('instructions').firstElementChild.addEventListener('mousedown', (event) => {
    event.stopPropagation()

    event.currentTarget.nextElementSibling.hidden = !event.currentTarget.nextElementSibling.hidden
})

const resourcesElement = document.getElementById('resources')
const resources = { Seaweed: 0, Coral: 0, Rocks: 0, Shells: 0, Plankton: 0 }
const resourcesKeys = Object.keys(resources)

export function addResources(gains) {
    for (const resource in gains) {
        resources[resource] += gains[resource]

        resourcesElement.children[resourcesKeys.indexOf(resource)].textContent = resources[resource]
    }
}

export function removeResources(costs) {
    for (const resource in costs) {
        if (resources[resource] < costs[resource]) {
            return false
        }
    }

    for (const resource in costs) {
        resources[resource] -= costs[resource]

        resourcesElement.children[resourcesKeys.indexOf(resource)].textContent = resources[resource]
    }

    return true
}

const selectionElement = document.getElementById('selection')
const selection = []
let selectionTimeout = null

export function addSelected(portrait, description) {
    const index = selection.findIndex((selected) => selected.portrait === portrait)

    if (index === -1) {
        selection.push({ portrait, description, count: 1 })
    } else {
        selection[index].count++
    }

    selectionTimeout = selectionTimeout || setTimeout(updateSelection)
}

export function removeSelected(portrait) {
    const index = selection.findIndex((selected) => selected.portrait === portrait)

    if (--selection[index].count === 0) {
        selection.splice(index, 1)
    }

    selectionTimeout = selectionTimeout || setTimeout(updateSelection)
}

function updateSelection() {
    for (let i = 0; i < selectionElement.children.length; i++) {
        if (i < selection.length) {
            const selected = selection[i]

            selectionElement.children[i].firstElementChild.src = selected.portrait
            selectionElement.children[i].lastElementChild.textContent = selected.description(selected.count)

            selectionElement.children[i].hidden = false
        } else {
            selectionElement.children[i].hidden = true
        }
    }

    selectionTimeout = null
}

export function setSelectedDescription(portrait) {
    const index = selection.findIndex((selected) => selected.portrait === portrait)
    const selected = selection[index]

    selectionElement.children[index].lastElementChild.textContent = selected.description(selected.count)
}

const buildElement = document.getElementById('build')
const buildCosts = [
    { Seaweed: 5, Rocks: 10, Shells: 5 },
    { Coral: 30 },
    { Seaweed: 20, Rocks: 20 },
    { Rocks: 15, Shells: 15 },
    { Seaweed: 15, Shells: 15 },
]

const buildCostsFormatted = buildCosts.map((costs) => {
    return Object.entries(costs).map(([resource, cost]) => `${cost} ${resource.toLowerCase()}`).join(' | ')
})
let buildCallback

export function setBuildCallback(callback) {
    buildCallback = callback
}

for (let i = 0; i < buildElement.children[1].children.length; i++) {
    const building = buildElement.children[1].children[i]

    building.addEventListener('mouseenter', () => {
        buildElement.firstElementChild.firstElementChild.textContent = buildCostsFormatted[i]
        buildElement.firstElementChild.lastElementChild.textContent = building.dataset.description

        buildElement.firstElementChild.hidden = false
    })

    building.addEventListener('mouseleave', () => {
        buildElement.firstElementChild.hidden = true
    })

    building.addEventListener('mousedown', (event) => {
        event.stopPropagation()

        if (removeResources(buildCosts[i])) {
            buildCallback(i, () => {
                addResources(buildCosts[i])
            })
        }
    })

    building.firstElementChild.addEventListener('dragstart', (event) => {
        event.preventDefault()
    })
}

buildElement.lastElementChild.addEventListener('mousedown', (event) => {
    event.stopPropagation()

    event.currentTarget.previousElementSibling.hidden = !event.currentTarget.previousElementSibling.hidden
})

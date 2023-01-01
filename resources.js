let plankton = 0
let seaweed = 0
let rocks = 0
let shells = 0
let coral = 0

export function use(costs) {
    if (costs.Plankton || 0 > plankton ||
        costs.Seaweed || 0 > seaweed ||
        costs.Rocks || 0 > rocks ||
        costs.Shells || 0 > shells ||
        costs.Coral || 0 > coral) {
        return false
    }

    plankton -= costs.Plankton || 0
    seaweed -= costs.Seaweed || 0
    rocks -= costs.Rocks || 0
    shells -= costs.Shells || 0
    coral -= costs.Coral || 0

    return true
}

export function add(gains) {
    plankton += gains.Plankton || 0
    seaweed += gains.Seaweed || 0
    rocks += gains.Rocks || 0
    shells += gains.Shells || 0
    coral += gains.Coral || 0
}

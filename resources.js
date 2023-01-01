let plankton = 0
let seaweed = 0
let shells = 0
let rocks = 0

export function use(costs) {
    if (costs.Plankton || 0 > plankton ||
        costs.Seaweed || 0 > seaweed ||
        costs.Shells || 0 > shells ||
        costs.Rocks || 0 > rocks) {
        return false
    }

    plankton -= gains.Plankton || 0
    seaweed -= gains.Seaweed || 0
    shells -= gains.Shells || 0
    rocks -= gains.Rocks || 0

    return true
}

export function add(gains) {
    plankton += gains.Plankton || 0
    seaweed += gains.Seaweed || 0
    shells += gains.Shells || 0
    rocks += gains.Rocks || 0
}

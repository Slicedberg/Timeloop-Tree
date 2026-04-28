addLayer("l", {
    name: "Loop",
    symbol: "L",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#eeefff",
    resource: "Evolution",
    row: 0,

    tabFormat: {
        "The Timeloop": {
            content: [
                ["display-text", "Enter different eras, gather resources, and get forced out by time."],
                ["display-text", "Use Evolution to improve future runs."],
                "blank",
                ["bar", "temporality"],
                "blank",
                ["clickable", 11],
            ]
        },
        "Eras": {
            content: [
                ["bar", "temporality"],
                "blank",
                ["display-text", function() {
                    return player.inEra ? "Currently in: Dawn of Humanity" : "Not in an era"
                }],
            ]
        }
    },

    clickables: {
        11: {
            title: "Enter Dawn of Humanity",
            canClick() { return !player.inEra },
            onClick() {
                enterEra("d")
            }
        }
    },

    bars: {
        temporality: {
            direction: RIGHT,
            width: 300,
            height: 25,
            progress() {
                return player.temporality.div(player.temporalityMax)
            },
            display() {
                return "Temporality: " + format(player.temporality) + " / " + format(player.temporalityMax)
            },
            fillStyle() { return {"background-color": "#6aa9ff"} },
        }
    },

    layerShown(){return true}
})
addLayer("d", {
    name: "Dawn of Humanity",
    symbol: "D",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#8c6b3b",
    resource: "Food",
    row: 0,

    baseAmount() { return player.points },

    gainMult() {
        let mult = new Decimal(1)

        if (hasUpgrade("d", 11)) mult = mult.times(2)
        if (hasUpgrade("d", 12)) mult = mult.times(3)
        if (hasUpgrade("d", 14)) mult = mult.times(1.5)

        return mult
    },

    update(diff) {
        if (player.inEra == "d") {
            let gain = new Decimal(1)

            if (hasUpgrade("d", 13)) gain = gain.times(2)
            if (hasUpgrade("d", 14)) gain = gain.times(1.5)

            player.d.points = player.d.points.add(gain.mul(diff))
        }
    },

    upgrades: {
        11: {
            title: "Gathering",
            description: "Double point gain",
            cost: new Decimal(10),
        },
        12: {
            title: "Efficient Hunting",
            description: "Triple point gain",
            cost: new Decimal(50),
            unlocked() { return hasUpgrade("d", 11) }
        },
        13: {
            title: "Fire",
            description: "2x Food gain",
            cost: new Decimal(100),
            unlocked() { return hasUpgrade("d", 12) }
        },
        14: {
            title: "Cooperation",
            description: "1.5x point and Food gain",
            cost: new Decimal(250),
            unlocked() { return hasUpgrade("d", 13) }
        },
        15: {
            title: "Primitive Tools",
            description: "Unlock Food buyables",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade("d", 14) }
        },
    },

    tabFormat: [
        ["bar", "temporality"],
        "main-display",
        "blank",
        "upgrades"
    ],

    bars: {
        temporality: {
            direction: RIGHT,
            width: 300,
            height: 25,
            progress() {
                return player.temporality.div(player.temporalityMax)
            },
            display() {
                return "Temporality: " + format(player.temporality) + " / " + format(player.temporalityMax)
            },
            fillStyle() { return {"background-color": "#6aa9ff"} },
        }
    },

    layerShown(){return true}
})
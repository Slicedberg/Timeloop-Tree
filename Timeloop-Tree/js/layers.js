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

	update(diff) {
		if (!player.inEra) return

		player.temporality = player.temporality.sub(diff).max(0)

		if (player.temporality.lte(0)) {
			this.exitEra()
		}
	},

	enterEra(era) {
		player.inEra = era
		player.temporality = player.temporalityMax
		player.points = new Decimal(0)
	},

	exitEra() {
		let era = player.inEra
		if (!era) return

		// Call era-specific exit
		if (layers[era].onExit) {
			layers[era].onExit()
		}

		player.inEra = null
		player.temporality = new Decimal(0)

		// reset era resources
		player[era].points = new Decimal(0)
	},

	clickables: {
		11: {
			title: "Enter Dawn of Humanity",
			canClick() { return !player.inEra },
			onClick() {
				layers.l.enterEra("d")
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

	tabFormat: {
		"Timeloop": {
			content: [
				["display-text", "Enter eras, gather resources, and get forced out by time."],
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
					return player.inEra ? "In Dawn of Humanity" : "Not in an era"
				}],
			]
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

	update(diff) {
		if (player.inEra !== "d") return

		let gain = new Decimal(1)

		if (hasUpgrade("d", 13)) gain = gain.times(2)
		if (hasUpgrade("d", 14)) gain = gain.times(1.5)

		player.d.points = player.d.points.add(gain.mul(diff))
	},

	onExit() {
		let gain = player.d.points.div(10).floor()
		player.l.points = player.l.points.add(gain)
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

	tabFormat: [
		["bar", "temporality"],
		"main-display",
		"blank",
		"upgrades"
	],

	layerShown(){return true}
})
let modInfo = {
	name: "The Timeloop Tree",
	author: "Slicedberg",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "InDev",
	name: "The Beginning",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

var tmpCache = {}

function getTemporalityGain() {
    if (!player.inEra) return new Decimal(0)
    return new Decimal(-1) // -1 per second
}

function updateTemporality(diff) {
    if (!player.inEra) return

    player.temporality = player.temporality.add(getTemporalityGain().mul(diff))

    if (player.temporality.lte(0)) {
        exitEra()
    }
}

function enterEra(era) {
    player.inEra = era
    player.temporality = player.temporalityMax
    player.points = new Decimal(0)
}

function exitEra() {
    if (player.inEra == "d") {
        // Gain Evolution based on Food
        let gain = player.d.points.div(10).floor()
        player.l.points = player.l.points.add(gain)
    }

    player.inEra = null
    player.temporality = new Decimal(0)

    // Reset era layer
    player.d.points = new Decimal(0)
}
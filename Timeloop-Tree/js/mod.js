let modInfo = {
	name: "The Timeloop Tree",
	author: "Slicedberg",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal(10),
	offlineLimit: 1,
}

let VERSION = {
	num: "InDev",
	name: "The Beginning",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Initial setup<br>`

let winText = `Congratulations!`

var doNotCallTheseFunctionsEveryTick = []

function getStartPoints(){
	return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
	return player.inEra !== null // only generate points inside an era
}

function getPointGen() {
	if(!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)

	if (hasUpgrade("d", 11)) gain = gain.times(2)
	if (hasUpgrade("d", 12)) gain = gain.times(3)
	if (hasUpgrade("d", 14)) gain = gain.times(1.5)

	return gain
}

function addedPlayerData() { 
	return {
		inEra: null,
		temporality: new Decimal(0),
		temporalityMax: new Decimal(100),
	}
}

var displayThings = [
	function() {
		return player.inEra 
			? "Currently in: Dawn of Humanity" 
			: "Not in an era"
	}
]

function isEndgame() {
	return false
}

var backgroundStyle = {}

function maxTickLength() {
	return(3600)
}

function fixOldSave(oldVersion){}
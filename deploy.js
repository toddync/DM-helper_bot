const {REST, Routes} = require('discord.js')
const env = require("dotenv"); env.config();
const {TOKEN, CLIENT_ID} = process.env

const fs = require('node:fs')
const path = require('node:path')

const cPath = path.join(__dirname, 'commands')
const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith(".js"))

const commands = []

for (const file of cFiles){
    const command = require(`./commands/${file}`)
    
    if('data' in command && 'execute' in command){
        commands.push(command.data.toJSON())
    } else {
        console.log(`file ${fPath} has the wrong command structure`)
    }
}

const rest = new REST({version: "10"}).setToken(TOKEN);

(async () => {
    try{
        console.log(`Updating ${commands.length} /commands...`)
        
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
            )
        
        console.log(`Updated all ${commands.length} /commands successfully!`)
    } catch(e){
        console.log("\n")
        console.error(e)
    }
})()
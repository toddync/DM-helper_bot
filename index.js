const { Client, Events, GatewayIntentBits, Collection} = require('discord.js')

const env = require("dotenv"); env.config();
const {TOKEN, CLIENT_ID} = process.env

const fs = require('node:fs')
const path = require('node:path')

const cPath = path.join(__dirname, 'commands')
const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for (const file of cFiles){
    const fPath = path.join(cPath, file)
    const command = require(fPath)
    
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command)
    } else {
        console.log(`file ${fPath} has the wrong command structure`)
    }
}

console.log(client.commands)

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
});
client.login(TOKEN)

client.on(Events.InteractionCreate, async e => {
    if(!e.isChatInputCommand()){
        return
    }
    
    const command = e.client.commands.get(e.commandName)
    
    if(!command){
        e.reply("command doesn't exist ")
        return
    }
    
    await command.execute(e)
    
})
const { Client, Events, GatewayIntentBits, Collection} = require('discord.js')

const env = require("dotenv"); env.config();
const { TOKEN } = process.env

const fs = require('node:fs')
const path = require('node:path')

const cPath = path.join(__dirname, 'commands')
const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

leng = 0

for (const file of cFiles){
    const fPath = path.join(cPath, file)
    const command = require(fPath)
    
    if('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command)
        leng++
    } else {
        console.log(`file ${file} has the wrong command structure`)
    }
}

console.log(`\nTotal of ${leng} /commands available\n`)

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
        e.reply("Command doesn't exist ")
        return
    }
    
    await command.execute(e)
    
})
const {
    Client,
    Events,
    GatewayIntentBits,
    Collection
} = require('discord.js')

const colors = require('colors')
colors.enable()

const env = require("dotenv");
env.config();
const {
    TOKEN
} = process.env

const fs = require('node:fs')
const path = require('node:path')

const cPath = path.join(__dirname, 'commands')
const cFiles = fs.readdirSync(cPath).filter(file => file.endsWith(".js"))

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})
client.commands = new Collection()

length = 0

console.log('\n')
for (const file of cFiles) {
    const fPath = path.join(cPath, file)
    const command = require(fPath)

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
        length++
    } else {
        console.log(`file ${file} has the wrong command structure`.red)
    }
}

console.log(`\nTotal of ${length} /commands available\n`.green)

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`.magenta)
});

client.login(TOKEN)

client.on(Events.InteractionCreate, async e => {
    if (!e.isChatInputCommand()) {
        console.log(`e index.js:48 : ${e}`)
        return
    }

    const command = e.client.commands.get(e.commandName)

    if (!command) {
        e.reply("Command doesn't exist ")
        return
    }

    await command.execute(e)

})
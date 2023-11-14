const { SlashCommandBuilder } = require('discord.js')


module.exports={
    data: new SlashCommandBuilder()
            .setName('ping')
            .setDescription('responds with a "pong!"'),
    async execute(e){
       await e.reply("pong!")
    }
}
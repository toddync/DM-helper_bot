const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { mysql } = require('./db.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("listmacro")
    .setDescription('shows all the macros you have set for this server'),
    
    async execute(e) {
        
        i = {
            guild: e.guildId,
            user:e.user.id
        }
        
        raw = await mysql.query(`SELECT name, dice FROM macros WHERE guild='${i.guild}' AND user_id='${i.user}'`)
        
      
        i = []
        
        if (raw[0].length == 0){
            console.log(raw)
            await e.reply({
                content:`you haven't set any macros for this server yet`,
                ephemeral: true
            })
            
            return
        }
        
        for(let _ = 0; _ < raw[0].length; _++){
            i.push({
                 name: raw[0][_].name,
                 value: raw[0][_].dice,
                 inline: true
            })
        }
        
        
        list = new EmbedBuilder()
        	.setColor(0x0099FF)
        	.setTitle('Your macros')
        	.addFields(i)
        
        await e.reply({
            embeds:[list],
            ephemeral:true
        })
    }
}
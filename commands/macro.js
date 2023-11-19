const { SlashCommandBuilder } = require('discord.js')
const { mysql } = require('./db.js')
const { roll } = require('./roll.js')

module.exports={
    data: new SlashCommandBuilder()
            .setName('macro')
            .setDescription('executes a previous set macro')
            .addStringOption(option => 
                option
                    .setName('name')
                    .setDescription('the name of the previous set macro')
                    .setRequired(true)
            )
            .addBooleanOption(option => 
                option
                    .setName('secret')
                    .setDescription('if this roll is only for you or not')
            ),
    async execute(e){
        
        i = {
            macro: e.options.getString('name'),
            guild: e.guildId,
            user: e.user.id,
            username: e.user.username
        }
        
        raw = await mysql.query(`
        SELECT dice FROM macros
        WHERE 
            guild='${i.guild}' AND 
            user_id='${i.user}' AND
            name='${i.macro}'
        `)
        
        raw = raw[0]
        
        if(raw.length == 0){
            await e.reply({
                content:`you don't have a macro called ${i.macro}`,
                ephemeral: true
            })
            
            return
        } else if(raw.length > 1){
            await e.reply({
                content: `you have ${raw.length} macros with the name ${i.macro}, I'm confused of wich I should execute, so I won't execute any`,
                ephemeral: true
            })
            
            return
        }
        
        
       e.reply({
           content: `${i.macro} (${raw[0].dice}): ${roll(raw[0].dice)}`
       })
    }
}
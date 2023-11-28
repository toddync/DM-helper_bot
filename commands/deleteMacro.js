const {
    SlashCommandBuilder
} = require('discord.js')
const {
    mysql
} = require('./db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deletemacro")
        .setDescription('deletes a macro')
        .addStringOption(option =>
            option
            .setName("name")
            .setDescription('name of the macro')
            .setRequired(true)
        ),
    async execute(e) {

        i = {
            guild: e.guildId,
            user: e.user.id,
            macro: e.options.getString('name')
        }

        _ = await mysql.query(`
            SELECT * FROM 
                macros 
            WHERE 
                guild='${i.guild}' AND
                user_id='${i.user}' AND
                name='${i.macro}'
            `)

        if (_[0].length == 0) {
            await e.reply({
                content: `you don't have a macro named ${i.macro}`,
                ephemeral: true
            })
            return
        }

        _ = await mysql.query(`
                DELETE FROM
                    macros
                WHERE
                    guild='${i.guild}' AND
                    user_id='${i.user}' AND
                    name='${i.macro}'
            `)

        await e.reply({
            content: `macro ${i.macro} deleted successfully!!`,
            ephemeral: true
        })
    }
}
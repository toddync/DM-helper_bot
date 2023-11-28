const {
    SlashCommandBuilder
} = require('discord.js')
const {
    mysql
} = require('./db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changemacro")
        .setDescription('changes the dices of a macro')
        .addStringOption(option =>
            option
            .setName("name")
            .setDescription('name of the macro')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("dice")
            .setDescription("the new dices")
            .setRequired(true)
        ),
    async execute(e) {

        i = {
            guild: e.guildId,
            user: e.user.id,
            macro: e.options.getString('name'),
            dice: e.options.getString('dice')
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
                UPDATE macros SET
                    dice='${i.dice}'
                WHERE
                    guild='${i.guild}' AND
                    user_id='${i.user}' AND
                    name='${i.macro}'
            `)

        await e.reply({
            content: `macro ${i.macro} updated successfully!!`,
            ephemeral: true
        })
    }
}
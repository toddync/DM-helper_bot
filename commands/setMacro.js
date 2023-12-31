const {
    SlashCommandBuilder
} = require('discord.js')
const {
    mysql
} = require('./db.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addmacro")
        .setDescription('creates a reusable macro for rolling dices')
        .addStringOption(option =>
            option
            .setName("name")
            .setDescription('name of the macro')
            .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("dice")
            .setDescription("the dices to roll")
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

        if (_[0].length > 0) {
            await e.reply({
                content: `you already have a macro named ${i.macro}`,
                ephemeral: true
            })
            return
        }

        _ = await mysql.query(`
                INSERT INTO
                    macros( guild, user_id, name, dice)
                VALUES
                    ( '${i.guild}', '${i.user}', '${i.macro}', '${i.dice}')
            `)

        await e.reply({
            content: `macro ${i.macro} added successfully!!`,
            ephemeral: true
        })
    }
}
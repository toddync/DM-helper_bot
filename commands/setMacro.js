const { SlashCommandBuilder } = require('discord.js')

const MySQl = require("mysql2/promise");
const env = require("dotenv"); env.config();

const mysql = MySQl.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    enableKeepAlive: true
});

module.exports={
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
    async execute(e){
       
       i = {
           guild: e.guildId,
           user: e.user.id,
           macro: e.options.getString('name'),
           dice: e.options.getString('dice')
       };
       
        _ = await mysql.query(`INSERT INTO 
                                macros(guild, user_id, name, dice)
                                VALUES(${i.guild}, ${i.user}, '${i.macro}', '${i.dice}')`)
       
       _ = await mysql.query("select * from macros")
       
       console.log(_[0])
       
       await e.reply(`macro ${i.macro} added successfully!!`)
    }
}
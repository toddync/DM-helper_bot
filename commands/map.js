const { SlashCommandBuilder, AttachmentBuilder} = require('discord.js')
const {createCanvas} = require('@napi-rs/canvas')

module.exports={
    data: new SlashCommandBuilder()
            .setName('map')
            .setDescription('creates a battle map')
            .addAttachementOption(option => {
                option.setName('img')
                .setDescription('the image to be used as a background')
            }),
    async execute(e){
       
       console.log(e)
       
       const cs = createCanvas(20,20)
       const ctx = cs.getContext('2d')
       
       e.reply('.')
       
    }
}
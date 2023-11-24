const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js')
const canva = require('@napi-rs/canvas')

module.exports={
    data: new SlashCommandBuilder()
            .setName('map')
            .setDescription('creates a battle grid for you')
            .addNumberOption(option =>
                option
                    .setName('rows')
                    .setDescription('nummber of rows in the grid')
                    .setRequired(true)
            )
            .addNumberOption(option =>
                option
                    .setName('colums')
                    .setDescription('number of colums in the grid')
                    .setRequired(true)
            )
            .addAttachmentOption(option =>
                option
                    .setName('image')
                    .setDescription('the image to be used as background')
            ),
    async execute(e){

        const columns = e.options.getNumber('colums')
        const rows = e.options.getNumber('rows')

        const image = e.options.getAttachment('image') ?? false;

        const canvas = canva.createCanvas(columns * 20, rows * 20)

        const ctx = canvas.getContext('2d')

        if (!image) {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)    
        } else {
            img = await canva.loadImage(image.url)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }
        
        ctx.fillStyle = "black"

        for(let _ = 1; _ <= columns; _++){
            x = _ * 20
            ctx.fillRect(x, 0, 1, canvas.height)
        }

        for(let _ = 1; _ <= rows; _++){
            x = _ * 20
            ctx.fillRect(0, x, canvas.width, 1)
        }

        await e.reply({
            files: [ (
                    new AttachmentBuilder(
                        await canvas.encode('png'),
                        { name: 'map.png' }
                    )
                ) 
            ]
        })
    }
}
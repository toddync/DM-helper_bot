const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require('discord.js')
const canva = require('@napi-rs/canvas')
const r = 50
const square = 50
const sideLength = 50
const hHeight = 2 * 43.3
const d = r * 2
const a = 2 * Math.PI / 6

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDescription('creates a battle grid for you')
        .addNumberOption(option =>
            option
            .setName('rows')
            .setDescription('number of rows in the grid')
            .setRequired(true)
        )
        .addNumberOption(option =>
            option
            .setName('columns')
            .setDescription('number of column in the grid')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option
            .setName('hexagonal')
            .setDescription('hex grid for weirdos')
        )
        .addAttachmentOption(option =>
            option
            .setName('image')
            .setDescription('the image to be used as background')
        ),
    async execute(e) {

        console.time()
        const columns = e.options.getNumber('columns')
        const rows = e.options.getNumber('rows')
        const hex = e.options.getBoolean('hexagonal') || false

        console.log(hex)

        let dis = 0

        if (hex) {
            if (columns % 2 == 0) {
                for (let i = 1; i <= columns; i++) {
                    if (i % 2 == 0) {
                        dis += sideLength
                    } else {
                        dis += d
                    }
                }
                dis += 25
            } else {
                for (let i = 1; i <= columns; i++) {
                    if (i % 2 == 0) {
                        dis += sideLength
                    } else {
                        dis += d
                    }
                }
            }
        }


        const image = e.options.getAttachment('image') ? e.options.getAttachment('image') : false;

        const canvas = hex ? canva.createCanvas(dis, rows * hHeight - (d - hHeight)) : canva.createCanvas(columns * square, rows * square)

        const ctx = canvas.getContext('2d')

        if (!image) {
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        } else {
            img = await canva.loadImage(image.url)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        }

        ctx.fillStyle = "black"

        if (hex) {
            drawHexGrid(canvas.width, canvas.height, (columns % 2) == 0 ? 2 : 1, ctx)
        } else {
            drawSqGrid(canvas.width, canvas.height, ctx)
        }

        console.log(`\n${e}\n`)

        await e.reply({
            files: [(
                new AttachmentBuilder(
                    await canvas.encode('png'), {
                        name: 'map.png'
                    }
                )
            )]
        })


        console.timeEnd()
    }
}

function drawSqGrid(width, height, ctx) {
    for (let _ = 0; _ <= width; _ += square) {
        ctx.fillRect(_, 0, 1, height)
    }

    for (let _ = 0; _ <= height; _ += square) {
        ctx.fillRect(0, _, width, 1)
    }
}

function drawHexGrid(width, height, pair, ctx) {
    for (let y = r - (d - hHeight); y + (d - (hHeight / 2)) * Math.sin(a) <= height + (d - hHeight); y += (hHeight / 2)) {

        let I = 1
        let dis = 0

        for (let x = r, j = 0; x + dis <= width + (pair == 2 ? d : 0); x += r * (1 + Math.cos(a)), y += ((-1) ** j++ * r * Math.sin(a))) {

            if (I % 2 == 0) {
                dis = sideLength
            } else {
                dis = d
            }

            drawHexagon(x, y, ctx);
            I++
        }
    }
}

function drawHexagon(x, y, ctx) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.stroke();
}
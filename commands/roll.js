const { SlashCommandBuilder } = require('discord.js')
result = []

module.exports={
    data: new SlashCommandBuilder()
            .setName('roll')
            .setDescription('rolls the dice(s) for you!!')
            .addStringOption(option =>
                option
                    .setName("dices")
                    .setDescription("example: 3d20+7")
                    .setRequired(true)
            ),
    async execute(e){
       await e.reply(roll(e.options.getString("dices")))
    },
    roll:roll
}

function roll(e) {
    split = /([\+]|[\-])+/ 
       i = e.replace(/d/g, ",").split( split )
     
       i.forEach( (_,k) => {
            if(!split.test(_)){
                if(split.test(i[k-1]) && k-1 >= 0){
                    t = i[k-1]
                } else {
                    t = ""
                }
                i[k] = `l(${_},"${t}")`
            }
       })
       
       eval(i.join(''));
       
       result.pop()
       
       _ = result.join("")
       i = `${_} = ${eval(_)}`
       result = []
       
       return i
}
f = (e) => {
    return Math.floor(Math.random() * e +1)
}

l = (a,b,c) => {
    split = /([\+]|[\-])+/ 
    
    if(!(c && c != "") && (split.test(b))){
        result.push(b)
        result.push(a)
    } else {
        for (let i = 0; i < a; i++){
            result.push(f(b))
            if(i < a-1){
                result.push(c || "+")
            }
        }
    }
    
    result.push("+")
}
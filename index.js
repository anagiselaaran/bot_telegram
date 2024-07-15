const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require('axios').default

const { createRecipe } = require('./gpt');

require('dotenv').config()

//app de expreess
const app = express()

//var bot d telegram
const bot = new Telegraf(process.env.BOT_TOKEN)

//config bot telegram--q telegram sepa path dentro mi app
bot.telegram.setWebhook(`${process.env.BOT_URL}/telegram-bot`)
//para q mi bot se conecte con telegram
app.use(bot.webhookCallback('/telegram-bot'))

app.post('/telegram-bot', (req, res) => res.send('Funciona!!'))

//COMANDOS BOT---(ctx) -> contexto
bot.command('prueba', async(ctx) => {
    console.log(ctx.message)
    await ctx.reply('Esto funciona!!')
    /* await ctx.replyWithDice()
    await ctx.replyWithMarkdownV2(`*titulo en negrita*
        _cursiva_
        hola amiga`) */
})

bot.command('tiempo', async (ctx) => {
    const ciudad = ctx.message.text.substring(7)
    
    try {
        const { data } = await axios.get(` https://api.openweathermap.org/data/2.5/weather?q=${ciudad},es&appid=12cc61f3282afaca14152a6185f43de0&units=metric`)
       
        console.log(data)
        
        const message = `info de ${data.name}
       
       🌡️_temperatura_ :${sanitizeTemp(data.main.temp)} 
       _minima_ : ${sanitizeTemp(data.main.temp_min)}
       _maxima_ : ${sanitizeTemp(data.main.temp_max)}
       💧_humedad_ : ${sanitizeTemp(data.main.humidity)}
       `
        await ctx.replyWithPhoto(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        await ctx.replyWithMarkdownV2(message);
        await ctx.replyWithLocation(data.coord.lat, data.coord.lon);
    
    } catch (error) {
        console.log(data);
        ctx.reply('Ha ocurrido un error, vuelve a intentarlo de nuevo.');

    }
        
})

bot.command('receta', async (ctx) => {

    const ingredientes = ctx.message.text.substring(7)
    const gptResponse = await createRecipe(ingredientes);
    console.log(gptResponse);
    ctx.reply(gptResponse);
})




const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`servidor escuchando en puerto ${PORT}`)
})

function sanitizeTemp(value) {
    return String(value).replaceAll('.', ',');
}
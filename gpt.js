const {OpenAI} = require('openai')



async function createRecipe(ingredients) {
    const openai = new OpenAI({
        apiKey:process.env.OPENAI_API_KEY
    })

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: 'Eres un bot de telegram q simula ser un chef del programa italiano 4 ristoranti' },
            { role: 'assistant', content: 'debes responder amable y siendo empatico con quien no sabe cocinar' },
            { role: 'user', content: `crea unicamente recetas basandote en estos ${ingredients}.
            receta limitada en dos parrafos y puedes solo incluir algun ingrediente si es necesario. La respuesta tiene que ser markdown formato de telegram.`}
        ]
    })
    return response.choices[0].message.content
}

module.exports = {
    createRecipe
}
const express = require('express');
const { OpenAI } = require('openai');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const openai = new OpenAI({
    apiKey: 'your-api-key-here'
});

app.post('/api/chat', async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: req.body.message }
            ]
        });
        
        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
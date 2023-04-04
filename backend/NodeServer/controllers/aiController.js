import dotenv from 'dotenv';
dotenv.config();
import { Configuration, OpenAIApi  } from 'openai';
import axios from 'axios';
const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

export const askQuestion = async (req, res) => {
    const prompt = req.body.prompt;
    try{
        if(prompt == null || prompt == ""){
            return res.status(400).send("Prompt is empty");
        }
        
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });
        const completion = response.data.choices[0].message.content;
        console.log(completion);
        return res.status(200).json({
            success: true,
            completion
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({"error": err});
    }
}

export const finishStory = async(req, res) => {
    const prompt = req.body.prompt;
    const payload = {
        "inputs": prompt,
        "parameters": {
            "temperature": 1,
            "min_length": 25,
            "max_new_tokens": 50,
            "return_full_text": true,
            "do_sample": true,
            "seed": 10,
            "early_stopping": false,
            "length_penalty": 0.0
        },
        "options": {
            "use_cache": true,
            "wait_for_model": false
        }
    }

    const response = await axios.post(`${process.env.STORYBOT_SERVER_URL}`, payload, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`
        }
    });
    console.log(response);
    return res.status(200).json(response.data);
}

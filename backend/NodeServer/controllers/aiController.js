import dotenv from 'dotenv';
dotenv.config();
import { Configuration, OpenAIApi  } from 'openai';
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

export default class aiService{
    parameters = {

    }

    static askStoryBot(story) {
        const payload = {
            "inputs": story,
            "parameters": {
                "temperature": 1,
                "min_length": 50,
                "max_new_tokens": 100,
                "return_full_text": true,
                "do_sample": true,
                "early_stopping": false,
                "length_penalty": 0.0
            },
            "options": {
                "use_cache": false,
                "wait_for_model": false
            }
        }

        return fetch("https://api-inference.huggingface.co/models/bigscience/bloom", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`
            },
            body: JSON.stringify(payload)
        }).then((response) => {
            return response.json()
        });
    }
    
    static getMe() {
        return fetch('http://localhost:5500/getMe', {
            credentials: 'include'
        }).then((response) =>{
            console.log(response);
            if(response.status !== 200){
                return {"error": "No logged in user"}
            }
            return response.json()
        });
    }
}
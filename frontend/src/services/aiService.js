export default class apiService{
    static finishStory(prompt) {
        return fetch(`${process.env.REACT_APP_NODE_SERVER}/ai/finishStory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: prompt})
        }).then((response) =>{
            console.log(response);
            return response.json();
        });
    }

    static askQuestion(question){
        return fetch(`${process.env.REACT_APP_NODE_SERVER}/ai/askQuestion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({prompt: question})
        }).then((response) =>{
            return response.json();
        });
    }

    static generateImage(prompt){
        const payload = {
            "inputs": prompt,
            "options": {
                "use_cache": true,
                "wait_for_model": false
            }
        }
        return fetch(`${process.env.REACT_APP_ARTIST_BOT_SERVER}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer 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`
            },
            body: JSON.stringify(payload)
        }).then((response) =>{
            console.log(response);
            if(response.status !== 200){
                return {"err": "Error generating image"}
            }
            return response.blob();
        })
    }
}

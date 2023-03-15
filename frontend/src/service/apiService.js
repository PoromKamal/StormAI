export default class apiService{
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
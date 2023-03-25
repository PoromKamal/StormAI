export default class apiService{
    static getMe() {
        return fetch(`${process.env.REACT_APP_AUTH_SERVER}/getMe`, {
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
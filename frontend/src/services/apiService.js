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
    
    static saveWhiteboard(whiteboardId, whiteboardName) {
        return fetch(`${process.env.REACT_APP_AUTH_SERVER}/saveWhiteboard`, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({whiteboardId: whiteboardId, whiteboardName: whiteboardName}),
        });
    }

    static getWhiteboards(){
        return fetch(`${process.env.REACT_APP_AUTH_SERVER}/getWhiteboards`, {
            method: 'GET',
            credentials: 'include',
        }).then((response) => {
            if(response.status === 200)
                return response.json();
            return [];
        });
    }

    static getRoomName(){
        return fetch(`${process.env.REACT_APP_AUTH_SERVER}/getRoomName`, {
            method: 'GET',
            credentials: 'include',
        }).then((response) => {
            if(response.status === 200)
                return response.json();
            return [];
        });
    }
}
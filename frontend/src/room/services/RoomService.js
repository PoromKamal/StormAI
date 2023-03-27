const roomService = {};

const baseUrl = 'http://localhost:5555';

roomService.createRoom = function (room) {
    return fetch(`${baseUrl}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(room)
      }).then(res => res.json());
}

roomService.getRoom = function (roomId) {
    return fetch(`${baseUrl}/rooms/${roomId}`).then(res => res.json());
}

export default roomService;
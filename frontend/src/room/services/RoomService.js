const roomService = {};

//If process in production
const baseUrl = process.env.NODE_ENV === 'production' ? 'https://room.stormai.live' : 'http://localhost:5555';
roomService.createRoom = function (room) {
  return fetch(`${baseUrl}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(room)
  }).then(res => res.json());
}

roomService.getRoomInfo = function (roomId) {
  return fetch(`${baseUrl}/rooms/${roomId}/info`).then(res => res.json());
}

roomService.getDoc = function (roomId) {
  return fetch(`${baseUrl}/rooms/${roomId}/doc`).then(res => res.json());
}

roomService.updateDoc = function (roomId, docState, lastUpdated) {
  // Transform docState and lastUpdated into a FormData object so we can use multer
  const data = new FormData();
  const blob = new Blob([docState], { type: 'application/json' });
  data.append('doc', blob);
  data.append('lastUpdated', lastUpdated);

  return fetch(`${baseUrl}/rooms/${roomId}/doc`, {
    method: 'PATCH',
    body: data
  }).then(res => res.json());
};

export default roomService;
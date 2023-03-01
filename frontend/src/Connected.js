import { useState, useEffect } from 'react'
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Connected = () => {
  const [room, setRoom] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setId(socket.id);
    });
  }, []);

  useEffect(() => {
    const handler = (users) => {
      setUsers(users);
      console.log(users);
    }

    socket.on("retrieveUsers", handler);

    return () => socket.off("retrieveUsers", handler);
  }, []);

  const joinRoom = () => {
    if (room === '') return;
    setJoinedRoom(true);
    socket.emit('joinRoom', room);
    socket.emit('getUsers', room);
  }

  return (
    <div className='flex flex-col fixed top-0 right-0 w-96 p-4 m-2 border rounded-md'>
      {id && (<h1>Connected as {id}</h1>)}
      <input className='border text-black' placeholder='Room...' onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom} className='underline w-max m-auto'>Join room</button>
      {joinedRoom && (<h1>In room {room}:</h1>)}
      {users.map((user, index) => (
        <p key={index}>{user}</p>
      ))}
    </div>
  )
}

export default Connected
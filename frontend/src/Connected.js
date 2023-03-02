import { useState, useEffect } from 'react'
import { SocketContext } from './SocketContext';
import io from 'socket.io-client';

//const socket = io('http://localhost:5000');

const Connected = () => {
  const [room, setRoom] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setId(socket.id);
    });

    socket.on('roomCreated', (roomId) => {
      setRoom(roomId);
      console.log(roomId);
      setJoinedRoom(true);
      socket.emit('getUsers', roomId);
    });

    socket.on('joinedRoom', (roomId) => {
      setRoom(roomId);
      setJoinedRoom(true);
      socket.emit('getUsers', roomId);
    });
  }, []);

  useEffect(() => {
    const handler = (users) => {
      setUsers(users);
    }

    socket.on("retrieveUsers", handler);

    return () => socket.off("retrieveUsers", handler);
  }, []);

  const joinRoom = () => {
    if (room === '') return;
    socket.emit('joinRoom', room);
  }

  const createRoom = () => {
    socket.emit('createRoom', socket.id);
  }

  return (
    <div className='flex flex-col fixed top-0 right-0 w-96 p-4 m-2 border rounded-md bg-white'>
      {id && (<h1>Connected as {id}</h1>)}
      <button onClick={createRoom} className='underline w-max m-auto'>Create room</button>
      <input className='border text-black' placeholder='Join Room...' onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom} className='underline w-max m-auto'>Join room</button>
      {joinedRoom && (<h1>In room {room}:</h1>)}
      {users.map((user, index) => (
        <p key={index}>{user}</p>
      ))}
    </div>
  )
}

export default Connected
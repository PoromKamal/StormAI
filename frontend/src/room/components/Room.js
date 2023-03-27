import { useState, createContext, useEffect } from 'react';
import Flowboard from '../../flowboard/components/Flowboard';
import RoomInfo from './RoomInfo';
import { ReactFlowProvider } from 'reactflow';
import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import AuthButton from '../../flowboard/components/button/AuthButton';
import apiService from '../../services/apiService';
import roomService from '../services/RoomService';
import AiDropdownButton from '../../flowboard/components/button/AiDropdownButton';

export const YjsContext = createContext(null);

const userColours = [
  '#30bced',
  '#6eeb83',
  '#ffbc42',
  '#ecd444',
  '#ee6352',
  '#9ac2c9',
  '#8acb88',
  '#1be7ff'
]

const Room = () => {
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [roomCreatedOrJoined, setRoomCreatedOrJoined] = useState(false);
  const [roomExists, setRoomExists] = useState(true);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [yDoc, setYDoc] = useState(null);
  const [user, setUser] = useState({ authenticated: false });

  // useEffect(() => {
  //   apiService.getMe().then((response) => {
  //     let user = {};
  //     if(response.error != null){
  //         user = {"authenticated": false};
  //     }else{
  //         user = {"authenticated": true, "username": response.username};
  //     }
  //     setUser(user);
  // });
  // }, [])
  

  const createRoom = async () => {
    const res = await roomService.createRoom({ name: roomName });
    if (!res.success) {
      return;
    }
    console.log(res);
    const doc = new Doc();
    const provider = new WebrtcProvider(res.room._id, doc, { signaling: ['ws://localhost:4444'] });
    provider.awareness.setLocalStateField('user', { name: username, color: userColours[Math.floor(Math.random() * userColours.length)] });
    doc.getMap('settings').set('variant', 'lines');
    doc.getMap('roomInfo').set('info', res.room);
    setYDoc(doc);
    setYjsProvider(provider);
    setRoomCreatedOrJoined(true);
  };

  const joinRoom = async () => {
    const res = await roomService.getRoom(roomName);
    if (!res.success) {
      setRoomExists(false);
      return;
    }
    const doc = new Doc();
    const provider = new WebrtcProvider(roomName, doc, { signaling: ['ws://localhost:4444'] });
    provider.awareness.setLocalStateField('user', { name: username, color: userColours[Math.floor(Math.random() * userColours.length)] });
    setYDoc(doc);
    setYjsProvider(provider);
    setRoomCreatedOrJoined(true);
  };

  if (!roomCreatedOrJoined && !user.authenticated) {
    return (
      <div className='h-full flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          <p>This is what it would look like if an anonymous user (user without an account) wants to use the app.
          If they have an account and are signed in, we don't need to show the username input.</p>
          <label>Room Name/Room ID</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <div className='flex justify-center'>
            <div className='m-5 h-0.5 w-80 bg-black'/>
          </div>
          <h1 className="font-bold text-center">Continue Anonymous: </h1>

          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          
          <h1 className="font-bold text-center">or</h1>
          <a className='mt-4 underline text-center font-bold' href={`${process.env.REACT_APP_AUTH_SERVER}/oauth2/authorization/auth0`}>Login/Signup</a>
          <div className='flex justify-center'>
            <div className='m-5 h-0.5 w-80 bg-black'/>
          </div>
          {!roomExists && <p className='text-red-500'>Room does not exist</p>}
          <button className='mt-4 underline' onClick={createRoom}>Create Room</button>
          <button className='mt-2 underline' onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    );
  }
  else if(!roomCreatedOrJoined){
    return (
      <div className='h-full flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          Welcome {user.username}!
          <div className='flex justify-center'>
            <div className='m-2 h-0.5 w-80 bg-black'/>
          </div>
          <label>Room Name</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          {!roomExists && <p className='text-red-500'>Room does not exist</p>}
          <button className='mt-4 underline' onClick={createRoom}>Create Room</button>
          <button className='mt-2 underline' onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <YjsContext.Provider value={{ yDoc, yjsProvider }}>
        <RoomInfo />
        <AuthButton />
        <ReactFlowProvider>
          <Flowboard />
        </ReactFlowProvider>
      </YjsContext.Provider>
    </>
  );
};

export default Room;

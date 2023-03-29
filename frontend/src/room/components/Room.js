import { useState, createContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Flowboard from '../../flowboard/components/Flowboard';
import RoomInfo from './RoomInfo';
import { ReactFlowProvider } from 'reactflow';
import { Doc, applyUpdate } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import PayButton from './PayButton';
import AuthButton from '../../flowboard/components/button/AuthButton';
import apiService from '../../services/apiService';
import roomService from '../services/RoomService';
import { useNavigate } from 'react-router-dom';

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
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [roomCreatedOrJoined, setRoomCreatedOrJoined] = useState(false);
  const [roomExists, setRoomExists] = useState(true);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [yDoc, setYDoc] = useState(null);
  const [user, setUser] = useState({ authenticated: false });
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/ProFeatures');
  };

  useEffect(() => {
    apiService.getMe().then((response) => {
      let user = {};
      if (response.error != null){
          user = {"authenticated": false};
      }else{
          user = {"authenticated": true, "username": response.username};
      }
      setUser(user);
  });
  }, [])

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
    // Use either roomId from url or roomName from input
    const roomIdOrName = roomId || roomName;
    const res = await roomService.getRoomInfo(roomIdOrName);
    // Continue if room exists
    if (!res.success) {
      setRoomExists(false);
      return;
    }
    const doc = new Doc();
    const provider = new WebrtcProvider(res.room._id, doc, { signaling: ['ws://localhost:4444'] });
    const update = await roomService.getDoc(res.room._id);
    const alreadyLoaded = doc.getMap('loading').get('alreadyLoaded');
    if (!alreadyLoaded && update.doc) {
      // If no one is in the room, apply the last state from the server
      doc.getMap('loading').set('alreadyLoaded', true);
      console.log('Applying update from server...')
      applyUpdate(doc, new Uint8Array(update.doc.data));
    }
    provider.awareness.setLocalStateField('user', { name: username, color: userColours[Math.floor(Math.random() * userColours.length)] });
    doc.getMap('roomInfo').set('info', res.room);
    setYDoc(doc);
    setYjsProvider(provider);
    setRoomCreatedOrJoined(true);
  };

  if (!roomCreatedOrJoined && roomId) {
    return (
      <div className='h-full flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          <p>You've been invited to:</p>
          <p className='text-2xl'>{roomId}</p>
          <label className='mt-2'>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          {!roomExists && <p className='text-red-500'>Sorry! That room does not exist</p>}
          <button className='mt-4 underline' onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    )
  } else if (!roomCreatedOrJoined && !user.authenticated) {
    return (
      <div className='h-full flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          <label>Room Name/Code</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <div className='flex justify-center'>
            <div className='m-5 h-0.5 w-80 bg-black' />
          </div>
          <h1 className="font-bold text-center">Continue Anonymous: </h1>

          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

          <h1 className="font-bold text-center">or</h1>
          <a className='mt-4 underline text-center font-bold' href={`${process.env.REACT_APP_AUTH_SERVER}/oauth2/authorization/auth0`}>Login/Signup</a>
          <div className='flex justify-center'>
            <div className='m-5 h-0.5 w-80 bg-black' />
          </div>
          {!roomExists && <p className='text-red-500'>Room does not exist</p>}
          <button className='mt-4 underline' onClick={createRoom}>Create Room</button>
          <button className='mt-2 underline' onClick={joinRoom}>Join Room</button>
          
        </div>
      </div>
    );
  }
  else if (!roomCreatedOrJoined) {
    return (
      <div className='h-full flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          Welcome {user.username}!
          <div className='flex justify-center'>
            <div className='m-2 h-0.5 w-80 bg-black' />
          </div>
          <label>Room Name/Code</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          {!roomExists && <p className='text-red-500'>Room does not exist</p>}
          <button className='mt-4 underline' onClick={createRoom}>Create Room</button>
          <button className='mt-2 underline' onClick={joinRoom}>Join Room</button>
          <button onClick={handleButtonClick}>Go to Pro Features</button>
          <PayButton/>
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
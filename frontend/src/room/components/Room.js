import { useState, createContext } from 'react';
import Flowboard from '../../flowboard/components/Flowboard';
import RoomInfo from './RoomInfo';
import { ReactFlowProvider } from 'reactflow';
import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import AuthButton from '../../flowboard/components/button/AuthButton';

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
  const [yjsProvider, setYjsProvider] = useState(null);
  const [yDoc, setYDoc] = useState(null);

  const createRoom = () => {
    const doc = new Doc();
    const provider = new WebrtcProvider(roomName, doc, { signaling: ['ws://localhost:1234'] });
    provider.awareness.setLocalStateField('user', { name: username, color: userColours[Math.floor(Math.random() * userColours.length)] });
    doc.getMap('settings').set('variant', 'lines');
    doc.getMap('roomInfo').set('name', roomName);
    setYDoc(doc);
    setYjsProvider(provider);
    setRoomCreatedOrJoined(true);
  };

  const joinRoom = () => {
    const doc = new Doc();
    const provider = new WebrtcProvider(roomName, doc, { signaling: ['ws://localhost:1234'] });
    provider.awareness.setLocalStateField('user', { name: username, color: userColours[Math.floor(Math.random() * userColours.length)] });
    setYDoc(doc);
    setYjsProvider(provider);
    setRoomCreatedOrJoined(true);
  };

  if (!roomCreatedOrJoined) {
    return (
      <div className='h-full flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          <p>This is what it would look like if an anonymous user (user without an account) wants to use the app.
          If they have an account and are signed in, we don't need to show the username input.</p>
          <label className=''>Room Name</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <div className='flex justify-center'>
            <div className='m-5 h-0.5 w-80 bg-black'/>
          </div>
          <h className="font-bold text-center">Continue Anonymous: </h>

          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          
          <h className="font-bold text-center">or</h>
          <a className='mt-4 underline text-center font-bold' href={`${process.env.REACT_APP_AUTH_SERVER}/oauth2/authorization/auth0`}>Login/Signup</a>
          <div className='flex justify-center'>
            <div className='m-5 h-0.5 w-80 bg-black'/>
          </div>
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

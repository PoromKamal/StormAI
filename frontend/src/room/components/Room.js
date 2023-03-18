import { useState, createContext } from 'react';
import Flowboard from '../../flowboard/components/Flowboard';
import RoomInfo from './RoomInfo';
import { ReactFlowProvider } from 'reactflow';
import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

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
      <div className='h-full bg-white flex justify-center content-center'>
        <div className='w-96 flex flex-col border bg-gray-100 m-auto justify-center p-4 rounded'>
          <p>This is what it would look like if an anonymous user (user without an account) wants to use the app.
          If they have an account and are signed in, we don't need to show the username input.</p>
          <label className=''>Room Name</label>
          <input type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <label className='mt-2'>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
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
        <ReactFlowProvider>
          <Flowboard />
        </ReactFlowProvider>
      </YjsContext.Provider>
    </>
  );
};

export default Room;

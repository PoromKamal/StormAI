import { useState, createContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Flowboard from '../../flowboard/components/Flowboard';
import RoomInfo from './RoomInfo';
import { ReactFlowProvider } from 'reactflow';
import { Doc, applyUpdate } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import AuthButton from '../../flowboard/components/button/AuthButton';
import apiService from '../../services/apiService';
import roomService from '../services/RoomService';
import { useNavigate } from 'react-router-dom';
import StormLogo from './StormLogo';
import NavBar from './NavBar';

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
  const [roomFull, setRoomFull] = useState(false);
  const [yjsProvider, setYjsProvider] = useState(null);
  const [yDoc, setYDoc] = useState(null);
  const [user, setUser] = useState({ authenticated: false });

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
      console.log("Unable to create room");
      return;
    }
    joinRoom(res.room._id);
  };

  const joinRoom = async (room) => {
    // Use either roomId from url, roomName from input, or room from createRoom
    let roomIdOrName = roomId || roomName;
    if (room) {
      roomIdOrName = room;
    }
    const res = await roomService.getRoomInfo(roomIdOrName);
    // Check if room exists or is full
    if (!res.success) {
      setRoomExists(false);
      return;
    } else if (res.room.numUsers >= 5) {
      setRoomFull(true);
      return;
    }
    // Joins room by creating a new yjs doc and provider
    const doc = new Doc();
    let signalingServer =  process.env.NODE_ENV === 'production' ? ['wss://signaling.stormai.live'] : ['ws://localhost:4444'];
    const provider = new WebrtcProvider(res.room._id, doc, { signaling: signalingServer });
    const update = await roomService.getDoc(res.room._id);
    // Get number of users currently in room
    const usersInRoom = Array.from(provider.awareness.getStates().values()).length;
    if (usersInRoom <= 1 && update.doc) {
      // If first to join the room, apply the last state from the server
      console.log('Applying update from server...')
      applyUpdate(doc, new Uint8Array(update.doc.data));
      roomService.updateNumUsers(res.room._id, 1);
    }
    // Assign username and colour to user, and set doc and provider for context
    provider.awareness.setLocalStateField('user', { name: username, color: userColours[Math.floor(Math.random() * userColours.length)] });
    doc.getMap('roomInfo').set('info', res.room);
    setYDoc(doc);
    setYjsProvider(provider);
    setRoomCreatedOrJoined(true);
  };

  const horizontalLine = (<div className='mx-32 my-3 rounded-lg h-1 bg-black' />)
  const animateText = "hover:animate-text hover:bg-gradient-to-r from-blue-900 via-indigo-500 to-cyan-400 hover:text-white"

  if (!roomCreatedOrJoined) {
    return (
      <div className='h-full flex flex-col justify-center'>
        <StormLogo />
        <NavBar />
        <div className='h-20 ml-32 text-6xl font-semibold text-storm-blue animate-introText animate-text bg-gradient-to-r from-blue-900 via-indigo-500 to-cyan-400 bg-clip-text text-transparent'>
          Get started with AI Powered Productivity.
        </div>

        {horizontalLine}

        <div className='flex flex-col justify-evenly text-2xl font-semibold text-storm-blue mx-auto'>
          <div className='w-full flex gap-6 mt-10'>

            {
              roomId ?
                <>
                  <div>
                    You've been invited to:
                    <p className='text-2xl'>{roomId}</p>
                  </div>
                </> :
                <input className="w-fit text-3xl border border-solid border-2 rounded-md font-semibold p-1" type="text" placeholder='Enter room name' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            }

            {
              user.authenticated ?
                "" :
                <>
                  <div>
                    as
                  </div>
                  <input className="w-fit text-3xl border border-solid border-2 rounded-md font-semibold p-1"
                    type="text"
                    placeholder='Enter username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />
                </>
            }

          </div>

          {
            roomId ?
              <>
              </> :
              <>
                <button className={`mx-auto w-fit mt-10 border-solid border-2 rounded-xl font-semibold p-3  ${animateText}`}
                  onClick={createRoom}>
                  Create Room
                </button>
                <div className="mx-auto my-1">
                  or
                </div>
              </>
          }

          <button className={`mx-auto w-fit border-solid border-2 rounded-xl font-semibold p-3  ${animateText}`}
            onClick={() => joinRoom()}>
            Join Room
          </button>
          {!roomExists && <p className='mx-auto font-semibold text-red-500'>Room does not exist</p>}
          {roomFull && <p className='mx-auto font-semibold text-red-500'>Room is full</p>}
        </div>
      </div>
    )
  }

  return (
    <>
      <YjsContext.Provider value={{ yDoc, yjsProvider }}>
        <StormLogo />
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
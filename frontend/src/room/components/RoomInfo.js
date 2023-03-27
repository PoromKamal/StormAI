import { useState, useContext, useEffect } from 'react'
import { YjsContext } from './Room';
import { FaUsers } from 'react-icons/fa';

const RoomInfo = () => {
  const { yDoc, yjsProvider } = useContext(YjsContext);
  const [awareness] = useState(yjsProvider.awareness);
  const [users, setUsers] = useState([]);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const newUsers = [];
      awareness.getStates().forEach(state => {
        if (state.user) {
          newUsers.push(state.user);
        }
      })
      setUsers(newUsers);
    }

    awareness.on('change', handler);
  }, [awareness]);

  const toggleInfoOpen = () => {
    setInfoOpen(!infoOpen);
  }

  return (
    <>
      <div
        className="z-50 top-0 right-0 m-2 absolute w-10 h-10 bg-gray-900 text-white border-none rounded shadow-md flex justify-center items-center text-xl hover:bg-gray-700 hover:scale-110 transition-transform hover: cursor-pointer"
        onClick={toggleInfoOpen}
      >
        <FaUsers />
      </div>
      {infoOpen &&
        <div className='flex flex-col fixed top-0 right-0 w-64 p-4 mr-14 mt-2 border rounded-md bg-gray-900 text-white opacity-90 z-50 shadow'>
          <h1>Room Name: {yDoc.getMap('roomInfo').get('info').name}</h1>
          <h1>Connected users:</h1>
          {users.map((user, index) => (
            <p key={index} style={{ color: user.color }}>{user.name}</p>
          ))}
        </div>
      }
    </>
  )
}

export default RoomInfo
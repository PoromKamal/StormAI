import { useState, useContext, useEffect } from 'react'
import { YjsContext } from './Room';
import Cursor from '../../cursors/components/Cursor';

const RoomInfo = () => {
  const { yjsProvider } = useContext(YjsContext);
  const [awareness] = useState(yjsProvider.awareness);
  const [users, setUsers] = useState([]);

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

  return (
    <>
      <div className='flex flex-col fixed top-0 right-0 w-96 p-4 m-2 border rounded-md bg-white z-50'>
        <h1>Room Info</h1>
        {users.map((user, index) => (
          <p key={index} style={{ color: user.color }}>{user.name}</p>
        ))}
      </div>
    </>
  )
}

export default RoomInfo
import { useState, useContext, useEffect } from 'react'
import { YjsContext } from './Room';

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
      console.log(newUsers);
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
      {users.filter(user => user.cursor).filter(user => user.name !== awareness.getLocalState().user.name).map((user, index) => (
        <div key={index} className='absolute border z-50' style={{ left: `${user.cursor.x}px`, top: `${user.cursor.y}px`, color: `${user.color}` }}>
          {user.name}
        </div>
      ))}
    </>
  )
}

export default RoomInfo
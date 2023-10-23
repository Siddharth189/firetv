import React from 'react';
import { SocketEvent } from '../socket-event.enum';

const UserListModal = ({ socket, userState, currentRoom, setOpen }) => {
  // Handle remove user from room
  const removeUser = (userId, userName) => {
    if (window.confirm(`Do you want to remove ${userName} ( ${userId} ) from this room ?\nThis cannot be undone..!`)) {
      socket.emit(SocketEvent.LEAVE_ROOM, currentRoom.roomId, userId);
      socket.emit(SocketEvent.REMOVED_FROM_ROOM_NOTIFY, currentRoom.roomId, userId);
    }
  };

  return (
    <div className='modal-container'>
      <div className='modal'>
        <span className='material-icons close' onClick={() => setOpen(false)}>
          close
        </span>
        <div className='modal-header'>All Users</div>
        <div className='modal-body'>
          <div className='user-item'>
            <div className='name host'>
              {currentRoom.host.name.length > 0 ? currentRoom.host.name : currentRoom.host.userId}
              {currentRoom.host.userId === userState.userId && ' (You)'}
            </div>
            <div className='host-badge'>Host</div>
          </div>
          {currentRoom.participants.map((user, index) => (
            <div key={index} className='user-item'>
              {user.userId === userState.userId ? (
                <div className='name current'>{user.name.length > 0 ? user.name : user.userId} (You)</div>
              ) : (
                <div className='name'>{user.name.length > 0 ? user.name : user.userId}</div>
              )}
              {userState.userId === currentRoom.host.userId && (
                <button className='btn btn-sm btn-outline-danger' onClick={() => removeUser(user.userId, user.name)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <div className='modal-footer'></div>
      </div>
    </div>
  );
};

export default UserListModal;

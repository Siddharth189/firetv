import React, { useState, useEffect, Fragment } from "react";

import Avatar from "../images/avatar.png";

import CreateJoinRoom from "./CreateJoinRoom.component";
import UserListItem from "./UserListItem.component";
import RoomListItem from "./RoomListItem.component";
import { SocketEvent } from "../socket-event.enum";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";

function LeftSidebarComponent({
  socket,
  userList,
  setUserList,
  userState,
  chatBoxList,
  setChatBoxList,
  roomList,
  setRoomList,
  isSidebarHidden,
  setIsSidebarHidden,
}) {
  const { userId, name, color } = userState;
  const [isUsersHidden, setIsUsersHidden] = useState(false);

  // Tell server to add new user when userId changes
  useEffect(() => {
    socket.emit(SocketEvent.NEW_USER, userId, name, color);
  }, [userId]);

  // Watch the socket to update userList & roomList
  useEffect(() => {
    socket.on(SocketEvent.GET_USERS, (users) => {
      setUserList(users);
    });

    socket.on(SocketEvent.USER_DISCONNECTED, (disconnectedUserId) => {
      setUserList((prevList) => {
        let tempUserList = prevList;
        tempUserList = prevList.filter(
          (item) => item.userId !== disconnectedUserId
        );
        return tempUserList;
      });
      setChatBoxList((prevList) => {
        let tempList = prevList;
        tempList = prevList.filter((item) => {
          if (item.id === disconnectedUserId && item.status === 1) {
            setIsSidebarHidden(false);
          } else if (item.id !== disconnectedUserId) {
            return item;
          }
        });
        return tempList;
      });
    });

    socket.on(SocketEvent.ROOM_CLOSED, (closedRoomId) => {
      try {
        setIsSidebarHidden(false);
        setChatBoxList((prevList) => {
          let tempList = prevList;
          tempList = tempList.filter((item) => item.id !== closedRoomId);
          return tempList;
        });
        setRoomList((prevList) => {
          let tempList = prevList;
          tempList = tempList.filter(
            (roomItem) => roomItem.roomId !== closedRoomId
          );
          return tempList;
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on(SocketEvent.LEFT_ROOM, (from_roomId, leftUserId) => {
      try {
        if (leftUserId === userState.userId) {
          setIsSidebarHidden(false);
          setChatBoxList((prevList) => {
            let tempList = prevList;
            tempList = tempList.filter((item) => item.id !== from_roomId);
            return tempList;
          });
          setRoomList((prevList) => {
            let tempList = prevList;
            tempList = tempList.filter(
              (roomItem) => roomItem.roomId !== from_roomId
            );
            return tempList;
          });
        } else {
          setRoomList((prevList) => {
            let tempList = prevList;
            var roomIndex = tempList.findIndex(
              (roomItem) => roomItem.roomId === from_roomId
            );
            let temp = tempList[roomIndex].participants.filter(
              (participant) => participant.userId !== leftUserId
            );
            tempList[roomIndex].participants = temp;
            return tempList;
          });
          // setOpen((prevState) => !prevState);
          // setOpen((prevState) => !prevState);
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  return (
    <Fragment>
      <div
        className={`left-sidebar-container ${isSidebarHidden && `hidden`}`}
        onClick={() => setIsSidebarHidden(true)}
      >
        <div
          className={`left-sidebar ${isSidebarHidden && `hidden`}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="current-user" id="current-user">
            <div className="avatar">
              <img src={Avatar} alt="" />
            </div>
            <div className="details">
              {name.length > 0 && (
                <div style={{ display: "flex" }}>
                  <p className="name" title={name}>
                    {name}
                  </p>
                </div>
              )}
              <p className="userId">
                User Id: <span>{userId}</span>
              </p>
            </div>
          </div>

          <div className="btn-container" id="btn-container">
            <CreateJoinRoom
              socket={socket}
              userState={userState}
              roomList={roomList}
              setRoomList={setRoomList}
            />
          </div>

          <div className="user-list-container">
            <div className="justify-between">
              <p className="heading">Online users and rooms </p>
              <button
                onClick={() => setIsUsersHidden((prevState) => !prevState)}
                style={{
                  width: "50px",
                  fontSize: "1.8em",
                  color: "#041243",
                  backgroundColor: "transparent",
                  padding: "1px",
                  border: "none",
                }}
              >
                {isUsersHidden ? (
                  <IoIosArrowDropupCircle />
                ) : (
                  <IoIosArrowDropdownCircle />
                )}
              </button>
            </div>
            <div>
              {!isUsersHidden && (
                <ul className="user-list">
                  {roomList.map((room, index) => (
                    <RoomListItem
                      key={index}
                      room={room}
                      userState={userState}
                      chatBoxList={chatBoxList}
                      setChatBoxList={setChatBoxList}
                      setIsSidebarHidden={setIsSidebarHidden}
                    />
                  ))}

                  {userList.map(
                    (user, index) =>
                      user.userId !== userId && (
                        <UserListItem
                          key={index}
                          user={user}
                          chatBoxList={chatBoxList}
                          setChatBoxList={setChatBoxList}
                          setIsSidebarHidden={setIsSidebarHidden}
                        />
                      )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default LeftSidebarComponent;

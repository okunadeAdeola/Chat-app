import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { BsSendFill } from "react-icons/bs";
import { MdKeyboardVoice } from "react-icons/md";
import { Link } from 'react-router-dom';
import { ReactMediaRecorder } from "react-media-recorder";

const baseUrl = "https://chat-backend-4uuv.onrender.com";

// Video Preview Component
const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return stream ? (
    <video ref={videoRef} width={500} height={500} autoPlay muted />
  ) : (
    <p>No video stream available</p>
  );
};

const ChatAndRecord = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'record'
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    const socketInstance = io(baseUrl);
    setSocket(socketInstance);

    socketInstance.emit('user-online', userId);
    fetchUsers(socketInstance);

    socketInstance.on('recievemessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketInstance.on('update-online-users', (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    return () => socketInstance.disconnect();
  }, [userId]);

  const fetchUsers = async (socketInstance) => {
    const token = localStorage.getItem('userToken');
    socketInstance.emit('getUsers', { token });

    socketInstance.on('getUsers', (data) => {
      if (data.status) {
        const updatedUsers = data.users.map((user) => ({
          ...user,
          online: onlineUsers.includes(user._id),
        }));
        setUsers(updatedUsers);
      }
    });
  };

  const fetchMessages = async (receiverId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/user/getMessage?userId=${userId}&receiverId=${receiverId}`
      );
      if (response.data.status) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleUserClick = (user) => {
    setReceiverId(user._id);
    setSelectedUser(user);
    fetchMessages(user._id);
    setIsChatting(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message || !receiverId) return;

    const newMessage = {
      senderId: userId,
      receiverId,
      content: message,
      timestamp: new Date(),
    };

    socket.emit('chat message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex justify-around bg-gray-200 p-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`px-4 py-2 ${activeTab === 'record' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
        >
          Record
        </button>
        <Link to="/signin" className="px-4 py-2 bg-red-500 text-white rounded">
          Log Out
        </Link>
      </div>

      {/* Chat Section */}
      {activeTab === 'chat' && (
        <div className="flex flex-grow overflow-hidden">
          {!isChatting ? (
            <div className="w-1/4 border-r overflow-y-auto">
              <h2 className="text-lg font-bold p-4">Users</h2>
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-4 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleUserClick(user)}
                >
                  <span className="font-bold">{user.username}</span>{' '}
                  <span className={user.online ? 'text-green-500' : 'text-red-500'}>
                    {user.online ? '(Online)' : '(Offline)'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col flex-grow">
              <div className="p-4 border-b">
                <button onClick={() => setIsChatting(false)} className="text-blue-500">
                  ← Back
                </button>
                <h3 className="text-lg font-bold">
                  Chatting with {selectedUser?.username}
                </h3>
              </div>
              <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2 mb-2 ${
                      msg.senderId === userId ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded ${
                        msg.senderId === userId ? 'bg-green-200' : 'bg-gray-200'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-grow p-2 border rounded-l"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-r"
                >
                  <BsSendFill />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Recording Section */}
      {activeTab === 'record' && (
        <div className="p-4">
          <ReactMediaRecorder
            video
            render={({ status, startRecording, stopRecording, mediaBlobUrl, previewStream }) => (
              <div>
                <div className="mb-4">
                  <button
                    onClick={startRecording}
                    className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                  >
                    Start Recording
                  </button>
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Stop Recording
                  </button>
                </div>
                <p>Status: {status}</p>
                <VideoPreview stream={previewStream} />
                {mediaBlobUrl && (
                  <div>
                    <h3 className="text-lg font-bold">Recorded Video</h3>
                    <video src={mediaBlobUrl} controls className="w-full" />
                    <a
                      href={mediaBlobUrl}
                      download="recorded-video.mp4"
                      className="block mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Download Video
                    </a>
                  </div>
                )}
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ChatAndRecord;

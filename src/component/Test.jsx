import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { ReactMediaRecorder } from 'react-media-recorder';
import { BsSendFill } from 'react-icons/bs';
import { MdKeyboardVoice } from 'react-icons/md';

const baseUrl = "https://chat-backend-4uuv.onrender.com";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = io(baseUrl);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    socket.emit('user-online', userId);

    socket.on('getUsers', ({ users }) => setUsers(users));

    socket.on('receiveMessage', (msg) => setMessages((prev) => [...prev, msg]));

    fetchUsers(token);
    return () => socket.disconnect();
  }, []);

  const fetchUsers = (token) => {
    socket.emit('getUsers', { token });
  };

  const fetchMessages = async (receiverId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`${baseUrl}/user/getMessage`, {
        params: { userId, receiverId },
      });
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (message && receiverId) {
      const msg = { senderId: userId, receiverId, content: message };
      socket.emit('chatMessage', msg);
      setMessages((prev) => [...prev, msg]);
      setMessage('');
    }
  };

  const handleAudioSend = async (audioBlobUrl) => {
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    const audioBlob = await fetch(audioBlobUrl).then((res) => res.blob());
    formData.append('audio', audioBlob);
    formData.append('senderId', userId);
    formData.append('receiverId', receiverId);

    try {
      const response = await axios.post(`${baseUrl}/user/send-voice`, formData);
      if (response.data.status) {
        const audioMsg = { senderId: userId, receiverId, content: response.data.audioUrl, type: 'audio' };
        socket.emit('chatMessage', audioMsg);
        setMessages((prev) => [...prev, audioMsg]);
      }
    } catch (err) {
      console.error('Error sending audio message:', err);
    }
  };

  return (
    <div className="h-screen flex">
      <div className="w-1/4 border-r">
        <h2 className="p-4 text-lg font-bold">Users</h2>
        {users.map((user) => (
          <div
            key={user._id}
            className={`p-4 cursor-pointer ${user._id === receiverId ? 'bg-gray-200' : ''}`}
            onClick={() => {
              setReceiverId(user._id);
              setSelectedUser(user);
              fetchMessages(user._id);
            }}
          >
            {user.username}
          </div>
        ))}
      </div>
      <div className="flex-grow flex flex-col">
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 ${
                msg.senderId === localStorage.getItem('userId') ? 'text-right' : 'text-left'
              }`}
            >
              {msg.type === 'audio' ? (
                <audio controls src={msg.content} />
              ) : (
                <span className="inline-block px-3 py-2 rounded bg-gray-200">
                  {msg.content}
                </span>
              )}
            </div>
          ))}
        </div>
        <ReactMediaRecorder
          audio
          render={({ startRecording, stopRecording, mediaBlobUrl }) => (
            <form className="p-4 flex items-center" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Type a message"
                className="flex-grow border p-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="button"
                className="mx-2"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
              >
                <MdKeyboardVoice size={24} />
              </button>
              <button type="submit" className="text-blue-500">
                <BsSendFill size={24} />
              </button>
              {mediaBlobUrl && (
                <button
                  type="button"
                  onClick={() => handleAudioSend(mediaBlobUrl)}
                  className="ml-2 text-green-500"
                >
                  Send Audio
                </button>
              )}
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default Chat;

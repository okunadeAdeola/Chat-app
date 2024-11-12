import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { BsSendFill } from "react-icons/bs";
const baseUrl = "https://chat-backend-4uuv.onrender.com";

const Chat = () => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [receiverId, setReceiverId] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(null);
    const [isChatting, setIsChatting] = useState(false);
    const time = new Date().toLocaleTimeString();

    useEffect(() => {
        const initialSocket = io(baseUrl);
        setSocket(initialSocket);
        initialSocket.emit('user-online', userId);
        getAllUsers(initialSocket); 

        const lastChattedUserId = localStorage.getItem('lastChattedUserId');
        if (lastChattedUserId) {
            setReceiverId(lastChattedUserId);
            fetchMessages(lastChattedUserId);
            initialSocket.emit('getUsers', { token: localStorage.getItem('userToken') });
            initialSocket.on('getUsers', (data) => {
                if (data.status) {
                    const user = data.users.find(u => u._id === lastChattedUserId);
                    setSelectedUser(user);
                }
            });
        }
        initialSocket.on('update-online-users', (onlineUsersIds) => {
            setOnlineUsers(onlineUsersIds);
        });

        return () => {
            initialSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('recievemessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        socket.on('getUsers', (data) => {
            if (data.status) {
                const filteredUsers = data.users.filter(user => user._id !== userId);
                const updatedUsers = filteredUsers.map(user => ({
                    ...user,
                    online: onlineUsers.includes(user._id),
                }));
                setUsers(updatedUsers);
            }
        });

        return () => {
            socket.off('recievemessage');
            socket.off('getUsers');
        };
    }, [socket, onlineUsers, userId]);

    const getAllUsers = async (socket) => {
        if (!socket) return;
        try {
            const token = localStorage.getItem('userToken');
            socket.emit('getUsers', { token });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchMessages = async (senderId) => {
        setMessages([]);
        try {
            const response = await axios.get(`${baseUrl}/user/getMessage?userId=${userId}&receiverId=${senderId}`);
            if (response.data.status) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message && receiverId) {
            try {
                socket.emit('chat message', { senderId: userId, receiverId, content: message, users: [receiverId, userId] });
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { senderId: userId, receiverId, content: message, timestamp: new Date() }
                ]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleUserClick = (user) => {
        setReceiverId(user._id);
        setSelectedUser(user);
        localStorage.setItem('lastChattedUserId', user._id);
        fetchMessages(user._id);
        setIsChatting(true); // Show chat view
    };

    const handleBack = () => {
        setIsChatting(false); // Show user list again
        setSelectedUser(null);
    };

    return (
        <div className='background'>
            <div className="flex flex-col md:flex-row h-screen">
                {!isChatting ? (
                    // User list view
                    <div className="md:w-1/4 w-full p-4 border-b md:border-b-0 md:border-r border-gray-300 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 bg-gray-100 border-t rounded-sm p-1 border-gray-300">Users</h2>
                        <div className="space-y-2">
                            {users.map((item, i) => (
                                <div
                                    key={i}
                                    className="p-2 cursor-pointer hover:bg-gray-200 rounded bg-gray-100 bg-opacity-50"
                                    onClick={() => handleUserClick(item)}
                                >
                                    {item.username}
                                    <span className={`ml-2 ${item.online ? 'text-green-500' : 'text-red-500'}`}>
                                        ({item.online ? 'Online' : 'Offline'})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Chat view
                    <div className="flex-1 flex flex-col bg-opacity-80 overflow-y-auto">
                        <div className="flex items-center p-4 bg-gray-100 border-b border-gray-300 sticky top-0 z-100">
                            <button onClick={handleBack} className="mr-4 text-blue-500 hover:text-blue-700">
                                ← Back
                            </button>
                            <h3 className="text-xl font-semibold ">
                                Chatting with {selectedUser?.username}
                            </h3>
                        </div>
                        <div className="flex-1 p-4">
                            <div className="space-y-2">
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'} p-2`}
                                    >
                                        <div className={`p-2 rounded ${msg.senderId === userId ? 'bg-green-200 text-blue-800' : 'bg-gray-200 text-white-800'}`}>
                                            <strong>{msg.senderId === userId ? 'You' : selectedUser.username}:</strong> {msg.content}
                                            <em className="text-sm text-gray-500">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : <span>{time}</span>}</em>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <form className="p-4 bg-gray-500 border-t border-gray-300 sticky bottom-0 z-500" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message"
                                className="w-[280px] p-2 border border-gray-300 rounded"
                            />
                            <button
                                type="submit"
                                className="mt-2 px-4 py-4 bg-blue-500 text-white rounded hover:bg-blue-600 h-[44px]"
                            >
                               <BsSendFill/>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;

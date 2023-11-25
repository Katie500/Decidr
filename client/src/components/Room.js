 // client/src/components/Room.js
 import React, { useEffect, useState } from 'react';
 import { useParams } from 'react-router-dom';
 import socket from '../utils/socket';
 
 const Room = () => {
   const { roomName } = useParams();
   const [messages, setMessages] = useState([]);
   const [message, setMessage] = useState('');
 
   useEffect(() => {
     socket.emit('new-user', roomName, 'YourName'); // Replace 'YourName' with the actual user's name
 
     socket.on('chat-message', (data) => {
       setMessages((prevMessages) => [...prevMessages, `${data.name}: ${data.message}`]);
     });
 
     socket.on('user-connected', (name) => {
       setMessages((prevMessages) => [...prevMessages, `${name} connected`]);
     });
 
     socket.on('user-disconnected', (name) => {
       setMessages((prevMessages) => [...prevMessages, `${name} disconnected`]);
     });
 
     return () => {
       // Clean up event listeners on component unmount
       socket.off('chat-message');
       socket.off('user-connected');
       socket.off('user-disconnected');
     };
   }, [roomName]);
 
   const sendMessage = (e) => {
     e.preventDefault();
     socket.emit('send-chat-message', roomName, message);
     setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
     setMessage('');
   };
 
   return (
     <div>
       <div>
         {messages.map((msg, index) => (
           <div key={index}>{msg}</div>
         ))}
       </div>
       <form onSubmit={sendMessage}>
         <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
         <button type="submit">Send</button>
       </form>
     </div>
   );
 };
 
 export default Room;
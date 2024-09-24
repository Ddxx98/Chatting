import React, { useState, useEffect } from 'react';
import './ChatPage.css';
import { useParams } from 'react-router-dom';

let socket;

function ChatPage() {
  const [messages, setMessages] = useState([]); // Ensure it is an array
  const [input, setInput] = useState('');

  // Get the current user and other user from localStorage
  const username = localStorage.getItem('Name');
  const { otherUsername } = useParams();

  useEffect(() => {
    if (username && otherUsername) {
      // Fetch chat history between current user and other user
      fetch(`http://localhost:5000/chat-history?from=${username}&to=${otherUsername}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure the data is an array, or set it to an empty array
          setMessages(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.log('Error fetching chat history', err);
          setMessages([]); // Set to an empty array in case of error
        });
    }
  }, [username, otherUsername]);

  useEffect(() => {
    // Establish WebSocket connection when the chat page is opened
    socket = new WebSocket('ws://localhost:5000/ws');
    
    // Handle incoming messages
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      // Ensure that `prevMessages` is always an array when updating
      setMessages((prevMessages) =>
        Array.isArray(prevMessages) ? [...prevMessages, newMessage] : [newMessage]
      );
    };

    // Cleanup on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [otherUsername]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const message = { from: username, to: otherUsername, text: input };
      socket.send(JSON.stringify(message));
      setInput('');
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>Chat with {otherUsername}</h2>
      </div>
      <div className="chat-window">
        {/* Render messages only if the array is not empty */}
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from === username ? 'sent' : 'received'}`}
            >
              {/* Display 'from' and 'to' for each message */}
              <p className="message-info">
                <strong>{msg.from}</strong> 
              </p>
              <p>{msg.text}</p>
            </div>
          ))
        ) : (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPage;

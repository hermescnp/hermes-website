import React, { useRef, useEffect, useState } from 'react';
import { TypingEffect } from '@/components/Uxhelper/TypingEffect';
import '@/styles/Botchat.css'

export default function Botchat() {
  const [messages, setMessages] = useState<string[]>([
    "It's ok, I was only testing how a very long text looks. It seems right!"
  ]);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = 999999; // a large number to ensure it's at the bottom
    }
  }, [messages]);

  const addNewMessage = (newMessage: string) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  return (
    <>
      <div id='chatBox' ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`messageBubble ${index === messages.length - 1 ? 'active' : ''}`}
            ref={index === messages.length - 1 ? lastMessageRef : null}

          >
            <TypingEffect
              message={message}
              typingSpeed={50}
              showCursor={index === messages.length - 1}
            />
          </div>
        ))}
      </div>
      <button onClick={() => addNewMessage("Hello... how can i help you?")}>
        +
      </button>
    </>
  )
}

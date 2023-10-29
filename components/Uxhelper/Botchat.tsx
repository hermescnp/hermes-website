import React, { useRef, useEffect, useState } from 'react'
import { TypingEffect } from '@/components/Uxhelper/TypingEffect'
import { MessageProvider } from '@/components/Uxhelper/MessageProvider'
import '@/styles/Botchat.css'

interface BotchatProps {
  messages: string[];
  chatPrinter: (newMessage: string) => void;
  chatBoxRef: React.MutableRefObject<HTMLDivElement | null>;
  isExperienceStarted: boolean; 
}

export const Botchat: React.FC<BotchatProps> = ({ messages, chatPrinter, chatBoxRef, isExperienceStarted}) => {

  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div id='chatBox' ref={chatBoxRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={ (isExperienceStarted? 'messageBubble' : 'loadingMessageBubble') + ' ' + (index === messages.length - 1 ? 'active' : '')}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <TypingEffect
              message={message}
              typingSpeed={30}
              showCursor={index === messages.length - 1}
              isSoundOn={index === messages.length - 1}
            />
          </div>
        ))}
      </div>
      <MessageProvider chatPrint={chatPrinter} />
    </>
  )
}

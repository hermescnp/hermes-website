import React, { useRef, useEffect, useLayoutEffect } from 'react'
import { TypingEffect } from '@/components/Uxhelper/TypingEffect'
import { MessageProvider } from '@/components/Uxhelper/MessageProvider'
import { useExperienceContext } from '@/context/ExperienceContext'
import type { BotMessage } from 'Types'
import '@/styles/Botchat.css'

interface BotchatProps {
  messages: BotMessage[];
  chatPrinter: (newMessage: BotMessage) => void;
  chatBoxRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const Botchat: React.FC<BotchatProps> = ({ messages, chatPrinter, chatBoxRef }) => {
  const { isChatbotExpanded } = useExperienceContext();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const isExpandedRef = useRef<boolean>(isChatbotExpanded);

  useEffect(() => {
    isExpandedRef.current = isChatbotExpanded;
  }, [isChatbotExpanded]);

  return (
    <>
      <div id="chatBox" ref={chatBoxRef}>
        {messages.map((msg, idx) => {
          const isLast = idx === messages.length - 1
          if (msg.type === 'system' && !isLast) {
            return null
          }
          const baseClass = 'messageBubble'
          const typeClass = `messageBubble--${msg.type}`
          return (
            <div
              key={idx}
              className={`${baseClass} ${typeClass}${isLast ? ' active' : ''}`}
              ref={isLast ? lastMessageRef : null}
            >
              <TypingEffect
                message={msg.content}
                typingSpeed={30}
                showCursor={isLast}
                isSoundOn={isLast}
              />
            </div>
          )
        })}
      </div>
      <MessageProvider chatPrint={chatPrinter} />
    </>
  )
}

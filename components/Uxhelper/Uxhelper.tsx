import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import '../../styles/Uxhelper.css'
import Image from 'next/image'
import Botface from '@/components/Uxhelper/Botface'
import { Botchat } from '@/components/Uxhelper/Botchat'
import { useExperienceContext } from '@/context/ExperienceContext'
import type { BotMessage } from 'Types'

// Directly refer to the message sound
const messageSound: string = '/assets/sounds/switch_effect.mp3';

const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch((error) => { });
};

export const Uxhelper: React.FC = () => {
    const { startExperience, isInfoPanelExpanded, isUserPanelExpanded, isPortraitMode, isChatbotExpanded, setIsChatbotExpanded } = useExperienceContext();
    const [messages, setMessages] = useState<BotMessage[]>([
        {
            type: 'agent',
            content: "Hi! This is the Hermes's Science Lab, I'm here to assist you in your experience through this metaverse."
        }
    ]);

    const chatBoxRef = useRef<HTMLDivElement | null>(null);
    const chatContentRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [hiddenChatBot, setHideChatBot] = useState<boolean>(false);
    const [isBotActive, setIsBotActive] = useState<boolean>(true);
    const isExpandedRef = useRef<boolean>(isChatbotExpanded);
    const instanceInput = useRef<HTMLInputElement | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [isChatbotInputActive, setIsChatbotInputActive] = useState<boolean>(false);

    useEffect(() => {
        const content = chatContentRef.current
        const box = chatBoxRef.current
        const outer = containerRef.current
        if (!content || !box) return

        // always snap to bottom right away:
        content.scrollTop = content.scrollHeight

        // one observer will fire whenever *either* the messages change size *or*
        // the container itself changes size
        const ro = new ResizeObserver(() => {
            content.scrollTop = content.scrollHeight
        })

        // observe the thing that grows when you get new bubbles:
        ro.observe(box)

        // if you want to scroll when *the frame* gets resized (e.g. expand/collapse),
        // observe that too:
        if (outer) ro.observe(outer)

        return () => ro.disconnect()
    }, [messages])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleFocus = () => {
        if (instanceInput.current) {
            instanceInput.current.focus();
        }
        setIsChatbotInputActive(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsChatbotInputActive(false);
        }, 300);
    };

    const sendMessage = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;
        // 1) show user message immediately
        setMessages(prev => [...prev, { type: 'user', content: trimmed }]);
        // 2) clear input
        setInputValue('');
        // 3) let the bot respond
        setTimeout(() => {
            addNewMessage({ type: 'system', content: '🤖 thinking…' });
        }, 1000);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        isExpandedRef.current = isChatbotExpanded;
    }, [isChatbotExpanded]);

    useEffect(() => {
        // Set isBotActive each time a new message is added
        if (startExperience) {
            setIsBotActive(true);
        }

        // Set isBotActive to false if the last message have more than 20 seconds
        const timer = setTimeout(() => {
            if (startExperience && !isExpandedRef.current) {
                setIsBotActive(false);
            }
        }, 20000);

        return () => {
            clearTimeout(timer);
        };
    }, [messages]);


    useEffect(() => {
        if (isPortraitMode && (isUserPanelExpanded || isInfoPanelExpanded)) {
            setHideChatBot(true);
        } else {
            setHideChatBot(false);
        }
    }, [isPortraitMode, isUserPanelExpanded, isInfoPanelExpanded]);


    const addNewMessage = (newMessage: BotMessage) => {
        setTimeout(() => {
            setMessages(prev => {
                // grab only the last 1
                const recent = prev.slice(-1)

                // check if there’s already a message with same type+content
                const isDuplicate = recent.some(
                    msg => msg.type === newMessage.type && msg.content === newMessage.content
                )

                if (!isDuplicate) {
                    playSound(messageSound)
                    return [...prev, newMessage]
                }

                return prev
            })
        }, 2000)
    }

    const hideChatbotPanel = () => {
        setIsChatbotExpanded(!isChatbotExpanded)
    }

    const handleTalkButton = () => {
        setIsChatbotExpanded(true)
        handleFocus()
    }

    return (
        <div className={(startExperience ? 'ChatbotContainer' : 'LoadingChatbotContainer') + (isChatbotExpanded ? '--expanded' : '') + (hiddenChatBot ? ' invisible' : '')} ref={containerRef}>
            <Botface chatPrint={addNewMessage} activateBot={setIsBotActive} openChatPanel={handleTalkButton} botState={isBotActive} />
            <div id='chatContent' className={(isBotActive ? 'show-chatBox' : 'hide-chatBox') + (isChatbotExpanded ? ' content--expanded' : ' content--collapsed') + ((isPortraitMode && startExperience && !isChatbotExpanded) ? ' invisible' : '')} ref={chatContentRef}>
                <Botchat messages={messages} chatPrinter={addNewMessage} chatBoxRef={chatBoxRef} />
                <div id='chatOptions' className={startExperience ? '' : ' invisible'}>
                    <button className={'ask-button' + (isChatbotExpanded ? ' invisible' : '')} onClick={handleTalkButton}>
                        <Image id="AskIcon" className="ask-icon-normal" src={'/assets/SVG/talk_icon.svg'} width={30} height={30} alt='talk icon'></Image>
                        <span className="ask-text">ASK SOMETHING…</span>
                    </button>
                </div>
            </div>
            <div className={'chatbotInputBar' + (isChatbotInputActive ? ' chatbotInput--focused' : '') + (isChatbotExpanded ? '' : ' invisible')}>
                <div className='grid-cell hide-chat-panel-button' onClick={hideChatbotPanel}>
                    <Image className={isChatbotExpanded ? ' arrow-up' : ' arrow-down'} src="/assets/SVG/Chevron.svg" width={18} height={18} alt="User Icon" />
                </div>
                <div className="chatInput-container">
                    <input
                        ref={instanceInput}
                        type="text"
                        placeholder='Ask anything'
                        className="InstanceInput"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="grid-cell">
                    <button className='InstanceOptionIcon sendButton' onClick={() => sendMessage()} disabled={!inputValue.trim()}>
                        <Image className={'OptionIconSrc' + ' sendButton'} src="/assets/SVG/send_icon.svg" width={22} height={22} alt="Send Icon" />
                    </button>
                </div>
            </div>
        </div>
    )
}

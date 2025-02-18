import React, { useEffect, useState, useRef } from 'react'
import { marked } from 'marked'
import '../../styles/InstanceDocumentation.css'
import { Socialmedia } from '../UserPanel/Socialmedia'
import { useExperienceContext } from '@/context/ExperienceContext'

interface InstanceDocumentationProps {
  currentDocumentation: string | null;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const InstanceDocumentation: React.FC<InstanceDocumentationProps> = ({ currentDocumentation }) => {
  const { pauseBackgroundMusic } = useExperienceContext();
  const [markedDocumentation, setMarkedDocumentation] = useState<string>('');
  const spaceOwnerAlias = 'Hermes';
  const emptyDefault = "![No Documentation](/assets/SVG/Empty_Default_Icon.svg)\n\nThere is no documentation available for the selected instance. \n\n## What Can You Do?\n\n- **Check for Updates:** This space may be under development. Please check back later for available documentation.\n- **Explore Other Sections:** You might find relevant information in other available documentation spaces. \n- **Contact {spaceOwner} directly:** You can talk to {spaceOwner} directly if you have any question or even just to connect.";
  const customEmptyDefault = emptyDefault.replace(/{spaceOwner}/g, spaceOwnerAlias);
  const [isNoDocument, setIsNoDocument] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create a custom renderer for Marked
  const renderer = new marked.Renderer();
  let uniqueIdCounter = 0; // to generate unique IDs for iframes

  renderer.image = ({ href, title, text }) => {
    // Check if it's a YouTube link
    if (href && href.includes("youtube.com/watch")) {
      try {
        const url = new URL(href);
        const videoId = url.searchParams.get("v");
        if (videoId) {
          uniqueIdCounter += 1;
          const iframeId = `youtube-player-${uniqueIdCounter}`;
          // Append enablejsapi=1 to allow JS control.
          return `<iframe id="${iframeId}" style="width: 100%; aspect-ratio: 16/9; display: block;" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" title="${text}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
      } catch (error) {
        console.error("Invalid URL:", href);
      }
    }
    // Fallback: render a normal image
    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += ' />';
    return out;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
  });

  // Parse Markdown into HTML asynchronously
  useEffect(() => {
    async function parseMarkdown() {
      const markdownSource = currentDocumentation || customEmptyDefault;
      const html = await marked(markdownSource);
      setMarkedDocumentation(html);
      setIsNoDocument(!currentDocumentation);
    }
    parseMarkdown();
  }, [currentDocumentation, customEmptyDefault]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [markedDocumentation]);

  // Load the YouTube IFrame API if it's not already loaded.
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // After the Markdown is rendered, initialize YouTube players for any embedded videos.
  useEffect(() => {
    // Wait until the YouTube API is available.
    let interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);
        // For each YouTube iframe, create a YT.Player instance.
        document.querySelectorAll('iframe[id^="youtube-player-"]').forEach((iframe) => {
          new window.YT.Player(iframe as HTMLIFrameElement, {
            events: {
              onStateChange: (event: any) => {
                if (event.data === window.YT.PlayerState.PLAYING) {
                  // Dispatch custom event to pause background music in LoadingPage.
                  pauseBackgroundMusic();
                  // Mute other media elements.
                  muteOtherMedia(iframe as HTMLElement);
                }
              },
            },
          });
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, [markedDocumentation, pauseBackgroundMusic]);

  // Helper function to mute other media on the page.
  const muteOtherMedia = (videoIframe: HTMLElement) => {
    document.querySelectorAll('audio, video').forEach((media) => {
      // Optionally, avoid muting the YouTube iframe if it's a <video> element (unlikely)
      if (!videoIframe.contains(media)) {
        (media as HTMLMediaElement).muted = true;
      }
    });
  };

  return (
    <div ref={containerRef} className='DocumentContainer'>
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: markedDocumentation }} />
      {isNoDocument && <Socialmedia />}
    </div>
  );
};

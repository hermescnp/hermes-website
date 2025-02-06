import React, { useEffect, useState } from 'react'
import { marked } from 'marked'
import '../../styles/InstanceDocumentation.css'
import { Socialmedia } from '../UserPanel/Socialmedia'
import { useExperienceContext } from '@/context/ExperienceContext'

export const InstanceDocumentation: React.FC = () => {
    const [markedDocumentation, setMarkedDocumentation] = useState<any>('');
    const spaceOwnerAlias = 'Hermes';
    const emptyDefault = "![No Documentation](/assets/SVG/Empty_Default_Icon.svg)\n\nThere is no documentation available for the selected space. \n\n## What Can You Do?\n\n- **Check for Updates:** This space may be under development. Please check back later for available documentation.\n- **Explore Other Sections:** You might find relevant information in other available documentation spaces. \n- **Contact {spaceOwner} directly:** You can talk to {spaceOwner} directly if you have any question or even just to connect.";
    const customEmptyDefault = emptyDefault.replace(/{spaceOwner}/g, spaceOwnerAlias);
    const { currentDocumentation } = useExperienceContext();
    const [isNoDocument, setIsNoDocument] = useState<boolean>(true)

    // Set Markdown options before parsing
    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        breaks: true,
        pedantic: false,
    });

    // Parse Markdown into HTML
    useEffect(() => {
        if (currentDocumentation) {
            setMarkedDocumentation(marked(currentDocumentation));
            setIsNoDocument(false);
        } else {
            setMarkedDocumentation(marked(customEmptyDefault));
            setIsNoDocument(true);
        }
    }, [currentDocumentation]);

    return (
        <div className='DocumentContainer'>
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: markedDocumentation }} />
            {isNoDocument && <Socialmedia />}
        </div>
    );
};

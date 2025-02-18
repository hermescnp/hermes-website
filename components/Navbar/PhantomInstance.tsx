import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface SearchBarProps {
    placehover?: PlaceHoverType;
}

type PlaceHoverType = {
    key: string | null;
    name: string | null;
}

export default function PhantomInstance({ placehover }: SearchBarProps) {
    const [blink, setBlink] = useState<boolean>(false)

    // Toggle the blink state when a phantom instance is displayed.
    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (placehover?.name) {
            // Toggle blink every 500ms (adjust as needed)
            intervalId = setInterval(() => {
                setBlink(prev => !prev);
            }, 500);
        }
        // Cleanup when the component unmounts or placehover.name changes.
        return () => {
            if (intervalId) clearInterval(intervalId);
        }
    }, [placehover?.name]);

    return (
        <div className="NavigationInstance">
            <Image
                id="objectIcon"
                // Conditionally add the "blink" class based on state.
                className={`ObjectIcon-blinking ${blink ? 'blink' : ''}`}
                src={'/assets/SVG/3DGraphics_Icon_blue.svg'}
                width={20}
                height={20}
                alt="Object Icon"
            />
            <div className={`PhantomInstance`}>{placehover?.name}</div>
        </div>
    )
}

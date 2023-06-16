import React, { useState, useEffect, forwardRef } from "react"
import { Contact } from './Contact'
import SoftwareList from './Softwares/SoftwareList'
import BackgroundList from './Background/BackgroundList'
import SkillList from './Skills/SkillList'
import '../../styles/Panel.css'

interface PanelProps {
  skillRef: React.RefObject<HTMLDivElement>;
  backgroundRef: React.RefObject<HTMLDivElement>;
  softwareRef: React.RefObject<HTMLDivElement>;
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(({ skillRef, backgroundRef, softwareRef }, ref) => {

    const [Data, setData] = useState([]);

    useEffect(() => {
        fetch('/user/data.json')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div ref={ref} className="Panel panelWrapper" >

            <SkillList items={Data} ref={skillRef}/>

            <BackgroundList items={Data} ref={backgroundRef}/>

            <SoftwareList items={Data} ref={softwareRef}/>

            <Contact />

        </div>
    )
})

export { Panel };

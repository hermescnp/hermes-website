import React, { forwardRef } from "react"
import { Contact } from './Contact'
import SoftwareList from './Softwares/SoftwareList'
import BackgroundList from './Background/BackgroundList'
import SkillList from './Skills/SkillList'
import '../../styles/Panel.css'

interface PanelProps {
  data: any[];
  skillRef: React.RefObject<HTMLDivElement>;
  backgroundRef: React.RefObject<HTMLDivElement>;
  softwareRef: React.RefObject<HTMLDivElement>;
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(({ data, skillRef, backgroundRef, softwareRef }, ref) => {

    return (
        <div ref={ref} className="Panel panelWrapper" >

            <SkillList items={data} ref={skillRef}/>

            <BackgroundList items={data} ref={backgroundRef}/>

            <SoftwareList items={data} ref={softwareRef}/>

            <Contact />

        </div>
    )
})

export { Panel };

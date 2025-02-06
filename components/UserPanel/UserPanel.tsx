import React, { forwardRef } from "react"
import { Contact } from './Contact'
import SoftwareList from './Softwares/SoftwareList'
import BackgroundList from './Background/BackgroundList'
import SkillList from './Skills/SkillList'
import { About } from '@/components/Header/About'
import '../../styles/UserPanel.css'

interface UserPanelProps {
  data: any[];
  skillRef: React.RefObject<HTMLDivElement>;
  backgroundRef: React.RefObject<HTMLDivElement>;
  softwareRef: React.RefObject<HTMLDivElement>;
}
const UserPanel = forwardRef<HTMLDivElement, UserPanelProps>(({ data, skillRef, backgroundRef, softwareRef }, ref) => {

    return (
        <div ref={ref} className="Panel panelWrapper" >
            <About />
            <SkillList items={data} ref={skillRef}/>
            <BackgroundList items={data} ref={backgroundRef}/>
            <SoftwareList items={data} ref={softwareRef}/>
            <Contact />
        </div>
    )
})

export { UserPanel };

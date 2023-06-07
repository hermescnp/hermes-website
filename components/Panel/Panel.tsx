import React, { useState, useEffect, forwardRef } from "react"
import { Contact } from './Contact'
import SoftwareList from './Softwares/SoftwareList'
import { BackgroundList } from './Background/BackgroundList'
import SkillList from './Skills/SkillList'
import '../../styles/Panel.css'

const Panel = forwardRef<HTMLDivElement>((props, ref) => {

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

            <SkillList items={Data} />

            <BackgroundList items={Data} />

            <SoftwareList items={Data} />

            <Contact />

        </div>
    )
})

export { Panel };

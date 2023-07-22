import React, {Component} from "react";
import {Socialmedia} from "./Socialmedia"
import '../../styles/Contact.css'

class Contact extends Component<any, any> {

  lastEdit: string = '';

  async componentDidMount() {
    const result = await fetch('https://api.github.com/repos/hermescnp/hermes-website/commits/main', {
      headers: {
        'Authorization': 'Bearer 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'
      }
    });

    const response = await result.json();
    this.lastEdit = response.commit.author.date;
  }

  render() {
    return (
      <section id="ContactSection">
        <h4 className="SkillSectionTittle">Contact me</h4>

        <div id="ContactInfoContainer">
          <p>Physical residence at:</p>
          <p>
            Dominican Republic
            <br/>
            Santo Domingo, Distrito Nacional
          </p>
          <div id="mapContainer">
            <p>MAPS</p>
          </div>
          <p>Phone number: +1 (809) 350 5787</p>
          <p>E-mail: hermes.cnp@gmail.com</p>
        </div>

        <Socialmedia/>

        <div role="contentinfo" className="FooterInfo">
          <p className="metaInfo">Web designed and Developed by: Hermes Concepción</p>
          <p className="metaInfo">Last Edit: {this.lastEdit}</p>
        </div>

      </section>
    );
  }
}

export {Contact};

async function getLastEdit() {

}


import React, {Component} from "react";
import {Socialmedia} from "./Socialmedia"
import '../../styles/Contact.css'

class Contact extends Component<any, any> {

  // TODO: Move to a config file
  private githubApiUrl: string = 'https://api.github.com/repos/hermescnp/hermes-website/commits/main';

  lastEdit: string = '';

  async componentDidMount() {
    const result = await fetch(this.githubApiUrl);

    const response = await result.json();
    this.lastEdit = this.parseDate(response.commit.author.date);
  }

  private parseDate(date: string): string {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
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

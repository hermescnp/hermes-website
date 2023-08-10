import React, { Component } from "react";
import { Socialmedia } from "./Socialmedia"
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
            <br />
            Santo Domingo, Distrito Nacional
          </p>
          <div id="mapContainer">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121090.55491241552!2d-69.94687995!3d18.48004235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f1107ea5ab%3A0xd6c587b82715c164!2sSanto%20Domingo!5e0!3m2!1ses-419!2sdo!4v1691172504476!5m2!1ses-419!2sdo"
              width="100%" height="100%" style={{ border: "0" }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          {/* <p>Phone number: +1 (809) 350 5787</p> */}
          <p>E-mail: hermes.cnp@gmail.com</p>
        </div>

        <Socialmedia />

        <div role="contentinfo" className="FooterInfo">
          <p className="metaInfo">Web designed and Developed by: Hermes Concepción</p>
          <p className="metaInfo">Last Edit: {this.lastEdit}</p>
        </div>

      </section>
    );
  }
}

export { Contact };

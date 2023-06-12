import React from "react"
import '../../styles/Author.css'
import Image from "next/image"
import avatarImg from 'public/assets/HermesPrane.jpg'

export const Author = () => {
  return (
    <div id="AuthorBar">
      <picture>
        <Image className="Avatar" src={avatarImg} width={70} height={70} alt="Fotografía del autor" />
      </picture>
      <div className="AuthorInfo">
        <h2>Hermes Concepción</h2>
        <p>UX/Technical Artist | Professional Musician</p>
      </div>
    </div>
  )
}
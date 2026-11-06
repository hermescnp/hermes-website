"use client"

import React, { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { chapterImage, COVER_CROP_ZOOM, portfolioEntries, portfolioOwner, PortfolioEntry } from '@/data/portfolio'
import { indexLabel, PortfolioDeck } from './PortfolioDeck'
import '../../styles/Portfolio.css'

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> }
}

const COVER_PRELOAD_TIMEOUT_MS = 500
const coverLoads = new Map<string, Promise<void>>()

// The backdrop must already be decoded when the new state is captured, or it morphs in blank.
const preloadCover = (src: string) => {
  let load = coverLoads.get(src)
  if (!load) {
    const image = new window.Image()
    image.src = src
    load = image.decode().catch(() => undefined)
    coverLoads.set(src, load)
  }
  return load
}

export function PortfolioBoard() {
  const [slug, setSlug] = useState<string | null>(null)
  // The folder whose tile morphs into (or back out of) the open story.
  const [origin, setOrigin] = useState<string | null>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const transitioningRef = useRef(false)
  const entry = portfolioEntries.find((item) => item.slug === slug) ?? null
  const entryIndex = entry ? portfolioEntries.indexOf(entry) : -1

  useLayoutEffect(() => {
    frameRef.current?.scrollTo(0, 0)
  }, [slug])

  const navigate = async (next: string | null) => {
    const doc = document as ViewTransitionDocument
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!doc.startViewTransition || reduceMotion) {
      setOrigin(next ?? slug)
      setSlug(next)
      return
    }
    if (transitioningRef.current) return
    transitioningRef.current = true
    const cover = portfolioEntries.find((item) => item.slug === next)?.cover
    if (cover) {
      await Promise.race([preloadCover(cover), new Promise((resolve) => setTimeout(resolve, COVER_PRELOAD_TIMEOUT_MS))])
    }
    // Names must be on the outgoing tile before the old state is captured.
    flushSync(() => setOrigin(next ?? slug))
    const transition = doc.startViewTransition(() => flushSync(() => setSlug(next)))
    transition.finished.finally(() => {
      transitioningRef.current = false
    })
  }

  return (
    <section className="portfolio">
      {entry && <Backdrop entry={entry} />}
      <div className={`portfolio-frame${entry && isDeck(entry) ? ' portfolio-frame--deck' : ''}`} ref={frameRef}>
        {entry ? (
          <Story key={entry.slug} entry={entry} onExit={() => navigate(null)} />
        ) : (
          <Index origin={origin} onOpen={navigate} />
        )}
      </div>
      <div className="portfolio-vanish portfolio-vanish--top" aria-hidden="true" />
      <div className="portfolio-vanish" aria-hidden="true" />
      <header className="portfolio-masthead">
        {entry ? (
          <div>
            <p className="portfolio-kicker">
              <button className="portfolio-back" type="button" onClick={() => navigate(null)}>
                <span aria-hidden="true">&larr;</span> Index
              </button>
              <span>/ {indexLabel(entryIndex)}</span>
            </p>
            <h1 className="portfolio-heading" style={{ viewTransitionName: 'portfolio-title' }}>
              {entry.title}
            </h1>
          </div>
        ) : (
          <>
            <div>
              <p className="portfolio-kicker">UX / Tech-art</p>
              <h1 className="portfolio-heading">Portfolio</h1>
            </div>
            <Signature />
          </>
        )}
      </header>
      <Link className="portfolio-enter" href="/">
        Enter Virtual Office
        <span aria-hidden="true">&rarr;</span>
      </Link>
      <Owner />
    </section>
  )
}

function Signature() {
  return (
    <span
      className="portfolio-signature"
      role="img"
      aria-label={`Signature of ${portfolioOwner.name}`}
      style={{ maskImage: `url(${portfolioOwner.signature})`, WebkitMaskImage: `url(${portfolioOwner.signature})` }}
    />
  )
}

function Owner() {
  return (
    <figure className="portfolio-owner">
      <span className="portfolio-owner-portrait">
        <Image src={portfolioOwner.portrait} alt={portfolioOwner.name} width={96} height={96} priority />
      </span>
      <figcaption className="portfolio-owner-text">
        <span className="portfolio-owner-name">{portfolioOwner.name}</span>
        <span className="portfolio-owner-role">{portfolioOwner.role}</span>
      </figcaption>
    </figure>
  )
}

function Backdrop({ entry }: { entry: PortfolioEntry }) {
  return (
    <div className="portfolio-backdrop" aria-hidden="true" style={{ viewTransitionName: 'portfolio-cover' }}>
      <Image className="portfolio-backdrop-image" src={entry.cover} alt="" fill unoptimized priority />
    </div>
  )
}

function Index({ origin, onOpen }: { origin: string | null; onOpen: (slug: string) => void }) {
  return (
    <div className="portfolio-index-view">
      <ol className="portfolio-grid">
        {portfolioEntries.map((item, index) => {
          const isOrigin = item.slug === origin
          return (
            <li key={item.slug}>
              <button
                className="portfolio-tile"
                type="button"
                onClick={() => onOpen(item.slug)}
                onPointerEnter={() => preloadCover(item.cover)}
                onFocus={() => preloadCover(item.cover)}
                style={isOrigin ? { viewTransitionName: 'portfolio-cover' } : undefined}
              >
                <Image
                  className="portfolio-tile-image"
                  src={item.cover}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 50vw, 25vw"
                />
                <span className="portfolio-tile-caption">
                  <span className="portfolio-index">{indexLabel(index)}</span>
                  <span
                    className="portfolio-tile-title"
                    style={isOrigin ? { viewTransitionName: 'portfolio-title' } : undefined}
                  >
                    {item.title}
                  </span>
                  <span className="portfolio-tile-synopsis">{item.synopsis}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const isDeck = (entry: PortfolioEntry) => entry.chapters.some((chapter) => chapter.sections)

function Story({ entry, onExit }: { entry: PortfolioEntry; onExit: () => void }) {
  const [active, setActive] = useState(0)
  const chapter = entry.chapters[active]
  const panelId = `${entry.slug}-panel`

  if (isDeck(entry)) {
    return (
      <div className="portfolio-story-layout">
        <ChapterStrip entry={entry} active={active} panelId={panelId} onSelect={setActive} />
        <PortfolioDeck
          key={active}
          panelId={panelId}
          synopsis={entry.synopsis}
          chapter={chapter}
          artifact={chapter.artifact ?? entry.artifact}
          onExit={onExit}
        />
      </div>
    )
  }

  return (
    <article>
      <ChapterCarousel entry={entry} active={active} panelId={panelId} onSelect={setActive} />
      <section className="portfolio-chapter" id={panelId} role="tabpanel" key={active}>
        <h2>
          {indexLabel(active)} {chapter.title}
        </h2>
        <p>{chapter.body}</p>
      </section>
      <div className="portfolio-artifact">
        <span>Example</span>
        <p>{entry.artifact}</p>
      </div>
    </article>
  )
}

type ChapterPickerProps = {
  entry: PortfolioEntry
  active: number
  panelId: string
  onSelect: (index: number) => void
}

const revealInTrack = (track: HTMLElement | null, index: number) => {
  const item = track?.children[index] as HTMLElement | undefined
  if (!track || !item) return
  const left = item.offsetLeft - track.offsetLeft
  if (left < track.scrollLeft || left + item.offsetWidth > track.scrollLeft + track.clientWidth) {
    track.scrollTo({ left, behavior: 'smooth' })
  }
}

const imageFocusStyle = (crop: [number, number] | null) => {
  if (!crop) return undefined
  const focus = `${crop[0] * 100}% ${crop[1] * 100}%`
  return { objectPosition: focus, transformOrigin: focus, transform: `scale(${COVER_CROP_ZOOM})` }
}

/** Compact, always-visible item picker that sits above a presentation deck. */
function ChapterStrip({ entry, active, panelId, onSelect }: ChapterPickerProps) {
  const trackRef = useRef<HTMLOListElement>(null)
  const count = entry.chapters.length

  const select = (next: number) => {
    const wrapped = (next + count) % count
    onSelect(wrapped)
    revealInTrack(trackRef.current, wrapped)
  }

  return (
    <div className="portfolio-strip">
      <ol className="portfolio-strip-track" ref={trackRef} role="tablist" aria-label={`${entry.title} items`}>
        {entry.chapters.map((item, chapterIndex) => {
          const image = chapterImage(entry, chapterIndex)
          const selected = chapterIndex === active
          return (
            <li key={item.title} role="presentation">
              <button
                className={`portfolio-strip-item${selected ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                onClick={() => select(chapterIndex)}
              >
                <span className="portfolio-strip-thumb">
                  <Image src={image.src} alt="" fill sizes="96px" style={imageFocusStyle(image.crop)} />
                </span>
                <span className="portfolio-strip-text">
                  <span className="portfolio-index">{indexLabel(chapterIndex)}</span>
                  <span className="portfolio-strip-title">{item.title}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="portfolio-carousel-nav">
        <span className="portfolio-carousel-count">
          <strong>{indexLabel(active)}</strong> / {indexLabel(count - 1)}
        </span>
        {count > 1 && (
          <>
            <button type="button" aria-label="Previous item" onClick={() => select(active - 1)}>
              &larr;
            </button>
            <button type="button" aria-label="Next item" onClick={() => select(active + 1)}>
              &rarr;
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ChapterCarousel({ entry, active, panelId, onSelect }: ChapterPickerProps) {
  const trackRef = useRef<HTMLOListElement>(null)
  const count = entry.chapters.length

  const select = (next: number) => {
    const wrapped = (next + count) % count
    onSelect(wrapped)
    revealInTrack(trackRef.current, wrapped)
  }

  return (
    <div className="portfolio-carousel">
      <div className="portfolio-carousel-bar">
        <p className="portfolio-lead">{entry.synopsis}</p>
        <div className="portfolio-carousel-nav">
          <span className="portfolio-carousel-count">
            <strong>{indexLabel(active)}</strong> / {indexLabel(count - 1)}
          </span>
          <button type="button" aria-label="Previous item" onClick={() => select(active - 1)}>
            &larr;
          </button>
          <button type="button" aria-label="Next item" onClick={() => select(active + 1)}>
            &rarr;
          </button>
        </div>
      </div>
      <ol className="portfolio-carousel-track" ref={trackRef} role="tablist" aria-label={`${entry.title} items`}>
        {entry.chapters.map((item, chapterIndex) => {
          const image = chapterImage(entry, chapterIndex)
          const selected = chapterIndex === active
          return (
            <li key={item.title} role="presentation">
              <button
                className={`portfolio-carousel-item${selected ? ' is-active' : ''}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                onClick={() => select(chapterIndex)}
              >
                <Image
                  className="portfolio-carousel-image"
                  src={image.src}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 72vw, 360px"
                  style={imageFocusStyle(image.crop)}
                />
                <span className="portfolio-tile-caption">
                  <span className="portfolio-index">{indexLabel(chapterIndex)}</span>
                  <span className="portfolio-tile-title">{item.title}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

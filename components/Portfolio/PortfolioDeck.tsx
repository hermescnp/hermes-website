"use client"

import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { PortfolioChapter, PortfolioStorySection } from '@/data/portfolio'

export const indexLabel = (index: number) => String(index + 1).padStart(2, '0')

const SLIDE_COOLDOWN_MS = 900
const WHEEL_THRESHOLD = 36
const TOUCH_THRESHOLD = 48

type Slide =
  | { kind: 'cover'; id: string; label: string }
  | { kind: 'section'; id: string; label: string; section: PortfolioStorySection; index: number }
  | { kind: 'closing'; id: string; label: string }

/** Turns wheel and vertical swipes into one slide step per gesture. */
function bindDiscreteSlideGestures({
  target,
  getActiveIndex,
  slideCount,
  scrollToSlide,
}: {
  target: HTMLElement
  getActiveIndex: () => number
  slideCount: number
  scrollToSlide: (index: number) => void
}): () => void {
  let lockedUntil = 0
  let wheelAccum = 0
  let touchStartX: number | null = null
  let touchStartY: number | null = null

  const step = (direction: 1 | -1) => {
    const now = performance.now()
    if (now < lockedUntil) return
    const next = getActiveIndex() + direction
    if (next < 0 || next >= slideCount) return
    lockedUntil = now + SLIDE_COOLDOWN_MS
    scrollToSlide(next)
  }

  const onWheel = (event: WheelEvent) => {
    // Horizontal input belongs to the chapter carousel.
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
    event.preventDefault()
    if (performance.now() < lockedUntil) {
      wheelAccum = 0
      return
    }
    wheelAccum += event.deltaY
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return
    const direction: 1 | -1 = wheelAccum > 0 ? 1 : -1
    wheelAccum = 0
    step(direction)
  }

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) return
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  const onTouchMove = (event: TouchEvent) => {
    if (touchStartX == null || touchStartY == null || event.touches.length !== 1) return
    const dx = touchStartX - event.touches[0].clientX
    const dy = touchStartY - event.touches[0].clientY
    // Claim vertical pans so native scroll doesn't fight discrete steps.
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 6) event.preventDefault()
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX == null || touchStartY == null) return
    const touch = event.changedTouches[0]
    const dx = touchStartX - touch.clientX
    const dy = touchStartY - touch.clientY
    touchStartX = null
    touchStartY = null
    if (Math.abs(dx) >= Math.abs(dy) || Math.abs(dy) < TOUCH_THRESHOLD) return
    step(dy > 0 ? 1 : -1)
  }

  const onTouchCancel = () => {
    touchStartX = null
    touchStartY = null
  }

  target.addEventListener('wheel', onWheel, { passive: false })
  target.addEventListener('touchstart', onTouchStart, { passive: true })
  target.addEventListener('touchmove', onTouchMove, { passive: false })
  target.addEventListener('touchend', onTouchEnd, { passive: true })
  target.addEventListener('touchcancel', onTouchCancel, { passive: true })

  return () => {
    target.removeEventListener('wheel', onWheel)
    target.removeEventListener('touchstart', onTouchStart)
    target.removeEventListener('touchmove', onTouchMove)
    target.removeEventListener('touchend', onTouchEnd)
    target.removeEventListener('touchcancel', onTouchCancel)
  }
}

/** Scales slide content down (never up) so it fits the safe area between the overlays. */
function FitSlide({
  children,
  contentRef,
}: {
  children: ReactNode
  contentRef?: (node: HTMLDivElement | null) => void
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  const setMeasureRef = useCallback(
    (node: HTMLDivElement | null) => {
      measureRef.current = node
      contentRef?.(node)
    },
    [contentRef],
  )

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const content = measureRef.current
    if (!viewport || !content) return

    const update = () => {
      // offset* ignores the parent transform, so this is the natural content size.
      const next = Math.min(
        1,
        viewport.clientHeight / Math.max(content.offsetHeight, 1),
        viewport.clientWidth / Math.max(content.offsetWidth, 1),
      )
      const clamped = Number.isFinite(next) ? next : 1
      setScale((current) => (Math.abs(current - clamped) < 0.005 ? current : clamped))
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(viewport)
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="portfolio-slide-fit" ref={viewportRef}>
      <div className="portfolio-slide-scale" style={{ transform: `scale(${scale})` }}>
        <div className="portfolio-slide-content" ref={setMeasureRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function PortfolioDeck({
  panelId,
  synopsis,
  chapter,
  artifact,
  onExit,
}: {
  panelId: string
  synopsis: string
  chapter: PortfolioChapter
  artifact: string
  onExit: () => void
}) {
  const slides = useMemo<Slide[]>(
    () => [
      { kind: 'cover', id: 'cover', label: chapter.title },
      ...(chapter.sections ?? []).map((section, index) => ({
        kind: 'section' as const,
        id: `section-${index}`,
        label: section.heading,
        section,
        index,
      })),
      { kind: 'closing', id: 'closing', label: 'Recap' },
    ],
    [chapter],
  )
  const scrollerRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])
  const contentRefs = useRef<(HTMLElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(media.matches)
    const update = () => setReduceMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const nodes = slideRefs.current.filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = nodes.indexOf(visible.target as HTMLElement)
        if (index >= 0) setActiveIndex(index)
      },
      { root: scroller, threshold: [0.6] },
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [slides])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    if (reduceMotion) {
      for (const content of contentRefs.current) {
        if (!content) continue
        content.style.filter = ''
        content.style.opacity = ''
        content.style.visibility = ''
      }
      return
    }

    let frame = 0
    let disposed = false

    const updateEdgeFade = () => {
      frame = 0
      const scroller = scrollerRef.current
      if (disposed || !scroller || !scroller.isConnected) return
      const scrollTop = scroller.scrollTop
      const viewH = scroller.clientHeight
      const rootRect = scroller.getBoundingClientRect()
      const leaveDistance = viewH * 0.7
      const topFadeBand = viewH * 0.55
      const bottomFadeBand = viewH * 0.42

      contentRefs.current.forEach((content, index) => {
        const slide = slideRefs.current[index]
        if (!content || !slide) return

        const contentRect = content.getBoundingClientRect()
        if (contentRect.bottom <= rootRect.top || contentRect.top >= rootRect.bottom) {
          content.style.filter = 'blur(18px)'
          content.style.opacity = '0'
          content.style.visibility = 'hidden'
          return
        }

        const leaveProgress = Math.min(1, Math.abs(slide.offsetTop - scrollTop) / leaveDistance)
        const leaveClarity = 1 - leaveProgress * leaveProgress * (3 - 2 * leaveProgress)
        const topClarity = Math.min(1, Math.max(0, (contentRect.top - rootRect.top) / topFadeBand))
        const bottomClarity = Math.min(1, Math.max(0, (rootRect.bottom - contentRect.bottom) / bottomFadeBand))
        const scrollingClarity = Math.min(leaveClarity, topClarity, bottomClarity)
        const settled = Math.max(0, 1 - leaveProgress / 0.14)
        const clarity = settled + (1 - settled) * scrollingClarity
        const eased = clarity * clarity * (3 - 2 * clarity)
        const opacity = eased * eased
        content.style.filter = `blur(${((1 - eased) * 18).toFixed(2)}px)`
        content.style.opacity = opacity.toFixed(3)
        content.style.visibility = opacity < 0.02 ? 'hidden' : 'visible'
      })
    }

    const onScroll = () => {
      if (frame || disposed) return
      frame = window.requestAnimationFrame(updateEdgeFade)
    }

    updateEdgeFade()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      disposed = true
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [slides, reduceMotion])

  const scrollToSlide = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current
      const slide = slideRefs.current[index]
      if (!scroller || !slide || index < 0 || index >= slides.length) return
      scroller.scrollTo({ top: slide.offsetTop, behavior: reduceMotion ? 'auto' : 'smooth' })
      setActiveIndex(index)
    },
    [slides.length, reduceMotion],
  )

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return
    return bindDiscreteSlideGestures({
      target: scroller,
      getActiveIndex: () => activeIndexRef.current,
      slideCount: slides.length,
      scrollToSlide,
    })
  }, [scrollToSlide, slides.length])

  useEffect(() => {
    let lockedUntil = 0
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === ' ' && target?.closest('button, a')) return

      const forward = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)
      const back = event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)
      if (!forward && !back) return
      event.preventDefault()
      const now = performance.now()
      if (now < lockedUntil) return
      lockedUntil = now + SLIDE_COOLDOWN_MS / 2
      scrollToSlide(activeIndexRef.current + (forward ? 1 : -1))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [scrollToSlide])

  const isFirst = activeIndex === 0
  const isLast = activeIndex === slides.length - 1

  return (
    <div
      className={`portfolio-deck-shell${chapter.mediaTone === 'dark' ? ' portfolio-deck-shell--dark-media' : ''}`}
      id={panelId}
      role="tabpanel"
    >
      <div className="portfolio-deck" ref={scrollerRef} aria-live="polite">
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            ref={(node) => {
              slideRefs.current[index] = node
            }}
            className={`portfolio-slide portfolio-slide--${slide.kind}`}
            aria-label={`${chapter.title}: ${slide.label}`}
          >
            <FitSlide
              contentRef={(node) => {
                contentRefs.current[index] = node
              }}
            >
              {slide.kind === 'cover' && <CoverSlide synopsis={synopsis} chapter={chapter} />}
              {slide.kind === 'section' && <SectionSlide section={slide.section} index={slide.index} />}
              {slide.kind === 'closing' && (
                <ClosingSlide
                  chapter={chapter}
                  artifact={artifact}
                  onJump={(sectionIndex) => scrollToSlide(sectionIndex + 1)}
                  onExit={onExit}
                />
              )}
            </FitSlide>
          </section>
        ))}
      </div>

      <nav className="portfolio-deck-nav" aria-label="Story slides">
        <button
          type="button"
          className="portfolio-deck-arrow portfolio-deck-arrow--up"
          onClick={() => scrollToSlide(activeIndex - 1)}
          aria-label="Go to previous slide"
          hidden={isFirst}
        >
          <Chevron direction="up" />
        </button>
        <div className="portfolio-deck-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`portfolio-deck-dot${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to ${slide.label}`}
              aria-current={index === activeIndex ? 'step' : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          className="portfolio-deck-arrow portfolio-deck-arrow--down"
          onClick={() => scrollToSlide(activeIndex + 1)}
          aria-label="Go to next slide"
          hidden={isLast}
        >
          <Chevron direction="down" />
        </button>
      </nav>
    </div>
  )
}

function Chevron({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        d={direction === 'up' ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CoverSlide({ synopsis, chapter }: { synopsis: string; chapter: PortfolioChapter }) {
  return (
    <header className="portfolio-cover">
      <div className="portfolio-cover-text">
        <span className="portfolio-deck-kicker">{synopsis}</span>
        <h2>{chapter.title}</h2>
        <p className="portfolio-story-lead">{chapter.body}</p>
      </div>
      {chapter.image && (
        <span className="portfolio-cover-media">
          <Image src={chapter.image} alt="" fill sizes="(max-width: 760px) 100vw, 640px" priority />
        </span>
      )}
      {chapter.facts && (
        <dl className="portfolio-facts">
          {chapter.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  )
}

function SectionSlide({ section, index }: { section: PortfolioStorySection; index: number }) {
  const image = section.image
  return (
    <article className="portfolio-story">
      <div className="portfolio-story-text">
        <div className="portfolio-story-heading">
          <span className="portfolio-index">{indexLabel(index)}</span>
          <h3>{section.heading}</h3>
        </div>
        <p>{section.body}</p>
      </div>
      {image && (
        <figure className="portfolio-story-figure">
          <a href={image.src} target="_blank" rel="noreferrer">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(max-width: 760px) 100vw, 760px"
            />
          </a>
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>
      )}
    </article>
  )
}

function ClosingSlide({
  chapter,
  artifact,
  onJump,
  onExit,
}: {
  chapter: PortfolioChapter
  artifact: string
  onJump: (sectionIndex: number) => void
  onExit: () => void
}) {
  return (
    <div className="portfolio-closing">
      <span className="portfolio-deck-kicker">Recap</span>
      <h3>{chapter.title}</h3>
      <p>{artifact}</p>
      <ol className="portfolio-closing-grid">
        {chapter.sections?.map((section, index) => (
          <li key={section.heading}>
            <button type="button" onClick={() => onJump(index)}>
              {section.image && (
                <span className="portfolio-closing-thumb">
                  <Image src={section.image.src} alt="" fill sizes="200px" />
                </span>
              )}
              <span className="portfolio-index">{indexLabel(index)}</span>
              <span className="portfolio-closing-title">{section.heading}</span>
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="portfolio-deck-exit" onClick={onExit}>
        <span aria-hidden="true">&larr;</span> Back to index
      </button>
    </div>
  )
}

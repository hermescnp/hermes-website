"use client"
import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { useRouter } from "next/navigation"
import { chapterImage, COVER_CROP_ZOOM, portfolioEntries, portfolioOwner } from "@/data/portfolio"
import { useExperienceContext } from "@/context/ExperienceContext"

// Matches the 1448x1244 aspect of the easel's original "Canvas" texture.
const WIDTH = 1792
const HEIGHT = 1540
const PAD_X = 120
const MAST_BASELINE = 228
const MAST_RULE = 268
const BODY_TOP = 312
const FOOTER_H = 210
const GAP = 36
const MEASURE = 1360

const COLORS = {
  bg: "#10151f",
  accent: "#68DBFF",
  title: "#ffffff",
  body: "#c9ced8",
  muted: "#8f98aa",
  rule: "rgba(255, 255, 255, 0.09)",
  accentRule: "rgba(104, 219, 255, 0.35)",
  panel: "#1a2130",
  tileEdge: "rgba(255, 255, 255, 0.14)",
}

type Region = {
  key: string
  x: number
  y: number
  w: number
  h: number
  action: () => void
}

type GLTFResult = { scene: THREE.Group }

const indexLabel = (index: number) => String(index + 1).padStart(2, "0")

const wrap = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const lines: string[] = []
  let line = ""
  text.split(" ").forEach((word) => {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  })
  if (line) lines.push(line)
  return lines
}

const setTracking = (ctx: CanvasRenderingContext2D, value: string) => {
  const target = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
  if ("letterSpacing" in target) target.letterSpacing = value
}

export default function EaselPortfolio({ active }: { active: boolean }) {
  const { scene } = useGLTF("/models/virtual-office-room.glb") as unknown as GLTFResult
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const connected = useThree((state) => state.events.connected) as HTMLElement | undefined
  const { setIsCursorTargeting } = useExperienceContext()
  const router = useRouter()

  const slug = useRef<string | null>(null)
  const hover = useRef<string | null>(null)
  const scroll = useRef(0)
  const scrollTarget = useRef(0)
  const maxScroll = useRef(0)
  const regions = useRef<Region[]>([])
  const dirty = useRef(true)
  const fontFamily = useRef('Inter, "Helvetica Neue", Arial, sans-serif')
  const images = useRef(new Map<string, HTMLImageElement>())
  const activeChapter = useRef(0)
  const portrait = useRef<HTMLImageElement | null>(null)
  const signature = useRef<HTMLCanvasElement | null>(null)

  const surface = useMemo(() => {
    const found: THREE.Mesh[] = []
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh && !Array.isArray(mesh.material) && mesh.material.name === "Canvas") {
        found.push(mesh)
      }
    })
    return found[0] ?? null
  }, [scene])

  const { canvas, texture } = useMemo(() => {
    const element = document.createElement("canvas")
    element.width = WIDTH
    element.height = HEIGHT
    const canvasTexture = new THREE.CanvasTexture(element)
    canvasTexture.flipY = false
    canvasTexture.colorSpace = THREE.SRGBColorSpace
    canvasTexture.anisotropy = 8
    return { canvas: element, texture: canvasTexture }
  }, [])

  useEffect(() => {
    const page = document.querySelector(".Page")
    const family = page ? getComputedStyle(page).fontFamily : ""
    if (family) fontFamily.current = family
    dirty.current = true
    document.fonts?.ready.then(() => {
      dirty.current = true
    })
    const sources = new Set(
      portfolioEntries.flatMap((item) => [item.cover, ...item.chapters.map((_, index) => chapterImage(item, index).src)])
    )
    sources.forEach((src) => {
      const image = new Image()
      image.onload = () => {
        dirty.current = true
      }
      image.src = src
      images.current.set(src, image)
    })

    const portraitImage = new Image()
    portraitImage.onload = () => {
      portrait.current = portraitImage
      dirty.current = true
    }
    portraitImage.src = portfolioOwner.portrait

    const signatureImage = new Image()
    signatureImage.onload = () => {
      const tinted = document.createElement("canvas")
      tinted.width = signatureImage.naturalWidth
      tinted.height = signatureImage.naturalHeight
      const tintCtx = tinted.getContext("2d")
      if (!tintCtx) return
      tintCtx.drawImage(signatureImage, 0, 0)
      tintCtx.globalCompositeOperation = "source-in"
      tintCtx.fillStyle = COLORS.accent
      tintCtx.fillRect(0, 0, tinted.width, tinted.height)
      signature.current = tinted
      dirty.current = true
    }
    signatureImage.src = portfolioOwner.signature
  }, [])

  useEffect(() => {
    if (!surface) return
    const material = surface.material as THREE.MeshStandardMaterial
    const previous = {
      map: material.map,
      emissiveMap: material.emissiveMap,
      emissive: material.emissive.clone(),
    }
    material.map = texture
    material.emissiveMap = texture
    material.emissive.setScalar(0.85)
    material.needsUpdate = true
    return () => {
      material.map = previous.map
      material.emissiveMap = previous.emissiveMap
      material.emissive.copy(previous.emissive)
      material.needsUpdate = true
    }
  }, [surface, texture])

  useEffect(() => () => texture.dispose(), [texture])

  const font = (weight: number, size: number) => `${weight} ${size}px ${fontFamily.current}`

  const open = (next: string | null) => {
    slug.current = next
    activeChapter.current = 0
    scroll.current = 0
    scrollTarget.current = 0
    hover.current = null
    dirty.current = true
  }

  const drawKicker = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.font = font(400, 26)
    ctx.fillStyle = COLORS.accent
    setTracking(ctx, "6px")
    ctx.fillText(text, x, y)
    setTracking(ctx, "0px")
  }

  const drawRule = (ctx: CanvasRenderingContext2D, y: number, color = COLORS.rule) => {
    ctx.fillStyle = color
    ctx.fillRect(PAD_X, y, WIDTH - PAD_X * 2, 2)
  }

  const drawCover = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    focus: [number, number] = [0.5, 0.5],
    zoom = 1
  ) => {
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight) * zoom
    const sw = w / scale
    const sh = h / scale
    ctx.drawImage(image, (image.naturalWidth - sw) * focus[0], (image.naturalHeight - sh) * focus[1], sw, sh, x, y, w, h)
  }

  const drawTile = (ctx: CanvasRenderingContext2D, index: number, x: number, y: number, w: number, h: number) => {
    const item = portfolioEntries[index]
    const hovered = hover.current === `tile-${index}`
    const image = images.current.get(item.cover)

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 18)
    ctx.clip()
    ctx.fillStyle = COLORS.panel
    ctx.fillRect(x, y, w, h)
    if (image?.complete && image.naturalWidth) {
      ctx.filter = hovered ? "none" : "saturate(0.85) brightness(0.85)"
      drawCover(ctx, image, x, y, w, h)
      ctx.filter = "none"
    }
    const fade = ctx.createLinearGradient(0, y + h * 0.35, 0, y + h)
    fade.addColorStop(0, "rgba(10, 14, 22, 0)")
    fade.addColorStop(1, "rgba(10, 14, 22, 0.94)")
    ctx.fillStyle = fade
    ctx.fillRect(x, y, w, h)
    ctx.restore()

    ctx.font = font(300, 40)
    const lines = wrap(ctx, item.title, w - 56)
    let lineY = y + h - 40 - (lines.length - 1) * 46
    ctx.font = font(400, 24)
    ctx.fillStyle = COLORS.accent
    setTracking(ctx, "4px")
    ctx.fillText(indexLabel(index), x + 28, lineY - 52)
    setTracking(ctx, "0px")
    ctx.font = font(300, 40)
    ctx.fillStyle = COLORS.title
    lines.forEach((line) => {
      ctx.fillText(line, x + 28, lineY)
      lineY += 46
    })

    ctx.strokeStyle = hovered ? COLORS.accent : COLORS.tileEdge
    ctx.lineWidth = hovered ? 4 : 2
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 18)
    ctx.stroke()
  }

  const drawSignature = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number) => {
    const ink = signature.current
    if (!ink) return
    ctx.drawImage(ink, x, y, w, (w * ink.height) / ink.width)
  }

  const drawEnterButton = (ctx: CanvasRenderingContext2D, list: Region[]) => {
    const key = "enter"
    const hovered = hover.current === key
    const label = "ENTER PORTFOLIO"
    const h = 92
    ctx.font = font(400, 28)
    setTracking(ctx, "5px")
    const labelW = ctx.measureText(label).width
    setTracking(ctx, "0px")
    ctx.font = font(400, 34)
    const arrowW = ctx.measureText("\u2192").width
    const w = labelW + arrowW + 28 + 88
    const x = WIDTH - PAD_X - w
    const y = 134

    ctx.beginPath()
    ctx.roundRect(x, y, w, h, h / 2)
    ctx.fillStyle = hovered ? "rgba(23, 46, 73, 0.95)" : "rgba(23, 46, 73, 0.7)"
    ctx.fill()
    ctx.strokeStyle = hovered ? COLORS.accent : "rgba(178, 178, 178, 0.8)"
    ctx.lineWidth = hovered ? 3 : 2
    ctx.stroke()

    ctx.font = font(400, 28)
    ctx.fillStyle = COLORS.title
    setTracking(ctx, "5px")
    ctx.fillText(label, x + 44, y + 56)
    setTracking(ctx, "0px")
    ctx.font = font(400, 34)
    ctx.fillStyle = COLORS.accent
    ctx.fillText("\u2192", x + 44 + labelW + 28 + (hovered ? 6 : 0), y + 58)

    list.push({ key, x, y, w, h, action: () => router.push("/portfolio") })
    return x
  }

  const drawOwner = (ctx: CanvasRenderingContext2D) => {
    const size = 132
    const cx = PAD_X + size / 2 + 10
    const cy = HEIGHT - FOOTER_H / 2 + 6
    const image = portrait.current
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.fillStyle = COLORS.panel
    ctx.fillRect(cx - size / 2, cy - size / 2, size, size)
    if (image) drawCover(ctx, image, cx - size / 2, cy - size / 2, size, size)
    ctx.restore()
    ctx.strokeStyle = COLORS.accentRule
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, size / 2 + 10, 0, Math.PI * 2)
    ctx.stroke()

    const textX = cx + size / 2 + 10 + 64
    ctx.fillStyle = COLORS.accentRule
    ctx.fillRect(textX - 32, cy - 50, 2, 100)
    ctx.font = font(400, 32)
    ctx.fillStyle = COLORS.title
    ctx.fillText(portfolioOwner.name, textX, cy - 4)
    ctx.font = font(400, 20)
    ctx.fillStyle = COLORS.muted
    setTracking(ctx, "4px")
    ctx.fillText(portfolioOwner.role.toUpperCase(), textX, cy + 34)
    setTracking(ctx, "0px")
  }

  const drawKickerLine = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLORS.accent
    ctx.fillRect(PAD_X, 122, 50, 2)
    ctx.font = font(400, 24)
    setTracking(ctx, "8px")
  }

  const drawHeading = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    ctx.font = font(200, 100)
    setTracking(ctx, "-4px")
    const fullW = ctx.measureText(text).width
    if (fullW > maxWidth) ctx.font = font(200, Math.floor((100 * maxWidth) / fullW))
    const titleW = ctx.measureText(text).width
    const titleFill = ctx.createLinearGradient(PAD_X, 0, PAD_X + titleW, 0)
    titleFill.addColorStop(0.3, COLORS.title)
    titleFill.addColorStop(1, "#a9c4dc")
    ctx.fillStyle = titleFill
    ctx.fillText(text, PAD_X - 6, MAST_BASELINE)
    setTracking(ctx, "0px")
    return titleW
  }

  const drawIndex = (ctx: CanvasRenderingContext2D, list: Region[]) => {
    drawKickerLine(ctx)
    ctx.fillText("UX / TECH-ART", PAD_X + 72, 132)
    setTracking(ctx, "0px")
    const enterX = drawEnterButton(ctx, list)
    const titleW = drawHeading(ctx, "Portfolio", enterX - PAD_X - 60)
    ctx.save()
    ctx.translate(PAD_X + titleW + 85, 168)
    ctx.rotate((-4 * Math.PI) / 180)
    drawSignature(ctx, -145, -104, 290)
    ctx.restore()
    drawRule(ctx, MAST_RULE, COLORS.accentRule)
    drawOwner(ctx)

    const cols = 4
    const rows = Math.ceil(portfolioEntries.length / cols)
    const gap = GAP
    const top = BODY_TOP
    const tileW = (WIDTH - PAD_X * 2 - gap * (cols - 1)) / cols
    const tileH = (HEIGHT - FOOTER_H - top - gap * (rows - 1)) / rows
    portfolioEntries.forEach((item, index) => {
      const x = PAD_X + (index % cols) * (tileW + gap)
      const y = top + Math.floor(index / cols) * (tileH + gap)
      drawTile(ctx, index, x, y, tileW, tileH)
      list.push({ key: `tile-${index}`, x, y, w: tileW, h: tileH, action: () => open(item.slug) })
    })
  }

  const drawStory = (ctx: CanvasRenderingContext2D, list: Region[], index: number) => {
    const entry = portfolioEntries[index]
    const offset = scroll.current
    const viewTop = MAST_RULE + 2
    const viewBottom = HEIGHT - FOOTER_H
    const visible = (top: number, height: number) => top + height > viewTop && top < viewBottom

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, viewTop, WIDTH, viewBottom - viewTop)
    ctx.clip()
    ctx.translate(0, -offset)

    const region = (key: string, x: number, top: number, w: number, h: number, action: () => void) => {
      if (visible(top - offset, h)) list.push({ key, x, y: top - offset, w, h, action })
    }
    const count = entry.chapters.length
    const active = Math.min(activeChapter.current, count - 1)
    const select = (next: number) => {
      activeChapter.current = (next + count) % count
      dirty.current = true
    }

    const navR = 36
    const barY = BODY_TOP + navR
    const prevX = WIDTH - PAD_X - navR * 3 - 16
    ctx.font = font(400, 24)
    setTracking(ctx, "6px")
    const total = ` / ${indexLabel(count - 1)}`
    const totalW = ctx.measureText(total).width
    const current = indexLabel(active)
    const countX = prevX - navR - 28 - totalW - ctx.measureText(current).width
    ctx.fillStyle = COLORS.accent
    ctx.fillText(current, countX, barY + 9)
    ctx.fillStyle = COLORS.muted
    ctx.fillText(total, prevX - navR - 28 - totalW, barY + 9)
    setTracking(ctx, "0px")
    ctx.font = font(300, 34)
    ctx.fillStyle = COLORS.body
    ctx.fillText(entry.synopsis, PAD_X, barY + 12, countX - PAD_X - 48)

    ;[
      { key: "prev", glyph: "\u2190", cx: prevX, step: -1 },
      { key: "next", glyph: "\u2192", cx: WIDTH - PAD_X - navR, step: 1 },
    ].forEach(({ key, glyph, cx, step }) => {
      const hovered = hover.current === key
      ctx.beginPath()
      ctx.arc(cx, barY, navR, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(23, 46, 73, 0.7)"
      ctx.fill()
      ctx.strokeStyle = hovered ? COLORS.accent : "rgba(178, 178, 178, 0.8)"
      ctx.lineWidth = hovered ? 3 : 2
      ctx.stroke()
      ctx.font = font(400, 30)
      ctx.fillStyle = hovered ? COLORS.accent : COLORS.title
      ctx.textAlign = "center"
      ctx.fillText(glyph, cx, barY + 10)
      ctx.textAlign = "left"
      region(key, cx - navR, barY - navR, navR * 2, navR * 2, () => select(active + step))
    })

    let y = barY + navR + 28
    const gap = GAP
    const cardW = (WIDTH - PAD_X * 2 - gap * (count - 1)) / count
    const cardH = (cardW * 10) / 16
    entry.chapters.forEach((chapter, chapterIndex) => {
      const key = `card-${chapterIndex}`
      const x = PAD_X + chapterIndex * (cardW + gap)
      const selected = chapterIndex === active
      const lit = selected || hover.current === key
      const { src, crop } = chapterImage(entry, chapterIndex)
      const image = images.current.get(src)

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(x, y, cardW, cardH, 18)
      ctx.clip()
      ctx.fillStyle = COLORS.panel
      ctx.fillRect(x, y, cardW, cardH)
      if (image?.complete && image.naturalWidth) {
        ctx.filter = lit ? "none" : "saturate(0.6) brightness(0.6)"
        drawCover(ctx, image, x, y, cardW, cardH, crop ?? undefined, crop ? COVER_CROP_ZOOM : 1)
        ctx.filter = "none"
      }
      const fade = ctx.createLinearGradient(0, y + cardH * 0.35, 0, y + cardH)
      fade.addColorStop(0, "rgba(10, 14, 22, 0)")
      fade.addColorStop(1, "rgba(10, 14, 22, 0.94)")
      ctx.fillStyle = fade
      ctx.fillRect(x, y, cardW, cardH)
      ctx.restore()

      ctx.font = font(400, 22)
      ctx.fillStyle = COLORS.accent
      setTracking(ctx, "4px")
      ctx.fillText(indexLabel(chapterIndex), x + 28, y + cardH - 80)
      setTracking(ctx, "0px")
      ctx.font = font(300, 36)
      ctx.fillStyle = COLORS.title
      ctx.fillText(chapter.title, x + 28, y + cardH - 32)

      ctx.strokeStyle = selected ? COLORS.accent : lit ? COLORS.accentRule : COLORS.tileEdge
      ctx.lineWidth = selected ? 4 : 2
      ctx.beginPath()
      ctx.roundRect(x, y, cardW, cardH, 18)
      ctx.stroke()
      region(key, x, y, cardW, cardH, () => select(chapterIndex))
    })
    y += cardH

    const chapter = entry.chapters[active]
    y += 86
    ctx.font = font(300, 42)
    ctx.fillStyle = COLORS.accent
    ctx.fillText(`${indexLabel(active)}  ${chapter.title}`, PAD_X, y)
    y += 58
    ctx.font = font(300, 33)
    ctx.fillStyle = COLORS.body
    wrap(ctx, chapter.body, MEASURE).forEach((line) => {
      ctx.fillText(line, PAD_X, y)
      y += 52
    })
    y += 18
    drawRule(ctx, y)

    y += 44
    ctx.font = font(300, 31)
    const artifactLines = wrap(ctx, entry.artifact, MEASURE - 80)
    const boxH = 96 + artifactLines.length * 48
    ctx.strokeStyle = COLORS.accentRule
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(PAD_X, y, WIDTH - PAD_X * 2, boxH, 18)
    ctx.stroke()
    drawKicker(ctx, "EXAMPLE", PAD_X + 40, y + 56)
    ctx.font = font(300, 31)
    ctx.fillStyle = COLORS.body
    artifactLines.forEach((line, lineIndex) => {
      ctx.fillText(line, PAD_X + 40, y + 112 + lineIndex * 48)
    })
    y += boxH + 48
    ctx.restore()

    maxScroll.current = Math.max(0, y - viewBottom)

    const fade = ctx.createLinearGradient(0, viewBottom - 70, 0, viewBottom)
    fade.addColorStop(0, "rgba(16, 21, 31, 0)")
    fade.addColorStop(1, COLORS.bg)
    ctx.fillStyle = fade
    ctx.fillRect(0, viewBottom - 70, WIDTH, 70)
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, viewBottom, WIDTH, FOOTER_H)
    drawOwner(ctx)

    const backKey = "back"
    drawKickerLine(ctx)
    const backLabel = "\u2190 INDEX"
    ctx.fillStyle = hover.current === backKey ? COLORS.title : COLORS.accent
    ctx.fillText(backLabel, PAD_X + 72, 132)
    const backW = ctx.measureText(backLabel).width
    ctx.fillStyle = COLORS.accent
    ctx.fillText(`/ ${indexLabel(index)}`, PAD_X + 72 + backW + 20, 132)
    setTracking(ctx, "0px")
    list.push({ key: backKey, x: PAD_X - 20, y: 90, w: backW + 120, h: 64, action: () => open(null) })
    const enterX = drawEnterButton(ctx, list)
    drawHeading(ctx, entry.title, enterX - PAD_X - 60)
    drawRule(ctx, MAST_RULE, COLORS.accentRule)

    if (maxScroll.current > 0) {
      const trackTop = BODY_TOP
      const trackH = viewBottom - trackTop - 30
      const thumbH = Math.max(80, (trackH * HEIGHT) / (HEIGHT + maxScroll.current))
      const thumbY = trackTop + ((trackH - thumbH) * offset) / maxScroll.current
      ctx.fillStyle = COLORS.rule
      ctx.fillRect(WIDTH - 52, trackTop, 4, trackH)
      ctx.fillStyle = COLORS.accentRule
      ctx.fillRect(WIDTH - 52, thumbY, 4, thumbH)
    }
  }

  const draw = () => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const list: Region[] = []
    ctx.textBaseline = "alphabetic"
    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    const index = portfolioEntries.findIndex((item) => item.slug === slug.current)
    if (index === -1) {
      drawIndex(ctx, list)
    } else {
      drawStory(ctx, list, index)
    }
    regions.current = list
    texture.needsUpdate = true
  }

  useFrame(() => {
    const delta = scrollTarget.current - scroll.current
    if (Math.abs(delta) > 0.5) {
      scroll.current += delta * 0.2
      dirty.current = true
    } else if (delta !== 0) {
      scroll.current = scrollTarget.current
      dirty.current = true
    }
    if (dirty.current) {
      dirty.current = false
      draw()
    }
  })

  useEffect(() => {
    if (!active || !surface) return
    const target = connected ?? gl.domElement.parentElement ?? gl.domElement
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let down: { x: number; y: number } | null = null

    const pick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      )
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObject(surface, false)[0]
      return hit?.uv ? { x: hit.uv.x * WIDTH, y: hit.uv.y * HEIGHT } : null
    }

    const regionAt = (event: MouseEvent) => {
      const point = pick(event)
      if (!point) return null
      return regions.current.find(
        (region) =>
          point.x >= region.x &&
          point.x <= region.x + region.w &&
          point.y >= region.y &&
          point.y <= region.y + region.h
      ) ?? null
    }

    const onPointerDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY }
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!down) return
      const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y)
      down = null
      if (moved > 6) return
      regionAt(event)?.action()
    }

    const onPointerMove = (event: PointerEvent) => {
      const key = regionAt(event)?.key ?? null
      if (key === hover.current) return
      hover.current = key
      dirty.current = true
      setIsCursorTargeting(Boolean(key))
    }

    const onWheel = (event: WheelEvent) => {
      if (!slug.current || !pick(event)) return
      event.preventDefault()
      event.stopImmediatePropagation()
      scrollTarget.current = Math.min(maxScroll.current, Math.max(0, scrollTarget.current + event.deltaY * 1.6))
    }

    target.addEventListener("pointerdown", onPointerDown)
    target.addEventListener("pointerup", onPointerUp)
    target.addEventListener("pointermove", onPointerMove)
    target.addEventListener("wheel", onWheel, { capture: true, passive: false })

    return () => {
      target.removeEventListener("pointerdown", onPointerDown)
      target.removeEventListener("pointerup", onPointerUp)
      target.removeEventListener("pointermove", onPointerMove)
      target.removeEventListener("wheel", onWheel, { capture: true })
      if (hover.current) {
        hover.current = null
        dirty.current = true
        setIsCursorTargeting(false)
      }
    }
  }, [active, surface, camera, gl, connected, setIsCursorTargeting])

  return null
}

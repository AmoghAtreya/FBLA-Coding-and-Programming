import { useRef, useEffect } from 'react'
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Mesh,
  Program,
  Texture,
} from 'ogl'

import './CircularGallery.css';

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function (...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t
}

function autoBind(instance: any) {
  const proto = Object.getPrototypeOf(instance)
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance)
    }
  })
}

function createTextTexture(gl: any, text: string, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")!
  context.font = font
  
  // Split text into lines
  const lines = text.split('\n')
  const lineHeight = parseInt(font, 10) * 1.2
  
  // Calculate dimensions
  let maxWidth = 0
  lines.forEach(line => {
    const metrics = context.measureText(line)
    maxWidth = Math.max(maxWidth, metrics.width)
  })
  
  const textWidth = Math.ceil(maxWidth)
  const textHeight = Math.ceil(lineHeight * lines.length)
  canvas.width = textWidth + 40
  canvas.height = textHeight + 40
  
  // Set up context again after canvas resize
  context.font = font
  context.fillStyle = color
  context.textBaseline = "top"
  context.textAlign = "center"
  context.clearRect(0, 0, canvas.width, canvas.height)
  
  // Draw each line
  lines.forEach((line, index) => {
    const y = 20 + (index * lineHeight)
    context.fillText(line, canvas.width / 2, y)
  })
  
  const texture = new Texture(gl, { generateMipmaps: false })
  texture.image = canvas
  return { texture, width: canvas.width, height: canvas.height }
}

class Title {
  gl: any
  plane: any
  renderer: any
  text: string
  description: string
  textColor: string
  font: string
  mesh: any

  constructor({ gl, plane, renderer, text, description = "", textColor = "#545050", font = "30px sans-serif" }: any) {
    autoBind(this)
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.text = text
    this.description = description
    this.textColor = textColor
    this.font = font
    this.createMesh()
  }
  createMesh() {
    // Create combined text with title and description
    const combinedText = this.description ? `${this.text}\n\n${this.description}` : this.text
    const { texture, width, height } = createTextTexture(
      this.gl,
      combinedText,
      "bold 24px Arial",
      this.textColor
    )
    const geometry = new Plane(this.gl)
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    })
    this.mesh = new Mesh(this.gl, { geometry, program })
    const aspect = width / height
    const textHeight = this.plane.scale.y * 0.4
    const textWidth = textHeight * aspect
    this.mesh.scale.set(textWidth, textHeight, 1)
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05
    this.mesh.setParent(this.plane)
  }
}

class Media {
  extra: number = 0
  geometry: any
  gl: any
  image: string
  index: number
  length: number
  renderer: any
  scene: any
  screen: any
  text: string
  description: string
  viewport: any
  bend: number
  textColor: string
  borderRadius: number
  font: string
  program: any
  plane: any
  title: any
  scale: number = 0
  padding: number = 0
  width: number = 0
  widthTotal: number = 0
  x: number = 0
  speed: number = 0
  isBefore: boolean = false
  isAfter: boolean = false

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    description = "",
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font
  }: any) {
    this.extra = 0
    this.geometry = geometry
    this.gl = gl
    this.image = image
    this.index = index
    this.length = length
    this.renderer = renderer
    this.scene = scene
    this.screen = screen
    this.text = text
    this.description = description
    this.viewport = viewport
    this.bend = bend
    this.textColor = textColor
    this.borderRadius = borderRadius
    this.font = font
    this.createShader()
    this.createMesh()
    this.createTitle()
    this.onResize()
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    })
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = this.image
    img.onload = () => {
      texture.image = img
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]
    }
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })
    this.plane.setParent(this.scene)
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      description: this.description || "",
      textColor: this.textColor,
      fontFamily: this.font
    })
  }
  update(scroll: any, direction: string) {
    this.plane.position.x = this.x - scroll.current - this.extra

    const x = this.plane.position.x
    const H = this.viewport.width / 2

    if (this.bend === 0) {
      this.plane.position.y = 0
      this.plane.rotation.z = 0
    } else {
      const B_abs = Math.abs(this.bend)
      const R = (H * H + B_abs * B_abs) / (2 * B_abs)
      const effectiveX = Math.min(Math.abs(x), H)

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX)
      if (this.bend > 0) {
        this.plane.position.y = -arc
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R)
      } else {
        this.plane.position.y = arc
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R)
      }
    }

    this.speed = scroll.current - scroll.last
    this.program.uniforms.uTime.value += 0.04
    this.program.uniforms.uSpeed.value = this.speed

    const planeOffset = this.plane.scale.x / 2
    const viewportOffset = this.viewport.width / 2
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal
      this.isBefore = this.isAfter = false
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal
      this.isBefore = this.isAfter = false
    }
  }
  onResize({ screen, viewport }: any = {}) {
    if (screen) this.screen = screen
    if (viewport) {
      this.viewport = viewport
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height]
      }
    }
    this.scale = this.screen.height / 1500
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y]
    this.padding = 2
    this.width = this.plane.scale.x + this.padding
    this.widthTotal = this.width * this.length
    this.x = this.width * this.index
  }
}

class App {
  container: HTMLElement
  scroll: any
  onCheckDebounce: Function
  renderer: any
  gl: any
  camera: any
  scene: any
  screen: any
  viewport: any
  planeGeometry: any
  mediasImages: any[]
  medias: Media[]
  isDown: boolean = false
  start: number = 0
  raf: number = 0
  boundOnResize: any
  boundOnWheel: any
  boundOnTouchDown: any
  boundOnTouchMove: any
  boundOnTouchUp: any

  constructor(container: HTMLElement, { items, bend, textColor = "#ffffff", borderRadius = 0, font = "bold 30px Figtree" }: any = {}) {
    document.documentElement.classList.remove('no-js')
    this.container = container
    this.scroll = { ease: 0.05, current: 0, target: 0, last: 0 }
    this.onCheckDebounce = debounce(this.onCheck, 200)
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometry()
    this.createMedias(items, bend, textColor, borderRadius, font)
    this.update()
    this.addEventListeners()
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true })
    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 0)
    this.container.appendChild(this.gl.canvas)
  }
  createCamera() {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene() {
    this.scene = new Transform()
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }
  createMedias(items: any, bend = 1, textColor: string, borderRadius: number, font: string) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline', description: 'Default feature description' },
      { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: "Palm Trees", description: 'Default feature description' }
    ]
    const galleryItems = items && items.length ? items : defaultItems
    this.mediasImages = galleryItems.concat(galleryItems)
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        description: data.description || "",
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font
      })
    })
  }
  onTouchDown(e: any) {
    e.preventDefault()
    e.stopPropagation()
    this.isDown = true
    this.scroll.position = this.scroll.current
    this.start = e.touches ? e.touches[0].clientX : e.clientX
  }
  onTouchMove(e: any) {
    if (!this.isDown) return
    e.preventDefault()
    e.stopPropagation()
    const x = e.touches ? e.touches[0].clientX : e.clientX
    const distance = (this.start - x) * 0.05
    this.scroll.target = this.scroll.position + distance
  }
  onTouchUp() {
    this.isDown = false
    this.onCheck()
  }
  onWheel(e: any) {
    e.preventDefault()
    e.stopPropagation()
    this.scroll.target += 2
    this.onCheckDebounce()
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return
    const width = this.medias[0].width
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width)
    const item = width * itemIndex
    this.scroll.target = this.scroll.target < 0 ? -item : item
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    })
    const fov = (this.camera.fov * Math.PI) / 180
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect
    this.viewport = { width, height }
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport })
      )
    }
  }
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    )
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left'
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction))
    }
    this.renderer.render({ scene: this.scene, camera: this.camera })
    this.scroll.last = this.scroll.current
    this.raf = window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this)
    this.boundOnWheel = this.onWheel.bind(this)
    this.boundOnTouchDown = this.onTouchDown.bind(this)
    this.boundOnTouchMove = this.onTouchMove.bind(this)
    this.boundOnTouchUp = this.onTouchUp.bind(this)
    
    window.addEventListener('resize', this.boundOnResize)
    
    // Add event listeners specifically to the canvas element
    this.gl.canvas.addEventListener('wheel', this.boundOnWheel, { passive: false })
    this.gl.canvas.addEventListener('mousedown', this.boundOnTouchDown)
    this.gl.canvas.addEventListener('mousemove', this.boundOnTouchMove)
    this.gl.canvas.addEventListener('mouseup', this.boundOnTouchUp)
    this.gl.canvas.addEventListener('touchstart', this.boundOnTouchDown, { passive: false })
    this.gl.canvas.addEventListener('touchmove', this.boundOnTouchMove, { passive: false })
    this.gl.canvas.addEventListener('touchend', this.boundOnTouchUp)
  }
  destroy() {
    window.cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.boundOnResize)
    
    // Remove event listeners from canvas element
    if (this.gl && this.gl.canvas) {
      this.gl.canvas.removeEventListener('wheel', this.boundOnWheel)
      this.gl.canvas.removeEventListener('mousedown', this.boundOnTouchDown)
      this.gl.canvas.removeEventListener('mousemove', this.boundOnTouchMove)
      this.gl.canvas.removeEventListener('mouseup', this.boundOnTouchUp)
      this.gl.canvas.removeEventListener('touchstart', this.boundOnTouchDown)
      this.gl.canvas.removeEventListener('touchmove', this.boundOnTouchMove)
      this.gl.canvas.removeEventListener('touchend', this.boundOnTouchUp)
    }
    
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas)
    }
  }
}

interface CircularGalleryProps {
  items?: Array<{ image: string; text: string }>;
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
}

export default function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px Figtree"
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (containerRef.current) {
      const app = new App(containerRef.current, { items, bend, textColor, borderRadius, font })
      return () => {
        app.destroy()
      }
    }
  }, [items, bend, textColor, borderRadius, font])
  return (
    <div className='circular-gallery' ref={containerRef} />
  )
} 
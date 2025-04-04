import gsap from "gsap"

// 睡眠
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
// 雨滴
export class Rays {
  /**
   * Constructor
   */
  constructor({ el }) {
    this.container = el
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.rays = []
    this.init()
  }

  /**
   * Init
   */
  init() {
    this.resizeHandler()
    this.bindEvents()

    requestAnimationFrame(this.tick.bind(this))
  }

  /**
   * Bind events
   */
  bindEvents() {
    window.addEventListener("resize", this.resizeHandler.bind(this))
  }

  /**
   * Resize handler
   */
  resizeHandler() {
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight

    this.emit()
  }

  /**
   * Emit
   */
  emit() {
    this.rays = []
    this.totalRays = this.height * 0.75

    for (let i = 0; i < this.totalRays; i++) {
      const ray = new Ray(this)
      this.rays.push(ray)
    }
  }

  /**
   * Tick
   */
  tick() {
    let path = ""
    this.rays.forEach((ray) => {
      ray.tick()
      path += ray.d
    })
    this.container.style.clipPath = 'path("' + path + '")'
    requestAnimationFrame(this.tick.bind(this))
  }
}
// 雨滴
export class Ray {
  /**
   * Constructor
   */
  constructor(emitter) {
    this.emitter = emitter
    const gap = 12

    this.x = Math.random() * this.emitter.width
    this.y = Math.floor(Math.random() * (this.emitter.height / gap + 1)) * gap

    this.width = 50 * Math.random()
    this.velocity = 0.25 + this.width / 50

    this.d = ""
  }

  /**
   * Update position
   */
  update() {
    this.x += this.velocity
    if (this.x > this.emitter.width) {
      this.x = -this.width
    }
  }

  /**
   * Draw line
   */
  draw() {
    this.d =
      "M " +
      this.x +
      "," +
      this.y +
      " h " +
      this.width +
      " v 1 h -" +
      this.width +
      " z "
  }

  /**
   * Tick
   */
  tick() {
    this.update()
    this.draw()
  }
}
// 鼠标
export class Cursor {
  constructor() {
    this.mouse = {
      position: { x: 0, y: 0 },
      last: { x: 0, y: 0 },
      smoothPosition: { x: 0, y: 0 },
      speed: 0,
    }

    this.windowSize = Math.hypot(window.innerWidth, window.innerHeight)

    this.touch = { x: 0, y: 0 }

    this.scene = document.querySelector(".cursor-scene")
    this.wrapper = document.querySelector(".cursor-wrapper")
    this.points = []

    this.init()
  }

  init() {
    this.resizeHandler()
    this.bindEvents()

    this.getMouseMovement()

    gsap.ticker.add(this.tick.bind(this))
  }

  bindEvents() {
    window.addEventListener("resize", this.resizeHandler.bind(this))
    window.addEventListener("mousemove", this.mouseHandler.bind(this))

    window.addEventListener("touchstart", this.touchHandler.bind(this))
    window.addEventListener("touchmove", this.touchHandler.bind(this))
  }

  resizeHandler() {
    this.windowSize = Math.hypot(window.innerWidth, window.innerHeight)

    // @ts-ignore
    this.scene.setAttribute("width", window.innerWidth + "px")
    // @ts-ignore
    this.scene.setAttribute("height", window.innerHeight + "px")
  }

  mouseHandler(e) {
    this.mouse.position.x = e.pageX
    this.mouse.position.y = e.pageY
  }

  touchHandler(e) {
    const touch = e.touches[0]

    this.mouse.position.x = touch.pageX
    this.mouse.position.y = touch.pageY
  }

  getMouseMovement() {
    const distX = this.mouse.position.x - this.mouse.last.x
    const distY = this.mouse.position.y - this.mouse.last.y
    const dist = Math.hypot(distX, distY)

    this.mouse.speed += (dist - this.mouse.speed) * 0.1
    if (this.mouse.speed < 0.001) {
      this.mouse.speed = 0
    }

    this.mouse.last = {
      x: this.mouse.position.x,
      y: this.mouse.position.y,
    }

    setTimeout(this.getMouseMovement.bind(this), 20)
  }

  emitCursor() {
    const maxPoints = 1000
    if (this.points.length < maxPoints) {
      for (let i = maxPoints - this.points.length; i > 0; i--) {
        const point = new Point(
          this.mouse.smoothPosition.x,
          this.mouse.smoothPosition.y,
          this
        )
        // @ts-ignore
        this.wrapper.prepend(point.el)
        this.points.push(point)
      }
    }
  }

  tick() {
    this.emitCursor()

    // Move mouse
    this.mouse.smoothPosition.x +=
      (this.mouse.position.x - this.mouse.smoothPosition.x) * 0.1
    this.mouse.smoothPosition.y +=
      (this.mouse.position.y - this.mouse.smoothPosition.y) * 0.1

    document.documentElement.style.setProperty(
      "--mouse-x",
      // @ts-ignore
      this.mouse.smoothPosition.x
    )
    document.documentElement.style.setProperty(
      "--mouse-y",
      // @ts-ignore
      this.mouse.smoothPosition.y
    )
  }
}
// 鼠标
export class Point {
  constructor(x = 0, y = 0, cursor) {
    this.cursor = cursor

    this.anchor = { x, y }
    this.x = x
    this.y = y
    this.r =
      Math.random() *
      Math.min(this.cursor.mouse.speed, this.cursor.windowSize * 0.005)
    this.seed = Math.random() * 1000
    this.freq = 0.05 + Math.random() * 0.1
    this.amplitude = Math.random() * 10

    this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    // @ts-ignore
    this.el.setAttribute("cx", this.x)
    // @ts-ignore
    this.el.setAttribute("cy", this.y)
    // @ts-ignore
    this.el.setAttribute("r", this.r)

    let color = Math.random()
    if (color < 0.33) {
      // @ts-ignore
      color = "#4cede1"
    } else if (color < 0.66) {
      // @ts-ignore
      color = "#ffc53a"
    } else {
      // @ts-ignore
      color = "#ff858d"
    }
    // @ts-ignore
    color += Math.round(Math.random() * 255).toString(16)
    // @ts-ignore
    this.el.setAttribute("fill", color)

    this.init()
  }

  init() {
    const self = this

    gsap.to(this, {
      duration: 1 + Math.random() * 2,
      y: "-=" + Math.random() * 200 + "px",
      r: 0,
      ease: "power1.inOut",
      onUpdate: () => {
        self.x =
          self.anchor.x +
          Math.cos((gsap.ticker.frame + self.seed) * self.freq) * self.amplitude
        // @ts-ignore
        self.el.setAttribute("cy", self.y)
        // @ts-ignore
        self.el.setAttribute("cx", self.x)
        // @ts-ignore
        self.el.setAttribute("r", self.r)
      },
      onComplete: this.kill.bind(this),
    })
  }

  kill() {
    const self = this

    this.cursor.points.forEach((point, index) => {
      if (point === self) {
        self.cursor.points.splice(index, 1)
      }
    })

    self.el.remove()
  }
}

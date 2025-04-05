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
// 波动效果
export class SVG {
  constructor({ el }) {
    this.ratio = 420 / 297

    this.el = el

    this.resizeHandler()
    window.addEventListener("resize", this.resizeHandler.bind(this))
  }

  resizeHandler() {
    const maxWidth = window.innerWidth - 100
    const maxHeight = window.innerHeight - 100

    this.width = maxWidth
    this.height = this.width / this.ratio

    if (this.height > maxHeight) {
      this.height = maxHeight
      this.width = maxHeight * this.ratio
    }

    this.el.setAttribute("width", this.width + "px")
    this.el.setAttribute("height", this.height + "px")
  }
}
// 波动效果
export class Scene {
  constructor({ svg, stroke }) {
    this.stroke = stroke
    this.svg = svg
    this.isPaused = false
    window.addEventListener("resize", this.resizeHandler.bind(this))

    this.maxLines = 100
    this.maxPoints = 10
  }

  resizeHandler() {
    this.generate()
  }

  generate() {
    this.lines = []

    this.maxLines = Math.floor(this.svg.width / 15)
    this.maxPoints = Math.floor(this.svg.height / 90)

    this.gapX = this.svg.width / (this.maxLines - 1)
    this.gapY = this.svg.height / (this.maxPoints - 1)

    for (let i = 0; i < this.maxLines; i++) {
      const line = {}
      const points = []

      let x = i * this.gapX

      for (let j = 0; j < this.maxPoints; j++) {
        let y = j * this.gapY

        const point = {
          offsetX: 0,
          offsetY: 0,
          x: x,
          y: y,
        }

        points.push(point)
      }

      line.points = points

      this.lines.push(line)
    }

    if (this.isPaused) {
      this.move(performance.now())
      this.draw()
      this.save()
    } else {
      this.animate()
    }
  }

  move(time) {
    this.lines.forEach((line) => {
      line.points.forEach((point, index) => {
        point.offsetY = Math.cos(point.x * 0.025 + time * 0.00025) * 40
        point.offsetX =
          Math.sin((point.y + point.offsetY) * 0.02 + time * 0.000125) *
          this.gapX *
          2.5

        if (index === 0 || index === line.points.length - 1) {
          point.offsetX = 0
          point.offsetY = 0
        }
      })
    })
  }

  draw() {
    this.svg.el.innerHTML = ""

    const type = "Q"

    this.lines.forEach((line, index) => {
      let d = ""

      line.points.forEach((point, index) => {
        const cmd = index === 0 ? "M" : type

        const x = point.x + point.offsetX
        const y = point.y + point.offsetY

        if (type === "Q") {
          let p2 = point
          if (index > 0 && index < line.points.length - 1) {
            p2 = line.points[index - 1]
          }

          const cx = point.x
          const cy = (y + p2.y) * 0.5

          d += " " + cmd + " " + cx + "," + cy + " " + x + "," + y
        } else if (type === "L") {
          d += " " + cmd + " " + x + "," + y
        }
        try {
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          )
          circle.setAttribute("fill", "none")
          circle.setAttribute("stroke", this.stroke)
          circle.setAttribute("stroke-width", "1px")

          circle.setAttribute("r", 1)
          circle.setAttribute("cx", x)
          circle.setAttribute("cy", y)

          this.svg.el.append(circle)
        } catch (e) {
          console.log(e)
        }
      })
      try {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        )
        path.setAttribute("fill", "none")
        path.setAttribute("stroke", this.stroke)
        path.setAttribute("stroke-width", "1px")

        path.setAttribute("d", d)
        this.svg.el.append(path)
      } catch (e) {
        console.log(e)
      }
    })

    const outer = document.createElementNS("http://www.w3.org/2000/svg", "path")
    outer.setAttribute("fill", "none")
    outer.setAttribute("stroke", this.stroke)
    outer.setAttribute("stroke-width", "1px")

    outer.setAttribute(
      "d",
      "M 0,0 L " +
        this.svg.width +
        ",0 M " +
        this.svg.width +
        "," +
        this.svg.height +
        " L 0," +
        this.svg.height
    )

    this.svg.el.append(outer)
  }

  animate() {
    this.startTime = performance.now()
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
    this.tick()
  }

  tick(nowTime) {
    if (!this.isPaused) {
      const deltaTime = nowTime - this.startTime

      this.move(deltaTime)
      this.draw()
    }

    this.raf = requestAnimationFrame(this.tick.bind(this))
  }

  toggle() {
    this.isPaused = !this.isPaused
  }
}

// canvasNavigation.js

/// CanvasNavigation class handles zooming and panning of a canvas
// Obtain the pan and zoom values using the panX, panY, and zoomLevel properties
export default class CanvasNavigation {
  constructor(canvas, redraw_cb) {
    this.canvas = canvas;
    this.updateCanvas = redraw_cb;
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;

    // Bind event listeners
    this.bindEvents();
  }

  /// Bind event listeners
  bindEvents() {
    // Mouse wheel for zoom and pan (computers)
    this.canvas.addEventListener("wheel", (e) => this.handleWheel(e));

    // Handle 2-finger touch for zoom and pan (mobile devices)
    this.canvas.addEventListener("touchstart", (e) => this.handleTouchStart(e), {
      passive: false, // Required when calling preventDefault() in touch events
    });
    this.canvas.addEventListener("touchmove", (e) => this.handleTouchMove(e), {
      passive: false,
    });
  }

  /// Handle computer mouse wheel events
  handleWheel(event) {
    event.preventDefault();

    // Zoom in or out with Ctrl + scroll.  Track-pad pinch should register ctrlKey
    if (event.ctrlKey) {
      this.zoomLevel += event.deltaY * -0.01;
      this.zoomLevel = Math.min(Math.max(0.125, this.zoomLevel), 4);
    } else {
      // Pan the canvas
      const panSpeed = 5;
      this.panX += event.deltaX * panSpeed;
      this.panY += event.deltaY * panSpeed;
    }

    this.updateCanvas();
  }

  /// When a 2-finger touch is detected, start tracking the touch
  handleTouchStart(event) {
    if (event.touches.length !== 2) return;
    event.preventDefault();

    this.touch = new TwoFingerTouch(event.touches);
  }

  /// As the 2-finger touch moves, update the zoom and pan
  handleTouchMove(event) {
    if (event.touches.length !== 2) return;
    event.preventDefault();

    const touch = new TwoFingerTouch(event.touches);
    {
      this.zoomLevel *= this.touch.zoom(touch);
      this.zoomLevel = Math.min(Math.max(0.125, this.zoomLevel), 4);
      const { x, y } = this.touch.pan(touch, this.zoomLevel);
      this.panX += x;
      this.panY += y;
    }
    this.touch = touch;

    this.updateCanvas();
  }
}

/// TwoFingerTouch class stores the center and distance between two touch points
class TwoFingerTouch {
  constructor(touches) {
    if (touches.length !== 2) {
      throw new Error("TwoFingerTouch object requires exactly 2 touches");
    }

    this.center = {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
    this.distance = Math.sqrt(
      (touches[0].clientX - touches[1].clientX) ** 2 +
        (touches[0].clientY - touches[1].clientY) ** 2
    );
  }

  zoom(other) {
    return other.distance / this.distance;
  }

  pan(other, zoomLevel) {
    return {
      x: (other.center.x - this.center.x) / zoomLevel,
      y: (other.center.y - this.center.y) / zoomLevel,
    };
  }
}

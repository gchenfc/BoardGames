import Point2 from "./point2.js";

const DEFAULT_PROPERTIES = {
  isFloating: false,
  isDraggable: false,
  isClickable: true,
  isSelectable: null,
  isHighlightable: false,
  isHidden: false,
};

export class VisualElement {
  constructor(x, y, width, height, sprite = null, properties = {}) {
    this.point = new Point2(x, y);
    this.width = width;
    this.height = height;
    this.properties = { ...DEFAULT_PROPERTIES, ...properties };
    this.sprite = sprite;
  }

  draw(ctx, name = "", debug = false) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(this.point.x, this.point.y, this.width, this.height);
    if (this.sprite) {
      // TODO
    }
    if (debug || !this.sprite) {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.strokeRect(this.point.x, this.point.y, this.width, this.height);
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.fillText(name, this.point.x, this.point.y, this.width);
      ctx.fillText(this.toString(), this.point.x, this.point.y + 10, this.width);
    }
  }

  inBounds(point) {
    return (
      this.point.x < point.x &&
      point.x < this.point.x + this.width &&
      this.point.y < point.y &&
      point.y < this.point.y + this.height
    );
  }

  toString() {
    return `element ${this.point} ${this.width} ${this.height}`;
  }
}

export class BoardElement extends VisualElement {
  constructor(x, y, width, height, sprite = null, properties = {}) {
    super(x, y, width, height, sprite, { ...DEFAULT_PROPERTIES, ...properties });
  }
}

export class FloatingElement extends VisualElement {
  constructor(x, y, width, height, sprite = null, properties = {}) {
    super(x, y, width, height, sprite, { ...DEFAULT_PROPERTIES, isFloating: true, ...properties });
  }
}

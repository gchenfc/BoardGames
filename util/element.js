const DEFAULT_PROPERTIES = {
  isFloating: false,
  isDraggable: false,
  isClickable: true,
  isSelectable: null,
};

export class VisualElement {
  constructor(x, y, width, height, sprite = null, properties = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.properties = { ...DEFAULT_PROPERTIES, ...properties };
    this.sprite = sprite;
  }

  draw(ctx, name = "", debug = false) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    if (this.sprite) {
      // TODO
    }
    if (debug) {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.fillText(name, this.x, this.y, this.width);
      ctx.fillText(this.toString(), this.x, this.y + 10, this.width);
    }
  }

  toString() {
    return `element ${this.x} ${this.y} ${this.width} ${this.height}`;
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

import Point2 from "./point2.js";

const SelectBehaviors = Object.freeze({
  HIGHLIGHT: Symbol("SelectBehaviors.HIGHLIGHT"),
  FOLLOW_MOUSE: Symbol("SelectBehaviors.FOLLOW_MOUSE"),
});

const DEFAULT_PROPERTIES = {
  isFloating: false,
  isDraggable: false,
  isClickable: false,
  isSelectable: null,
  isHoverable: false,
  selectBehavior: SelectBehaviors.HIGHLIGHT,
};

const DEFAULT_STATE = {
  isHidden: false,
  isDragging: false,
  isSelected: false,
  isHovered: false,
};

export class VisualElement {
  constructor(x, y, width, height, sprite = null, properties = {}, state = {}) {
    this.point = new Point2(x, y);
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.properties = { ...DEFAULT_PROPERTIES, ...properties };
    this.state = { ...DEFAULT_STATE, ...state };
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

    if (this.properties.isSelected) {
      ctx.strokeStyle = "rgba(0, 255, 0, 1)";
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.strokeRect(this.point.x, this.point.y, this.width, this.height);
      ctx.fillRect(this.point.x, this.point.y, this.width, this.height);
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
  constructor(x, y, width, height, sprite = null, properties = {}, state = {}) {
    super(x, y, width, height, sprite, properties, state);
  }
}

export class FloatingElement extends VisualElement {
  constructor(x, y, width, height, sprite = null, properties = {}, state = {}) {
    super(x, y, width, height, sprite, { isFloating: true, ...properties }, state);
  }
}

import Point2 from "./point2.js";

export const SelectBehaviors = Object.freeze({
  HIGHLIGHT: Symbol("SelectBehaviors.HIGHLIGHT"),
  MAKE_PREVIEWS: Symbol("SelectBehaviors.MAKE_PREVIEWS"), // Not yet implemented
  FOLLOW_MOUSE: Symbol("SelectBehaviors.FOLLOW_MOUSE"),
  FOLLOW_MOUSE_SNAP: Symbol("SelectBehaviors.FOLLOW_MOUSE_SNAP"), // Not yet implemented
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
  constructor(x, y, width, height, sprite = null, properties = {}, state = {}, angle = 0) {
    this.point = new Point2(x, y);
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.angle = angle;
    this.properties = { ...DEFAULT_PROPERTIES, ...properties };
    this.state = { ...DEFAULT_STATE, ...state };
  }

  /// Function to draw this element.  Can override this function to draw custom elements
  drawSprite(ctx) {
    if (this.sprite) {
      if (this.angle == 0) {
        ctx.drawImage(this.sprite, this.point.x, this.point.y, this.width, this.height);
      } else {
        ctx.translate(this.point.x + this.width / 2, this.point.y + this.height / 2);
        ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.rotate(-this.angle);
        ctx.translate(-(this.point.x + this.width / 2), -(this.point.y + this.height / 2));
      }
    }
  }

  draw(ctx, name = "", debug = false) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(this.point.x, this.point.y, this.width, this.height);
    this.drawSprite(ctx);
    if (debug || !this.sprite) {
      ctx.strokeStyle = "rgba(0, 0, 0, 1)";
      ctx.strokeRect(this.point.x, this.point.y, this.width, this.height);
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.fillText(name, this.point.x, this.point.y, this.width);
      ctx.fillText(this.toString(), this.point.x, this.point.y + 10, this.width);
    }

    if (this.state.isSelected || this.state.isDragging) {
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

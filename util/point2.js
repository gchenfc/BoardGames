/**
 * A 2D point class.
 */

export default class Point2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Point2(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Point2(this.x - other.x, this.y - other.y);
  }

  scale(factor) {
    return new Point2(this.x * factor, this.y * factor);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  distanceTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  toString() {
    return `Point2(${this.x}, ${this.y})`;
  }

  static FromString(s) {
    // Format: "Point2(1.234, 5.678)"
    return new Point2(...s.match(/-?\d+(\.\d+)?/g).map(parseFloat));
  }

  static Clone(p) {
    return new Point2(p.x, p.y);
  }
}

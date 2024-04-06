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
}

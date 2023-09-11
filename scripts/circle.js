class Circle {
  radius = 0;

  color = null;

  id = null;

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.color = randomColor();
    this.id = new Date().getTime();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  contains(x, y) {
    const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    return distance < this.radius;
  }

  isCursorNearEdge(x, y) {
    const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
    return distance < this.radius && distance > this.radius - 20;
  }
}

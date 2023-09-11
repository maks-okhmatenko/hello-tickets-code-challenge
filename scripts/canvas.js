class Canvas {

  // html canvas element
  element = null;

  // html ul element
  list = null;

  selectedCircle = null;

  circles = [];

  isResizing = false;

  constructor(canvasElement, list) {
    this.element = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.list = list;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Canvas mouse listeners
    this.element.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.element.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.element.addEventListener('mousemove', this.onMouseMove.bind(this));

    // List mouse listeners
    this.list.addEventListener('click', this.removeCircleFromList.bind(this));
  }

  onMouseDown(event) {
    const x = event.clientX - this.element.offsetLeft;
    const y = event.clientY - this.element.offsetTop;

    for (let circle of this.circles) {
      if (circle.isCursorNearEdge(x, y)) {
        // If cursor is next to some circle's edge, start resizing
        this.isResizing = true;
        this.selectedCircle = circle;
        return;
      } else if (circle.contains(x, y)) {
        // If cursor is inside some circle, change its color
        circle.color = randomColor();
        this.redraw();
        return;
      }
    }

    // If no circle clicked, create a new one
    const circle = this.createCircle(x, y);
    this.animateCircle(circle);
  }

  onMouseMove(event) {
    const x = event.clientX - this.element.offsetLeft;
    const y = event.clientY - this.element.offsetTop;
    let cursorInResizeZone = false;

    for (let circle of this.circles) {
      if (this.isResizing && this.selectedCircle) {
        const dx = x - this.selectedCircle.x;
        const dy = y - this.selectedCircle.y;
        this.selectedCircle.radius = Math.sqrt(dx ** 2 + dy ** 2);
        this.redraw();
      }

      if (circle.isCursorNearEdge(x, y)) {
        cursorInResizeZone = true;
      }
    }

    this.element.style.cursor = cursorInResizeZone ? 'nwse-resize' : 'default';
  }

  onMouseUp() {
    this.isResizing = false;
    this.selectedCircle = null;
  }

  createCircle(x, y) {
    const circle = new Circle(x, y);

    this.circles.push(circle);
    this.addCircleToList(circle);

    return circle;
  }

  animateCircle(circle) {
    const interval = setInterval(() => {
      if (circle.radius < 50) {
        circle.draw(this.ctx);
        circle.radius++;
      } else {
        clearInterval(interval);
      }
    }, 10);
  }

  addCircleToList(circle) {
    const listItem = document.createElement('li');
    listItem.textContent = `Circle ${circle.id}`;
    listItem.dataset.circleId = circle.id;
    this.list.appendChild(listItem);
  }

  removeCircleFromList(event) {
    if (event.target.tagName !== 'LI') {
      return;
    }
    const element = event.target;
    const circleId = parseInt(element.dataset.circleId);
    this.circles = this.circles.filter(c => c.id !== circleId);

    element.remove();
    this.redraw();
  }

  redraw() {
    const width = this.element.width;
    const height = this.element.height;
    this.ctx.clearRect(0, 0, width, height);
    this.circles.forEach(circle => {
      circle.draw(this.ctx);
    });
  }
}

class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;
    this.ctx = this.canvas.getContext("2d");

    this.mouse = null;
    this.selectedPoint = null;
    this.hoveredPoint = null;
    this.dragging = false;
    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (e) => {
      this.#handleMouseDown(e);
    });

    this.canvas.addEventListener("mousemove", (e) => {
      this.#handleMouseMove(e);
    });

    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    this.canvas.addEventListener("mouseup", () => {
      this.dragging = false;
    });
  }

  #handleMouseMove(e) {
    this.mouse = this.viewport.getMousePos(e, true);
    this.hoveredPoint = getNearestPoint(this.mouse, this.graph.points, 10);
    if (this.dragging) {
      this.selectedPoint.x = this.mouse.x;
      this.selectedPoint.y = this.mouse.y;
    }
  }

  #handleMouseDown(e) {
    if (e.button == 2) {
      if (this.selectedPoint) {
        this.selectedPoint = null;
      } else if (this.hoveredPoint) {
        this.#removePoint(this.hoveredPoint);
      }
    }
    if (e.button == 0) {
      if (this.hoveredPoint) {
        this.#selectPoint(this.hoveredPoint);
        this.dragging = true;
        return;
      }
      this.graph.addPoint(this.mouse);
      this.#selectPoint(this.mouse);
      this.hoveredPoint = this.mouse;
    }
  }

  #selectPoint(point) {
    if (this.selectedPoint) {
      this.graph.tryAddSegment(new Segment(this.selectedPoint, point));
    }
    this.selectedPoint = point;
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    if (this.selectedPoint == point) {
      this.selectedPoint = null;
    }
    this.hoveredPoint = null;
  }

  dispose() {
    this.graph.dispose();
    this.selectedPoint = null;
    this.hoveredPoint = null;
  }

  draw() {
    this.graph.draw(this.ctx);
    if (this.selectedPoint) {
      const intented = this.hoveredPoint ? this.hoveredPoint : this.mouse;
      new Segment(this.selectedPoint, intented).draw(ctx, {
        dash: [3, 3],
      });
      this.selectedPoint.draw(this.ctx, {
        outline: true,
      });
    }
    if (this.hoveredPoint) {
      this.hoveredPoint.draw(this.ctx, {
        fill: true,
      });
    }
  }
}

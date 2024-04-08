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
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.canvas.removeEventListener("mousedown", this.boundMouseDown);
    this.canvas.removeEventListener("mousemove", this.boundMouseMove);
    this.canvas.removeEventListener("mouseup", this.boundMouseUp);
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    this.selectedPoint = null;
    this.hoveredPoint = null;
  }

  #addEventListeners() {
    this.boundMouseDown = this.#handleMouseDown.bind(this);
    this.boundMouseMove = this.#handleMouseMove.bind(this);
    this.boundMouseUp = () => {
      this.dragging = false;
    };
    this.boundContextMenu = (e) => {
      e.preventDefault();
    };
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("mouseup", this.boundMouseUp);
    this.canvas.addEventListener("contextmenu", this.boundContextMenu);
  }

  #handleMouseMove(e) {
    this.mouse = this.viewport.getMousePos(e, true);
    this.hoveredPoint = getNearestPoint(
      this.mouse,
      this.graph.points,
      10 * this.viewport.zoom
    );
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

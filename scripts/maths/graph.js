class Graph {
  constructor(points = [], segments = []) {
    this.points = points;
    this.segments = segments;
  }

  static fromJSON(json) {
    const points = json.points.map((point) => Point.fromJSON(point));
    const segments = json.segments.map((seg) => {
      return new Segment(
        points.find((p) => p.equals(seg.p1)),
        points.find((p) => p.equals(seg.p2))
      );
    });
    return new Graph(points, segments);
  }

  hash() {
    return JSON.stringify(this);
  }

  addPoint(point) {
    this.points.push(point);
  }

  containsPoint(point) {
    return this.points.find((p) => p.equals(point));
  }

  tryAddPoint(point) {
    if (!this.containsPoint(point)) {
      this.addPoint(point);
      return true;
    }
    return false;
  }

  removePoint(point) {
    const segments = this.getSegmentWithPoint(point);
    segments.forEach((segment) => {
      this.removeSegment(segment);
    });
    this.points.splice(this.points.indexOf(point), 1);
  }

  addSegment(segment) {
    this.segments.push(segment);
  }

  containsSegment(segment) {
    return this.segments.find((s) => s.equals(segment));
  }

  tryAddSegment(segment) {
    if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
      this.addSegment(segment);
      return true;
    }
    return false;
  }

  removeSegment(segment) {
    this.segments.splice(this.segments.indexOf(segment), 1);
  }

  getSegmentWithPoint(point) {
    return this.segments.filter((s) => s.includesPoint(point));
  }

  dispose() {
    this.points = [];
    this.segments = [];
  }

  draw(ctx) {
    this.segments.forEach((segment) => {
      segment.draw(ctx);
    });

    this.points.forEach((point) => {
      point.draw(ctx);
    });
  }
}

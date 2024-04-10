class Segment {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  static fromJSON(json) {
    return new Segment(Point.fromJSON(json.p1), Point.fromJSON(json.p2));
  }

  length() {
    return distance(this.p1, this.p2);
  }

  directionVector() {
    return normalize(sub(this.p2, this.p1));
  }

  equals(segment) {
    return this.includesPoint(segment.p1) && this.includesPoint(segment.p2);
  }

  includesPoint(point) {
    return this.p1.equals(point) || this.p2.equals(point);
  }

  distanceToPoint(point) {
    const projection = this.projectionOf(point);
    if (projection.offset > 0 && projection.offset < 1) {
      return distance(point, projection.point);
    }
    const d1 = distance(this.p1, point);
    const d2 = distance(this.p2, point);
    return Math.min(d1, d2);
  }

  projectionOf(point) {
    const v = sub(this.p2, this.p1);
    const w = sub(point, this.p1);
    const normV = normalize(v);
    const scaler = dot(w, normV);
    const projection = {
      point: add(this.p1, scale(normV, scaler)),
      offset: scaler / magnitude(v),
    };
    return projection;
  }

  draw(ctx, { width = 3, color = "black", dash = [], cap = "butt" } = {}) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = cap;
    ctx.setLineDash(dash);
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

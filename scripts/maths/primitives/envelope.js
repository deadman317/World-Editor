class Envelope {
  constructor(skeleton, width, roundness = 1) {
    if (skeleton) {
      this.skeleton = skeleton;
      this.poly = this.#generatePolygons(width, roundness);
    }
  }

  static fromJSON(json) {
    const envelope = new Envelope();
    envelope.skeleton = Segment.fromJSON(json.skeleton);
    envelope.poly = Polygon.fromJSON(json.poly);
    return envelope;
  }

  #generatePolygons(width, roundness) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = angle(sub(p1, p2));
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;

    const points = [];
    const step = Math.PI / Math.max(1, roundness);
    const eps = step / 2;
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p1, i, radius));
    }
    for (let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
      points.push(translate(p2, Math.PI + i, radius));
    }

    return new Polygon(points);
  }
  draw(ctx, options = {}) {
    this.poly.draw(ctx, options);
  }
}

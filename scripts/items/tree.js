class Tree {
  constructor(center, size, height = 200) {
    this.center = center;
    this.size = size;
    this.height = height;
    this.base = this.#generateLevel(center, size);
  }

  static fromJSON(json) {
    return new Tree(Point.fromJSON(json.center), json.size, json.height);
  }

  #generateLevel(point, size) {
    const points = [];
    const radius = size / 2;
    for (let a = 0; a < 2 * Math.PI; a += Math.PI / 16) {
      const random = Math.cos(((a + this.center.x) * size) % 17) ** 2;
      const noisyRadius = radius * linearInterpolation(0.5, 1, random);
      points.push(translate(point, a, noisyRadius));
    }
    return new Polygon(points);
  }

  draw(ctx, viewPoint) {
    const top = getFake3DPoint(this.center, viewPoint, this.height);

    const levelCount = 7;
    for (let level = 0; level < levelCount; level++) {
      const t = level / (levelCount - 1);
      const point = linearInterpolation2D(this.center, top, t);
      const color = `rgb(30, ${linearInterpolation(50, 200, t)}, 70)`;
      const size = linearInterpolation(this.size, 40, t);
      const poly = this.#generateLevel(point, size);
      poly.draw(ctx, { fill: color, stroke: "rgba(0, 0, 0, 0)" });
    }
  }
}

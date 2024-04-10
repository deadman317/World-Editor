class Building {
  constructor(base, height = 200) {
    this.base = base;
    this.height = height;
  }

  static fromJSON(json) {
    return new Building(Polygon.fromJSON(json.base), json.height);
  }

  draw(ctx, viewPoint) {
    const topPoints = this.base.points.map((p) =>
      getFake3DPoint(p, viewPoint, this.height * 0.6)
    );
    const celling = new Polygon(topPoints);
    const sides = [];
    for (let i = 0; i < this.base.points.length; i++) {
      const next = (i + 1) % this.base.points.length;
      const poly = new Polygon([
        this.base.points[i],
        this.base.points[next],
        topPoints[next],
        topPoints[i],
      ]);
      sides.push(poly);
    }
    sides.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );

    const baseMidpoint = [
      average(this.base.points[0], this.base.points[1]),
      average(this.base.points[2], this.base.points[3]),
    ];

    const topMidpoint = baseMidpoint.map((p) =>
      getFake3DPoint(p, viewPoint, this.height)
    );

    const roofPoly = [
      new Polygon([
        celling.points[0],
        celling.points[3],
        topMidpoint[1],
        topMidpoint[0],
      ]),
      new Polygon([
        celling.points[1],
        celling.points[2],
        topMidpoint[1],
        topMidpoint[0],
      ]),
    ];
    roofPoly.sort(
      (a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint)
    );
    this.base.draw(ctx, {
      fill: "white",
      stroke: "rgba(0,0,0,0.2)",
      lineWidth: 20,
    });
    for (const side of sides) {
      side.draw(ctx, { fill: "white", stroke: "#AAA" });
    }
    celling.draw(ctx, { fill: "white", stroke: "white", lineWidth: 6 });
    for (const poly of roofPoly) {
      poly.draw(ctx, {
        fill: "#D44",
        stroke: "#C44",
        lineWidth: 8,
        join: "round",
      });
    }
  }
}

class Light extends Marking {
  constructor(center, directionVector, width, height) {
    super(center, directionVector, width, 16);

    this.state = "off";
    this.border = this.poly.segments[2];
    this.type = "light";
  }

  draw(ctx) {
    const perp = perpendicular(this.directionVector);
    const line = new Segment(
      add(this.center, scale(perp, this.width / 2)),
      add(this.center, scale(perp, -this.width / 2))
    );
    const green = linearInterpolation2D(line.p1, line.p2, 0.2);
    const yellow = linearInterpolation2D(line.p1, line.p2, 0.5);
    const red = linearInterpolation2D(line.p1, line.p2, 0.8);

    new Segment(red, green).draw(ctx, { width: this.height, cap: "round" });
    green.draw(ctx, { color: "#060", size: this.height * 0.6 });
    yellow.draw(ctx, { color: "#660", size: this.height * 0.6 });
    red.draw(ctx, { color: "#600", size: this.height * 0.6 });

    switch (this.state) {
      case "green":
        green.draw(ctx, { color: "#0F0", size: this.height * 0.6 });
        break;
      case "yellow":
        yellow.draw(ctx, { color: "#FF0", size: this.height * 0.6 });
        break;
      case "red":
        red.draw(ctx, { color: "#F00", size: this.height * 0.6 });
        break;
    }
  }
}

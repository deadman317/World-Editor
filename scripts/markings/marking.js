class Marking {
  constructor(center, directionVector, width, height) {
    this.center = center;
    this.directionVector = directionVector;
    this.width = width;
    this.height = height;

    this.support = new Segment(
      translate(center, angle(directionVector), -height / 2),
      translate(center, angle(directionVector), height / 2)
    );
    this.poly = new Envelope(this.support, width).poly;

    this.type = "marking";
  }

  static fromJSON(json) {
    const center = Point.fromJSON(json.center);
    const directionVector = Point.fromJSON(json.directionVector);
    const width = json.width;
    const height = json.height;
    switch (json.type) {
      case "crossing":
        return new Crossing(center, directionVector, width, height);
      case "stop":
        return new Stop(center, directionVector, width, height);
      case "start":
        return new Start(center, directionVector, width, height);
      case "target":
        return new Target(center, directionVector, width, height);
      case "yield":
        return new Yield(center, directionVector, width, height);
      case "light":
        return new Light(center, directionVector, width, height);
      case "parking":
        return new Parking(center, directionVector, width, height);
    }
  }

  draw(ctx) {
    this.poly.draw(ctx);
  }
}

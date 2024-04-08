class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = [];
    for (let i = 0; i < points.length; i++) {
      this.segments.push(
        new Segment(points[i], points[(i + 1) % points.length])
      );
    }
  }

  static union(polygons) {
    Polygon.multiBreak(polygons);
    const keptSegments = [];
    for (let i = 0; i < polygons.length; i++) {
      for (const seg of polygons[i].segments) {
        let keep = true;
        for (let j = 0; j < polygons.length; j++) {
          if (i != j && polygons[j].containsSegment(seg)) {
            keep = false;
            break;
          }
        }
        if (keep) {
          keptSegments.push(seg);
        }
      }
    }
    return keptSegments;
  }

  containsSegment(seg) {
    const midPoint = average(seg.p1, seg.p2);
    return this.containsPoint(midPoint);
  }

  containsPoint(point) {
    return pointInsidePolygon(point, this);
  }

  static multiBreak(polygons) {
    for (let i = 0; i < polygons.length - 1; i++) {
      for (let j = i + 1; j < polygons.length; j++) {
        Polygon.break(polygons[i], polygons[j]);
      }
    }
  }

  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    for (let i = 0; i < segs1.length; i++) {
      for (let j = 0; j < segs2.length; j++) {
        const inter = getIntersection(segs1[i], segs2[j]);
        if (inter && inter.offset != 0 && inter.offset != 1) {
          const point = new Point(inter.x, inter.y);
          let aux = segs1[i].p2;
          segs1[i].p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));
          aux = segs2[j].p2;
          segs2[j].p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      }
    }
  }

  distanceToPoint(point) {
    return Math.min(...this.segments.map((seg) => seg.distanceToPoint(point)));
  }

  distanceToPoly(poly) {
    return Math.min(...this.points.map((point) => poly.distanceToPoint(point)));
  }

  intersectsPoly(poly) {
    for (const seg of this.segments) {
      for (const seg2 of poly.segments) {
        if (getIntersection(seg, seg2)) {
          return true;
        }
      }
    }
    return false;
  }

  drawSegments(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx, { color: getRandomColor(), width: 5 });
    }
  }

  draw(
    ctx,
    {
      stroke = "blue",
      lineWidth = 1,
      fill = "rgba(0,0,255,0.3)",
      join = "miter",
    } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = join;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }
}

class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();
    this.readings = [];
    for (let v = 0; v < this.rays.length; v++) {
      this.readings.push(this.#getReading(this.rays[v], roadBorders, traffic));
    }
  }

  #getReading(ray, roadBorders, traffic) {
    let touches = [];

    for (let v = 0; v < roadBorders.length; v++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[v][0],
        roadBorders[v][1]
      );
      if (touch) {
        touches.push(touch);
      }
    }

    for (let v = 0; v < traffic.length; v++) {
      const poly = traffic[v].polygon;
      for (let s = 0; s < poly.length; s++) {
        const value = getIntersection(
          ray[0],
          ray[1],
          poly[s],
          poly[(s + 1) % poly.length]
        );
        if (value) {
          touches.push(value);
        }
      }
    }

    if (touches.length == 0) {
      return null;
    } else {
      const offsets = touches.map((e) => e.offset);
      const minOffset = Math.min(...offsets);
      return touches.find((e) => e.offset == minOffset);
    }
  }

  #castRays() {
    this.rays = [];
    for (let v = 0; v < this.rayCount; v++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : v / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let v = 0; v < this.rayCount; v++) {
      let end = this.rays[v][1];
      if (this.readings[v]) {
        end = this.readings[v];
      }

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(this.rays[v][0].x, this.rays[v][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(this.rays[v][1].x, this.rays[v][1].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }
}

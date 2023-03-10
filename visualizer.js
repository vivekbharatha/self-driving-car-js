class Visualizer {
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin * 2;
    const height = ctx.canvas.height - margin * 2;

    const levelHeight = height / network.levels.length;

    for (let v = network.levels.length - 1; v >= 0; v--) {
      const levelTop =
        top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length == 1 ? 0.5 : v / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(
        ctx,
        network.levels[v],
        left,
        levelTop,
        width,
        levelHeight,
        v == network.levels.length - 1 ? ["🠉", "🠈", "🠊", "🠋"] : []
      );
    }
  }

  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    for (let v = 0; v < inputs.length; v++) {
      for (let s = 0; s < outputs.length; s++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.#getNodeX(inputs, v, left, right), bottom);
        ctx.lineTo(Visualizer.#getNodeX(outputs, s, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[v][s]);
        ctx.stroke();
      }
    }

    const nodeRadius = 18;
    for (let v = 0; v < inputs.length; v++) {
      const x = Visualizer.#getNodeX(inputs, v, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[v]);
      ctx.fill();
    }

    for (let v = 0; v < outputs.length; v++) {
      const x = Visualizer.#getNodeX(outputs, v, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[v]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[v]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[v]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = nodeRadius * 1.5 + "px Arial";
        ctx.fillText(outputLabels[v], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[v], x, top + nodeRadius * 0.1);
      }
    }
  }

  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}

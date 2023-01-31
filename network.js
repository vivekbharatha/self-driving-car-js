class NeuralNetwork {
  constructor(neuronCounts) {
    this.levels = [];

    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0]);

    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i]);
    }

    return outputs;
  }

  static mutate(network, amount = 1) {
    network.levels.forEach((level) => {
      for (let v = 0; v < level.biases.length; v++) {
        level.biases[v] = lerp(level.biases[v], Math.random() * 2 - 1, amount);
      }

      for (let v = 0; v < level.weights.length; v++) {
        for (let s = 0; s < level.weights[v].length; s++) {
          level.weights[v][s] = lerp(
            level.weights[v][s],
            Math.random() * 2 - 1,
            amount
          );
        }
      }
    });
  }
}

class Level {
  constructor(inputCount, outputCount) {
    this.inputs = new Array(inputCount);
    this.outputs = new Array(outputCount);
    this.biases = new Array(outputCount);

    this.weights = [];
    for (let v = 0; v < inputCount; v++) {
      this.weights[v] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  static #randomize(level) {
    for (let v = 0; v < level.inputs.length; v++) {
      for (let s = 0; s < level.outputs.length; s++) {
        level.weights[v][s] = Math.random() * 2 - 1;
      }
    }

    for (let v = 0; v < level.biases.length; v++) {
      level.biases[v] = Math.random() * 2 - 1;
    }
  }

  static feedForward(givenInputs, level) {
    for (let v = 0; v < level.inputs.length; v++) {
      level.inputs[v] = givenInputs[v];
    }

    for (let v = 0; v < level.outputs.length; v++) {
      let sum = 0;
      for (let s = 0; s < level.inputs.length; s++) {
        sum += level.inputs[s] * level.weights[s][v];
      }

      if (sum > level.biases[v]) {
        level.outputs[v] = 1;
      } else {
        level.outputs[v] = 0;
      }
    }

    return level.outputs;
  }
}

const distanceId = document.getElementById("distance");
const noOfCarsId = document.getElementById("noOfCars");

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = CANVAS_WIDTH;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = CANVAS_WIDTH;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const N = 2000;

let cars = generateCars(N);

let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let v = 0; v < cars.length; v++) {
    cars[v].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (v !== 0) {
      NeuralNetwork.mutate(cars[v].brain, 0.1);
    }
  }
}

let traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50),
  new Car(road.getLaneCenter(0), -300, 30, 50),
  new Car(road.getLaneCenter(2), -300, 30, 50),
  new Car(road.getLaneCenter(0), -500, 30, 50),
  new Car(road.getLaneCenter(1), -500, 30, 50),
  new Car(road.getLaneCenter(1), -700, 30, 50),
  new Car(road.getLaneCenter(2), -700, 30, 50),
];

generateTraffic();

function generateTraffic() {
  setInterval(() => {
    if (traffic.length < 4) {
      traffic.push(
        new Car(
          road.getLaneCenter(Math.floor(Math.random() * 3)),
          traffic[traffic.length - 1].y - 200,
          30,
          50
        )
      );
    }

    traffic = traffic.filter((trafficCar) => trafficCar.y - bestCar.y < 100);
  }, 2000);
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let v = 1; v <= N; v++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 3));
  }
  return cars;
}

function animate(time) {
  for (let v = 0; v < traffic.length; v++) {
    traffic[v].update(road.borders, []);
  }

  for (let v = 0; v < cars.length; v++) {
    cars[v].update(road.borders, traffic);
  }

  cars = cars.filter((car) => !car.damaged);

  bestCar = cars.find((car) => car.y == Math.min(...cars.map((car) => car.y)));

  carCanvas.height = CANVAS_HEIGHT;
  networkCanvas.height = CANVAS_HEIGHT;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let v = 0; v < traffic.length; v++) {
    traffic[v].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;

  for (let v = 0; v < cars.length; v++) {
    cars[v].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);

  noOfCarsId.innerHTML = cars.length;
  distanceId.innerHTML = Math.floor(Math.abs(bestCar.y));
}

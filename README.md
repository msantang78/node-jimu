# NODE-JIMU

This is a quick and dirty lib to control the Ubtech robots. I bought an Astrobot kit to teach some coding concepts to my daughter, and despite that the mobile app is great I wanted to have the possibility to work with it from a mac or PC.
Spoofing the Bluetooth communication from the app with the robot and I was able to figure out some parts of the communication protocol.

Disclaimer: I have no affiliation with Ubtech and the intention of this lib is to get even more from these awesome robotics kits.

## Compatibilty

For now this code is to control the astrobot model

## Installation

`yarn add node-jimu`
or
`npm install node-jimu`

## Usage

```js
import { Communication, Commands, delay } from "node-jimu";

const comm = new Communication("My_Jimu_CA15"); // name of the robot as seen in jimu app
const robot: Commands = new Commands(comm);

comm.connect(async () => {
  // // enable predefined animation for the eyes: red, green, blue, animation (0 - 15), eye (1, 2 or 3 for both)
  await robot.setEyesAnimation(253, 158, 254, 1, 3, 1);

  // set servo positions central, left arm, right arm, speed
  await robot.setPosition(205, 120, 120, 20);
  await delay(4000);

  // enable predefined animation for the eyes: red, green, blue, animation (0 - 15), eye (1, 2 or 3 for both)
  await robot.setEyesAnimation(253, 158, 254, 6, 3, 3);

  // set servo positions central, left arm, right arm, speed
  await robot.setPosition(190, 120, 120, 10);
  await delay(2000);

  // set eyes color red, green, blue, eye (1, 2 or 3 for both), time
  await robot.setEyes(0xff, 0x04, 0x04, 3, 60);
  await delay(2000);

  // set position again
  await robot.setPosition(220, 140, 100, 44);
  await delay(1000);

  // set wheels speed (sadly, it seems like you only can do it individually )
  await robot.setSpeed(1, 2, 0x92);
  await robot.setSpeed(2, 1, 0x92);

  await delay(2000);

  // full stop!
  await robot.stop();

  await delay(100);
  // disconnect
  comm.disconnect();

  // close
  process.exit(0);
});

```

Reading data
```js
import { Communication, Commands, delay } from "node-jimu";

const comm = new Communication("My_Jimu_CA15"); // name of the robot as seen in jimu app
const robot: Commands = new Commands(comm);
comm.setDebug(true);

comm.connect(async () => {
  try {
    // get servo positions
    const p = await robot.getPosition();
    console.log("position", p);

    // get sensors data
    const s = await robot.getSensors();
    console.log("sensors", s);
  } catch (error) {
    console.log(error);
  }

  // disconnect
  comm.disconnect();

  // close
  process.exit(0);
});
```

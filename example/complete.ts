import { Communication } from "../src/Communication";
import { Commands } from "../src/Commands";
import say from "say";

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const comm = new Communication("My_Jimu_CA10"); // name of the robot as seen in jimu app
const robot: Commands = new Commands(comm);

say.speak("", "Paulina");

comm.connect(async () => {
  const s = await robot.getSensors();

  console.log(s); // Sensors information

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

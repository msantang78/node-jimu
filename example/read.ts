import { Communication } from "../src/Communication";
import { Commands } from "../src/Commands";

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const comm = new Communication("My_Jimu_CA10"); // name of the robot as seen in jimu app
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

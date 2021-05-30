import type { Communication } from "./Communication";

/**
 * Robot commands
 */
export class Commands {
  com: Communication;

  constructor(com: Communication) {
    this.com = com;
  }

  async com1() {
    const payload = [0x06, 0x36, 0x00, 0x3c];
    await this.com.send(payload);
  }

  async setEyes(r: number, g: number, b: number, eyes: number = 3, time = 255) {
    const payload = [
      0x79,
      0x04,
      eyes, // eyes 1, 2, 3 both
      time, // time
      0x01, // number of colors
      0xff, // light mask
      r, // color 0-255
      g, // color 0-255
      b, // color 0-255
    ];
    await this.com.send(payload);
  }

  async setEyesAnimation(
    r: number,
    g: number,
    b: number,
    animation: number,
    eyes: number = 3,
    repetition = 1
  ) {
    const payload = [
      0x78, // command
      0x04,
      eyes, // eye 1, 2, 3 both
      animation, // animation
      0x00, // repetition 16bits?
      repetition, // repetitions
      r, // 0-255
      g, // 0-255
      b, // 0-255
    ];
    await this.com.send(payload);
  }

  /**
   * Get sensors
   */
  async getSensors() {
    const payload = [0x7e, 0x01, 0x01, 0x01];

    return await this.com.sendWithResponse(payload);
  }

  /**
   * Get position of servo
   * @param servo
   * @returns
   */
  async getPosition() {
    const payload = [0x0b, 0x00, 0x00];

    return await this.com.sendWithResponse(payload, 5, 1500);
  }

  /**
   * Set servos positions
   */
  async setPosition(s1: number, s2: number, s3: number, speed: number) {
    const payload = [
      0x09,
      0,
      0,
      0,
      28,
      s1, // central servo position
      s2, // left arm position
      s3, // right arm position
      speed, // speed
      1, // ?
      121, // ?
    ];
    await this.com.send(payload);
  }

  async setSpeed(motor: number, direction: 1 | 2, vel: number) {
    const payload = [0x07, 0x01, motor, direction, 0x01, vel];
    await this.com.send(payload);
  }

  async setRotationSpeed(direction: 1 | 2, vel: number) {
    const payload = [0x07, 0x02, direction, direction === 2 ? 1 : 2, 0x01, vel];
    await this.com.send(payload);
  }

  async stop() {
    const payload = [0x07, 0x02, 1, 2, 0, 0, 0];
    await this.com.send(payload);
  }
}

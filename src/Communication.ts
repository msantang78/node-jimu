import noble, { Peripheral, Characteristic } from "@abandonware/noble";

/**
 * Bluetooth Communication
 */
export class Communication {
  characteristics: Array<Characteristic>;
  peripheral: Peripheral;
  onReady?: Function;
  onDisconnect?: Function;
  debug: boolean = false;

  constructor(name: string) {
    noble.on("discover", async (peripheral: Peripheral) => {
      console.log("Found device", peripheral.advertisement.localName);
      if (
        peripheral.advertisement &&
        peripheral.advertisement.localName === name
      ) {
        await noble.stopScanningAsync();
        await peripheral.connectAsync();
        this.peripheral = peripheral;

        // on disconnet
        if (this.onDisconnect) {
          peripheral.on("disconnect", this.onDisconnect);
        }

        // get bluetooth characteristics and services
        const { characteristics, services } =
          await peripheral.discoverAllServicesAndCharacteristicsAsync();

        this.characteristics = characteristics;

        // subscribe to events
        try {
          await characteristics[1].subscribeAsync();
          console.log("Ready");
          if (this.onReady) {
            this.onReady(this);
          }
        } catch (error) {
          console.log(error);
          return;
        }
      }
    });
  }

  /**
   * Enable or disable debug
   */
  setDebug(v: boolean) {
    this.debug = v;
  }

  /**
   * Builds the message
   */
  private buildMessage(payload: Array<number>) {
    const header = [0xfb, 0xbf, payload.length + 4]; // message header
    const message = header.concat(payload);
    message.push(message.slice(2).reduce((p, c) => p + c)); // checksum
    message.push(0xed); // finish char
    return Buffer.from(message);
  }

  /**
   * Send a packet
   */
  send(payload: Array<number>) {
    if (this.debug) console.log('[Comm]: Sending', this.buildMessage(payload));
    return this.characteristics[0].writeAsync(this.buildMessage(payload), true);
  }

  /**
   * Send and wait responses
   */
  sendWithResponse(
    payload: Array<number>,
    count: number = 1,
    timeout: number = 200
  ): Promise<Array<Buffer>> {
    return new Promise(async (resolve, reject) => {
      const responses: Array<Buffer> = [];
      const handler = (data: Buffer) => {
        responses.push(data);
        if (this.debug) console.log('[Comm]: Receiving', data);
        if (responses.length === count) {
          clearTimeout(wait);
          this.characteristics[1].off("data", handler);
          resolve(responses);
        }
      }

      // listen for responses
      this.characteristics[1].on("data", handler);

      const wait = setTimeout(() => {
        clearTimeout(wait);
        this.characteristics[1].off("data", handler);
        reject(new Error('timeout'));
      }, timeout);

      if (this.debug) console.log('[Comm]: Sending', this.buildMessage(payload));

      this.characteristics[0].writeAsync(this.buildMessage(payload), true);
    });
  }

  /**
   * Disconnect
   */
  async disconnect() {
    await noble.stopScanningAsync();
    await this.characteristics[1].unsubscribeAsync();
    if (this.peripheral) {
      await this.peripheral.disconnectAsync();
    }
  }

  /**
   * Connect to robot
   */
  connect(onReady: Function, onDisconnect?: Function) {
    this.onReady = onReady;
    this.onDisconnect = onDisconnect;
    if (noble.state !== "poweredOn") {
      noble.on("stateChange", (state) => {
        if (state === "poweredOn") {
          this._connect();
        }
      });
      return;
    }
    this._connect();
  }

  _connect() {
    console.log("Scanning for robots...");
    noble.startScanningAsync();
  }
}

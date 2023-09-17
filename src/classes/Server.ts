import express from 'express';
import http from 'http';
import { Config } from '../config/Config';

export default class Server {
  private static _instance: Server;
  public app!: express.Application;
  public port!: number;
  public httpServer!: http.Server;

  constructor() {
    this.port = 5000;
    this.app = express();
    this.httpServer = new http.Server(this.app);
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public async start() {
    try {
      const res = await this.validate();
      this.port = res.SERVER_PORT;
      this.httpServer.listen(this.port, () => {
        console.log(`Listening in the port ${this.port}`);
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async validate() {
    return Config.schema.validateAsync(Config.config);
  }
}

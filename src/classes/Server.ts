import express from 'express';
import http from 'http';
import { config, schema } from '../config/config';

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

  public start() {
    this.validate()
      .then(res => {
        this.port = res.SERVER_PORT;
        console.log(res);
        this.httpServer.listen(this.port, () => {
          console.log('Escuchando en el puerto ' + this.port);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  private async validate() {
    return schema.validateAsync(config);
  }
}

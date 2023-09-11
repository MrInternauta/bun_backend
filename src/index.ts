import Server from './classes/Server';
import routes from './routes';
const _Server: Server = Server.instance;

_Server.app.use('', routes);

_Server.start();

import bodyParser from 'body-parser';
import Server from './classes/Server';
import routes from './routes';
import cors from 'cors';
const _Server: Server = Server.instance;

//BodyParse to get json
_Server.app.use(bodyParser.urlencoded({ extended: true }));
_Server.app.use(bodyParser.json());

//Routes
_Server.app.use('/api', routes);

//Enable(CORS)
_Server.app.use(cors({ origin: true, credentials: true }));

await _Server.start();

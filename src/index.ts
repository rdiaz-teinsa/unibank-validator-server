
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from './helpers/config';
import userRoutes from './routes/user.route';
import reportRoutes from './routes/report.route';
import validationRoutes from './routes/validation.route';

const app: Application = express();
const options: cors.CorsOptions = {
  origin: '*',
};

app.set('port', parseInt(config.HTTP_PORT, 10));
app.use(cors(options));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/apis/usuarios/', userRoutes);
app.use('/apis/reportes/', reportRoutes);
app.use('/apis/validador/', validationRoutes);
app.use('/apis/archive', express.static(config.SYSPATH.WEB_ARCHIVE));
app.use('/apis/test', express.static(config.SYSPATH.TST_ARCHIVE));

const initializeService = async () => {
  try {
    const server = app.listen(app.get('port'));
    server.setTimeout(300000);
    console.log(`Teinsa Validator API's Server Version: ${config.VERSION}`);
    console.log(`Server Listening on Port: ${app.get('port')}`);
  } catch (error) {
    console.error(`Error during server startup: ${(error as Error).message}`);
  }
};

initializeService();

// import express, {Application} from 'express';
import express, {Application, Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import './_helpers/database';
import {globalVars} from './_helpers/enviroment';
import userRoutes from './routes/user.route';
import reportRoutes from './routes/report.route';
import validationRoutes from './routes/validation.route';

const app  = express();
const options: cors.CorsOptions = {
    origin: '*'
};


app.set('port', parseInt(globalVars.HTTP_PORT));
app.use(cors(options))
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/apis/usuarios/', userRoutes);
app.use('/apis/reportes/', reportRoutes);
app.use('/apis/validador/', validationRoutes);
app.use('/apis/archive', express.static(globalVars.SYSPATH.WEB_ARCHIVE));
app.use('/apis/test', express.static(globalVars.SYSPATH.TST_ARCHIVE))

async function initializeService() {
    const server = app.listen(app.get('port'));
    server.setTimeout(300000);
    console.log("Teinsa Validator API's Server Version: ", globalVars.VERSION);
    console.log("Server Listening on Port: ", app.get('port'));
}

initializeService();

const winston = require('winston');
const rotateFile = require('winston-daily-rotate-file');
const path = require('path');

const fileOpt = {
    filename: path.join(__dirname, ('../../archive/syslogs/' + 'teinsa-validator-events_%DATE%.log')),
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '5m',
    maxFiles: '30d'
};

console.log("RUTA: ", fileOpt.filename);

export const addEvent = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info: any) => `${info.timestamp} - ${info.level}: ${info.message}`),
    ),
    transports: [
        new rotateFile(fileOpt),
    ],

});

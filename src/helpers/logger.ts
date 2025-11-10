import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const logDir = path.join(__dirname, "../../archive/syslogs");

const fileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(logDir, "teinsa-validator-events-%DATE%.log"),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "5m",
  maxFiles: "30d",
});

export const addEvent = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} - ${info.level}: ${info.message}`,
    ),
  ),
  transports: [fileTransport],
});

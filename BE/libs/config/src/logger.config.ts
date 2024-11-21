import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { utilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

const logDir = __dirname + '/../../logs';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `./logs/${level}-%DATE%.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const getWinstonConfig = (configService: ConfigService) => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    transports: [
      new winston.transports.Console({
        level: isProduction ? 'info' : 'silly',
        format: isProduction
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('boomap', {
                colors: true,
                prettyPrint: true,
              }),
            ),
      }),
      new DailyRotateFile(dailyOptions('info')),
      new DailyRotateFile(dailyOptions('warn')),
      new DailyRotateFile(dailyOptions('error')),
    ],
  };
};

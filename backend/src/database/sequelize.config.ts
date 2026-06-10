// ==========================================================================================
//? Import 
// ==========================================================================================

import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';


// ==========================================================================================
export const getSequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {
    // base url provide access to serverless database(neon)
    const databaseUrl = configService.get<string>('DATABASE_URL');
    // ---------------------------------


    return {
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 4840),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'database123'),
        database: configService.get<string>('DB_DATABASE', 'easylearn'),
        dialectOptions: configService.get<string>('NODE_ENV') === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        } : {},

        autoLoadModels: true,
        synchronize: true,
    };
};


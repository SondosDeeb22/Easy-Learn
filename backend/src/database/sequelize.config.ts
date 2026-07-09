// ==========================================================================================
//? Import 
// ==========================================================================================

import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';


// ==========================================================================================
export const getSequelizeConfig = (configService: ConfigService): SequelizeModuleOptions => {

    const databaseUrl = configService.get<string>('DATABASE_URL');
    const config: SequelizeModuleOptions = {
        dialect: 'postgres',

        dialectOptions: configService.get<string>('NODE_ENV') === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        } : {},
        autoLoadModels: true,
        synchronize: true,
    };

    // --------------------------

    if (databaseUrl) {
        config.uri = databaseUrl;
    } else {
        config.host = configService.get<string>('DB_HOST', 'localhost');
        config.port = configService.get<number>('DB_PORT', 5432);
        config.username = configService.get<string>('DB_USERNAME', 'postgres');
        config.password = configService.get<string>('DB_PASSWORD', '123');
        config.database = configService.get<string>('DB_DATABASE', 'easylearn');

    }
    return config;




};


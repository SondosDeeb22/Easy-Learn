// ===============================================================
//? Importing  
// ===============================================================
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';


// db
import { SequelizeModule } from '@nestjs/sequelize';
import { getSequelizeConfig } from './database/sequelize.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';


// ===============================================================

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getSequelizeConfig(configService)
    }),
    UsersModule,

  ],



  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

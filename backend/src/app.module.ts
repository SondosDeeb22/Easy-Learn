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

// modules
import { AuthModule } from './modules/auth/auth.module';



// ===============================================================

@Module({
  controllers: [AppController],
  providers: [AppService],

  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getSequelizeConfig(configService)
    }),
    UsersModule,
    AuthModule

  ],

})
export class AppModule { }

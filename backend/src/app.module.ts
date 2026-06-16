// ===============================================================
//? Importing  
// ===============================================================
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';



// db
import { SequelizeModule } from '@nestjs/sequelize';
import { getSequelizeConfig } from './database/sequelize.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';

// modules
import { AuthModule } from './modules/auth/auth.module';


// seeder
import { SeedService } from './seeders/seed.service';


// ===============================================================

@Module({
  controllers: [AppController],
  providers: [AppService, SeedService],

  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getSequelizeConfig(configService)
    }),
    UsersModule,
    CoursesModule,
    AuthModule,
  ],

})
// --------------------------------------------------------------
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly seedService: SeedService) { }

  async onApplicationBootstrap() {
    console.log('Seeding database...');
    await this.seedService.seed();
    console.log('Database seeded successfully.');
  }
}

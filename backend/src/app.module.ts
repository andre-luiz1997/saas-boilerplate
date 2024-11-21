import { Module } from '@nestjs/common';
import { MongooseModule, type MongooseModuleOptions } from '@nestjs/mongoose';
import { Providers } from '@shared/providers';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

function getMongooseConfig(): { uri: string, options: MongooseModuleOptions } {
  let options: MongooseModuleOptions = {}
  if (process.env.DB_USER && process.env.DB_PWD) {
    options = {
      auth: {
        username: process.env.DB_USER,
        password: process.env.DB_PWD,
      }
    }
  }
  return {
    uri: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,
    options
  }
}

const mongooseConfigs = getMongooseConfig();

@Module({
  imports: [
    MongooseModule.forRoot(mongooseConfigs.uri, mongooseConfigs.options),
    // @ts-ignore
    MongooseModule.forFeature(Providers),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

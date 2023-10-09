import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigurationService } from 'configuration/configuration.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => ({
        uri: configService.databaseUrl,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DatabaseModule {}

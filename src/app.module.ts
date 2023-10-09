import { Module } from '@nestjs/common';

import { AuthModule } from 'auth/auth.module';
import { BscscanModule } from 'bscscan/bscscan.module';
import { DatabaseModule } from 'database/database.module';
import { JwtTokenModule } from 'jwtToken/jwt-token.module';
import { UserModule } from 'user/user.module';
import { WalletModule } from 'wallet/wallet.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    JwtTokenModule,
    UserModule,
    WalletModule,
    BscscanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

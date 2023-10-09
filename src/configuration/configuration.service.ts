import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  public constructor(private readonly configService: ConfigService) {}

  public get appEnv(): string {
    return this.configService.get<string>('app.env') as string;
  }

  public get appPort(): number {
    return this.configService.get<number>('app.port') as number;
  }

  public get databaseUrl(): string {
    return this.configService.get<string>('database.databaseUrl');
  }

  public get jwtSecret(): string {
    return this.configService.get<string>('jwt.secret');
  }
  public get bscscanApiKey(): string {
    return this.configService.get<string>('bscscan.bscscanApiKey');
  }
}

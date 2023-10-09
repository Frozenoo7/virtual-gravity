export interface App {
  port: number;
  env: string;
}

export interface Database {
  databaseUrl: string;
}

export interface JWT {
  secret: string;
}

export interface Bscscan {
  bscscanApiKey: string;
}

export interface Env {
  app: App;
  database: Database;
  jwt: JWT;
  bscscan: Bscscan;
}

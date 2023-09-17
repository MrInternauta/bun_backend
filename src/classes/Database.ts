import { PrismaClient } from '@prisma/client';

export class Database {
  private static _prisma: PrismaClient | undefined;

  public static get prismaDB() {
    return this._prisma || (this._prisma = new PrismaClient());
  }
}

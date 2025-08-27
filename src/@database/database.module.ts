import path from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TEnvService } from '@/modules/env/services/env.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [TEnvService],
      useFactory: (envService: TEnvService) => {
        const ignoreMigrations = envService.get('DATABASE_IGNORE_MIGRATIONS');

        // console.log(
        //   'DATABASE:',
        //   JSON.stringify({
        //     type: 'postgres',
        //     host: envService.get('DATABASE_HOST'),
        //     port: envService.get('DATABASE_PORT'),
        //     username: envService.get('DATABASE_USER'),
        //     password: envService.get('DATABASE_PASSWORD'),
        //     database: envService.get('DATABASE_DB_NAME'),
        //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        //     migrations: ignoreMigrations
        //       ? []
        //       : [`${path.resolve(__dirname, 'migrations')}/*.{ts}`],
        //     migrationsRun: !ignoreMigrations,
        //   }),
        // );

        return {
          type: 'postgres',
          host: envService.get('DATABASE_HOST'),
          port: envService.get('DATABASE_PORT'),
          username: envService.get('DATABASE_USER'),
          password: envService.get('DATABASE_PASSWORD'),
          database: envService.get('DATABASE_DB_NAME'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: ignoreMigrations
            ? []
            : [`${path.resolve(__dirname, 'migrations')}/*.{ts}`],
          migrationsRun: !ignoreMigrations,
        };
      },
    }),
  ],
})
export class DatabaseModule {}

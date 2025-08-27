import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  type HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { Public } from '../authenticate/metadatas-for-decorators';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { HealthCheckDocumentation } from './@docs/health.doc';

@Public()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mem: MemoryHealthIndicator,
    private database: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @ApiDocumentation(HealthCheckDocumentation)
  @HealthCheck()
  healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.database.pingCheck('postgres'),
      () => this.mem.checkRSS('mem_rss', 768 * 2 ** 20 /* 768 MB */),
      () => this.mem.checkHeap('mem_heap', 512 * 2 ** 20 /* 512 MB */),
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9, // 90%
        }),
    ]);
  }
}

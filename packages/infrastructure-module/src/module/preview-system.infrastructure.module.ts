/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { DynamicModule }                                 from '@nestjs/common'
import type { Provider }                                      from '@nestjs/common'

import type { PreviewSystemInfrastructureModuleAsyncOptions } from './preview-system.infrastructure.module.interfaces.js'
import type { PreviewSystemInfrastructureModuleOptions }      from './preview-system.infrastructure.module.interfaces.js'
import type { PreviewSystemInfrastructureOptionsFactory }     from './preview-system.infrastructure.module.interfaces.js'

import { MikroOrmModule }                                     from '@mikro-orm/nestjs'
import { Module }                                             from '@nestjs/common'

import { PreviewSystemApplicationModule }                     from '@preview-system/application-module'
import { PreviewRepository }                                  from '@preview-system/application-module'
import { PDFPort }                                            from '@preview-system/application-module'
import { VideoPort }                                          from '@preview-system/application-module'
import { AccessPort }                                         from '@preview-system/application-module'
import { FilesystemPort }                                     from '@preview-system/application-module'

import * as controllers                                       from '../controllers/index.js'
import * as entities                                          from '../entities/index.js'
import * as mappers                                           from '../mappers/index.js'
import { PDFPortImpl }                                        from '../ports/index.js'
import { VideoPortImpl }                                      from '../ports/index.js'
import { AccessPortImpl }                                     from '../ports/index.js'
import { FilesystemPortImpl }                                 from '../ports/index.js'
import { PreviewRepositoryImpl }                              from '../repositories/index.js'
import { PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS }       from './preview-system.infrastructure.module.constants.js'

@Module({})
export class PreviewSystemInfrastructureModule {
  static register(options: PreviewSystemInfrastructureModuleOptions): DynamicModule {
    return {
      global: true,
      module: PreviewSystemInfrastructureModule,
      imports: [
        MikroOrmModule.forFeature(Object.values(entities)),
        PreviewSystemApplicationModule.register(),
      ],
      controllers: Object.values(controllers),
      providers: [
        ...Object.values(mappers),
        {
          provide: PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: PreviewRepository,
          useClass: PreviewRepositoryImpl,
        },
        {
          provide: VideoPort,
          useClass: VideoPortImpl,
        },
        {
          provide: AccessPort,
          useClass: AccessPortImpl,
        },
        {
          provide: PDFPort,
          useClass: PDFPortImpl,
        },
        {
          provide: FilesystemPort,
          useClass: FilesystemPortImpl,
        },
      ],
      exports: [PreviewRepository, FilesystemPort, AccessPort, PDFPort, VideoPort],
    }
  }

  static registerAsync(options: PreviewSystemInfrastructureModuleAsyncOptions): DynamicModule {
    return {
      global: true,
      module: PreviewSystemInfrastructureModule,
      imports: [
        ...(options.imports || []),
        MikroOrmModule.forFeature(Object.values(entities)),
        PreviewSystemApplicationModule.register(),
      ],
      controllers: Object.values(controllers),
      providers: [
        ...this.createAsyncProviders(options),
        ...Object.values(mappers),
        {
          provide: PreviewRepository,
          useClass: PreviewRepositoryImpl,
        },
        {
          provide: VideoPort,
          useClass: VideoPortImpl,
        },
        {
          provide: AccessPort,
          useClass: AccessPortImpl,
        },
        {
          provide: PDFPort,
          useClass: PDFPortImpl,
        },
        {
          provide: FilesystemPort,
          useClass: FilesystemPortImpl,
        },
      ],
      exports: [PreviewRepository, FilesystemPort, AccessPort, PDFPort, VideoPort],
    }
  }

  private static createAsyncProviders(
    options: PreviewSystemInfrastructureModuleAsyncOptions
  ): Array<Provider> {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ]
  }

  private static createAsyncOptionsProvider(
    options: PreviewSystemInfrastructureModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    return {
      provide: PREVIEW_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS,
      useFactory: (
        optionsFactory: PreviewSystemInfrastructureOptionsFactory
      ):
        | PreviewSystemInfrastructureModuleOptions
        | Promise<PreviewSystemInfrastructureModuleOptions> =>
        optionsFactory.createPreviewSystemOptions(),
      inject: [options.useExisting! || options.useClass!],
    }
  }
}

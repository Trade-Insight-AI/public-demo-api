/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  DataSource,
  EntityManager,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Not,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { ILogger } from './custom-logger';
import { TEnvService } from '@/modules/env/services/env.service';

export interface IPagination<T> {
  hasNextPage: boolean;
  total?: number;
  data: T[];
}

interface IBulkOperationOptions {
  chunkSize?: number;
  useTransaction?: boolean;
  noModelReturn?: boolean;
  onConflictAction?: 'DO_NOTHING' | 'DO_UPDATE';
  conflictColumns?: string[];
}

// PostgreSQL-specific types and interfaces
interface IPostgreSQLError {
  message: string;
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
}

interface IQueryPerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  operation: string;
  affectedRows?: number;
  queryPlan?: any;
}

export interface IRepository<Entity extends ObjectLiteral, Model> {
  create(
    data: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ): Promise<Model>;

  find(criteria: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    includeDeleted?: boolean;
    select?: FindOptionsSelect<Entity>;
    relations?: FindOptionsRelations<Entity>;
    order?: FindOptionsOrder<Entity>;
    offset?: number;
    page?: number;
  }): Promise<IPagination<Model>>;

  findAll(criteria: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    includeDeleted?: boolean;
    order?: FindOptionsOrder<Entity>;
    relations?: FindOptionsRelations<Entity>;
  }): Promise<Model[]>;

  findOne(criteria: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    includeDeleted?: boolean;
    select?: FindOptionsSelect<Entity>;
    relations?: FindOptionsRelations<Entity>;
  }): Promise<Model | undefined>;

  findById(
    id: string,
    specs?: {
      excludeId?: string;
      includeDeleted?: boolean;
      select?: FindOptionsSelect<Entity>;
      relations?: FindOptionsRelations<Entity>;
    },
  ): Promise<Model | undefined>;

  findLast(criteria: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    includeDeleted?: boolean;
    relations?: FindOptionsRelations<Entity>;
  }): Promise<Model | undefined>;

  count(criteria: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    includeDeleted?: boolean;
  }): Promise<number>;

  update(
    id: string,
    data: Omit<Partial<Entity>, 'id' | 'createdAt' | 'updatedAt'>,
    opts?: { relations?: FindOptionsRelations<Entity> },
  ): Promise<Model>;

  softDelete(id: string | FindOptionsWhere<Entity>): Promise<void>;
  hardDelete(id: string | FindOptionsWhere<Entity>): Promise<void>;
  restoreSoftDeleted(
    id: string | FindOptionsWhere<Entity>,
  ): Promise<Model | undefined>;
  queryBuilder(alias: string): Promise<SelectQueryBuilder<Entity>>;

  bulkCreate(payload: {
    data: Array<{
      data: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
      id?: string;
    }>;
    options?: {
      chunkSize?: number;
      useTransaction?: boolean;
      noModelReturn?: boolean;
    };
  }): Promise<Model[]>;

  bulkUpdate(payload: {
    data: Array<{
      id: string;
      data: Omit<Partial<Entity>, 'id' | 'createdAt' | 'updatedAt'>;
    }>;
    options?: {
      chunkSize?: number;
      useTransaction?: boolean;
      noModelReturn?: boolean;
    };
  }): Promise<Model[]>;

  bulkDelete(payload: {
    ids: string[];
    options?: { soft?: boolean; chunkSize?: number; useTransaction?: boolean };
  }): Promise<void>;
}

export abstract class AbstractRepository<Entity extends ObjectLiteral, Model>
  implements IRepository<Entity, Model>
{
  protected defaultPaginationLimit: number;
  protected developmentEnv: boolean;

  constructor(
    protected readonly collection: Repository<Entity>,
    protected readonly envService: TEnvService,
    private readonly logger: ILogger,
  ) {
    this.defaultPaginationLimit = this.envService.get(
      'UTILITIES_PAGINATION_LIMIT',
    );
    this.developmentEnv =
      this.envService.get('INFRA_ENVIRONMENT') === 'development';
  }

  // =============================================================================
  // Interface functions
  // =============================================================================

  async create(
    data: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string,
  ): Promise<Model> {
    return this.execute(async () => {
      const entityData = id ? { ...data, id } : data;
      const savedEntity = await this.collection.save(
        this.collection.create(
          entityData as unknown as import('typeorm').DeepPartial<Entity>,
        ),
      );

      const model = this.toModel(savedEntity);

      if (!model) {
        throw new Error(`Failed to transform entity to model`);
      }

      return model;
    }, 'create');
  }

  async find({
    where,
    excludeId,
    select,
    relations,
    order,
    offset,
    page,
    includeDeleted = false,
  }: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    select?: FindOptionsSelect<Entity>;
    relations?: FindOptionsRelations<Entity>;
    order?: FindOptionsOrder<Entity>;
    offset?: number;
    page?: number;
    includeDeleted?: boolean;
  }): Promise<IPagination<Model>> {
    return this.execute(async () => {
      const transformedPage = page ?? 1;
      const transformedOffset: number = offset ?? this.defaultPaginationLimit;
      const skip: number = (transformedPage - 1) * transformedOffset;

      const [data, totalRecords] = await this.collection.findAndCount({
        where: excludeId
          ? ({
              ...where,
              id: Not(excludeId),
            } as unknown as FindOptionsWhere<Entity>)
          : where,
        select,
        relations,
        skip,
        take: transformedOffset,
        order,
        withDeleted: includeDeleted,
      });

      const models = data
        .map((entity) => this.toModel(entity))
        .filter((model): model is Model => model !== null);

      return {
        data: models,
        hasNextPage: totalRecords > transformedPage * transformedOffset,
        total: totalRecords,
      };
    }, 'find');
  }

  async findAll({
    where,
    relations,
    excludeId,
    order,
    includeDeleted = false,
  }: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    relations?: FindOptionsRelations<Entity>;
    order?: FindOptionsOrder<Entity>;
    includeDeleted?: boolean;
  }): Promise<Model[]> {
    return this.execute(async () => {
      const entities = await this.collection.find({
        relations,
        where: excludeId
          ? ({
              ...where,
              id: Not(excludeId),
            } as unknown as FindOptionsWhere<Entity>)
          : where,
        withDeleted: includeDeleted,
        order,
      });

      const models = entities
        .map((entity) => this.toModel(entity))
        .filter((model): model is Model => model !== null);

      return models;
    }, 'findAll');
  }

  async findOne({
    where,
    select,
    relations,
    excludeId,
    includeDeleted = false,
  }: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    select?: FindOptionsSelect<Entity>;
    relations?: FindOptionsRelations<Entity>;
    excludeId?: string;
    includeDeleted?: boolean;
  }): Promise<Model | undefined> {
    return this.execute(async () => {
      const entity = await this.collection.findOne({
        where: excludeId
          ? ({
              ...where,
              id: Not(excludeId),
            } as unknown as FindOptionsWhere<Entity>)
          : where,
        select,
        relations,
        withDeleted: includeDeleted,
      });

      return this.toModel(entity);
    }, 'findOne');
  }

  async findById(
    id: string,
    {
      select,
      relations,
      includeDeleted,
    }: {
      select?: FindOptionsSelect<Entity>;
      relations?: FindOptionsRelations<Entity>;
      includeDeleted?: boolean;
    } = {
      includeDeleted: false,
    },
  ): Promise<Model | undefined> {
    return this.execute(async () => {
      if (id?.length === undefined || id?.length === 0 || id?.length === null) {
        return undefined;
      }

      const entity = await this.collection.findOne({
        where: { id } as unknown as FindOptionsWhere<Entity>,
        select,
        relations,
        withDeleted: includeDeleted,
      });

      return this.toModel(entity);

      //
    }, 'findById');
  }

  async findLast({
    where,
    relations,
    excludeId,
    includeDeleted = false,
  }: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    relations?: FindOptionsRelations<Entity>;
    excludeId?: string;
    includeDeleted?: boolean;
  }): Promise<Model | undefined> {
    return this.execute(async () => {
      const order: FindOptionsOrder<Entity> = {
        createdAt: 'DESC',
      } as never;

      const entity = await this.collection.findOne({
        where: excludeId
          ? ({
              ...where,
              id: Not(excludeId),
            } as unknown as FindOptionsWhere<Entity>)
          : where,
        relations,
        order,
        withDeleted: includeDeleted,
      });

      return this.toModel(entity);

      //
    }, 'findLast');
  }

  async count({
    where,
    excludeId,
    includeDeleted = false,
  }: {
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
    excludeId?: string;
    includeDeleted?: boolean;
  }): Promise<number> {
    return this.execute(async () => {
      const totalRecords = await this.collection.count({
        where: excludeId
          ? ({
              ...where,
              id: Not(excludeId),
            } as unknown as FindOptionsWhere<Entity>)
          : where,
        withDeleted: includeDeleted,
      });

      return totalRecords;

      //
    }, 'count');
  }

  async update(
    id: string,
    data: Omit<Partial<Entity>, 'id' | 'createdAt' | 'updatedAt'>,
    { relations }: { relations?: FindOptionsRelations<Entity> } = {},
  ): Promise<Model> {
    return this.execute(async () => {
      const entity = await this.collection.findOne({
        where: { id } as unknown as FindOptionsWhere<Entity>,
      });

      if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
      }

      const updated = await this.collection.save({
        ...entity,
        ...data,
        id,
      });

      if (relations) {
        const entityWithRelations = await this.collection.findOne({
          where: { id } as unknown as FindOptionsWhere<Entity>,
          relations,
        });

        const model = this.toModel(entityWithRelations);

        if (!model) {
          throw new Error(
            `Failed to transform entity to model after update with relations`,
          );
        }

        return model;
      }

      const model = this.toModel(updated);
      if (!model) {
        throw new Error(`Failed to transform entity to model after update`);
      }
      return model;
    }, 'update');
  }

  async hardDelete(id: string | FindOptionsWhere<Entity>): Promise<void> {
    return this.execute(async () => {
      await this.collection.delete(
        typeof id === 'string'
          ? ({
              id,
            } as unknown as FindOptionsWhere<Entity>)
          : id,
      );

      //
    }, 'hardDelete');
  }

  async softDelete(id: string | FindOptionsWhere<Entity>): Promise<void> {
    return this.execute(async () => {
      await this.dataSource.transaction(async (manager) => {
        // First, find the entity to get its relations
        const whereCondition =
          typeof id === 'string'
            ? ({ id } as unknown as FindOptionsWhere<Entity>)
            : id;

        const entity = await manager.findOne(this.collection.target, {
          where: whereCondition,
        });

        if (!entity) {
          return; // Entity doesn't exist, nothing to delete
        }

        // Get all cascade relationships for this entity
        const cascadeRelations = this.getCascadeRelations();

        // Recursively soft delete cascade relations first
        for (const relation of cascadeRelations) {
          await this.softDeleteCascadeRelation(manager, entity, relation);
        }

        // Finally, soft delete the main entity
        await manager.softDelete(this.collection.target, whereCondition);
      });
    }, 'softDelete');
  }

  /**
   * Get all relations that have onDelete: 'CASCADE' configured
   */
  private getCascadeRelations() {
    const metadata = this.collection.metadata;
    const cascadeRelations: any[] = [];

    // Check OneToMany relations
    metadata.oneToManyRelations.forEach((relation) => {
      if (relation.onDelete === 'CASCADE') {
        cascadeRelations.push({
          type: 'OneToMany',
          relation,
          targetEntity: relation.inverseEntityMetadata.target,
          joinColumn:
            relation.inverseRelation?.joinColumns?.[0]?.propertyName || 'id',
          foreignKey:
            relation.inverseRelation?.joinColumns?.[0]?.referencedColumn
              ?.propertyName || relation.propertyName,
        });
      }
    });

    // Check OneToOne relations where this entity is the owner
    metadata.oneToOneRelations.forEach((relation) => {
      if (relation.onDelete === 'CASCADE' && relation.isOwning) {
        cascadeRelations.push({
          type: 'OneToOne',
          relation,
          targetEntity: relation.inverseEntityMetadata.target,
          joinColumn: relation.joinColumns?.[0]?.propertyName || 'id',
          foreignKey:
            relation.joinColumns?.[0]?.referencedColumn?.propertyName || 'id',
        });
      }
    });

    // Check ManyToMany relations where this entity owns the junction table
    metadata.manyToManyRelations.forEach((relation) => {
      if (relation.onDelete === 'CASCADE' && relation.isOwning) {
        cascadeRelations.push({
          type: 'ManyToMany',
          relation,
          targetEntity: relation.inverseEntityMetadata.target,
          junctionTable: relation.junctionEntityMetadata?.tableName,
          ownerColumn:
            relation.joinColumns?.[0]?.referencedColumn?.propertyName || 'id',
          inverseColumn:
            relation.inverseJoinColumns?.[0]?.referencedColumn?.propertyName ||
            'id',
        });
      }
    });

    return cascadeRelations;
  }

  /**
   * Recursively soft delete cascade relations
   */
  private async softDeleteCascadeRelation(
    manager: EntityManager,
    parentEntity: Entity,
    relationConfig: any,
  ): Promise<void> {
    const { type } = relationConfig;

    switch (type) {
      case 'OneToMany':
        await this.softDeleteOneToManyRelation(
          manager,
          parentEntity,
          relationConfig,
        );
        break;
      case 'OneToOne':
        await this.softDeleteOneToOneRelation(
          manager,
          parentEntity,
          relationConfig,
        );
        break;
      case 'ManyToMany':
        await this.softDeleteManyToManyRelation(
          manager,
          parentEntity,
          relationConfig,
        );
        break;
    }
  }

  /**
   * Soft delete OneToMany cascade relations
   */
  private async softDeleteOneToManyRelation(
    manager: EntityManager,
    parentEntity: Entity,
    relationConfig: any,
  ): Promise<void> {
    const { targetEntity, foreignKey } = relationConfig;
    const parentId = (parentEntity as any).id;

    // Find all related entities
    const relatedEntities = await manager.find(targetEntity, {
      where: { [foreignKey]: parentId } as any,
    });

    // Recursively soft delete each related entity (in case they have their own cascades)
    for (const relatedEntity of relatedEntities) {
      const relatedRepo = manager.getRepository(targetEntity);
      const relatedMetadata = relatedRepo.metadata;

      // Check if the related entity has its own cascade relations
      const nestedCascades = this.getCascadeRelationsForEntity(relatedMetadata);

      for (const nestedCascade of nestedCascades) {
        await this.softDeleteCascadeRelation(
          manager,
          relatedEntity as Entity,
          nestedCascade,
        );
      }

      // Soft delete the related entity
      await manager.softDelete(targetEntity, { id: (relatedEntity as any).id });
    }
  }

  /**
   * Soft delete OneToOne cascade relations
   */
  private async softDeleteOneToOneRelation(
    manager: EntityManager,
    parentEntity: Entity,
    relationConfig: any,
  ): Promise<void> {
    const { targetEntity, joinColumn } = relationConfig;
    const foreignKeyValue = (parentEntity as any)[joinColumn];

    if (!foreignKeyValue) return;

    const relatedEntity = await manager.findOne(targetEntity, {
      where: { id: foreignKeyValue } as any,
    });

    if (relatedEntity) {
      const relatedRepo = manager.getRepository(targetEntity);
      const relatedMetadata = relatedRepo.metadata;

      // Check if the related entity has its own cascade relations
      const nestedCascades = this.getCascadeRelationsForEntity(relatedMetadata);

      for (const nestedCascade of nestedCascades) {
        await this.softDeleteCascadeRelation(
          manager,
          relatedEntity as Entity,
          nestedCascade,
        );
      }

      // Soft delete the related entity
      await manager.softDelete(targetEntity, { id: (relatedEntity as any).id });
    }
  }

  /**
   * Handle ManyToMany cascade relations (removes junction table entries)
   */
  private async softDeleteManyToManyRelation(
    manager: EntityManager,
    parentEntity: Entity,
    relationConfig: any,
  ): Promise<void> {
    const { junctionTable, ownerColumn } = relationConfig;
    const parentId = (parentEntity as any).id;

    if (!junctionTable) return;

    // For ManyToMany, we typically just remove the junction table entries
    // The related entities themselves are usually not deleted in cascade
    // But if you need to soft delete them as well, you can implement that logic here

    // Remove junction table entries
    await manager.query(
      `DELETE FROM ${junctionTable} WHERE ${ownerColumn} = $1`,
      [parentId],
    );

    // If you need to also soft delete the related entities:
    // const relatedIds = await manager.query(
    //   `SELECT ${relationConfig.inverseColumn} FROM ${junctionTable} WHERE ${ownerColumn} = $1`,
    //   [parentId]
    // );
    //
    // for (const { [relationConfig.inverseColumn]: relatedId } of relatedIds) {
    //   await manager.softDelete(targetEntity, { id: relatedId });
    // }
  }

  /**
   * Get cascade relations for a specific entity metadata (used for nested cascades)
   */
  private getCascadeRelationsForEntity(metadata: any): any[] {
    const cascadeRelations: any[] = [];

    metadata.oneToManyRelations.forEach((relation: any) => {
      if (relation.onDelete === 'CASCADE') {
        cascadeRelations.push({
          type: 'OneToMany',
          relation,
          targetEntity: relation.inverseEntityMetadata.target,
          joinColumn:
            relation.inverseRelation?.joinColumns?.[0]?.propertyName || 'id',
          foreignKey:
            relation.inverseRelation?.joinColumns?.[0]?.referencedColumn
              ?.propertyName || relation.propertyName,
        });
      }
    });

    metadata.oneToOneRelations.forEach((relation: any) => {
      if (relation.onDelete === 'CASCADE' && relation.isOwning) {
        cascadeRelations.push({
          type: 'OneToOne',
          relation,
          targetEntity: relation.inverseEntityMetadata.target,
          joinColumn: relation.joinColumns?.[0]?.propertyName || 'id',
          foreignKey:
            relation.joinColumns?.[0]?.referencedColumn?.propertyName || 'id',
        });
      }
    });

    metadata.manyToManyRelations.forEach((relation: any) => {
      if (relation.onDelete === 'CASCADE' && relation.isOwning) {
        cascadeRelations.push({
          type: 'ManyToMany',
          relation,
          targetEntity: relation.inverseEntityMetadata.target,
          junctionTable: relation.junctionEntityMetadata?.tableName,
          ownerColumn:
            relation.joinColumns?.[0]?.referencedColumn?.propertyName || 'id',
          inverseColumn:
            relation.inverseJoinColumns?.[0]?.referencedColumn?.propertyName ||
            'id',
        });
      }
    });

    return cascadeRelations;
  }

  async restoreSoftDeleted(
    id: string | FindOptionsWhere<Entity>,
  ): Promise<Model | undefined> {
    return this.execute(async () => {
      const entity = await this.collection.findOne({
        where: { id } as unknown as FindOptionsWhere<Entity>,
        withDeleted: true,
      });

      if (!entity) {
        throw new Error(`Entity with id ${id} not found`);
      }

      await this.collection.restore(id);

      return this.toModel(entity);
    }, 'restoreSoftDeleted');
  }

  async queryBuilder(alias: string): Promise<SelectQueryBuilder<Entity>> {
    /* eslint-disable-next-line @typescript-eslint/require-await */
    return this.execute(async () => {
      return this.collection.createQueryBuilder(alias);
    }, 'queryBuilder');
  }

  // =============================================================================
  // BULK OPERATIONS - UPSERT FUNCTIONALITY
  // =============================================================================
  async batchUpsert(
    dataArray: Array<{
      data: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
      id?: string;
    }>,
    conflictColumns: string[] = ['id'],
    updateOnConflict = true,
    chunkSize = 1000,
  ): Promise<Model[]> {
    return this.execute(async () => {
      if (dataArray.length === 0) return [];

      const results: Model[] = [];

      for (let i = 0; i < dataArray.length; i += chunkSize) {
        const chunk = dataArray.slice(i, i + chunkSize);

        const chunkResult = await this.dataSource.transaction(
          async (manager) => {
            const tableName = this.collection.metadata.tableName;

            const sampleData = chunk[0].id
              ? { ...chunk[0].data, id: chunk[0].id }
              : chunk[0].data;
            const columns = Object.keys(sampleData);

            const valuesClauses: string[] = [];
            const allValues: any[] = [];
            let paramIndex = 1;

            chunk.forEach((item) => {
              const entityData = item.id
                ? { ...item.data, id: item.id }
                : item.data;
              const itemValues = columns.map(
                (col) => (entityData as Record<string, unknown>)[col],
              );
              const itemPlaceholders = itemValues
                .map(() => `$${paramIndex++}`)
                .join(', ');

              valuesClauses.push(`(${itemPlaceholders})`);
              allValues.push(...itemValues);
            });

            let query = `
          INSERT INTO ${tableName} (${columns.join(', ')})
          VALUES ${valuesClauses.join(', ')}
          ON CONFLICT (${conflictColumns.join(', ')})
        `;

            if (updateOnConflict) {
              const updateColumns = columns
                .filter(
                  (col) =>
                    !conflictColumns.includes(col) && col !== 'createdAt',
                )
                .map((col) => `${col} = EXCLUDED.${col}`)
                .join(', ');
              query += ` DO UPDATE SET ${updateColumns}, updated_at = NOW()`;
            } else {
              query += ' DO NOTHING';
            }

            query += ' RETURNING *';

            const batchResult = await manager.query(query, allValues);
            return batchResult
              .map((entity: Entity) => this.toModel(entity))
              .filter((model): model is Model => model !== undefined);
          },
        );

        results.push(...chunkResult);
      }

      return results;
    }, 'batchUpsert');
  }

  // =============================================================================
  // BULK OPERATIONS - HIGH PERFORMANCE BULK CRUD
  // =============================================================================

  async bulkCreate({
    data,
    options = {},
  }: {
    data: Array<{
      data: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
      id?: string;
    }>;
    options?: IBulkOperationOptions;
  }): Promise<Model[]> {
    return this.execute(async () => {
      const {
        chunkSize = 1000,
        useTransaction = true,
        noModelReturn = false,
        onConflictAction = 'DO_NOTHING',
        conflictColumns = ['id'],
      } = options;

      const results: Model[] = [];
      if (data.length === 0) return results;

      const optimizedChunkSize = noModelReturn ? 5000 : chunkSize;

      const executeOperation = async (manager: EntityManager) => {
        for (let i = 0; i < data.length; i += optimizedChunkSize) {
          const chunk = data.slice(i, i + optimizedChunkSize);

          if (onConflictAction !== 'DO_NOTHING') {
            const chunkResults = await this.batchUpsert(
              chunk,
              conflictColumns,
              onConflictAction === 'DO_UPDATE',
              optimizedChunkSize,
            );

            if (!noModelReturn) {
              results.push(...chunkResults);
            }
          } else {
            const tableName = this.collection.metadata.tableName;
            const valuesToInsert = chunk.map((item) => {
              const entityData =
                item.id && typeof item.id === 'string'
                  ? { ...item.data, id: item.id }
                  : item.data;

              return {
                ...entityData,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
            });

            if (valuesToInsert.length === 0) continue;

            const propertyNames = Object.keys(valuesToInsert[0]);
            const metadata = this.collection.metadata;

            const columnMappings: {
              propertyName: string;
              columnName: string;
            }[] = [];

            propertyNames.forEach((propertyName) => {
              const column = metadata.findColumnWithPropertyName(propertyName);
              if (column) {
                columnMappings.push({
                  propertyName,
                  columnName: column.databaseName,
                });
              } else {
                columnMappings.push({
                  propertyName,
                  columnName: propertyName,
                });
              }
            });

            const columns = columnMappings.map((mapping) => mapping.columnName);
            const values: any[] = [];
            const placeholders: string[] = [];

            valuesToInsert.forEach((row, rowIndex) => {
              const rowPlaceholders: string[] = [];
              columnMappings.forEach((mapping, colIndex) => {
                const paramIndex =
                  rowIndex * columnMappings.length + colIndex + 1;
                rowPlaceholders.push(`$${paramIndex}`);
                values.push(row[mapping.propertyName]);
              });
              placeholders.push(`(${rowPlaceholders.join(', ')})`);
            });

            let query = `
              INSERT INTO ${tableName} (${columns.join(', ')})
              VALUES ${placeholders.join(', ')}
            `;

            if (conflictColumns.length > 0) {
              query += ` ON CONFLICT (${conflictColumns.join(', ')}) DO NOTHING`;
            }

            if (!noModelReturn) {
              query += ' RETURNING *';
            }

            const insertResult = await manager.query(query, values);

            if (!noModelReturn && insertResult.length > 0) {
              const models = insertResult
                .map((entity: Entity) => this.toModel(entity))
                .filter((model): model is Model => model !== undefined);

              results.push(...models);
            }
          }
        }
      };

      if (useTransaction) {
        await this.dataSource.transaction(executeOperation);
      } else {
        await executeOperation(this.collection.manager);
      }

      return results;
    }, 'bulkCreate');
  }

  async bulkUpdate({
    data,
    options = {},
  }: {
    data: Array<{
      id: string;
      data: Omit<Partial<Entity>, 'id' | 'createdAt' | 'updatedAt'>;
    }>;
    options?: IBulkOperationOptions;
  }): Promise<Model[]> {
    return this.execute(async () => {
      const {
        chunkSize = 1000,
        useTransaction = true,
        noModelReturn = false,
      } = options;
      const results: Model[] = [];

      if (data.length === 0) return results;

      const optimizedChunkSize = noModelReturn ? 2000 : chunkSize;

      const executeOperation = async (manager: EntityManager) => {
        for (let i = 0; i < data.length; i += optimizedChunkSize) {
          const chunk = data.slice(i, i + optimizedChunkSize);
          const tableName = this.collection.metadata.tableName;

          if (chunk.length > 1 && Object.keys(chunk[0].data).length > 0) {
            const sampleData = chunk[0].data;
            const propertyNames = Object.keys(sampleData);
            const metadata = this.collection.metadata;

            const columnMappings: {
              propertyName: string;
              columnName: string;
            }[] = [];

            propertyNames.forEach((propertyName) => {
              const column = metadata.findColumnWithPropertyName(propertyName);
              if (column) {
                columnMappings.push({
                  propertyName,
                  columnName: column.databaseName,
                });
              } else {
                columnMappings.push({
                  propertyName,
                  columnName: propertyName,
                });
              }
            });

            const updateColumns = columnMappings.map(
              (mapping) => mapping.columnName,
            );
            const ids = chunk.map((item) => item.id);

            if (!noModelReturn) {
              const existingEntities = await manager.query(
                `SELECT id FROM ${tableName} WHERE id = ANY($1)`,
                [ids],
              );

              if (existingEntities.length !== chunk.length) {
                const foundIds: string[] = existingEntities.map(
                  (e: { id: string }) => e.id,
                );
                const missingIds = ids.filter((id) => !foundIds.includes(id));
                throw new Error(
                  `Entities not found for ids: ${missingIds.join(', ')}`,
                );
              }
            }

            const caseStatements = updateColumns.map((column) => {
              const cases = chunk.map((item, idx) => {
                return `WHEN id = $${idx + 2} THEN $${idx + 2 + chunk.length}`;
              });
              return `${column} = CASE ${cases.join(' ')} ELSE ${column} END`;
            });

            caseStatements.push('updated_at = NOW()');

            const query = `
              UPDATE ${tableName}
              SET ${caseStatements.join(', ')}
              WHERE id = ANY($1)
              ${!noModelReturn ? 'RETURNING *' : ''}
            `;

            const parameters: any[] = [ids];
            chunk.forEach((item) => parameters.push(item.id));
            chunk.forEach((item) => {
              columnMappings.forEach((mapping) => {
                parameters.push((item.data as any)[mapping.propertyName]);
              });
            });

            const updateResult = await manager.query(query, parameters);

            if (!noModelReturn && updateResult.length > 0) {
              const models = (updateResult as Entity[])
                .map((entity: Entity) => this.toModel(entity))
                .filter((model): model is Model => model !== undefined);
              results.push(...models);
            }

            //
          } else {
            for (const updateItem of chunk) {
              const propertyNames = Object.keys(updateItem.data);
              const metadata = this.collection.metadata;

              const columnMappings: {
                propertyName: string;
                columnName: string;
              }[] = [];

              propertyNames.forEach((propertyName) => {
                const column =
                  metadata.findColumnWithPropertyName(propertyName);
                if (column) {
                  columnMappings.push({
                    propertyName,
                    columnName: column.databaseName,
                  });
                } else {
                  columnMappings.push({
                    propertyName,
                    columnName: propertyName,
                  });
                }
              });

              const query = `
                UPDATE ${tableName}
                SET ${columnMappings
                  .map((mapping, idx) => `${mapping.columnName} = $${idx + 2}`)
                  .join(', ')}, updated_at = NOW()
                WHERE id = $1
                ${!noModelReturn ? 'RETURNING *' : ''}
              `;

              const parameters = [
                updateItem.id,
                ...columnMappings.map(
                  (mapping) => (updateItem.data as any)[mapping.propertyName],
                ),
              ];

              const updateResult = await manager.query(query, parameters);

              if (!noModelReturn && updateResult.length > 0) {
                const model = this.toModel(updateResult[0] as Entity);
                if (model) {
                  results.push(model);
                }
              }
            }
          }
        }
      };

      if (useTransaction) {
        await this.dataSource.transaction(executeOperation);
      } else {
        await executeOperation(this.collection.manager);
      }

      return results;
    }, 'bulkUpdate');
  }

  async bulkDelete({
    ids,
    options = { soft: true, chunkSize: 1000, useTransaction: true },
  }: {
    ids: string[];
    options?: IBulkOperationOptions & { soft?: boolean };
  }): Promise<void> {
    return this.execute(async () => {
      const { soft = true, chunkSize = 1000, useTransaction = true } = options;

      if (ids.length === 0) return;

      const executeOperation = async (manager: EntityManager) => {
        const tableName = this.collection.metadata.tableName;

        for (let i = 0; i < ids.length; i += chunkSize) {
          const chunk = ids.slice(i, i + chunkSize);

          if (soft) {
            await manager.query(
              `UPDATE ${tableName} SET deleted_at = NOW() WHERE id = ANY($1) AND deleted_at IS NULL`,
              [chunk],
            );
          } else {
            await manager.query(`DELETE FROM ${tableName} WHERE id = ANY($1)`, [
              chunk,
            ]);
          }
        }
      };

      if (useTransaction) {
        await this.dataSource.transaction(executeOperation);
      } else {
        await executeOperation(this.collection.manager);
      }
    }, 'bulkDelete');
  }

  // =============================================================================
  // Protected functions
  // =============================================================================
  protected get dataSource(): DataSource {
    return this.collection.manager.connection;
  }

  // Transformation/mapping function
  // Specific repositories can override this if needed.
  protected toModel(entity: Entity | null): Model | undefined {
    return entity as unknown as Model;
  }

  protected async execute<T>(
    operation: () => Promise<T>,
    operationName?: string,
  ): Promise<T> {
    const metrics: IQueryPerformanceMetrics = {
      startTime: Date.now(),
      operation: operationName || operation.name || 'unknown',
      affectedRows: 0,
    };

    try {
      const result = await operation();

      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;

      // Enhanced slow query logging with detailed analysis
      this.logSlowQueryDetails(metrics);

      // Only log debug info in development for performance
      // if (this.envService.get('INFRA_ENVIRONMENT') === 'development') {
      //   this.logger.debug(
      //     `Database operation completed: ${JSON.stringify(metrics)}`,
      //   );
      // }

      return result;
    } catch (error) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;

      // Enhanced PostgreSQL error handling
      const pgError = this.handlePostgreSQLError(error);

      this.logger.error(
        `Database operation failed: ${JSON.stringify({
          ...metrics,
          error: pgError.message,
          errorCode: pgError.code,
          errorDetail: pgError.detail,
          constraint: pgError.constraint,
          table: pgError.table,
          column: pgError.column,
        })}`,
      );

      throw error;
    }
  }

  /**
   * Enhanced PostgreSQL error handler for better debugging and user feedback
   */
  private handlePostgreSQLError(error: any): IPostgreSQLError {
    const pgError: IPostgreSQLError = {
      message: error.message || 'Unknown database error',
      code: error.code,
      detail: error.detail,
      constraint: error.constraint,
      table: error.table,
      column: error.column,
    };

    // PostgreSQL specific error code handling
    switch (error.code) {
      case '23505': // unique_violation
        pgError.message = `Duplicate entry: ${error.detail || 'Record already exists'}`;
        break;
      case '23503': // foreign_key_violation
        pgError.message = `Foreign key constraint violation: ${error.detail || 'Referenced record does not exist'}`;
        break;
      case '23502': // not_null_violation
        pgError.message = `Required field missing: ${error.column || 'A required field'} cannot be null`;
        break;
      case '42703': // undefined_column
        pgError.message = `Invalid column: ${error.message}`;
        break;
      case '42P01': // undefined_table
        pgError.message = `Table not found: ${error.message}`;
        break;
      case '53300': // too_many_connections
        pgError.message =
          'Database connection pool exhausted. Please try again.';
        break;
      case '57014': // query_canceled
        pgError.message =
          'Query was canceled due to timeout. Consider optimizing your query.';
        break;
    }

    return pgError;
  }

  /**
   * Enhanced slow query analyzer with detailed performance insights
   * Provides actionable recommendations for query optimization
   */
  private logSlowQueryDetails(
    metrics: IQueryPerformanceMetrics,
    queryBuilder?: SelectQueryBuilder<Entity>,
    rawQuery?: string,
    parameters?: any[],
  ): void {
    if (!metrics.duration || metrics.duration < 500) return;

    const tableName = this.collection.metadata.tableName;
    const logData: any = {
      operation: metrics.operation,
      duration: `${metrics.duration}ms`,
      tableName,
      timestamp: new Date().toISOString(),
      affectedRows: metrics.affectedRows || 'unknown',
    };

    // Add sanitized query information if available
    if (queryBuilder) {
      const [query, params] = queryBuilder.getQueryAndParameters();
      logData.queryType = 'QueryBuilder';
      logData.queryLength = query.length;
      logData.parameterCount = params.length;

      // Sanitize parameters for logging (remove sensitive data)
      logData.sanitizedParameters = this.sanitizeParameters(params);
    } else if (rawQuery) {
      logData.queryType = 'RawSQL';
      logData.queryLength = rawQuery.length;
      logData.parameterCount = parameters?.length || 0;
      logData.sanitizedParameters = this.sanitizeParameters(parameters || []);
    }

    // Performance recommendations based on duration
    if (metrics.duration > 5000) {
      logData.severity = 'CRITICAL';
      logData.recommendations = [
        'Immediate attention required - query exceeds 5 seconds',
        'Check for missing indexes on WHERE/JOIN columns',
        'Consider query rewrite or data partitioning',
        'Analyze query execution plan with EXPLAIN ANALYZE',
        'Consider caching strategy for frequently accessed data',
      ];

      this.logger.error(
        `CRITICAL Database Performance Issue: ${JSON.stringify(logData)}`,
      );

      //
    } else if (metrics.duration > 2000) {
      logData.severity = 'HIGH';
      logData.recommendations = [
        'Query performance degraded - exceeds 2 seconds',
        'Review indexes and query optimization',
        'Check for table scans in execution plan',
        'Consider result pagination for large datasets',
      ];

      this.logger.warn(
        `HIGH Priority Database Performance: ${JSON.stringify(logData)}`,
      );

      //
    } else if (metrics.duration > 1000) {
      logData.severity = 'MEDIUM';
      logData.recommendations = [
        'Query slower than optimal - exceeds 1 second',
        'Review query structure and indexes',
        'Monitor if this becomes a pattern',
      ];

      this.logger.warn(
        `Database Performance Notice: ${JSON.stringify(logData)}`,
      );

      //
    } else if (metrics.duration > 500) {
      logData.severity = 'LOW';
      logData.recommendations = [
        'Query performance monitoring - above 500ms threshold',
        'Consider optimization if this query runs frequently',
      ];

      // Only log in development for low severity
      if (this.developmentEnv) {
        this.logger.debug(
          `Database Performance Debug: ${JSON.stringify(logData)}`,
        );
      }
    }
  }

  /**
   * Sanitizes query parameters for safe logging (removes sensitive data)
   */
  private sanitizeParameters(parameters: any[]): any[] {
    return parameters.map((param, index) => {
      if (typeof param === 'string') {
        // Hide potential sensitive data like emails, passwords, tokens
        if (
          param.includes('@') ||
          param.length > 50 ||
          /password|token|secret|key/i.test(param)
        ) {
          return `[SANITIZED_STRING_${index}]`;
        }
        // Truncate long strings
        return param.length > 100 ? `${param.substring(0, 100)}...` : param;
      }

      if (Array.isArray(param)) {
        return `[ARRAY_${param.length}_ITEMS]`;
      }

      if (typeof param === 'object' && param !== null) {
        return `[OBJECT_${Object.keys(param).length}_KEYS]`;
      }

      return param;
    });
  }
}

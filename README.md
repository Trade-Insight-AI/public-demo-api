<p align="center">
  <img src="https://storage.googleapis.com/tia-cdn/tia-logo.png" alt="TIA Logo" width="400" style="background-color: white; padding: 10px; border-radius: 8px;">
</p>

# TIA Public Demo API - Implementation Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Project Structure](#project-structure)
4. [Authentication System](#authentication-system)
5. [TIA API Integration](#tia-api-integration)
6. [Core Modules](#core-modules)
7. [Database Setup](#database-setup)
8. [Getting Started](#getting-started)
9. [API Endpoints](#api-endpoints)
10. [Best Practices Demonstrated](#best-practices-demonstrated)

## Project Overview

This project demonstrates how to integrate with the **TIA (Trade Insight AI) public API** using a well-structured NestJS application. TIA is a service that provides AI-powered product classification for international trade, helping businesses classify products according to HTSUS (Harmonized Tariff Schedule of the United States) classifications.

**Learn more about TIA**: [https://www.tradeinsightai.com](https://www.tradeinsightai.com)

### Key Features Demonstrated:
- **Single Product Classification**: Classify individual products using AI
- **Bulk Classification**: Process multiple products via file upload
- **Account Management**: User registration and authentication
- **Balance Tracking**: Monitor API usage and credits
- **Engine Selection**: Choose different AI classification engines

### Technologies Used:
- **NestJS**: Progressive Node.js framework for building scalable server-side applications
- **TypeScript**: Type-safe JavaScript superset
- **PostgreSQL**: Relational database for data persistence
- **TypeORM**: Object-Relational Mapping for database operations
- **JWT**: JSON Web Tokens for authentication
- **Swagger**: API documentation
- **Zod**: Runtime type validation
- **Axios**: HTTP client for external API calls

## Architecture & Design Patterns

This project follows several important architectural patterns and principles:

### 1. Clean Architecture
The project is organized in layers with clear separation of concerns:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access
- **Entities**: Define data models
- **DTOs**: Data Transfer Objects for validation
- **Providers**: External service integrations

### 2. Dependency Injection
NestJS's built-in dependency injection system is used throughout:
```typescript
@Injectable()
export class TIAProvider implements TTIAProvider {
  constructor(
    @Inject(TIA_PROVIDER_HTTP_CLIENT) private httpClient: AxiosInstance,
    @Inject(TIA_PROVIDER_ENVIRONMENT) private env: ITIAProviderEnvironment,
    private logger: ILogger,
  ) {}
}
```

### 3. Result Pattern
A custom `Result` class is used for error handling:
```typescript
export class Result<T> {
  static success<T>(value?: T): Result<T>
  static fail<T>(error: Error): Result<T>
  
  get error(): Error | undefined
  getValue(): T
}
```

### 4. Repository Pattern
Data access is abstracted through repositories using a custom base class:
```typescript
@Injectable()
export class AccountsRepository extends IAccountsRepository {
  constructor(
    @InjectRepository(AccountEntity)
    readonly accountRepository: Repository<AccountEntity>,
    readonly envService: TEnvService,
  ) {
    super(
      accountRepository,
      envService,
      new CustomLogger(envService, AccountsRepository.name),
    );
  }
}

// Where IAccountsRepository extends the abstract base repository
export class IAccountsRepository extends AbstractRepository<
  AccountEntity,
  IAccountModel
> {}
```

The `AbstractRepository` provides a comprehensive set of methods including:
- CRUD operations with soft delete support (`create`, `findOne`, `findById`, `update`, `softDelete`)
- Bulk operations for high performance (`bulkCreate`, `bulkUpdate`, `bulkDelete`)
- Pagination and filtering (`find`, `findAll`, `count`)
- Query performance monitoring and slow query detection
- PostgreSQL-specific error handling

This approach eliminates the need to create custom methods like `findByEmail` or `create` in each repository, as the abstract class already provides generic `findOne` and `create` methods that can be used with appropriate criteria. This reduces code duplication and ensures consistent behavior across all repositories.

## Project Structure

```
src/
├── @database/                 # Database configuration and migrations
│   ├── migrations/           # TypeORM migrations
│   └── database.module.ts    # Database module configuration
├── @decorators/              # Custom decorators
│   ├── api-documentation.decorator.ts
│   ├── authentication.decorator.ts
│   └── request-context.decorator.ts
├── @shared/                  # Shared utilities and components
│   ├── classes/             # Base classes (Repository, Service, etc.)
│   ├── cryptography/        # JWT and hashing services
│   ├── errors/              # Custom exception classes
│   ├── filters/             # Exception filters
│   ├── middlewares/         # Request middleware
│   ├── pipes/               # Validation pipes
│   ├── providers/           # External service providers
│   └── utils/               # Utility functions
├── modules/                  # Feature modules
│   ├── accounts/            # User account management
│   ├── authenticate/        # Authentication system
│   ├── classifications/     # TIA classification features
│   ├── engines/             # Available classification engines
│   ├── health/              # Health check endpoint
│   └── transactions/        # Balance and transaction tracking
├── app.module.ts            # Root application module
└── main.ts                  # Application bootstrap
```

## Authentication System

**Note**: This is a reference implementation demonstrating one approach to authentication. Partners integrating with TIA are free to use different strategies for token management, authentication, and authorization, including relying on third-party providers like Auth0, AWS Cognito, Firebase Auth, or other identity management solutions.

The project implements a robust JWT-based authentication system:

### 1. JWT Strategy
Uses RS256 algorithm with public/private key pairs:
```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: TEnvService) {
    const publicKey = envService.get('AUTH_JWT_PUBLIC_KEY');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }
}
```

### 2. Key Generation and Configuration
The project includes instructions for generating RSA key pairs and shows how they are consumed:

#### Generate RSA Key Pairs:
```bash
# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Extract public key
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert to base64 for environment variables
base64 -i ./private_key.pem -o private_key_base64.txt
base64 -i ./public_key.pem -o public_key_base64.txt
```

#### How Keys Are Consumed:
The generated base64-encoded keys are consumed in the JWT module configuration:

```typescript
// authenticate.module.ts
JwtModule.registerAsync({
  global: true,
  imports: [EnvModule],
  inject: [TEnvService],
  useFactory: (envService: TEnvService) => ({
    privateKey: Buffer.from(
      envService.get('AUTH_JWT_PRIVATE_KEY'), // Base64 private key from .env
      'base64',
    ),
    publicKey: Buffer.from(
      envService.get('AUTH_JWT_PUBLIC_KEY'), // Base64 public key from .env
      'base64',
    ),
    signOptions: {
      algorithm: 'RS256',
    },
    verifyOptions: {
      algorithms: ['RS256'],
    },
  }),
})
```

The **private key** is used by the `JwtEncrypter` service to sign tokens:
```typescript
// jwt-encrypter.service.ts
async accessToken({ sub, ...payload }: Record<string, any>): Promise<string> {
  return await this.jwtService.signAsync(payload, {
    expiresIn: this.envService.get('AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN'),
    subject: sub as string | undefined,
  });
}
```

The **public key** is used by the `JwtStrategy` to verify incoming tokens:
```typescript
// jwt.strategy.ts
constructor(envService: TEnvService) {
  const publicKey = envService.get('AUTH_JWT_PUBLIC_KEY');
  
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Buffer.from(publicKey, 'base64'), // Decode base64 public key
    algorithms: ['RS256'],
  });
}
```

### 3. Authentication Flow
1. **Sign Up**: Create account with email/password
2. **Login**: Authenticate and receive JWT tokens
3. **Token Validation**: Middleware validates JWT on protected routes
4. **Token Refresh**: Refresh tokens for extended sessions

## TIA API Integration

The core of this project is the integration with the TIA (Trade Insight AI) API:

### 1. Provider Pattern
The `TIAProvider` class encapsulates all TIA API interactions:
```typescript
@Injectable()
export class TIAProvider implements TTIAProvider {
  private tiaAccessToken: string | undefined = undefined;
  private tiaAccessTokenExpiresAt: Date | undefined = undefined;

  async login(): Promise<Result<void>>
  async classifyProduct(payload: ITIAProviderClassifyProductDTO): Promise<Result<ITIAProviderClassifyProductDetails>>
  async bulkClassify(payload: ITIAProviderBulkClassifyDTO): Promise<Result<ITIAProviderBulkClassifyResponse>>
  // ... other methods
}
```

### 2. Automatic Token Management
The provider automatically handles token refresh:
```typescript
async validateAndAutoRefreshTokenIfNeeded(): Promise<void> {
  if (this.isAccessTokenExpired()) {
    const result = await this.login();
    if (result.error) {
      throw result.error;
    }
  }
}
```

### 3. Error Handling
Comprehensive error handling with detailed logging:
```typescript
private errorHandler(error: AxiosError | Error): Error {
  let message = String(error);
  const metadata: any = {};

  if (error instanceof AxiosError) {
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    const status = error.response?.status;
    // ... collect metadata
    
    message = error.response?.data?.message || 'Unknown error';
  }

  this.logger.debug(`[TIAProvider errorHandler] ${message} ${JSON.stringify(metadata)}`);
  return new DefaultException(message);
}
```

## Core Modules

### 1. Classifications Module
Handles product classification operations:

#### Single Product Classification
```typescript
@Post()
@ApiDocumentation(ClassifyProductDocumentation)
async handle(
  @ReqContext() context: IRequestContext,
  @Body(new ZodValidationPipe(classifyProductDtoBodySchema)) body: TClassifyProductDtoBodySchema,
) {
  const result = await this.service.execute(body, context);

  if (result.error) {
    if (result.error instanceof AbstractApplicationException) {
      result.error.context = context;
    }

    throw result.error;
  }

  return result.getValue();
}
```

#### Bulk Classification Features
- **File Upload**: Process CSV files with multiple products
- **Queue Status**: Monitor processing progress
- **Results Download**: Retrieve completed classifications
- **Cancellation**: Cancel running bulk jobs

### 2. Engines Module
Lists available classification engines:
```typescript
@Get()
@ApiDocumentation(ListEnginesDocumentation)
async handle(@ReqContext() context: IRequestContext) {
  const result = await this.service.execute(context);

  if (result.error) {
    if (result.error instanceof AbstractApplicationException) {
      result.error.context = context;
    }

    throw result.error;
  }

  return result.getValue();
}
```

### 3. Transactions Module
Tracks API usage and account balance:
```typescript
@Get('balance')
@ApiDocumentation(GetBalanceDocumentation)
async handle(@ReqContext() context: IRequestContext) {
  const result = await this.service.execute(context);

  if (result.error) {
    if (result.error instanceof AbstractApplicationException) {
      result.error.context = context;
    }

    throw result.error;
  }

  return result.getValue();
}
```

### 4. Accounts Module
Manages user accounts with proper validation:
```typescript
export const createAccountDtoBodySchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
```

## Database Setup

### 1. TypeORM Configuration
The project uses TypeORM with PostgreSQL with dynamic configuration:
```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [TEnvService],
      useFactory: (envService: TEnvService) => {
        const ignoreMigrations = envService.get('DATABASE_IGNORE_MIGRATIONS');

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
```

Key features of this configuration:
- **Dynamic Entity Discovery**: Automatically finds all `.entity.ts` and `.entity.js` files
- **Migration Control**: Uses `DATABASE_IGNORE_MIGRATIONS` environment variable to enable/disable migrations
- **Automatic Migration Execution**: Runs migrations automatically when enabled
- **Flexible Path Resolution**: Uses dynamic path resolution for migrations directory

### 2. Migration System
Includes a custom migration creation script:
```javascript
// create-migration.js
const { execSync } = require('child_process');
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d ./src/@database/data-source-only-for-migration.ts migration:create ./src/@database/migrations/${migrationName}`;
execSync(command, { stdio: 'inherit' });
```

### 3. Account Entity
Simple user account structure:
```typescript
@Entity('accounts')
export class AccountEntity implements IAccountModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken?: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;
}
```

Key features:
- **TypeScript Naming**: Uses camelCase property names following TypeScript conventions
- **Database Mapping**: Maps to snake_case column names in the database using `name` option
- **Model Implementation**: Implements `IAccountModel` interface for type safety
- **Soft Delete Support**: Includes `deletedAt` field for soft delete functionality

## Getting Started

### 1. Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
# Infrastructure
INFRA_PORT=3500
INFRA_URL=http://localhost

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5450
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_DB_NAME=tia-public-demo

# Authentication (generate your own keys)
AUTH_JWT_PRIVATE_KEY="your_base64_private_key"
AUTH_JWT_PUBLIC_KEY="your_base64_public_key"

# TIA API Credentials
EXTERNAL_TIA_API=https://api.tradeinsightai.com
EXTERNAL_TIA_CLIENT_ID=your_client_id
EXTERNAL_TIA_CLIENT_SECRET=your_client_secret
```

### 2. Database Setup
```bash
# Start PostgreSQL (using Docker Compose)
docker-compose up -d

# Run migrations
pnpm migration:run
```

### 3. Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm start:dev

# Access Swagger documentation
# http://localhost:3500/api/swagger
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/sign-up` - Create new account
- `POST /api/v1/auth/login` - Authenticate user

### Classifications
- `POST /api/v1/classifications/single-product/classify` - Classify single product
- `POST /api/v1/classifications/bulk/classify` - Start bulk classification
- `GET /api/v1/classifications/bulk/queue-status` - Get queue status
- `GET /api/v1/classifications/bulk/downloadable` - List downloadable results
- `GET /api/v1/classifications/bulk/{groupId}` - Get bulk classification status
- `GET /api/v1/classifications/bulk/{groupId}/results` - Get bulk results
- `DELETE /api/v1/classifications/bulk/{groupId}` - Delete bulk classification
- `POST /api/v1/classifications/bulk/{groupId}/cancel` - Cancel bulk classification

### Engines
- `GET /api/v1/engines` - List available classification engines

### Transactions
- `GET /api/v1/transactions/balance` - Get account balance

### Health
- `GET /api/v1/health` - Health check endpoint

## Best Practices Demonstrated

### 1. Type Safety
- **Zod Validation**: Runtime type checking for all inputs
- **TypeScript**: Compile-time type safety
- **DTOs**: Structured data transfer objects

### 2. Error Handling
- **Result Pattern**: Consistent error handling across the application
- **Custom Exceptions**: Domain-specific error types
- **Global Exception Filter**: Centralized error processing

### 3. Security
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt for password security
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing configuration

### 4. Logging
- **Custom Logger**: Structured logging with context
- **Request Logging**: Automatic request/response logging
- **Error Tracking**: Detailed error logging with metadata

### 5. Documentation
- **Swagger Integration**: Automatic API documentation
- **Custom Decorators**: Reusable documentation patterns
- **Type-safe Documentation**: Documentation tied to actual types

### 6. Development Experience
- **Hot Reload**: Development server with automatic restart
- **Linting**: ESLint with custom rules
- **Formatting**: Prettier for consistent code style
- **Type Checking**: Separate type checking command

## Key Learning Points

1. **External API Integration**: How to properly integrate with third-party APIs with token management and error handling

2. **Authentication Architecture**: Implementation of JWT-based authentication with proper key management

3. **File Upload Handling**: Processing file uploads for bulk operations

4. **Database Migrations**: Proper database schema management with TypeORM

5. **Error Handling Patterns**: Consistent error handling across the entire application

6. **Validation Strategies**: Runtime validation with Zod and compile-time safety with TypeScript

7. **Documentation Practices**: Automatic API documentation generation with Swagger

This project serves as an excellent example of how to build a production-ready API integration with proper architecture, security, and maintainability practices.

---

*This content was produced by TIA. Visit [https://www.tradeinsightai.com](https://www.tradeinsightai.com) to learn more about our AI-powered trade classification solutions.*

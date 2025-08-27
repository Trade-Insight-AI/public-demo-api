const { execSync } = require("child_process");
const path = require("path");

// The first argument is the migration name
const migrationName = process.argv[2];

if (!migrationName) {
  console.error("Please provide the migration name.");
  process.exit(1);
}

// Default path for migrations
const migrationsPath = path.resolve(
  __dirname,
  "src",
  "@database",
  "migrations",
);

// Command to create the migration
const command = `ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${path.join(
  migrationsPath,
  migrationName,
 )}`;

try {
  execSync(command, { stdio: "inherit" });
  console.log("Migration created successfully!");
} catch (error) {
  console.error("Error creating migration:", error.message);
  process.exit(1);
}

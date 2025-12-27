# Database Commands Reference

Quick reference for all `pnpm db:*` commands in the backend.

## Commands

| Command                | What It Does                                                                                  |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm db:generate`     | Regenerates Prisma Client after you change `schema.prisma`. Run this after editing models.    |
| `pnpm db:migrate`      | Creates a new migration file and applies it. Use during development when changing the schema. |
| `pnpm db:migrate:prod` | Applies existing migrations without creating new ones. Use in production deployments.         |
| `pnpm db:push`         | Pushes schema directly to DB without creating migration files. Quick sync for prototyping.    |
| `pnpm db:studio`       | Opens Prisma Studio - a visual database browser at `http://localhost:5555`.                   |
| `pnpm db:seed`         | Runs the seed script to populate DB with initial data (requires setup in package.json).       |
| `pnpm db:reset`        | ⚠️ **DESTRUCTIVE** - Drops all tables, re-runs all migrations. Wipes all data!                |

## When to Use What?

```
Schema change in development?
  └─► pnpm db:migrate    (creates migration + applies)
  └─► pnpm db:generate   (regenerates client)

Quick prototyping (don't care about migrations)?
  └─► pnpm db:push       (direct sync, no migration file)

Deploying to production?
  └─► pnpm db:migrate:prod  (applies existing migrations)

Want to view/edit data visually?
  └─► pnpm db:studio

Starting fresh? (dev only!)
  └─► pnpm db:reset
```

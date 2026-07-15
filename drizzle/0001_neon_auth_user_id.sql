-- Rename Stack Auth external id column to Neon Auth.
ALTER TABLE "users" RENAME COLUMN "stack_auth_id" TO "auth_user_id";--> statement-breakpoint
DROP INDEX IF EXISTS "users_stack_auth_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "users_auth_user_id_idx" ON "users" USING btree ("auth_user_id");

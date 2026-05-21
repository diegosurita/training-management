<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database guidelines
- Use Prisma for all database interactions. Do not use raw SQL queries or other ORMs.
- Always define your database schema in `prisma/schemas/<model-name>.prisma` and import it in `prisma/schema.prisma`. Do not create or modify database tables directly.
- Use Prisma Migrate to manage schema changes. Do not manually alter the database schema or use other migration tools.
- Follow Prisma's best practices for performance and security, such as using parameterized queries and avoiding N+1 query problems.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# General guidelines
- Commands related to `package.json` or Prisma should be run inside the `app` docker compose service. All other commands should be run in local terminal.
- After making changes to any file, run `npm run lint` ONLY to ensure code quality and consistency.

# Database guidelines
- Use Prisma for all database interactions. Do not use raw SQL queries or other ORMs.
- Always define your database schema in `prisma/schemas/<model-name>.prisma` and import it in `prisma/schema.prisma`. Do not create or modify database tables directly.
- Use Prisma Migrate to manage schema changes. Do not manually alter the database schema or use other migration tools.
- Follow Prisma's best practices for performance and security, such as using parameterized queries and avoiding N+1 query problems.

# Backend guidelines
- The backend should be implemented following modular architecture principles in `src` folder. Organize code into modules based on domains.
- Each module should follow Clean Architecture principles, with clear separation of concerns between interfaces, application and infrastructure layers.
- For code that needs to be shared across modules, create a `shared` module that contains common utilities, types, and interfaces. Do not create circular dependencies between modules.
- Use dependency injection to manage dependencies between modules. Avoid tight coupling and ensure that modules can be easily tested in isolation.
- Since Next.js does not provide built-in support for dependency injection, do not use any DI frameworks or libraries.

## Clean Architecture Layers
Each module should be organized into the following layers:
- **Interfaces**: This layer defines the public API of the module, including server components, server actions, API routes, and any other entry points. It should not contain any business logic or direct database access.
- **Application**: This layer contains the business logic of the module. It should define use cases and orchestrate interactions between the interfaces and the infrastructure layer. It should not directly access the database or external services.
- **Domain**: This layer contains the core domain models and business rules. It should be independent of any specific application or infrastructure concerns and should not contain any code related to data access or external services.
- **Infrastructure**: This layer is responsible for implementing the actual data access and external service interactions.

# Frontend guidelines
- The frontend should be implemented using React 19+ and Next.js 16+. Follow React best practices for component design, state management, and performance optimization.
- Organize components into a `components` directory with subdirectories for each page.
- Components that are shared across multiple pages should be placed in a `shared` directory within `components`. Do not create circular dependencies between components.
- Do not recreate UI components if it already exists in `shadcn/ui`. Always check the component library first before creating a new one.
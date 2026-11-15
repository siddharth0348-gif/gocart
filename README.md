# GoCart

GoCart is a multi-vendor e-commerce application with a Next.js storefront and a Spring Boot REST API. It includes customer shopping pages, vendor product and order management, and an admin dashboard.

## Project structure

- `gocart-main/` - Next.js 15 frontend (React 19, Redux Toolkit, Tailwind CSS)
- `gocart-backend/` - Spring Boot 3.4 REST API (Java 17, Spring Security, JPA, JWT)
- `FULL_STACK_ARCHITECTURE.md` - Additional architecture documentation

## Requirements

- Node.js 18.18 or newer and npm
- Java 17 or newer
- Maven 3.6.3 or newer

## Run locally

Start the backend from the repository root:

```bash
cd gocart-backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`. OpenAPI documentation is available at `http://localhost:8080/swagger-ui.html`. The default development configuration uses an in-memory H2 database; its console is at `http://localhost:8080/h2-console`.

In another terminal, configure and start the frontend:

```bash
cd gocart-main
npm install
```

Copy `.env.example` to `.env.local`, then start Next.js:

```bash
npm run dev
```

Open `http://localhost:3000`. The frontend API URL is configured with `NEXT_PUBLIC_API_URL`; the example points it at the local Spring Boot API. Restart the frontend after changing environment variables.

## Contributing and license

See [CONTRIBUTING.md](gocart-main/CONTRIBUTING.md) for contribution guidelines and [LICENSE.md](gocart-main/LICENSE.md) for license details.

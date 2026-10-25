# CTPR Club: Spring Boot + React

- `backend/`  Spring Boot 3 (Java 17), JPA + H2 database, REST API
- `frontend/` React + Vite (the landing page, swipe cards, portfolios, carousel)

## Requirements
- JDK 17 or newer
- Maven 3.9+ (or open `backend/` in IntelliJ / VS Code and run `CtprClubApplication`)
- Node 18+ (only if you want to change the React code)

## Option A: run everything as one app (easiest)
The React app is already built into `backend/src/main/resources/static`.

    cd backend
    mvn spring-boot:run

Open http://localhost:8080

## Option B: develop the React side with hot reload
Terminal 1:

    cd backend
    mvn spring-boot:run

Terminal 2:

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173 (Vite proxies `/api` to port 8080).

When you are done editing React, run `npm run build` inside `frontend/`.
It writes into `backend/src/main/resources/static`, so Option A serves your new version.

## API
| Method | URL                  | What it does            |
|--------|----------------------|-------------------------|
| GET    | /api/members         | all members, in order   |
| GET    | /api/members/{id}    | one member              |
| POST   | /api/members         | create (send JSON)      |
| PUT    | /api/members/{id}    | update                  |
| DELETE | /api/members/{id}    | delete                  |

Each member has: id, sortOrder, name, role, location, quote, color, caption,
matchPercent, bio, tags[], projects[{title,description,gradient}], slides[{title,description,gradient}].

## Changing the data
- Edit the members in `DataSeeder.java`, delete the `backend/data` folder, restart. It re-seeds.
- Or call the API (for example with Postman): `PUT /api/members/m2` with new JSON.
- H2 console: http://localhost:8080/h2-console  (JDBC URL `jdbc:h2:file:./data/ctprdb`, user `sa`, empty password)

## Where things are
- `MemberController.java`: the REST endpoints
- `Member.java`, `Project.java`, `Slide.java`: the database entities
- `MemberRepository.java`: database access (Spring Data JPA)
- `CorsConfig.java`: allows the Vite dev server to call the API
- `frontend/src/App.jsx`: all React components
- `frontend/src/api.js`: fetches `/api/members`

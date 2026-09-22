# Course Selling — Frontend

A minimal React + Vite + Tailwind frontend for the existing Express/Prisma
backend in `../course-selling-assignment-tests`. Built for learning how a
frontend actually talks to a backend — see the "How it connects" section.

## Run it

Terminal 1 (backend, unchanged):
```
cd ../course-selling-assignment-tests
bun run index.ts        # starts on http://localhost:3000
```

Terminal 2 (this frontend):
```
npm install
npm run dev              # starts on http://localhost:5173
```

Open http://localhost:5173.

## Folder structure

```
src/
  api/          one file per backend resource (auth, courses, lessons, purchases)
                + axios.ts, the shared axios instance everything else imports
  components/   reusable UI pieces (Navbar, CourseCard, ProtectedRoute)
  context/      AuthContext — holds the logged-in user, shared app-wide
  pages/        one component per route (Home, Login, Signup, CourseDetail, ...)
  types/        TypeScript shapes that mirror the backend's Prisma models
  App.tsx       route definitions
  main.tsx      app entry point — wraps App in BrowserRouter + AuthProvider
```

The `api/` folder is the important part to study: it's the *only* place
that knows backend URLs and request/response shapes. Pages never call
`axios` directly — they call `getCourses()`, `login()`, etc. If the
backend's API ever changes, you only update `api/`, not every page.

## How it connects (the part you're here to learn)

1. **axios instance** (`src/api/axios.ts`) — one shared `axios.create()`.
   A request interceptor runs before every call and attaches
   `Authorization: Bearer <token>` if we have one saved, because that's
   exactly what the backend's `auth.middleware.ts` expects.

2. **No CORS setup needed** — because we never touch the backend, and by
   default a browser blocks JS on `localhost:5173` from calling
   `localhost:3000` directly (different origin). Instead, `vite.config.ts`
   proxies specific paths (`/auth`, `/courses`, `/lessons`, `/purchases`,
   `/users`, `/me`) to `http://localhost:3000`. That forwarding happens
   inside Vite's own dev server (Node talking to Node), which isn't
   subject to the browser's CORS rules — so as far as the browser is
   concerned, it's all one origin. This is the standard way to develop a
   frontend against a backend when you can't (or don't want to) add CORS
   headers on the backend.

3. **JWT storage** — on login, the backend returns a JWT
   (`{ token }`). We save it in `localStorage`. From then on, the axios
   interceptor attaches it to every request automatically. There's no
   session/cookie — the token *is* the proof of identity.

4. **AuthContext** (`src/context/AuthContext.tsx`) — on app load, if a
   token exists in `localStorage`, we call `GET /me` to ask the backend
   who it belongs to, and store that user in React state. This is how
   "staying logged in" across a page refresh works, since React state
   itself resets on refresh but `localStorage` doesn't.

5. **ProtectedRoute** — a component that checks `useAuth()` and redirects
   to `/login` if there's no user (or wrong role). This is purely a UX
   nicety; the *real* enforcement is the backend's `authMiddleware` /
   `authorise()` — the frontend check can always be bypassed by someone
   editing the JS, so the backend never trusts it.

## One thing to notice while you use it

`GET /courses/:id/stats` is wired with `authorise("INSTRUCTOR")` but
*not* `authMiddleware` in `routes/course.routes.ts` — so `req.user` is
never set, and the route always responds 401. That's a pre-existing bug
in the backend (not something this frontend introduced). It's a good
example of why route middleware order/composition matters — worth fixing
yourself as an exercise.

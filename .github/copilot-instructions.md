# E-commerce Clothes Application - AI Coding Guide

## Architecture Overview
This is a **server-side rendered Express.js MVC application** for managing clothing products. It uses:
- **Backend**: Express 5.x with EJS templating
- **Database**: MongoDB via Mongoose ODM
- **Auth**: Express-session with bcrypt password hashing
- **Middleware**: Custom middleware for auth guards and view context

## Critical Middleware Ordering (server.js)
Middleware order is crucial - follow this exact pattern:
1. View engine & static files
2. Body parsing & method-override
3. Express-session setup
4. `passUserToView` (makes `user` available in all views)
5. Public routes (auth)
6. `isSignedIn` middleware
7. Protected routes (products)

**Protected routes MUST be registered after `app.use(isSignedIn)`** - see [server.js](server.js#L68-L72).

## Authentication Pattern
- Session data stored in `req.session.user` with `{ username, _id }` only (never store password)
- Middleware `is-signed-in.js` redirects to `/auth/sign-in` if no session
- Middleware `pass-user-to-view.js` sets `res.locals.user` for navbar conditional rendering
- bcrypt hashing: Use `bcrypt.hashSync(password, 10)` for signup, `bcrypt.compareSync()` for signin

## Models & Database Patterns
### Product Schema ([models/Products.js](models/Products.js))
Required fields: `category`, `price`, `size`, `color`, `name`, `inStock` (boolean)
- Commented-out `supplier` field suggests future Supplier relationship

### User Schema ([models/User.js](models/User.js))
- `basket` array references Product IDs (not yet implemented in controllers)
- `isAdmin` boolean for future role-based access

## Controller Conventions
### Route Structure
- Controllers use Express Router and export `router`
- Auth routes: `/auth/sign-up`, `/auth/sign-in`, `/auth/sign-out`
- Product routes: RESTful pattern under `/products`

### Products Controller Key Patterns
1. **Static routes before dynamic**: `/new` route defined before `/:id` to avoid conflicts
2. **Checkbox handling**: Convert `"on"` to boolean - `req.body.inStock = req.body.inStock === "on"`
3. **Confirmation pages**: GET routes for `/id/edit` and `/:id/delete` render confirmation forms
4. **HTTP verbs**: Use PUT for updates, DELETE for deletion (via method-override)

## Form & View Patterns
- **Method Override**: Forms use `?_method=PUT` or `?_method=DELETE` query params (see [server.js](server.js#L21))
- **EJS Structure**: Views in `views/` with `auth/` and `products/` subdirectories
- **Navbar**: Separate `navbar.ejs` partial (conditional rendering based on `user`)

## Development Workflow
### Environment Setup
Required `.env` variables:
- `MONGODB_URI` - MongoDB connection string
- `SESSION_SECRET` - Express session secret

### Running the App
```bash
node server.js
# Runs on port 3000
# Morgan logs HTTP requests in 'dev' format
```

### Database Connection
Uses async `connectToDB()` function with try-catch error handling (see [server.js](server.js#L37-L44))

## Common Patterns & Gotchas
1. **Always hash passwords** before saving to database in auth routes
2. **Validation**: Currently minimal - password confirmation check only
3. **Error handling**: Simple `.send()` for errors - consider implementing proper error pages
4. **Redirects**: After mutations, always redirect (e.g., `res.redirect("/products")`)
5. **Async/await**: Controllers consistently use async/await without try-catch (consider adding)
6. **Basket feature**: User model has `basket` array but no controller implementation yet

## File Naming
- Models: PascalCase (e.g., `Products.js`, `User.js`)
- Controllers: kebab-case with descriptive names (e.g., `index.routes.js`, `products.js`)
- Middleware: kebab-case (e.g., `is-signed-in.js`, `pass-user-to-view.js`)
- Views: kebab-case `.ejs` files

## Extending the App
When adding new protected resources:
1. Create controller in `controllers/`
2. Create model in `models/`
3. Register route **after** `app.use(isSignedIn)` in server.js
4. Create views in `views/<resource>/`
5. Follow REST conventions (index, new, create, show, edit, update, delete)

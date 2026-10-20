# Codebase Analysis: Admin Module & Core Architecture

## 1. Overview
The codebase is a **Nuxt 3** application serving as a wedding invitation platform ("Thiệp Cưới"). It features a **Full-Stack** architecture where Nuxt handles both the Server-Side Rendering (SSR) frontend and the API backend. The database layer uses **Sequelize** ORM with **MySQL**.

This analysis focuses on the Admin module, Authentication, and Data layers as requested.

## 2. Architecture Layers

### **Tech Stack**
-   **Framework**: Nuxt 3 (Vue 3 + Nitro Server)
-   **Database**: MySQL
-   **ORM**: Sequelize
-   **Authentication**: JWT (JSON Web Tokens) + Bcrypt
-   **Frontend UI**: Custom Bootstrap/CSS, Vue Composition API

### **Directory Structure**
-   `models/`: Database schema definitions and associations.
-   `migrations/` & `seeders/`: Database version control and initial data population.
-   `server/api/v1/`: API route handlers (Controllers).
-   `server/services/`: Business logic layer (Service Pattern).
-   `server/middleware/`: Request processing (Authentication).
-   `app/pages/admin/`: Admin dashboard frontend pages.

---

## 3. Database Layer (Models & Migrations)

The database schema revolves around **Users** creating **Wedding Cards** which can contain **Media** (Images, Music, Animations).

### **Key Entities & Relationships**
*   **User (`users`)**:
    *   Roles: `admin` or `user`.
    *   Auth: Supports Email/Password and Social Login (Google/Facebook).
    *   **Relationships**: Has many `Images`, `Musics`, `Animations`, `WeddingCards`, `Orders`.
*   **Wedding Actions**:
    *   `WeddingCard` belongs to `User` and `CategoryWeddingCard`.
    *   `Order` links `User` and `Package`.
*   **Media & Assets**:
    *   `Image`, `Music`, `Animation` all belong to a `User` and a specific `Type` (e.g., `ImageType`).
    *   They also link to a `Package` (`id_min_package`) to enforce access control based on user subscription levels.
*   **Packages**:
    *   Many-to-Many relationship with `Features` via `PackageFeature`.

### **Seeders**
-   **`user_seeder.js`**: Populates initial users.
    -   Creates 1 Admin (`admin@thiepcuoi.com`) and 1 Regular User.
    -   Passwords are hashed using `bcrypt` before insertion.

---

## 4. Backend Logic (Server API)

The backend follows a **Controller-Service-Data** pattern to keep concerns separated.

### **Authentication Flow**
1.  **Login (`/api/v1/auth/login`)**:
    *   Handled by `AuthService.login()`.
    *   Accepts `email`, `password`, and `isAdmin` flag.
    *   Verifies credentials using `bcrypt`.
    *   **Admin Check**: If `isAdmin: true`, enforces `user.role == 'admin'`.
    *   **Token Issue**: exacts a JWT and sets it in an HTTP-only cookie named **`auth_admin_token`**.
2.  **Protection (`server/middleware/admin-auth.ts`)**:
    *   Global middleware running on every request.
    *   Intercepts routes starting with `/api/v1/admin`.
    *   Skips `/api/v1/admin/login`.
    *   Decodes `auth_admin_token`. If invalid or missing, returns 401 Unauthorized.
    *   Attaches decoded user info to `event.context.admin`.

### **Admin API (`server/api/v1/admin/`)**
*   **Structure**: API routes mirror the resource names (e.g., `/users`, `/packages`).
*   **Implementation**:
    *   Files like `users/index.ts` act as **Controllers**. They parse the request (method, body, query) and call the corresponding **Service**.
    *   **Service Layer (`userService.ts`)**: Contains the business logic.
        *   `getList()`: Handles pagination and filtering.
        *   `create()`: Validates input and calls the Data layer.
        *   `delete()`: Removes records.
    *   **Data Layer (`server/data/user.ts`)**: Wraps Sequelize calls to keep raw DB queries isolated.

---

## 5. Data Access Layer (`server/data/`)

The application uses a **Repository-like Pattern** to abstract database operations.

### **Base Abstraction: `DataPattern` (`server/data/index.ts`)**
*   **Purpose**: Acts as a base class for all data access objects.
*   **Model Access**: It retrieves Sequelize models from a global object: `(global as any).__db`. This suggests the models are loaded and attached to `global` during server startup (likely in a plugin or middleware).
*   **Key Utility: `pagination()`**:
    *   A protected method available to all subclasses.
    *   Standardizes logic for `offset`, `limit`, `order`, and `where` clauses (including partial text search via `Op.like`).
    *   Returns a consistent response structure: `{ count, totalCount, currentPage, totalPages, data }`.

### **Implementation Example: `PackageData` (`server/data/package.ts`)**
*   Extends `DataPattern`.
*   Implements standard CRUD methods (`list`, `create`, `getById`, `update`, `delete`).
*   Uses `this.getModels()?.Package` to access the specific Sequelize model.
*   Passes query parameters (page, limit, search) to `this.pagination()` for the list view.

---

## 6. Frontend Logic (Admin Panel)

 The Admin Panel is built with **Vue 3** keying on Nuxt's file-based routing.

### **Structure (`app/pages/admin/`)**
*   **Routing**: Directories create nested routes.
    *   `admin/login.vue` -> `/admin/login`
    *   `admin/users/list.vue` -> mapped usually to `/admin/users` (via `index.vue` or direct mapping).
*   **Components**: Heavy use of reusable components (`PaginationComponent`, `ViewModalComponent`, `BaseIconComponent`).
*   **State Management**: Uses local `ref`s for page state (loading, list data, pagination).
*   **Data Fetching**:
    *   Uses Nuxt's `$fetch` to call internal API endpoints (`/api/v1/admin/...`).
    *   **Login Page**: Features a polished UI with animated background (`login.vue`). It POSTs to the generic auth endpoint but with the admin flag.

    *   **Login Page**: Features a polished UI with animated background (`login.vue`). It POSTs to the generic auth endpoint but with the admin flag.

---

## 7. Nuxt Configuration & Global Settings

The `nuxt.config.ts` file reveals several critical architectural decisions:

*   **Modules**:
    *   `@pinia/nuxt`: State management.
    *   `nuxt-auth-utils`: Authentication utilities (session management).
    *   `@nuxt/image`: Image optimization (providers configured for local & Google).
    *   `@nuxtjs/sitemap`: SEO automatic sitemap generation (linked to `/api/v1/sitemap`).
*   **Runtime Config**:
    *   Exposes `jwtSecret` and OAuth credentials (Facebook/Google) securely.
    *   Differentiates between **Public** (client-side access) and **Private** (server-only) keys.
*   **Custom Routing (`pages:extend` hook)**:
    *   Implements a custom route translation layer.
    *   It dynamically renames routes based on a `routesMap` (e.g., translating English route names to Vietnamese URL paths).
    *   It handles the `admin` prefix replacement driven by configuration.

---

## 8. Public Frontend & Shared Components

Beyond the admin panel, the application has a substantial public-facing side.

### **Public Pages (`app/pages/`)**
The directory structure indicates a feature-rich user site:
*   `dashboard/`: Likely the User Dashboard (distinct from Admin).
*   `thiep-cuoi/` & `thiep-tron-goi.vue`: Wedding card galleries/landing pages.
*   `pricing-plans.vue`: Subscription/Payment pages.

### **Shared Components (`app/coms/`)**
The `app/coms` directory is organized by domain and functionality:
*   **`editor/`**: A significant subdirectory (33 items) suggesting a complex **Wyiswyg or Drag-and-Drop Editor** for users to customize their wedding cards.
*   **`common/` UI**: `button/`, `modal/`, `pagination/`.
*   **`home/`, `invitation/`**: specialized components for specific page sections.

---

## 9. Frontend Architecture & UI/UX

As a platform heavily reliant on aesthetics, the frontend architecture is designed for visual richness and interactive complexity.

### **9.1 Public Layout & Design System**
The public-facing site (`layouts/default.vue`) implements a "Soft/Ethereal" design language suitable for weddings.
*   **Ambient Backgrounds**: Instead of static colors, the layout uses a complex 3-layer overlay system (`overlay-bg-container`) with radial gradients and blur filters to create a dynamic, soft atmosphere.
*   **Typography**: Custom fonts are hosted locally (`public/fonts`), ensuring brand consistency without relying on external CDNs.
*   **Modular Landing Page**: `pages/index.vue` is purely compositional, stacking self-contained sections (`SlideCarousel`, `Reason`, `InvitationTemplate`) to tell a product story.

### **9.2 Wedding Card Editor (UX Core)**
The Editor (`app/coms/editor`) is a sophisticated SPA module within the Nuxt app, functioning like a design tool (e.g., Canva-lite).
*   **Interaction Engine**:
    *   Powered by `vue3-moveable` (in `EditorMoveable.vue`).
    *   Features detailed interaction logic: Snapping to guidelines (center/vertical), Element Locking, and Rotatable/Resizable handles.
    *   Real-time DOM-to-Store synchronization: Drag events immediately update Pinia state (`updateStoreStyle`).
*   **Atomic Tool Architecture**:
    *   The settings panels (`tool/`) follow an **Atomic Composition** pattern.
    *   Example: `ToolMap.vue` doesn't contain logic itself but composes atomic UI blocks like `<PaddingComponent>`, `<BorderComponent>`, `<BoxShadowComponent>`, and `<ColorComponent>`. This ensures a highly consistent UI across different tools.

---

## 10. Utilities & Helpers

### **Composables (`app/composables/`)**
*   **`FormatResponse.ts`**: Standardizes API responses (Success/Error wrappers) across the app.
*   **`SEO.ts`**: Helper for managing dynamic Head tags and Meta descriptions.

### **Server Utils (`server/utils/`)**
*   **`redis.ts`**: Indicates the use of Redis, likely for caching heavy queries or managing session stores in production.

---

## 11. State Management (Pinia)

The application relies heavily on **Pinia** for complex client-side logic, particularly for the wedding card builder.

### **Editor Store (`stores/editor.ts`)**
This is the core engine for the "Invitation Builder" feature:
*   **State**: Manages the visual structure of a card including `createdNodes` (text/image blocks), `background` settings, and background `music`.
*   **Persistence**:
    *   Implements a custom **Auto-Save** mechanism.
    *   Uses `localStorage` (key: `wd_invitations`) to save work-in-progress cards.
    *   Uses `this.$subscribe` with a debounce timer to save changes automatically without user intervention.
*   **Interactivity**: Handles element selection (`selectedNodeId`), style updates, and property modification.

### **User Store (`stores/user.ts`)**
*   **Purpose**: Manages global user session state.
*   **Integration**: Wraps `nuxt-auth-utils` (`useUserSession`) to sync server-side session data (role, email, avatar) to the client-side store.
*   **Actions**: Handles `logout` and `checkLogin` lifecycles.

---

## 12. Summary of Understanding

I have analyzed the provided files and established the following understanding:
1.  **Robust Auth**: The system separates Admin and User sessions via different cookies and logic branches in `AuthService`.
2.  **Clean Architecture**: The separation of Controller (`api/`), Service (`services/`), and Data (`data/`) ensures maintainability.
3.  **Rich Database**: A comprehensive schema supports a feature-rich wedding invitation platform with media management and paid packages.
4.  **Modern Frontend**: The admin interface is component-driven and integrated tightly with the backend API.

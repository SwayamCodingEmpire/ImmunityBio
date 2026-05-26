# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Anktiva Order Management System** — a specialty pharmaceutical platform for managing orders, patient enrollment, territory assignments, and sales reporting for Anktiva (a $35,800/unit oncology drug). Built with Angular 19 + Bootstrap 5.

## Commands

```bash
npm install          # Restore dependencies
npm start            # Dev server at http://localhost:4200/
npm run build        # Production build → dist/order_management_system/
npm run watch        # Rebuild on change without serving
npm test             # Karma + Jasmine unit tests
```

No linting or e2e setup is currently configured.

## Architecture

### Data Layer

All data is mock/in-memory — there is no backend API. `src/app/services/data.service.ts` is the single data source: it holds static JSON objects for orders, patients, physicians, territories, sales, KPIs, and team members. It exposes typed `get*()`, `add*()`, `delete*()`, and `update*()` methods. Components inject this service directly.

### Routing & Layout

`app.routes.ts` defines 13 lazy-free routes. Default route redirects to `/order-management`. `AppComponent` is the root shell — it wraps `<router-outlet>` with `SidebarComponent` and `TopNavComponent`. The sidebar manages its own collapsed state; `AppComponent` dispatches a `resize` event on collapse to trigger ECharts redraws.

### Component Conventions

All components are **standalone** (Angular 19 style) with explicit `imports: []` arrays. No `NgModule` files exist. Components use `FormsModule` with `[(ngModel)]` for form state — there is no Reactive Forms usage. Modals and dialogs are implemented as conditional template blocks toggled by boolean flags on the component class.

### Filtering Pattern

Pages with tables use client-side filtering via computed getters that derive a filtered array from the full dataset and component filter state. An "apply filter" button copies pending filter values to active ones before the getter runs.

### Charts

ECharts 6 is used for all visualizations (dashboard page). Charts are initialized imperatively via `@ViewChild`, options objects, and manual `chart.setOption()` calls. Dispose charts in `ngOnDestroy` and re-initialize on window resize.

### Styling

- **Global theme:** `src/styles.scss` defines CSS custom properties: `--ib-navy`, `--ib-teal`, radii (`--ib-radius-sm` to `--ib-radius-xl`), and shadow variants.
- **Bootstrap 5.3.3** is included via `angular.json` styles/scripts arrays (not just npm).
- **Bootstrap Icons 1.13.1** is also in `angular.json` styles.
- Component SCSS uses the `--ib-*` variables and Bootstrap utility classes together.
- `SharedTableComponent` uses `ViewEncapsulation.None` so parents can inject styles directly.

### Shared Components

- **`SharedTableComponent`** (`src/app/shared/shared-table/`) — generic table wrapper accepting `title`, `headers`, `searchTerm`, `showSearch`, `showAddButton`, `tableClass` inputs and emitting `searchChange`/`addClick` outputs.

## Naming Conventions

| Item | Convention |
|---|---|
| Folders/files | `kebab-case` |
| Classes | `PascalCase` |
| Properties/methods | `camelCase` |
| Component selector prefix | `app-` |

## Key Files

| File | Purpose |
|---|---|
| `src/app/app.routes.ts` | All route definitions |
| `src/app/services/data.service.ts` | All mock data and CRUD methods |
| `src/app/app.component.ts` | Root layout shell and sidebar collapse logic |
| `src/styles.scss` | Global CSS custom properties and base styles |
| `angular.json` | Build config, Bootstrap inclusion, style budgets |

## Commit Style

Use clear imperative subjects scoped to the affected screen or module, e.g. `Add provider network filters` or `Fix sidebar route highlighting`. Include screenshots in PRs for visible UI changes.

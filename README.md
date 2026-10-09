# Forme

A visual, section-based website builder. Create a single-page website, customize its content and styling, preview responsive layouts, and export HTML/CSS that works without the editor.

## Run locally

Requirements: Node.js 22.12+ and npm. Install dependencies with `npm ci` on a new checkout.

```bash
npm run dev
```

Open http://127.0.0.1:5173. The React frontend and Express API share one origin and one command. On a new machine, run `npm ci` first. The first startup creates `data/forme.json` automatically; do not commit this file.

If a coding-agent sandbox reports `listen EPERM`, run the command in a normal terminal. The application requires permission to listen on localhost.

## First walkthrough

1. The editor opens with the Studio North template. Click a section in the preview to select it, or use the Layers tab.
2. Change the heading and description in Content. Use Style for section colors, spacing, and alignment.
3. Click Page to set global typography, accent color, and corner radius.
4. Add any of eight section types from the library. New sections go after the selection, or at the end when nothing is selected.
5. Reorder in Layers by dragging, or use the up/down buttons. Duplicate/remove from the inspector. Undo and redo are in the toolbar.
6. Switch between 1200px desktop, 768px tablet, and 375px mobile previews. Preview enables links; Design enables selection.
7. Code shows the generated HTML and CSS. Editing this view is intentionally disabled.
8. Export site downloads a ZIP containing `index.html`, `styles.css`, and instructions. Open the HTML independently or upload both files to a static host.
9. Save prompts for account creation or sign-in. After signing in, click Save again. Open saved projects through the project name at the top.
10. The Forme logo opens templates, including a blank canvas.

A single browser draft is stored locally and survives refresh. It is shared by people using the same browser profile. Account projects use server-side ownership checks. Local drafts do not automatically save to your account; use Save. Exported sites have no account dependency.

## MongoDB

The default is explicitly a local-development JSON store, suitable for one Node process. The MongoDB adapter is implemented but was not integration-tested in this restricted environment. The driver is optional so local development remains usable without database access.

```bash
npm run db:setup
cp .env.example .env
```

Set `MONGODB_URI` in `.env` to your local MongoDB or Atlas connection string and restart. `MONGODB_DB` defaults to `forme`. The adapter creates a unique email index, owner index, and session expiration index. Existing JSON accounts/projects are not automatically migrated to MongoDB. Keep `.env` private.

## Commands

```bash
npm test       # renderer and API middleware tests; no listening socket needed
npm run build  # production frontend bundle in dist/
npm start      # production server; use behind HTTPS for authentication
```

Production session cookies require HTTPS. For deployment set `APP_ORIGIN` to the exact public origin, configure HTTPS on the reverse proxy, set `HOST=0.0.0.0` only when intentionally exposing the service, and use MongoDB. A local production-bundle preview over plain HTTP cannot use the secure session cookie; use development mode locally. Email verification, password reset, distributed rate limiting, hosted publishing, and a deployment security review remain future work.

## Structure

- `src/main.jsx`: React editor, inspector, templates, project/account dialogs.
- `src/style.css`: responsive editor styles.
- `src/icons.jsx`: local SVG icon components; no remote icon dependency.
- `shared/page.js`: section defaults, templates, validation, HTML/CSS generation.
- `server/app.js`: Express auth and project routes, validation, ownership enforcement.
- `server/store.js`: local JSON and MongoDB adapters.
- `server/index.js`: server startup and Vite integration.
- `tests/`: renderer/security checks and Express middleware integration tests.

## Design decisions

Pages are JSON documents rather than arbitrary HTML. The same renderer powers preview and export. User content is escaped; URL protocols and style values are restricted. A sandboxed iframe separates the generated page from the editor; selection messages are accepted only from that iframe. Passwords use salted scrypt hashes; opaque session tokens are hashed in storage and transported through HTTP-only cookies.

Section content can be long, but a page is limited to 60 sections and the API bounds payloads at 512 KB. External images are linked by URL and are not bundled into exports. Navigation anchors Work/About/Contact match the corresponding starter sections. Custom link labels require corresponding destinations to be configured in the exported page; footer link labels are display text in this release. Multiple copies of sections with named anchors may need manual anchor adjustment in exported code.

The editor supports section-level placement, not arbitrary element positioning. There is no arbitrary JavaScript or two-way code editing. The UI scales the desktop canvas to the available workspace; the iframe still renders at the selected viewport width.

## Validation status

- Production build: passed.
- Six automated tests: passed, covering all templates/sections, standalone export, escaping and URL restrictions, schema rejection, immutable reordering, authentication, account isolation, project persistence, and request-origin rejection.
- API tests use real Express middleware with in-process request streams; they do not validate TCP or a deployed reverse proxy.
- Limited browser observations: the existing session displayed generated HTML in Code view and switched to the mobile preview. Complete editing, saving, download, and cross-browser workflows remain pending.
- MongoDB: adapter implemented; driver/database setup and integration test pending.

See `PROJECT_PLAN.md` for milestones and semester extensions.

## Project report and presentation

- [IEEE-style report (PDF)](docs/report/Forme_IEEE_Report.pdf)
- [Editable report (Word)](docs/report/Forme_IEEE_Report.docx)
- [Report source (Markdown)](docs/report/report.md)
- [Presentation slides (PowerPoint)](docs/slides/Forme_Presentation.pptx)

The report documents the actual prototype and its evaluation limits. The presentation includes speaker notes and a suggested demonstration sequence. GitHub Actions runs the tests and production build on pushes to main and on pull requests.

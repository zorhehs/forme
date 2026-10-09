# Forme: visual website builder

## Product
A section-based, single-page website builder for portfolios, studios, and product landing pages. Users start from a template or blank page, assemble semantic sections, customize content and styling, preview responsive layouts, and download portable HTML/CSS. The editor opens immediately with a usable starter project; accounts are needed only for server-backed project storage.

## First release
1. Editor shell: section library, ordered layers, interactive canvas, inspector.
2. Eight blocks: navigation, hero, features, text, image, testimonial, call to action, footer. Add, reorder by drag or buttons, duplicate, delete, undo/redo.
3. Three templates and blank page. Editable copy, links, image URLs, colors, typography, padding, and alignment. Responsive iframe at desktop/tablet/mobile widths.
4. Live HTML/CSS view from the same renderer as the canvas. ZIP export with index.html, styles.css, and README. No builder runtime needed by exported sites.
5. Browser draft recovery. Signup/login/logout, private project list, create/open/save/delete. Express API with ownership checks. MongoDB adapter plus explicit local JSON development mode.
6. Automated checks for rendering, validation, login, and project isolation; browser verification of the full edit-preview-export workflow.

## Architecture
React editor -> structured page JSON -> shared HTML/CSS renderer -> sandboxed preview or portable export.
React account/project UI -> same-origin Express REST API -> storage adapter -> MongoDB or local JSON.
The renderer escapes text, restricts links/images, and validates style values. Preview code is isolated from the editor; selection messages are checked against the iframe window. Server validation bounds page size and section fields.

## Data
User: id, normalized email, salted password hash, createdAt.
Session: hashed token, userId, expiresAt.
Project: id, ownerId, name, page {version, theme, sections}, createdAt, updatedAt.
Section: id, type, content, style. Generated identifiers connect layers, inspector, renderer and selection.

## API
GET /api/health; GET /api/auth/me; POST /api/auth/signup; POST /api/auth/login; POST /api/auth/logout.
GET/POST /api/projects; GET/PUT/DELETE /api/projects/:id. Every project request requires a session and owner match.

## Boundaries
No arbitrary JavaScript, free positioning, multi-page routing, collaborative editing, hosted publishing, or two-way code editing. Image URLs are remote references, not uploaded or bundled assets. Local draft storage is per browser; account projects are private on the server. Local JSON is for a single-process demonstration; use MongoDB for a hosted deployment.

## Milestones and acceptance
- Editor: construct and style a page, reorder sections, undo a deletion, and preview at 375/768/1200 pixels.
- Persistence: recover a draft after refresh; save and reopen a named project; verify a second account cannot read or update it.
- Export: unzip the download and open index.html independently; match preview content and responsive behavior.
- Delivery: reproducible commands, architecture notes, tests, and an honest record of remaining deployment work.

## Future semester work
Image upload with storage limits, revision history, keyboard-accessible section movement refinements, reusable components, multi-page support, publishing to a static host, and a formal usability evaluation. Choose these after the initial product is stable.

## Technical references
- React with a build tool: https://react.dev/learn/build-a-react-app-from-scratch
- Express request handling: https://expressjs.com/en/5x/api/application/

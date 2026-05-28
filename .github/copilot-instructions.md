# AI Agent Instructions for AEM Edge Delivery Services Codebase

## Project Overview

This is an **AEM Edge Delivery Services (EDS) project** using the Adobe Helix boilerplate. It's a headless CMS architecture where content is authored in AEM and delivered through Edge servers. The project uses a **block-based component architecture** where pages are built from modular, reusable blocks.

**Key URLs:**
- Preview: `https://main--aem-ue-edgeblock--vengadesh66.aem.page/`
- Live: `https://main--aem-ue-edgeblock--vengadesh66.aem.live/`
- Author: Content managed at `https://author-p120465-e1171116.adobeaemcloud.com`

## Architecture & Data Flow

### Core Concepts

1. **Blocks** (`blocks/` directory): Reusable UI components that render content. Each block has:
   - `blockname.js` - Decoration function that transforms HTML into structured DOM
   - `blockname.css` - Block-specific styling
   - `_blockname.json` - Block definitions and data models for AEM editor
   - Example: `blocks/cards/`, `blocks/header/`, `blocks/hero/`

2. **Models** (`models/` directory): JSON schemas defining content structure for AEM authoring
   - `_component-models.json` - Field definitions (image, title, text, button, etc.)
   - `_component-definition.json` - Component configurations for the editor
   - `_component-filters.json` - Component visibility rules
   - Built JSON files are generated to root (e.g., `component-models.json`)

3. **Scripts** (`scripts/` directory):
   - `aem.js` - Core AEM utilities: RUM tracking, image optimization, block loading
   - `scripts.js` - Global page decorators: header/footer loading, DOM transformation
   - `delayed.js` - Non-critical functionality loaded after page interactive

4. **Content Delivery**:
   - Content authored in AEM → Franklin delivery API → Edge servers
   - `fstab.yaml` maps the AEM author instance to this repo
   - `paths.json` defines content mappings (e.g., `/content/aem-ue-edgeblock/` → `/`)

## Block Development Pattern

### When Creating/Modifying Blocks

1. **Block Structure**: Each block lives in `blocks/{blockname}/` with `.js`, `.css`, and `_*.json` files
2. **Decoration Function**: The `.js` file exports a default `decorate(block)` function that:
   - Receives the block's HTML from AEM as a DOM element
   - Transforms it into semantic structures (e.g., HTML table → `<ul><li>` for cards)
   - Optimizes images using `createOptimizedPicture()` from `aem.js`
   - Preserves instrumentation attributes (`data-aue-*`) for editor integration
3. **CSS Classes**: Use BEM-like naming: `.blockname`, `.blockname-section`, `.blockname-item`
4. **Example Pattern** (from `blocks/cards/cards.js`):
   ```javascript
   export default function decorate(block) {
     const ul = document.createElement('ul');
     [...block.children].forEach((row) => {
       const li = document.createElement('li');
       moveInstrumentation(row, li); // Preserve AEM editor attributes
       ul.append(li);
     });
     block.replaceChildren(ul);
   }
   ```

## Project-Specific Conventions

### Code Style & Linting

- **ESLint** (`eslint`, `eslint-plugin-xwalk`): Enforces Airbnb style guide + Adobe additions
- **StyleLint** (`stylelint`): CSS linting with standard configuration
- **Pre-commit hooks** via Husky
- **Commands**:
  - `npm run lint` - Check JS and CSS
  - `npm run lint:fix` - Auto-fix issues
  - `npm run lint:js` - JavaScript only
  - `npm run lint:css` - CSS only

### JSON Build Pipeline

- **Auto-generated files** at root: `component-models.json`, `component-definition.json`, `component-filters.json`
- These are built from source files in `models/` using `merge-json-cli`
- Command: `npm run build:json` (runs all 3)
- **IMPORTANT**: Never manually edit generated JSON files; update source files in `models/` instead
- The build is NOT part of CI/CD—it's run locally and committed

### Instrumentation & AUM (Adobe Experience Manager)

- Elements in blocks carry `data-aue-*` attributes from AEM
- Use `moveInstrumentation(from, to)` from `scripts/scripts.js` when DOM restructuring
- This preserves editor integration and analytics tracking
- Example: When moving images in cards, preserve these attributes so the editor knows what was changed

### RUM (Real User Monitoring)

- `aem.js` includes sophisticated RUM tracking integrated with Adobe analytics
- Key function: `sampleRUM(checkpoint, data)` for performance tracking
- DO NOT remove or modify RUM collection code
- Checkpoints include: `page_load`, `error`, `cwv` (Core Web Vitals), etc.

## Development Workflow

### Local Development

1. Install AEM CLI: `npm install -g @adobe/aem-cli`
2. Run: `aem up` (starts proxy at `http://localhost:3000`)
3. Edit blocks/styles in your IDE; changes auto-reflect in browser
4. Preview endpoint uses Franklin delivery API with your local code

### Testing & Validation

- CI/CD runs: `npm run lint` on every push (see `.github/workflows/main.yaml`)
- Build validation: Node.js 20/24 (check `.github/workflows/main.yaml`)
- No automated tests; reliance on linting and manual verification
- Test widgets: `preact-calendar-widget/test-signup.html` provides HTML test pages

### Helix Query & Sitemap

- `helix-query.yaml` - Configures query index generation for `/query-index.json`
- `helix-sitemap.yaml` - Auto-generates XML sitemaps
- These are processed by Franklin during build; no manual updates needed

## Multi-Module Setup

This workspace contains **multiple sub-projects**:

1. **aem-ue-edgeblock** (main): EDS site blocks and styles
2. **preact-calendar-widget**: Preact-based widget (dependencies: `preact`, esbuild)
   - Build: `npm run build` (calls `build.js` which uses esbuild)
   - For widget integration, export to `widgets/preactwidgets/`
3. **widgets/preactwidgets**: Built/transpiled widget outputs

When working across modules, ensure symlinks or path mappings are correct in build tools.

## Critical Files & Their Purpose

| File | Purpose |
|------|---------|
| `aem.js` | Core library: image optimization, RUM tracking, block decorators |
| `scripts.js` | Page-level decorators: loads header/footer, processes sections |
| `component-definition.json` | Registers blocks/components in AEM editor UI |
| `component-models.json` | Defines content fields (image, text, button, etc.) |
| `fstab.yaml` | Maps AEM author instance to repo |
| `.github/workflows/main.yaml` | CI/CD: linting on push |

## Tips for Agent Productivity

1. **Block Decoration**: Always preserve `data-aue-*` attributes when restructuring DOM—use `moveInstrumentation()`.
2. **Image Handling**: Use `createOptimizedPicture()` from `aem.js` for responsive images; don't manually create `<picture>` tags.
3. **Adding Components**: New blocks require three files: `_blockname.json`, `blockname.js`, `blockname.css`, and optional entries in `models/`.
4. **JSON Updates**: Never edit `component-*.json` at root; edit `models/_component-*.json` and run `npm run build:json`.
5. **CSS Scope**: Use block-specific class names to avoid cascading issues across blocks.
6. **Performance**: Check RUM integration; avoid blocking scripts; use `delayed.js` for non-critical features.
7. **Testing Widgets**: Use `preact-calendar-widget/test-signup.html` to test widget integration in HTML context.

## Cross-Project References

- **Widget Integration**: See `preact-calendar-widget/.github/copilot-instructions.md` for how widgets are built
- **Widget Distribution**: See `widgets/.github/copilot-instructions.md` for how widgets are deployed
- **Workspace Overview**: See root-level `.github/copilot-instructions.md` for entire project structure
- **Adobe AI Agent Skills**: See `AI_AGENT_SKILLS_INTEGRATION.md` for comprehensive AI coding practices

## Adobe AEM AI Agent Skills

For detailed guidance on AI agent development patterns, see **`AI_AGENT_SKILLS_INTEGRATION.md`** which covers:
- ✅ HTML structure parsing and DOM transformation
- ✅ Instrumentation attribute preservation (critical for AEM editor)
- ✅ Image optimization with `createOptimizedPicture()`
- ✅ RUM tracking and performance monitoring
- ✅ Content model to code mapping
- ✅ CSS scoping and conflict avoidance
- ✅ Error handling and resilience patterns
- ✅ Testing and validation strategies
- ✅ Performance-first implementation
- ✅ Security and XSS prevention

**AI agents should reference this guide before generating block code.**

## External References

- [AEM EDS Docs](https://www.aem.live/developer/anatomy-of-a-project)
- [Creating Blocks](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/create-block)
- [Content Modeling](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/edge-delivery/wysiwyg-authoring/content-modeling)
- [AI Coding Agents Guide](https://www.aem.live/developer/ai-coding-agents)

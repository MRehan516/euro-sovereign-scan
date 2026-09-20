# SovereignGate polish, branding cleanup, and release

## Scope
Make additive presentation and metadata changes only. Preserve the database schema, scoring, scan server function, AI report generation, certificate data, and existing page layouts.

## Changes
1. **Brand metadata and favicon**
   - Keep the browser title as “SovereignGate — Digital Sovereignty Assurance”.
   - Add a small SovereignGate favicon derived from the existing landmark identity and replace the template favicon.
   - Complete route-level sharing metadata without adding a preview image unless a suitable public image already exists.

2. **Small interface additions**
   - Add one understated guidance line to the pre-scan empty state.
   - Keep the existing “Download as PDF” certificate action; do not change certificate generation.
   - Add a text-only dataset revision / last-updated note on the scoring methodology page.
   - Adjust only text color or opacity where automated contrast checks show a failure.

3. **Branding cleanup**
   - Remove visible platform badges or credits if present.
   - Replace platform-generated README copy and set an app-specific package name and description.
   - Remove platform-name references from non-essential comments and metadata while retaining required package names, generated integration modules, imports, headers, and runtime identifiers that keep the app working.

4. **Verification and release**
   - Check every content page and metadata output.
   - Smoke-test page loading, a real scan, live report generation, and certificate rendering/export controls.
   - Verify contrast for ink-navy, amber, and brick-red treatments.
   - Publish the app and confirm the public URL serves the updated version without login.
   - Inspect repository connectivity and report the exact sync result. The managed workspace controls commits; no unsafe manual Git state operations will be used.

## Technical constraints
- No database migrations or schema changes.
- No edits to scoring logic or server-side scan/report logic.
- No refactors or component rewrites.
- No removal of functional integrations or required platform packages.

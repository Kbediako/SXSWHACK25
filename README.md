# Localization Orchestrator Viewer

A lightweight React (Vite + TypeScript) single-page app for reviewing localization runs produced by the orchestrator pipeline.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the development server (serves `viewer/` with hot reload):
   ```bash
   npm run dev
   ```
   Vite defaults to http://localhost:5173/.
3. Build a production bundle (outputs to `dist/`):
   ```bash
   npm run build
   ```

## Populating `public/` assets

The app expects run artifacts to be copied into `public/` before launch.

- Place the manifest exported by phase 2 at `public/run-manifest.json`.
- Copy referenced assets (DOM snapshots, guardrail manifest, agent outputs, preview video, archive bundle) so that their relative paths from the manifest match the structure under `public/`.

Example workflow for a run stored at `.runs/0002/<timestamp>/`:

```bash
cp .runs/0002/<timestamp>/phase-2-manifest.json public/run-manifest.json
cp -R .runs/0002/<timestamp>/artifacts/* public/
```

Adjust the copy commands to mirror the directory layout defined by your manifest.

## Project structure

```
viewer/
  index.html
  src/
    App.tsx
    main.tsx
    components/
      GuardrailSummary.tsx
      HeaderBar.tsx
      LocaleSidebar.tsx
      RecommendationTable.tsx
      StatusBadge.tsx
      VisualPreview.tsx
    hooks/
      useRunData.ts
    types/
      manifest.ts
    utils/
      yaml.ts
public/
  run-manifest.json (sample)
  agents/
  guardrails/
  localized/
  snapshots/
```

`VisualPreview` includes TODO comments indicating where live localized DOM should be linked once the pipeline produces it. Update `public/localized/index.html` and the manifest when localized artifacts are ready.

## Notes

- Mantine provides layout, tabs, and chip components for a quick responsive interface.
- `js-yaml` powers YAML parsing for guardrail manifests and future change-log usage.
- The app filters recommendations by locale selected in the left sidebar; choose **All locales** to review aggregated suggestions.

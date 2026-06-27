# MLN122 Production Structure

Runtime code for the MLN122 ground-rent farming simulation lives in this folder.

## App code

- `page.tsx` - screen orchestration and game flow.
- `game-model.ts` - economic state, plot data, and calculations.
- `investment-screen.tsx`, `multi-map-farming.tsx`, `result-screen.tsx` - main playable screens.
- `tmx-map-renderer.tsx` - TMX parser/renderer for farm maps.
- `farm-maps-config.ts` - selectable farm metadata.
- `asset-paths.ts` - public asset base paths.
- `asset-registry.ts`, `pixel-components.tsx`, `sprite-sheet.tsx`, `character-composer.tsx` - shared sprite helpers.
- `ui-components.tsx`, `animations.tsx`, `economic-storytelling.tsx`, `village-scene.tsx` - UI and supporting presentation.

## Public assets

All production assets are under `public/resources/MLN122/assets`.

- `farms/<farm>/map.tmx` - source TMX maps. Keep the `Paths` tileset data in TMX; the renderer hides the `Paths` layer at runtime so tile IDs remain valid.
- `shared/tilesheets` - tilesheets required by TMX maps.
- `shared/scene` - cutout sprites used by the farming animation and role cards.
- `shared/sprites` - shared sprite sheets used by UI, village, investment, result, and story screens.

Do not add new MLN122 assets at the old root-level folders. Use the structure above so runtime paths stay predictable.

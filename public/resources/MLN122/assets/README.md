# MLN122 Asset Layout

This folder contains the runtime assets for the MLN122 farm simulation.

## Farm-specific assets

Each farm map owns its TMX file:

- `farms/standard/map.tmx`
- `farms/hilltop/map.tmx`
- `farms/riverland/map.tmx`
- `farms/forest/map.tmx`
- `farms/wilderness/map.tmx`
- `farms/four-corners/map.tmx`
- `farms/beach/map.tmx`

Put assets here only when they belong to one farm and should not be reused by
other maps. Generated map data for the ranching/beach viewport also lives under
`farms/beach/`.

## Shared assets

Reusable assets live under `shared/`:

- `shared/tilesheets/`: TMX tilesheet PNGs used by all farm maps.
- `shared/scene/characters/`: workers, role portraits, manager, landlord, capitalist.
- `shared/scene/crops/`: soil and crop state sprites.
- `shared/scene/animals/`: decorative farm animals.
- `shared/scene/effects/`: shared visual effects.
- `shared/scene/objects/`: tools and object sprites.
- `shared/scene/map-tiles/`: pre-cropped tiles used by the static ranching scene.

## Legacy assets

`../asset/` is kept for older UI and preview components that still reference the
original extracted PNG names. New runtime map and scene code should prefer this
`assets/` folder.

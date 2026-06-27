import type { Plot } from "./game-model";

const ASSET_BASE = "/resources/MLN122/asset";
type PlotArt = Pick<Plot, "soil" | "crop" | "mapAsset" | "buildingAsset">;

type AssetImageProps = {
  image: string;
  alt: string;
  className: string;
};

export function assetUrl(image: string) {
  return `${ASSET_BASE}/${encodeURIComponent(image)}`;
}

export function AssetImage({ image, alt, className }: AssetImageProps) {
  return (
    <img
      src={assetUrl(image)}
      alt={alt}
      className={`${className} [image-rendering:pixelated]`}
      draggable={false}
    />
  );
}

export function PixelVillage({ hero = false }: { hero?: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full max-w-4xl overflow-hidden border-4 border-[#0b1209] bg-[#9ed7ef] shadow-[6px_6px_0_#0b1209] ${
        hero ? "min-h-[280px]" : "min-h-[170px]"
      }`}
    >
      <AssetImage
        image="LooseSprites__stardewPanorama.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#20361d]/35 to-transparent" />
      <div className="relative grid h-full min-h-[inherit] grid-cols-3 items-end gap-4 p-5">
        <PlotPixelArt
          plot={{
            soil: "#7a4a2a",
            crop: "#6bbf45",
            mapAsset: "LooseSprites__Farm_ranching_map_summer.png",
            buildingAsset: "Buildings__Barn.png",
          }}
          compact
        />
        <div className="grid justify-items-center gap-3">
          <PixelHouse label="Landlord" asset="Buildings__Barn.png" />
          <AssetImage
            image="LooseSprites__farm_ranching_icon.png"
            alt=""
            className="hidden h-12 w-12 object-contain drop-shadow-[2px_2px_0_#0b1209] md:block"
          />
        </div>
        <PixelMarket />
      </div>
    </div>
  );
}

export function PlotPixelArt({
  plot,
  compact = false,
}: {
  plot: PlotArt;
  compact?: boolean;
}) {
  return (
    <div className="grid gap-2 border-2 border-[#0b1209] bg-[#6aad62] p-2">
      <div className="relative overflow-hidden border-2 border-[#0b1209] bg-[#274a24]">
        <AssetImage
          image={plot.mapAsset}
          alt=""
          className={`w-full object-cover ${compact ? "h-28" : "h-32"}`}
        />
        <div className="absolute inset-0 bg-[#0b1209]/5" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: compact ? 8 : 16 }).map((_, index) => (
          <span
            key={index}
            className="relative h-9 overflow-hidden border border-black/20"
            style={{ backgroundColor: plot.soil }}
          >
            {index % 2 === 0 && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <CropSprite variant={index % 3} />
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function PixelHouse({
  label,
  asset = "Buildings__Big Barn.png",
  small = false,
}: {
  label: string;
  asset?: string;
  small?: boolean;
}) {
  return (
    <div className="grid justify-items-center gap-1">
      <div
        className={`flex items-end justify-center overflow-hidden border-2 border-[#0b1209] bg-[#7fc66a] ${
          small ? "h-16 w-20" : "h-24 w-32"
        }`}
      >
        <AssetImage
          image={asset}
          alt=""
          className="h-full w-full object-contain object-bottom"
        />
      </div>
      <span className="border-2 border-[#0b1209] bg-[#10190d] px-2 py-0.5 text-[10px] font-black uppercase text-[#fff5cf]">
        {label}
      </span>
    </div>
  );
}

export function PixelMarket({ small = false }: { small?: boolean }) {
  return (
    <div className="grid justify-items-center gap-1">
      <div
        className={`relative flex items-end justify-center overflow-hidden border-2 border-[#0b1209] bg-[#f2a65a] ${
          small ? "h-16 w-20" : "h-24 w-32"
        }`}
      >
        <AssetImage
          image="Buildings__Shed.png"
          alt=""
          className="h-full w-full object-contain object-bottom"
        />
        <AssetImage
          image="Buildings__Shipping Bin.png"
          alt=""
          className={`absolute bottom-1 left-1 object-contain ${
            small ? "h-5 w-5" : "h-8 w-8"
          }`}
        />
      </div>
      <span className="border-2 border-[#0b1209] bg-[#10190d] px-2 py-0.5 text-[10px] font-black uppercase text-[#fff5cf]">
        Market
      </span>
    </div>
  );
}

export function CropSprite({ variant }: { variant: number }) {
  const positions = [
    { x: 0, y: 0 },
    { x: -16, y: 0 },
    { x: -32, y: 0 },
  ];
  const position = positions[variant] ?? positions[0];

  return (
    <AssetSprite
      image="TileSheets__crops.png"
      width={16}
      height={32}
      x={position.x}
      y={position.y}
      scale={1.55}
    />
  );
}

export function SeedSprite() {
  return (
    <AssetSprite
      image="TileSheets__crops.png"
      width={16}
      height={16}
      x={0}
      y={0}
      scale={1.8}
    />
  );
}

export function ToolSprite() {
  return (
    <AssetSprite
      image="TileSheets__tools.png"
      width={16}
      height={16}
      x={-16}
      y={-16}
      scale={2}
    />
  );
}

export function WorkerSprite({ delay }: { delay: number }) {
  return (
    <span
      className="relative block h-12 w-7 animate-[walkPixel_1.4s_ease-in-out_infinite]"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 border-2 border-[#0b1209] bg-[#f0bd8a]" />
      <span className="absolute left-1 top-4 h-5 w-5 border-2 border-[#0b1209] bg-[#3767b1]" />
      <span className="absolute bottom-0 left-1 h-3 w-2 bg-[#2d2114]" />
      <span className="absolute bottom-0 right-1 h-3 w-2 bg-[#2d2114]" />
      <style jsx>{`
        @keyframes walkPixel {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </span>
  );
}

export function AnimalSprite({
  image,
  className,
}: {
  image: string;
  className: string;
}) {
  const sprite =
    image === "Animals__Brown Cow.png"
      ? { width: 32, height: 32, x: 0, y: -32, scale: 1.5 }
      : image === "Animals__White Chicken.png"
        ? { width: 16, height: 16, x: 0, y: 0, scale: 1.7 }
        : { width: 32, height: 32, x: 0, y: -32, scale: 1.5 };

  return (
    <span className={className}>
      <AssetSprite
        image={image}
        width={sprite.width}
        height={sprite.height}
        x={sprite.x}
        y={sprite.y}
        scale={sprite.scale}
      />
    </span>
  );
}

export function TreeSprite({
  image = "TerrainFeatures__tree1_spring.png",
  className = "h-24 w-20",
}: {
  image?: string;
  className?: string;
}) {
  return (
    <span className={className}>
      <AssetSprite
        image={image}
        width={48}
        height={80}
        x={0}
        y={0}
        scale={2}
      />
    </span>
  );
}

export function HorseSprite() {
  return (
    <AssetSprite
      image="Animals__horse.png"
      width={32}
      height={32}
      x={0}
      y={-32}
      scale={1.6}
    />
  );
}

export function HayCrateSprite() {
  return (
    <AssetSprite
      image="TileSheets__Craftables.png"
      width={16}
      height={32}
      x={-16}
      y={-336}
      scale={1.7}
    />
  );
}

export function PixelRobot() {
  return (
    <span className="relative block h-12 w-10 animate-pulse">
      <span className="absolute left-1 top-0 h-7 w-8 border-2 border-[#0b1209] bg-[#b9d7e8]" />
      <span className="absolute left-3 top-2 h-2 w-2 bg-[#2d2114]" />
      <span className="absolute right-3 top-2 h-2 w-2 bg-[#2d2114]" />
      <span className="absolute bottom-0 left-0 h-5 w-3 border-2 border-[#0b1209] bg-[#6f8fa3]" />
      <span className="absolute bottom-0 right-0 h-5 w-3 border-2 border-[#0b1209] bg-[#6f8fa3]" />
    </span>
  );
}

function AssetSprite({
  image,
  width,
  height,
  x = 0,
  y = 0,
  scale = 1,
}: {
  image: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <span
      className="block shrink-0 overflow-hidden [image-rendering:pixelated]"
      style={{
        width: width * scale,
        height: height * scale,
      }}
    >
      <span
        className="block origin-top-left [image-rendering:pixelated]"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          backgroundImage: `url(${assetUrl(image)})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${x}px ${y}px`,
        }}
      />
    </span>
  );
}

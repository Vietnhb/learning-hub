"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  GalleryHorizontalEnd,
  Info,
  Landmark,
  MapPin,
  LocateFixed,
  Maximize2,
  Minimize2,
  Minus,
  Network,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";
import type { ArchivePhoto } from "./photos";
import VnrChat from "./VnrChat";
import {
  allNodes,
  entities,
  events,
  links,
  periods,
  type HistoryNode,
  type NodeKind,
} from "./data";

// ---------------------------------------------------------------------------
// Bố cục mạng lưới theo dạng phòng trưng bày:
//   hàng trên  – chân dung nhân vật
//   giữa       – thẻ sự kiện xen kẽ hai bên trục thời gian
//   hàng dưới  – văn kiện và địa danh
// ---------------------------------------------------------------------------

const STEP = 152;
const X0 = 190;
const AXIS_Y = 472;
const CARD_W = 256;
const CARD_H = 224;
const CARD_GAP = 44;
const PERSON_Y = 104;
const CHIP_Y = 806;
const CHIP_W = 224;
const WORLD_H = 866;
const WORLD_W = X0 * 2 + STEP * (events.length - 1);

const LANES = [
  { label: "Nhân vật", y: PERSON_Y + 20, icon: User },
  { label: "Sự kiện", y: AXIS_Y, icon: Landmark },
  { label: "Văn kiện · Địa danh", y: CHIP_Y, icon: FileText },
];

const KIND_LABEL: Record<NodeKind, string> = {
  event: "Sự kiện",
  person: "Nhân vật",
  document: "Văn kiện",
  place: "Địa danh",
};

const KIND_ICON = {
  event: Landmark,
  person: User,
  document: FileText,
  place: MapPin,
} as const;

const periodById = Object.fromEntries(periods.map((p) => [p.id, p]));
const nodeById = Object.fromEntries(allNodes.map((n) => [n.id, n]));

interface Placed {
  x: number;
  y: number;
  /** Điểm neo để vẽ liên kết tới nhân vật, văn kiện, địa danh */
  anchorY: number;
  above?: boolean;
}

function computeLayout(): Record<string, Placed> {
  const pos: Record<string, Placed> = {};
  events.forEach((event, index) => {
    const above = index % 2 === 0;
    const top = above ? AXIS_Y - CARD_GAP - CARD_H : AXIS_Y + CARD_GAP;
    pos[event.id] = {
      x: X0 + index * STEP,
      y: top,
      anchorY: above ? top : top + CARD_H,
      above,
    };
  });

  // Đặt nhân vật / văn kiện / địa danh ở trung bình vị trí các sự kiện liên quan,
  // rồi đẩy lần lượt sang phải để không chồng lên nhau.
  const lanes: Record<"person" | "chip", { id: string; x: number }[]> = { person: [], chip: [] };
  for (const entity of entities) {
    const xs = links
      .filter((l) => l.from === entity.id || l.to === entity.id)
      .map((l) => (l.from === entity.id ? l.to : l.from))
      .filter((id) => nodeById[id]?.kind === "event")
      .map((id) => pos[id].x);
    const x = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : X0;
    lanes[entity.kind === "person" ? "person" : "chip"].push({ id: entity.id, x });
  }

  for (const [lane, items] of Object.entries(lanes)) {
    const gap = lane === "person" ? 168 : CHIP_W + 26;
    items.sort((a, b) => a.x - b.x);
    for (let i = 1; i < items.length; i += 1) {
      items[i].x = Math.max(items[i].x, items[i - 1].x + gap);
    }
    for (const item of items) {
      const y = lane === "person" ? PERSON_Y : CHIP_Y;
      pos[item.id] = {
        x: Math.min(item.x, WORLD_W - X0 / 2),
        y,
        anchorY: lane === "person" ? PERSON_Y + 78 : CHIP_Y - 24,
      };
    }
  }
  return pos;
}

function normalize(text: string) {
  return text
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

const allPhotos: ArchivePhoto[] = Array.from(
  new Map(
    allNodes.flatMap((n) => n.photos ?? []).map((p) => [p.src, p]),
  ).values(),
);

// ---------------------------------------------------------------------------

type View = { x: number; y: number; k: number };
type Mode = "graph" | "gallery";

export default function HistoryMuseum() {
  const layout = useMemo(computeLayout, []);
  const [mode, setMode] = useState<Mode>("graph");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [kinds, setKinds] = useState<Record<NodeKind, boolean>>({
    event: true,
    person: true,
    document: true,
    place: true,
  });
  const [lightbox, setLightbox] = useState<ArchivePhoto | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 0.62 });
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);

  const neighbors = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const l of links) {
      (map[l.from] ??= new Set()).add(l.to);
      (map[l.to] ??= new Set()).add(l.from);
    }
    return map;
  }, []);

  const matches = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return null;
    return new Set(
      allNodes
        .filter((n) => normalize(`${n.title} ${n.date} ${n.summary}`).includes(q))
        .map((n) => n.id),
    );
  }, [query]);

  const activeId = selectedId ?? hoverId;
  const focusSet = useMemo(() => {
    if (!activeId) return null;
    return new Set([activeId, ...Array.from(neighbors[activeId] ?? [])]);
  }, [activeId, neighbors]);

  // Màn hình hẹp mở sẵn Phòng trưng bày, dễ đọc hơn mạng lưới
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setMode("gallery");
  }, []);

  const isVisible = useCallback((n: HistoryNode) => kinds[n.kind], [kinds]);

  // Kích thước khung và vị trí ban đầu
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode]);

  const fitK = Math.max(0.55, Math.min(1.15, (size.h - 56) / WORLD_H));

  // Căn khung toàn cảnh một lần khi đo được kích thước thật của khung
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || size.w === 0) return;
    fitted.current = true;
    setView({ x: 70, y: Math.max(6, (size.h - 50 - WORLD_H * fitK) / 2), k: fitK });
  }, [fitK, size.h, size.w]);

  // Toàn màn hình: khung mạng lưới chiếm trọn màn hình, căn lại toàn cảnh
  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
      fitted.current = false;
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void containerRef.current?.requestFullscreen?.();
  };

  const clampView = useCallback(
    (v: View): View => {
      const k = Math.min(2.2, Math.max(0.3, v.k));
      const minX = size.w - WORLD_W * k - 80;
      const x = Math.min(120, Math.max(minX, v.x));
      const worldH = WORLD_H * k;
      const y =
        worldH <= size.h
          ? Math.min(size.h - worldH + 60, Math.max(-60, v.y))
          : Math.min(60, Math.max(size.h - worldH - 60, v.y));
      return { x, y, k };
    },
    [size.w, size.h],
  );

  // Cuộn chuột: lăn để di chuyển ngang, Ctrl/⌘ + lăn để phóng to
  useEffect(() => {
    const el = containerRef.current;
    if (!el || mode !== "graph") return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      setView((v) => {
        if (e.ctrlKey || e.metaKey) {
          const k = Math.min(2.2, Math.max(0.3, v.k * Math.exp(-e.deltaY * 0.0022)));
          const px = e.clientX - rect.left;
          const py = e.clientY - rect.top;
          return clampView({
            k,
            x: px - ((px - v.x) / v.k) * k,
            y: py - ((py - v.y) / v.k) * k,
          });
        }
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        return clampView({ ...v, x: v.x - delta });
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampView, mode]);

  const zoomBy = (factor: number) =>
    setView((v) => {
      const k = Math.min(2.2, Math.max(0.3, v.k * factor));
      const cx = size.w / 2;
      const cy = size.h / 2;
      return clampView({ k, x: cx - ((cx - v.x) / v.k) * k, y: cy - ((cy - v.y) / v.k) * k });
    });

  const centerOn = useCallback(
    (id: string) => {
      const p = layout[id];
      if (!p) return;
      setView((v) =>
        clampView({ ...v, x: size.w * 0.38 - p.x * v.k, y: size.h / 2 - AXIS_Y * v.k }),
      );
    },
    [clampView, layout, size.h, size.w],
  );

  const jumpToPeriod = (periodId: string) => {
    const first = events.find((e) => e.period === periodId);
    if (!first) return;
    fitted.current = true;
    setView((v) => clampView({ ...v, x: -(layout[first.id].x - STEP) * v.k }));
  };

  const select = (id: string, recenter = false) => {
    setSelectedId(id);
    if (recenter && mode === "graph") centerOn(id);
  };

  // Phím tắt: Esc để đóng, ← → để chuyển sự kiện
  const selected = selectedId ? nodeById[selectedId] : null;
  const eventIndex = selected?.kind === "event" ? events.findIndex((e) => e.id === selected.id) : -1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else setSelectedId(null);
      }
      if (eventIndex < 0 || lightbox) return;
      if (e.key === "ArrowRight" && eventIndex < events.length - 1) {
        setSelectedId(events[eventIndex + 1].id);
        if (mode === "graph") centerOn(events[eventIndex + 1].id);
      }
      if (e.key === "ArrowLeft" && eventIndex > 0) {
        setSelectedId(events[eventIndex - 1].id);
        if (mode === "graph") centerOn(events[eventIndex - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [centerOn, eventIndex, lightbox, mode]);

  const periodBands = useMemo(
    () =>
      periods.map((period) => {
        const xs = events.filter((e) => e.period === period.id).map((e) => layout[e.id].x);
        return { ...period, x1: Math.min(...xs) - STEP / 2, x2: Math.max(...xs) + STEP / 2 };
      }),
    [layout],
  );

  const nodeOpacity = (id: string) => {
    if (focusSet) return focusSet.has(id) ? 1 : 0.22;
    if (matches) return matches.has(id) ? 1 : 0.22;
    return 1;
  };

  const stats = [
    { label: "Sự kiện", value: events.length },
    { label: "Nhân vật", value: entities.filter((e) => e.kind === "person").length },
    { label: "Văn kiện, địa danh", value: entities.filter((e) => e.kind !== "person").length },
    { label: "Ảnh tư liệu", value: allPhotos.length },
  ];

  return (
    <div
      className="min-h-screen bg-[#100e0c] text-[#efe6d6]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% -10%, rgba(176,141,87,0.18), transparent 55%), radial-gradient(ellipse at 90% 10%, rgba(181,68,59,0.12), transparent 50%)",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9b48f] transition hover:text-[#f3d9a4]"
        >
          <ArrowLeft className="h-4 w-4" />
          Tài nguyên
        </Link>

        <header className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#c9a45c]">
              VNR202 · Bảo tàng lịch sử số
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-vnr-serif)] text-4xl font-bold leading-tight text-[#f6eedf] sm:text-5xl lg:text-6xl">
              Mạng lưới sự kiện
              <span className="block text-[#d8b26a]">Lịch sử Đảng Cộng sản Việt Nam</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#cfc3ae]">
              Hơn một thế kỷ lịch sử (1920 – 2021) được kết nối thành mạng lưới tri thức: mỗi sự
              kiện liên hệ với nhân vật, văn kiện, địa danh và các sự kiện dẫn tới nó. Chọn một
              điểm bất kỳ để mở hiện vật.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#3a3128] bg-[#3a3128]">
            {stats.map((s) => (
              <div key={s.label} className="bg-[#16130f] px-5 py-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-[#9d8f78]">{s.label}</dt>
                <dd className="mt-1 font-[family-name:var(--font-vnr-serif)] text-3xl font-bold text-[#f3d9a4]">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-[#3a3128] bg-[#16130f]/80 px-4 py-3 text-sm leading-6 text-[#bfb29c]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a45c]" />
          <p>
            Mọi hình ảnh là ảnh tư liệu gốc hoặc ảnh chụp hiện vật, di tích, giữ nguyên trạng (không
            tô màu, không tạo bằng AI). Mỗi ảnh ghi rõ thời điểm chụp và nơi lưu giữ gốc
            (lưu trữ quốc gia, bảo tàng, thông tấn xã…); ảnh tái hiện hoặc ảnh chụp sau sự kiện đều được ghi chú.
          </p>
        </div>

        {/* Thanh điều khiển */}
        <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex w-fit rounded-lg border border-[#3a3128] bg-[#16130f] p-1">
            {(
              [
                { id: "graph", label: "Mạng lưới", icon: Network },
                { id: "gallery", label: "Phòng trưng bày", icon: GalleryHorizontalEnd },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  mode === m.id
                    ? "bg-[#c9a45c] text-[#1a140c]"
                    : "text-[#cfc3ae] hover:text-[#f6eedf]"
                }`}
              >
                <m.icon className="h-4 w-4" />
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {mode === "graph" && (
              <div className="flex flex-wrap gap-2">
                {(Object.keys(KIND_LABEL) as NodeKind[]).map((kind) => {
                  const Icon = KIND_ICON[kind];
                  return (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => setKinds((k) => ({ ...k, [kind]: !k[kind] }))}
                      aria-pressed={kinds[kind]}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition ${
                        kinds[kind]
                          ? "border-[#c9a45c]/60 bg-[#c9a45c]/10 text-[#f3d9a4]"
                          : "border-[#3a3128] text-[#7d715f]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {KIND_LABEL[kind]}
                    </button>
                  );
                })}
              </div>
            )}
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f826d]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm sự kiện, nhân vật, năm…"
                className="w-full rounded-lg border border-[#3a3128] bg-[#16130f] py-2 pl-9 pr-3 text-sm text-[#f6eedf] placeholder:text-[#7d715f] focus:border-[#c9a45c] focus:outline-none sm:w-72"
              />
            </label>
          </div>
        </div>

        {/* Các giai đoạn */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                if (mode === "graph") jumpToPeriod(p.id);
                else document.getElementById(`period-${p.id}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="shrink-0 rounded-md border border-[#3a3128] bg-[#16130f] px-3 py-2 text-left transition hover:border-[#c9a45c]/70"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-[#f3d9a4]">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                {p.range}
              </span>
              <span className="mt-0.5 block text-xs text-[#a89a83]">{p.label}</span>
            </button>
          ))}
        </div>
        {matches && (
          <p className="mt-3 text-sm text-[#bfb29c]">
            Tìm thấy {matches.size} kết quả cho “{query.trim()}”.
          </p>
        )}
      </div>

      {mode === "graph" ? (
        <section className="px-2 pb-10 sm:px-4">
          <div
            ref={containerRef}
            className="relative mx-auto h-[72vh] min-h-[480px] touch-none select-none overflow-hidden rounded-xl border border-[#3a3128] bg-[#0c0a08] sm:h-[calc(100vh-32px)] sm:min-h-[680px] [&:fullscreen]:h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
            style={{
              cursor: drag.current?.moved ? "grabbing" : "grab",
              backgroundImage:
                "radial-gradient(rgba(201,164,92,0.09) 1px, transparent 1px)",
              backgroundSize: `${28 * view.k}px ${28 * view.k}px`,
              backgroundPosition: `${view.x}px ${view.y}px`,
            }}
            onPointerDown={(e) => {
              drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d) return;
              const dx = e.clientX - d.x;
              const dy = e.clientY - d.y;
              if (!d.moved && Math.hypot(dx, dy) > 4) {
                d.moved = true;
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }
              if (d.moved) setView((v) => clampView({ ...v, x: d.vx + dx, y: d.vy + dy }));
            }}
            onPointerUp={() => {
              setTimeout(() => (drag.current = null), 0);
            }}
            onPointerCancel={() => (drag.current = null)}
          >
            <svg width={size.w} height={size.h} className="block">
              <defs>
                <style>{`
                  .vnr-flow { stroke-dasharray: 7 7; animation: vnr-flow 0.9s linear infinite; }
                  @keyframes vnr-flow { to { stroke-dashoffset: -14; } }
                  .vnr-pulse { transform-box: fill-box; transform-origin: center; animation: vnr-pulse 1.8s ease-out infinite; }
                  @keyframes vnr-pulse { from { transform: scale(1); opacity: 0.9; } to { transform: scale(3.2); opacity: 0; } }
                `}</style>
                <linearGradient id="axis-gradient" gradientUnits="userSpaceOnUse" x1={0} x2={WORLD_W} y1={0} y2={0}>
                  {periodBands.flatMap((band) => [
                    <stop key={`${band.id}-a`} offset={band.x1 / WORLD_W} stopColor={band.color} />,
                    <stop key={`${band.id}-b`} offset={band.x2 / WORLD_W} stopColor={band.color} />,
                  ])}
                </linearGradient>
                {periodBands.map((band) => (
                  <linearGradient key={band.id} id={`band-${band.id}`} x1={0} x2={0} y1={0} y2={1}>
                    <stop offset="0" stopColor={band.color} stopOpacity={0.2} />
                    <stop offset="0.5" stopColor={band.color} stopOpacity={0.07} />
                    <stop offset="1" stopColor={band.color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#e7c98a" />
                </marker>
              </defs>
              <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
                {/* Các phòng trưng bày theo giai đoạn */}
                {periodBands.map((band) => (
                  <g key={band.id}>
                    <rect x={band.x1} y={0} width={band.x2 - band.x1} height={WORLD_H} fill={`url(#band-${band.id})`} />
                    <text
                      x={band.x2 - 24}
                      y={WORLD_H - 120}
                      textAnchor="end"
                      fontSize={190}
                      fontWeight={700}
                      fontFamily="var(--font-vnr-serif)"
                      fill={band.color}
                      opacity={0.07}
                    >
                      {band.range.slice(0, 4)}
                    </text>
                    <line x1={band.x1} x2={band.x1} y1={0} y2={WORLD_H} stroke={band.color} strokeOpacity={0.45} strokeDasharray="2 10" />
                    <rect x={band.x1} y={0} width={band.x2 - band.x1} height={6} fill={band.color} />
                    <text x={band.x1 + 18} y={34} fill={band.color} fontSize={15} fontWeight={800} letterSpacing={3}>
                      {band.range}
                    </text>
                    <text x={band.x1 + 18} y={56} fill="#efe6d6" fontSize={17} fontFamily="var(--font-vnr-serif)" fontWeight={600}>
                      {band.label}
                    </text>
                  </g>
                ))}

                {/* Trục thời gian nhiều màu theo giai đoạn */}
                <rect x={X0 - 110} y={AXIS_Y - 3} width={WORLD_W - 2 * X0 + 220} height={6} rx={3} fill="url(#axis-gradient)" opacity={0.9} />
                {kinds.event &&
                  events.map((e) => {
                    const p = layout[e.id];
                    const color = periodById[e.period].color;
                    const stemTo = p.above ? p.y + CARD_H : p.y;
                    const active = selectedId === e.id;
                    return (
                      <g key={`tick-${e.id}`} opacity={nodeOpacity(e.id) < 1 ? 0.35 : 1}>
                        <line x1={p.x} x2={p.x} y1={AXIS_Y} y2={stemTo} stroke={color} strokeWidth={2} strokeOpacity={0.7} />
                        {active && <circle cx={p.x} cy={AXIS_Y} r={7} fill={color} className="vnr-pulse" />}
                        <circle cx={p.x} cy={AXIS_Y} r={7} fill="#0c0a08" stroke={color} strokeWidth={3} />
                        <circle cx={p.x} cy={AXIS_Y} r={2.5} fill="#f3d9a4" />
                      </g>
                    );
                  })}

                {/* Quan hệ nhân quả giữa các sự kiện: cung nhỏ bám theo trục */}
                {kinds.event &&
                  links.map((l, i) => {
                    if (nodeById[l.from].kind !== "event" || nodeById[l.to].kind !== "event") return null;
                    const x1 = layout[l.from].x;
                    const x2 = layout[l.to].x;
                    const steps = Math.round(Math.abs(x2 - x1) / STEP);
                    const up = steps <= 1;
                    const h = Math.min(36, 14 + steps * 7) * (up ? -1 : 1);
                    const sx = x1 + 10;
                    const ex = x2 - 10;
                    const hot = !!activeId && (l.from === activeId || l.to === activeId);
                    const dim = !!activeId && !hot;
                    return (
                      <g key={`arc-${i}`}>
                        <path
                          d={`M${sx} ${AXIS_Y} Q${(sx + ex) / 2} ${AXIS_Y + h * 2} ${ex} ${AXIS_Y}`}
                          fill="none"
                          stroke={hot ? "#f3d9a4" : "#e7c98a"}
                          strokeWidth={hot ? 3 : 1.6}
                          strokeOpacity={hot ? 1 : dim ? 0.08 : 0.5}
                          markerEnd="url(#arrow)"
                          className={hot ? "vnr-flow" : undefined}
                        />
                        {hot && (
                          <text
                            x={(sx + ex) / 2}
                            y={AXIS_Y + h + (up ? -6 : 16)}
                            textAnchor="middle"
                            fontSize={13}
                            fontWeight={600}
                            fill="#f3d9a4"
                            stroke="#0c0a08"
                            strokeWidth={5}
                            paintOrder="stroke"
                          >
                            {l.label}
                          </text>
                        )}
                      </g>
                    );
                  })}

                {/* Thẻ, chân dung, văn kiện, địa danh */}
                {allNodes.filter(isVisible).map((n) => (
                  <GraphNode
                    key={n.id}
                    node={n}
                    pos={layout[n.id]}
                    color={periodById[n.period].color}
                    linkCount={neighbors[n.id]?.size ?? 0}
                    opacity={nodeOpacity(n.id)}
                    selected={selectedId === n.id}
                    highlighted={!!matches?.has(n.id)}
                    onHover={setHoverId}
                    onSelect={(id) => {
                      if (drag.current?.moved) return;
                      select(id);
                    }}
                  />
                ))}

                {/* Liên kết tới nhân vật, văn kiện, địa danh: chỉ hiện khi đang chọn / di chuột */}
                {activeId &&
                  links.map((l, i) => {
                    if (l.from !== activeId && l.to !== activeId) return null;
                    const a = nodeById[l.from];
                    const b = nodeById[l.to];
                    if (a.kind === "event" && b.kind === "event") return null;
                    if (!isVisible(a) || !isVisible(b)) return null;
                    const p1 = layout[l.from];
                    const p2 = layout[l.to];
                    // Thẻ sự kiện nối từ mép gần phía nhân vật (trên) hoặc văn kiện (dưới)
                    const anchor = (node: HistoryNode, p: Placed, other: HistoryNode) =>
                      node.kind === "event" ? (other.kind === "person" ? p.y : p.y + CARD_H) : p.anchorY;
                    const y1 = anchor(a, p1, b);
                    const y2 = anchor(b, p2, a);
                    const my = (y1 + y2) / 2;
                    const color = periodById[(a.kind === "event" ? a : b).period].color;
                    return (
                      <g key={`rel-${i}`}>
                        <path
                          d={`M${p1.x} ${y1} C${p1.x} ${my}, ${p2.x} ${my}, ${p2.x} ${y2}`}
                          fill="none"
                          stroke={color}
                          strokeWidth={6}
                          strokeOpacity={0.25}
                        />
                        <path
                          d={`M${p1.x} ${y1} C${p1.x} ${my}, ${p2.x} ${my}, ${p2.x} ${y2}`}
                          fill="none"
                          stroke="#f3d9a4"
                          strokeWidth={2}
                          className="vnr-flow"
                        />
                        <text
                          x={(p1.x + p2.x) / 2}
                          y={my - 6}
                          textAnchor="middle"
                          fontSize={13}
                          fontWeight={600}
                          fill="#f3d9a4"
                          stroke="#0c0a08"
                          strokeWidth={5}
                          paintOrder="stroke"
                        >
                          {l.label}
                        </text>
                      </g>
                    );
                  })}
              </g>
            </svg>

            {/* Nhãn các làn, bám theo vị trí khung nhìn */}
            {LANES.map((lane) => (
              <div
                key={lane.label}
                className="pointer-events-none absolute left-3 hidden -translate-y-1/2 items-center gap-1.5 rounded-full border border-[#3a3128] bg-[#16130f]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9b48f] shadow-lg backdrop-blur sm:flex"
                style={{ top: view.y + lane.y * view.k }}
              >
                <lane.icon className="h-3 w-3" />
                {lane.label}
              </div>
            ))}

            {/* Điều khiển phóng to */}
            <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-[#3a3128] bg-[#16130f]/95 shadow-lg">
              <button type="button" aria-label="Phóng to" onClick={() => zoomBy(1.25)} className="p-2 text-[#d9ccb5] hover:bg-[#2a231b]">
                <Plus className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Thu nhỏ" onClick={() => zoomBy(0.8)} className="border-y border-[#3a3128] p-2 text-[#d9ccb5] hover:bg-[#2a231b]">
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Về toàn cảnh"
                onClick={() => setView({ x: 70, y: Math.max(6, (size.h - 50 - WORLD_H * fitK) / 2), k: fitK })}
                className="border-b border-[#3a3128] p-2 text-[#d9ccb5] hover:bg-[#2a231b]"
              >
                <LocateFixed className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label={isFullscreen ? "Thoát toàn màn hình" : "Xem toàn màn hình"}
                onClick={toggleFullscreen}
                className="p-2 text-[#d9ccb5] hover:bg-[#2a231b]"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Bản đồ thu nhỏ */}
            <Minimap view={view} size={size} bands={periodBands} onJump={(x) => setView((v) => clampView({ ...v, x: -x * v.k + size.w / 2 }))} />

            <p className="pointer-events-none absolute bottom-4 left-3 hidden max-w-[calc(50%-200px)] rounded-full border border-[#3a3128] bg-[#16130f]/90 px-3 py-1.5 text-xs text-[#a89a83] backdrop-blur xl:block">
              Di chuột vào một mục để thấy liên kết · Kéo để di chuyển · Ctrl + lăn để phóng to
            </p>
          </div>
        </section>
      ) : (
        <Gallery query={matches} onSelect={(id) => select(id)} onOpenPhoto={setLightbox} />
      )}

      <SourceNotes onOpenPhoto={setLightbox} />

      <AnimatePresence>
        {selected && (
          <DetailPanel
            key="panel"
            node={selected}
            onClose={() => setSelectedId(null)}
            onSelect={(id) => select(id, true)}
            onOpenPhoto={setLightbox}
            prev={eventIndex > 0 ? events[eventIndex - 1] : null}
            next={eventIndex >= 0 && eventIndex < events.length - 1 ? events[eventIndex + 1] : null}
          />
        )}
      </AnimatePresence>

      <VnrChat />

      <AnimatePresence>
        {lightbox && <Lightbox key="lightbox" photo={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------

function GraphNode({
  node,
  pos,
  color,
  linkCount,
  opacity,
  selected,
  highlighted,
  onHover,
  onSelect,
}: {
  node: HistoryNode;
  pos: Placed;
  color: string;
  linkCount: number;
  opacity: number;
  selected: boolean;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const photo = node.photos?.[0];
  const dimmed = opacity < 1;
  const glow = selected
    ? `0 0 0 2px #f3d9a4, 0 0 28px ${color}cc`
    : highlighted
      ? `0 0 0 2px #f3d9a4aa`
      : undefined;

  const common = {
    onPointerEnter: () => onHover(node.id),
    onPointerLeave: () => onHover(null),
    onClick: () => onSelect(node.id),
    role: "button",
    tabIndex: 0,
    "aria-label": `${KIND_LABEL[node.kind]}: ${node.title}, ${node.date}`,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onSelect(node.id);
    },
  };
  const fade = {
    opacity,
    filter: dimmed ? "grayscale(0.7)" : undefined,
    transition: "opacity 220ms, filter 220ms",
  };

  if (node.kind === "event") {
    return (
      <foreignObject x={pos.x - CARD_W / 2} y={pos.y} width={CARD_W} height={CARD_H} style={fade} overflow="visible">
        <div
          {...common}
          className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#3a3128] bg-[#17130f] shadow-[0_10px_30px_rgba(0,0,0,0.45)] outline-none transition duration-200 hover:-translate-y-1 hover:border-[#c9a45c]/70"
          style={{ boxShadow: glow, borderTop: `4px solid ${color}` }}
        >
          <div className="relative h-[128px] shrink-0 overflow-hidden">
            {photo && photo.height > photo.width * 1.05 ? (
              // Ảnh dọc (chân dung, văn bản): hiện trọn ảnh trên nền mờ của chính ảnh đó
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt="" aria-hidden draggable={false} loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-md" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt=""
                  draggable={false}
                  loading="lazy"
                  className="relative mx-auto h-full w-auto object-contain transition duration-500 group-hover:scale-105"
                />
              </>
            ) : photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.src}
                alt=""
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                style={{ objectPosition: photo.focus ?? "50% 30%" }}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: `radial-gradient(circle at 30% 20%, ${color}55, transparent 60%), linear-gradient(135deg, ${color}33, #120f0c)` }}
              >
                <span className="font-[family-name:var(--font-vnr-serif)] text-5xl font-bold tracking-tight" style={{ color: `${color}` }}>
                  {node.date.match(/\d{4}/)?.[0]}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17130f] via-transparent to-transparent" />
            <span className="absolute bottom-1.5 left-2.5 rounded-md bg-black/65 px-2 py-0.5 text-[12px] font-bold text-[#f3d9a4] backdrop-blur">
              {node.date}
            </span>
            {(node.photos?.length ?? 0) > 1 && (
              <span className="absolute right-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-[#efe6d6]">
                {node.photos!.length} ảnh
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between px-3 pb-2.5 pt-2">
            <p className="line-clamp-3 font-[family-name:var(--font-vnr-serif)] text-[16px] font-semibold leading-[1.3] text-[#f6eedf]">
              {node.title}
            </p>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color }}>
              {linkCount} liên kết
            </span>
          </div>
        </div>
      </foreignObject>
    );
  }

  if (node.kind === "person") {
    const w = 160;
    return (
      <foreignObject x={pos.x - w / 2} y={pos.y - 44} width={w} height={130} style={fade} overflow="visible">
        <div {...common} className="group flex cursor-pointer flex-col items-center outline-none">
          <div
            className="relative h-[88px] w-[88px] rounded-full p-[3px] transition duration-200 group-hover:scale-105"
            style={{
              background: `conic-gradient(from 200deg, ${color}, #f3d9a4, ${color})`,
              boxShadow: selected ? `0 0 0 3px #f3d9a4, 0 0 30px ${color}` : `0 8px 24px rgba(0,0,0,0.5)`,
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.src}
                alt=""
                draggable={false}
                loading="lazy"
                className="h-full w-full rounded-full object-cover"
                style={{ objectPosition: photo.focus ?? "50% 20%" }}
              />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-full bg-[#1d1813]">
                <User className="h-8 w-8 text-[#8f826d]" />
              </div>
            )}
            <span
              className="absolute -right-1 top-0 grid h-6 min-w-6 place-items-center rounded-full border-2 border-[#0c0a08] px-1 text-[11px] font-bold text-[#1a140c]"
              style={{ background: color }}
            >
              {linkCount}
            </span>
          </div>
          <div className="mt-1.5 rounded-md border border-[#3a3128] bg-[#16130f]/95 px-2.5 py-1 text-center shadow-lg">
            <p className="whitespace-nowrap font-[family-name:var(--font-vnr-serif)] text-[14px] font-bold leading-tight text-[#f6eedf]">
              {node.title.replace("Nguyễn Ái Quốc – ", "")}
            </p>
            <p className="text-[11px] text-[#c9a45c]">{node.date}</p>
          </div>
        </div>
      </foreignObject>
    );
  }

  const Icon = KIND_ICON[node.kind];
  const isDoc = node.kind === "document";
  return (
    <foreignObject x={pos.x - CHIP_W / 2} y={pos.y - 24} width={CHIP_W} height={56} style={fade} overflow="visible">
      <div
        {...common}
        className="flex h-12 cursor-pointer items-center gap-2.5 rounded-full border bg-[#16130f]/95 py-1 pl-1 pr-4 shadow-[0_8px_20px_rgba(0,0,0,0.4)] outline-none transition duration-200 hover:-translate-y-0.5"
        style={{
          borderColor: selected ? "#f3d9a4" : `${color}88`,
          boxShadow: glow,
        }}
      >
        <span
          className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full"
          style={{ background: isDoc ? "#efe2c6" : `${color}33` }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo.src} alt="" draggable={false} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <Icon className="h-5 w-5" style={{ color: isDoc ? "#8a3b2f" : color }} />
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-[family-name:var(--font-vnr-serif)] text-[13px] font-semibold leading-tight text-[#f6eedf]">
            {node.title}
          </span>
          <span className="block text-[11px] leading-tight text-[#a89a83]">
            {KIND_LABEL[node.kind]} · {node.date}
          </span>
        </span>
      </div>
    </foreignObject>
  );
}

function Minimap({
  view,
  size,
  bands,
  onJump,
}: {
  view: View;
  size: { w: number; h: number };
  bands: { id: string; color: string; x1: number; x2: number }[];
  onJump: (worldX: number) => void;
}) {
  const width = Math.min(360, size.w - 32);
  const scale = width / WORLD_W;
  const left = Math.max(0, -view.x / view.k) * scale;
  const span = Math.min(width, (size.w / view.k) * scale);
  return (
    <div
      className="absolute bottom-3 left-1/2 h-8 -translate-x-1/2 cursor-pointer overflow-hidden rounded-md border border-[#3a3128] bg-[#16130f]/95"
      style={{ width }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        onJump((e.clientX - rect.left) / scale);
      }}
      role="slider"
      aria-label="Vị trí trên dòng thời gian"
      aria-valuenow={Math.round(left)}
    >
      {bands.map((b) => (
        <div
          key={b.id}
          className="absolute inset-y-0"
          style={{ left: b.x1 * scale, width: (b.x2 - b.x1) * scale, background: b.color, opacity: 0.35 }}
        />
      ))}
      {events.map((e, i) => (
        <div key={e.id} className="absolute top-1/2 h-1 w-px -translate-y-1/2 bg-[#f3d9a4]/60" style={{ left: (X0 + i * STEP) * scale }} />
      ))}
      <div
        className="absolute inset-y-0 rounded border-2 border-[#f3d9a4]"
        style={{ left, width: Math.max(12, span) }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------

function PhotoFigure({
  photo,
  onOpen,
  compact = false,
}: {
  photo: ArchivePhoto;
  onOpen: (p: ArchivePhoto) => void;
  compact?: boolean;
}) {
  return (
    <figure>
      <button
        type="button"
        onClick={() => onOpen(photo)}
        className="group relative block w-full overflow-hidden rounded-md border border-[#3a3128] bg-[#0c0a08]"
        aria-label={`Xem ảnh lớn: ${photo.caption}`}
      >
        <Image
          src={photo.src}
          alt={photo.caption}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 640px) 440px, 100vw"
          className={`w-full object-contain transition duration-500 group-hover:scale-[1.02] ${compact ? "max-h-56" : "max-h-80"}`}
        />
        <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-[#f3d9a4]">
          {photo.taken}
        </span>
      </button>
      <figcaption className="mt-2 text-sm leading-6 text-[#cfc3ae]">
        {photo.caption}
        {photo.note && (
          <span className="mt-1.5 block rounded border-l-2 border-[#c9a45c] bg-[#c9a45c]/10 px-2.5 py-1.5 text-xs leading-5 text-[#e6d3ad]">
            Ghi chú tư liệu: {photo.note}
          </span>
        )}
        <SourceLine photo={photo} className="mt-1.5 text-[#8f826d]" />
      </figcaption>
    </figure>
  );
}

function SourceLine({ photo, className = "" }: { photo: ArchivePhoto; className?: string }) {
  return (
    <span className={`block text-xs leading-5 ${className}`}>
      <span className="font-semibold text-[#bfae8c]">Nguồn: </span>
      {photo.originUrl ? (
        <a
          href={photo.originUrl}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-dotted underline-offset-2 hover:text-[#f3d9a4]"
        >
          {photo.origin}
          <ExternalLink className="ml-0.5 inline h-3 w-3 align-[-1px]" />
        </a>
      ) : (
        photo.origin
      )}
      {photo.author && <> · Tác giả: {photo.author}</>}
      {photo.license && <> · Giấy phép {photo.license}</>}
      {" · "}
      <a
        href={photo.commonsUrl}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-dotted underline-offset-2 hover:text-[#f3d9a4]"
      >
        bản lưu số
      </a>
    </span>
  );
}

function DetailPanel({
  node,
  onClose,
  onSelect,
  onOpenPhoto,
  prev,
  next,
}: {
  node: HistoryNode;
  onClose: () => void;
  onSelect: (id: string) => void;
  onOpenPhoto: (p: ArchivePhoto) => void;
  prev: HistoryNode | null;
  next: HistoryNode | null;
}) {
  const period = periodById[node.period];
  const Icon = KIND_ICON[node.kind];
  const related = links
    .filter((l) => l.from === node.id || l.to === node.id)
    .map((l) => {
      const otherId = l.from === node.id ? l.to : l.from;
      const outgoing = l.from === node.id;
      return { other: nodeById[otherId], label: l.label, outgoing };
    });

  const groups: Record<string, typeof related> = {};
  for (const r of related) {
    const key =
      r.other.kind === "event" ? (r.outgoing ? "Dẫn tới / tác động" : "Bắt nguồn từ") : KIND_LABEL[r.other.kind];
    (groups[key] ??= []).push(r);
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/50 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.aside
        className="fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[#3a3128] bg-[#14110d] shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[460px] sm:rounded-none sm:border-l sm:border-t-0"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        aria-label={node.title}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#2a231b] bg-[#14110d]/95 px-5 py-3 backdrop-blur">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: period.color }}>
            <Icon className="h-4 w-4" />
            {KIND_LABEL[node.kind]} · {period.range}
          </span>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-md p-1.5 text-[#bfb29c] hover:bg-[#2a231b] hover:text-[#f6eedf]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-8 pt-5">
          <p className="font-semibold text-[#c9a45c]">{node.date}</p>
          <h2 className="mt-1 font-[family-name:var(--font-vnr-serif)] text-2xl font-bold leading-snug text-[#f6eedf]">
            {node.title}
          </h2>
          <p className="mt-1 text-xs text-[#8f826d]">Giai đoạn: {period.label}</p>

          {node.photos?.length ? (
            <div className="mt-5 space-y-5">
              {node.photos.map((p) => (
                <PhotoFigure key={p.src} photo={p} onOpen={onOpenPhoto} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-[#3a3128] px-4 py-3 text-xs leading-5 text-[#8f826d]">
              Chưa có ảnh tư liệu gốc được xác minh nguồn cho mục này, nên không hiển thị ảnh minh họa.
            </div>
          )}

          <p className="mt-5 text-[15px] leading-7 text-[#e2d7c4]">{node.summary}</p>

          {node.significance && (
            <div className="mt-4 rounded-md border border-[#c9a45c]/30 bg-[#c9a45c]/[0.07] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c9a45c]">Ý nghĩa</p>
              <p className="mt-1 text-sm leading-6 text-[#efe6d6]">{node.significance}</p>
            </div>
          )}

          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9d8f78]">{group}</p>
              <ul className="mt-2 space-y-1.5">
                {items.map(({ other, label }) => {
                  const OtherIcon = KIND_ICON[other.kind];
                  return (
                    <li key={other.id + label}>
                      <button
                        type="button"
                        onClick={() => onSelect(other.id)}
                        className="flex w-full items-start gap-3 rounded-md border border-[#2a231b] bg-[#191510] px-3 py-2 text-left transition hover:border-[#c9a45c]/60"
                      >
                        <OtherIcon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: periodById[other.period].color }} />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-[#efe6d6]">{other.title}</span>
                          <span className="block text-xs text-[#9d8f78]">
                            {other.date} · <span className="italic">{label}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {(prev || next) && (
            <div className="mt-8 grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!prev}
                onClick={() => prev && onSelect(prev.id)}
                className="flex items-center gap-1 rounded-md border border-[#3a3128] px-3 py-2 text-left text-xs text-[#cfc3ae] transition enabled:hover:border-[#c9a45c]/60 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="line-clamp-2">{prev?.title ?? "Sự kiện trước"}</span>
              </button>
              <button
                type="button"
                disabled={!next}
                onClick={() => next && onSelect(next.id)}
                className="flex items-center justify-end gap-1 rounded-md border border-[#3a3128] px-3 py-2 text-right text-xs text-[#cfc3ae] transition enabled:hover:border-[#c9a45c]/60 disabled:opacity-30"
              >
                <span className="line-clamp-2">{next?.title ?? "Sự kiện sau"}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

function Lightbox({ photo, onClose }: { photo: ArchivePhoto; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
    >
      <button type="button" onClick={onClose} aria-label="Đóng ảnh" className="absolute right-4 top-4 rounded-md p-2 text-white/80 hover:bg-white/10">
        <X className="h-6 w-6" />
      </button>
      <Image
        src={photo.src}
        alt={photo.caption}
        width={photo.width}
        height={photo.height}
        sizes="100vw"
        className="max-h-[78vh] w-auto max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="mt-4 max-w-3xl text-center text-sm leading-6 text-[#e2d7c4]" onClick={(e) => e.stopPropagation()}>
        <span className="font-semibold text-[#f3d9a4]">{photo.taken}</span> · {photo.caption}
        <SourceLine photo={photo} className="mt-1 text-[#9d8f78]" />
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------

function Gallery({
  query,
  onSelect,
  onOpenPhoto,
}: {
  query: Set<string> | null;
  onSelect: (id: string) => void;
  onOpenPhoto: (p: ArchivePhoto) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      {periods.map((period) => {
        const items = events.filter((e) => e.period === period.id && (!query || query.has(e.id)));
        if (!items.length) return null;
        return (
          <div key={period.id} id={`period-${period.id}`} className="scroll-mt-24 border-t border-[#2a231b] pt-10 first:border-t-0 first:pt-4">
            <div className="flex items-baseline gap-4">
              <span className="font-[family-name:var(--font-vnr-serif)] text-3xl font-bold" style={{ color: period.color }}>
                {period.range}
              </span>
              <h2 className="font-[family-name:var(--font-vnr-serif)] text-xl text-[#efe6d6]">{period.label}</h2>
            </div>
            <ol className="relative mt-6 space-y-5 border-l pl-6 sm:pl-8" style={{ borderColor: `${period.color}66` }}>
              {items.map((event) => {
                const photo = event.photos?.[0];
                return (
                  <li key={event.id} className="relative">
                    <span
                      className="absolute -left-[31px] top-5 h-3 w-3 rounded-full ring-4 ring-[#100e0c] sm:-left-[39px]"
                      style={{ background: period.color }}
                    />
                    <article
                      className={`grid overflow-hidden rounded-lg border border-[#2a231b] bg-[#16130f] transition hover:border-[#c9a45c]/50 ${
                        photo ? "md:grid-cols-[minmax(0,1fr)_280px]" : ""
                      }`}
                    >
                      <div className="p-5">
                        <p className="text-sm font-semibold text-[#c9a45c]">{event.date}</p>
                        <h3 className="mt-1 font-[family-name:var(--font-vnr-serif)] text-xl font-bold leading-snug text-[#f6eedf]">
                          {event.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-[#cfc3ae]">{event.summary}</p>
                        {event.significance && (
                          <p className="mt-2 text-sm italic leading-6 text-[#e6d3ad]">{event.significance}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => onSelect(event.id)}
                          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f3d9a4] hover:underline"
                        >
                          Mở hiện vật và các liên kết
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      {photo && (
                        <div className="border-t border-[#2a231b] bg-[#0c0a08] p-3 md:border-l md:border-t-0">
                          <PhotoFigure photo={photo} onOpen={onOpenPhoto} compact />
                        </div>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
    </section>
  );
}

function SourceNotes({ onOpenPhoto }: { onOpenPhoto: (p: ArchivePhoto) => void }) {
  return (
    <section className="border-t border-[#2a231b] bg-[#0c0a08]">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-[family-name:var(--font-vnr-serif)] text-2xl font-bold text-[#f6eedf]">Kho ảnh tư liệu và nguồn</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-[#bfb29c]">
          Nội dung sự kiện được biên soạn theo giáo trình Lịch sử Đảng Cộng sản Việt Nam và các văn
          kiện Đảng, dừng ở Đại hội XIII (2021). Mỗi ảnh ghi
          rõ nơi lưu giữ hoặc công bố gốc (lưu trữ quốc gia, bảo tàng, thông tấn xã, cơ quan báo
          chí…); bấm vào ảnh để xem lớn, bấm vào tên nguồn để kiểm chứng.
        </p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {allPhotos.map((p) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => onOpenPhoto(p)}
                className="group block w-full overflow-hidden rounded-md border border-[#2a231b] text-left"
              >
                <Image
                  src={p.src}
                  alt={p.caption}
                  width={p.width}
                  height={p.height}
                  sizes="200px"
                  className="aspect-[4/3] w-full object-cover opacity-90 transition group-hover:opacity-100"
                />
                <span className="block px-2 py-1.5 text-[11px] leading-4 text-[#9d8f78]">
                  <span className="font-semibold text-[#c9a45c]">{p.taken}</span> · {p.origin}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

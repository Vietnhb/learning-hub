/**
 * UI Components for MLN122 Pixel Farm Game
 * Consistent, polished UI elements with pixel aesthetic
 */

import { type ReactNode } from "react";
import { CoinIcon } from "./pixel-components";

// ===== LAYOUT COMPONENTS =====

interface ScreenHeadingProps {
  eyebrow: string;
  title: string;
  text: string;
}

export function ScreenHeading({ eyebrow, title, text }: ScreenHeadingProps) {
  return (
    <div className="screen-heading">
      <p className="pixel-eyebrow">{eyebrow}</p>
      <h2 className="pixel-heading mt-2 text-3xl md:text-4xl">{title}</h2>
      <p className="pixel-text mt-2 max-w-3xl text-sm">{text}</p>
    </div>
  );
}

// ===== CARD COMPONENTS =====

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  text: string;
  color?: string;
}

export function RoleCard({ icon, title, text, color = "#10190d" }: RoleCardProps) {
  return (
    <div 
      className="pixel-card grid gap-3 p-4"
      style={{ backgroundColor: color }}
    >
      <span className="flex h-12 w-12 items-center justify-center border-2 border-[#0b1209] bg-[#f5cf72] text-[#2d2114]">
        {icon}
      </span>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="pixel-text text-sm">{text}</p>
    </div>
  );
}

// ===== INFO COMPONENTS =====

interface InfoTileProps {
  icon: ReactNode;
  title: string;
  text: string;
}

export function InfoTile({ icon, title, text }: InfoTileProps) {
  return (
    <div className="grid gap-2 rounded-none border-3 border-[#0b1209] bg-[#10190d] p-3 shadow-[3px_3px_0_#0b1209]">
      <div className="flex items-center gap-2">
        {icon}
      </div>
      <h4 className="text-sm font-black text-white">{title}</h4>
      <p className="text-xs leading-relaxed text-[#fff5cf]/70">{text}</p>
    </div>
  );
}

// ===== METRIC COMPONENTS =====

interface MetricProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export function Metric({ label, value, icon }: MetricProps) {
  return (
    <div className="metric-box border-2 border-[#0b1209] bg-[#10190d]/80 p-2 text-center">
      {icon && <div className="mx-auto mb-1 flex justify-center">{icon}</div>}
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#f5cf72]">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-base font-black text-white">
        {value}
      </p>
    </div>
  );
}

interface ResultLineProps {
  label: string;
  value: string | number;
  highlight?: boolean;
  icon?: ReactNode;
}

export function ResultLine({ label, value, highlight = false, icon }: ResultLineProps) {
  return (
    <div
      className={`result-metric flex items-center justify-between gap-3 ${
        highlight ? "highlight" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-bold text-[#fff5cf]/90">{label}</span>
      </div>
      <span className="result-value">{value}</span>
    </div>
  );
}

interface RentBoxProps {
  title: string;
  value: number;
  text: string;
}

export function RentBox({ title, value, text }: RentBoxProps) {
  return (
    <div className="grid gap-2 border-4 border-[#0b1209] bg-[#20361d] p-4 shadow-[4px_4px_0_#0b1209]">
      <h3 className="text-base font-black text-[#f5cf72]">{title}</h3>
      <div className="flex items-center gap-2">
        <CoinIcon scale={2} />
        <p className="font-mono text-2xl font-black text-white">{value}c</p>
      </div>
      <p className="text-xs leading-relaxed text-[#fff5cf]/75">{text}</p>
    </div>
  );
}

interface SummaryStatProps {
  label: string;
  value: string;
}

export function SummaryStat({ label, value }: SummaryStatProps) {
  return (
    <div className="grid gap-2 border-4 border-[#0b1209] bg-[#2d4c28] p-4 text-center shadow-[5px_5px_0_#0b1209]">
      <p className="text-[11px] font-black uppercase tracking-wide text-[#f5cf72]">
        {label}
      </p>
      <p className="font-mono text-3xl font-black text-white">{value}</p>
    </div>
  );
}

// ===== INPUT COMPONENTS =====

interface StepperProps {
  icon: ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function Stepper({ icon, label, value, min, max, onChange }: StepperProps) {
  return (
    <div className="grid gap-2 border-4 border-[#0b1209] bg-[#10190d] p-4 shadow-[4px_4px_0_#0b1209]">
      <div className="flex items-center gap-2 text-[#f5cf72]">
        {icon}
        <h3 className="text-sm font-black">{label}</h3>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="pixel-button h-10 w-10 rounded-none border-2 border-[#0b1209] bg-[#d94b35] font-black text-white hover:bg-[#ef634b] disabled:opacity-40"
        >
          −
        </button>
        <span className="flex-1 text-center font-mono text-2xl font-black text-white">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="pixel-button h-10 w-10 rounded-none border-2 border-[#0b1209] bg-[#7fc66a] font-black text-[#0b1209] hover:bg-[#9ed7ef] disabled:opacity-40"
        >
          +
        </button>
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-bold text-[#fff5cf]/50">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}

interface ToggleOptionProps {
  icon: ReactNode;
  title: string;
  text: string;
  active: boolean;
  onToggle: () => void;
  cost?: number;
}

export function ToggleOption({ icon, title, text, active, onToggle, cost }: ToggleOptionProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`pixel-card grid gap-3 p-4 text-left transition-all ${
        active
          ? "border-[#f5cf72] bg-[#20361d]"
          : "border-[#0b1209] bg-[#10190d] opacity-75 hover:opacity-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-12 w-12 items-center justify-center border-2 ${
            active
              ? "border-[#f5cf72] bg-[#f5cf72] text-[#2d2114]"
              : "border-[#0b1209] bg-[#263f22] text-[#fff5cf]/60"
          }`}
        >
          {icon}
        </span>
        {cost !== undefined && (
          <div className="flex items-center gap-1 border-2 border-[#0b1209] bg-[#f5cf72] px-2 py-1">
            <CoinIcon scale={1} />
            <span className="font-mono text-sm font-black text-[#2d2114]">{cost}</span>
          </div>
        )}
      </div>
      <h3 className="text-base font-black text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-[#fff5cf]/75">{text}</p>
      <div className="mt-1 text-right">
        <span
          className={`rounded-none border-2 px-3 py-1 text-[10px] font-black uppercase ${
            active
              ? "border-[#f5cf72] bg-[#f5cf72] text-[#2d2114]"
              : "border-[#0b1209] bg-[#263f22] text-[#fff5cf]/50"
          }`}
        >
          {active ? "Kích hoạt" : "Không kích hoạt"}
        </span>
      </div>
    </button>
  );
}

// ===== PANEL COMPONENTS =====

interface PanelLineProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function PanelLine({ label, value, icon }: PanelLineProps) {
  return (
    <div className="flex items-center justify-between border-b-2 border-[#2d2114]/30 pb-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-bold text-[#2d2114]/90">{label}</span>
      </div>
      <span className="font-mono text-sm font-black text-[#2d2114]">{value}</span>
    </div>
  );
}

// ===== THEORY COMPONENTS =====

interface TheoryNoteProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function TheoryNote({ children, icon }: TheoryNoteProps) {
  return (
    <div className="theory-note">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-[#0b1209] bg-[#f5cf72] text-[#2d2114]">
            {icon}
          </span>
        )}
        <p className="text-sm leading-relaxed text-[#fff5cf]/90">{children}</p>
      </div>
    </div>
  );
}

interface TheoryStepProps {
  number: number;
  text: string;
}

export function TheoryStep({ number, text }: TheoryStepProps) {
  return (
    <div className="grid grid-cols-[42px_1fr] gap-3 border-4 border-[#0b1209] bg-[#10190d] p-4 shadow-[4px_4px_0_#0b1209]">
      <span className="flex h-10 w-10 items-center justify-center border-2 border-[#0b1209] bg-[#f5cf72] font-mono font-black text-[#2d2114]">
        {number}
      </span>
      <p className="text-sm leading-relaxed text-[#fff5cf]/85">{text}</p>
    </div>
  );
}

// ===== LOADING & ERROR =====

export function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#182614]">
      <div className="pixel-loading" />
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="border-4 border-[#d94b35] bg-[#d94b35]/10 p-4 shadow-[4px_4px_0_#0b1209]">
      <p className="text-sm font-bold text-[#d94b35]">{message}</p>
    </div>
  );
}

/**
 * Character Test Component
 * Debug tool to verify sprite cutting
 */

"use client";

import { useState } from "react";
import { LayeredCharacter, WorkerCharacter, SpriteSheetViewer } from "./character-composer";

export function CharacterDebugPanel() {
  const [shirtIndex, setShirtIndex] = useState(0);
  const [pantsIndex, setPantsIndex] = useState(0);
  const [gender, setGender] = useState<"male" | "female">("male");

  return (
    <div className="character-debug-panel fixed bottom-4 right-4 z-50 w-96 border-4 border-[#0b1209] bg-[#20361d] p-4 shadow-xl">
      <h3 className="mb-3 text-lg font-black text-[#f5cf72]">Character Debug</h3>
      
      {/* Preview */}
      <div className="mb-4 flex justify-center border-2 border-[#0b1209] bg-[#6aad62] p-4">
        <LayeredCharacter
          gender={gender}
          shirtIndex={shirtIndex}
          pantsIndex={pantsIndex}
          scale={4}
        />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-white">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female")}
            className="w-full rounded border-2 border-[#0b1209] bg-[#10190d] p-2 text-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-white">
            Shirt: {shirtIndex}
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={shirtIndex}
            onChange={(e) => setShirtIndex(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-white">
            Pants: {pantsIndex}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={pantsIndex}
            onChange={(e) => setPantsIndex(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Worker Variants */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-bold text-white">Worker Variants:</p>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((v) => (
            <div key={v} className="text-center">
              <div className="border-2 border-[#0b1209] bg-[#6aad62] p-1">
                <WorkerCharacter gender="male" variant={v} scale={1.5} />
              </div>
              <p className="mt-1 text-[10px] text-white">V{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sprite Sheet Raw View */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-bold text-white">Raw Sprite (16×32):</p>
        <div className="border-2 border-red-500 bg-white p-2">
          <SpriteSheetViewer
            sheet={gender === "male" 
              ? "Characters__Farmer__farmer_base.png"
              : "Characters__Farmer__farmer_girl_base.png"}
            spriteWidth={16}
            spriteHeight={32}
            row={0}
            col={0}
            scale={3}
          />
        </div>
        <p className="mt-1 text-[10px] text-white">
          Base character sprite (standing down)
        </p>
      </div>
    </div>
  );
}

/**
 * Simple toggle button for debug panel
 */
export function CharacterDebugToggle() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="fixed bottom-4 right-4 z-40 border-2 border-[#0b1209] bg-[#f5cf72] px-4 py-2 text-sm font-black text-[#2d2114] shadow-lg hover:bg-[#ffe08c]"
      >
        {show ? "Hide" : "Show"} Character Debug
      </button>
      {show && <CharacterDebugPanel />}
    </>
  );
}

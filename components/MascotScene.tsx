"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type LoadState = "loading" | "ready" | "error";
type WaveRig = {
  shoulder: THREE.Object3D;
  arm: THREE.Object3D;
  forearm: THREE.Object3D;
  palm: THREE.Object3D;
  base: Map<THREE.Object3D, THREE.Quaternion>;
};
type LookRig = {
  neck: THREE.Object3D;
  head: THREE.Object3D;
  base: Map<THREE.Object3D, THREE.Quaternion>;
};
type ArmPose = {
  shoulder: [number, number, number];
  arm: [number, number, number];
  forearm: [number, number, number];
  palm: [number, number, number];
};

function findObjectByName(root: THREE.Object3D, name: string) {
  return root.getObjectByName(name) ?? null;
}

function applyLocalRotation(
  object: THREE.Object3D,
  base: THREE.Quaternion,
  x: number,
  y: number,
  z: number,
) {
  const delta = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(x, y, z, "XYZ"),
  );

  object.quaternion.copy(base).multiply(delta);
}

function lerpPose(a: ArmPose, b: ArmPose, amount: number): ArmPose {
  const lerpTuple = (
    from: [number, number, number],
    to: [number, number, number],
  ): [number, number, number] => [
    THREE.MathUtils.lerp(from[0], to[0], amount),
    THREE.MathUtils.lerp(from[1], to[1], amount),
    THREE.MathUtils.lerp(from[2], to[2], amount),
  ];

  return {
    shoulder: lerpTuple(a.shoulder, b.shoulder),
    arm: lerpTuple(a.arm, b.arm),
    forearm: lerpTuple(a.forearm, b.forearm),
    palm: lerpTuple(a.palm, b.palm),
  };
}

export function MascotScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 1.2, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-label", "Learning Hub mascot 3D");
    renderer.domElement.className = "h-full w-full";
    mount.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.8, 4.8, 5.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9ec5ff, 1.4);
    fillLight.position.set(-4, 2.5, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd166, 1.2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x18346b, 1.8));

    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    let waveRig: WaveRig | null = null;
    let lookRig: LookRig | null = null;
    let frameId = 0;
    let disposed = false;

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const fitModel = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxAxis = Math.max(size.x, size.y, size.z) || 1;
      const scale = 2.95 / maxAxis;

      object.position.sub(center);
      object.scale.setScalar(scale);
      object.position.y -= size.y * scale * 0.08;

      camera.position.set(0, 0.75, 4.6);
      camera.lookAt(0, 0.55, 0);
    };

    loader.load(
      "/mascot.glb",
      (gltf) => {
        if (disposed) return;

        modelRoot.add(gltf.scene);
        fitModel(gltf.scene);
        modelRoot.rotation.y = -0.18;

        const shoulder = findObjectByName(gltf.scene, "shoulder.R_039");
        const arm = findObjectByName(gltf.scene, "arm.R_040");
        const forearm = findObjectByName(gltf.scene, "forearm.R_041");
        const palm = findObjectByName(gltf.scene, "palm.R_042");
        const neck = findObjectByName(gltf.scene, "neck_010");
        const head = findObjectByName(gltf.scene, "head_011");

        if (shoulder && arm && forearm && palm) {
          const parts = [shoulder, arm, forearm, palm];
          waveRig = {
            shoulder,
            arm,
            forearm,
            palm,
            base: new Map(parts.map((part) => [part, part.quaternion.clone()])),
          };
        }

        if (neck && head) {
          const parts = [neck, head];
          lookRig = {
            neck,
            head,
            base: new Map(parts.map((part) => [part, part.quaternion.clone()])),
          };
        }

        setLoadState("ready");
      },
      undefined,
      (error) => {
        console.error("Failed to load mascot.glb", error);
        setLoadState("error");
      },
    );

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      modelRoot.rotation.y = -0.18 + Math.sin(elapsed * 1.2) * 0.035;
      modelRoot.position.y = Math.sin(elapsed * 2) * 0.025;

      if (waveRig) {
        const cycle = elapsed % 3.2;
        const waveWindow =
          cycle < 2.45
            ? THREE.MathUtils.smoothstep(cycle, 0.15, 0.55) *
              (1 - THREE.MathUtils.smoothstep(cycle, 2.05, 2.45))
            : 0;
        const wave = Math.sin(elapsed * 9.2) * waveWindow;
        const smallWave = Math.sin(elapsed * 18.4) * waveWindow;
        const restPose: ArmPose = {
          shoulder: [-0.2, 0.05, -0.45],
          arm: [-0.24, -0.06, -0.72],
          forearm: [-0.58, 0.08, -0.16],
          palm: [0.02, 0.08, 0.08],
        };
        const helloPose: ArmPose = {
          shoulder: [-0.5, 0.2, -1.12],
          arm: [-0.74, -0.22, -1.72],
          forearm: [-1.16, 0.34 + wave * 0.78, -0.08],
          palm: [0.04, wave * 0.9 + smallWave * 0.12, 0.34],
        };
        const pose = lerpPose(restPose, helloPose, waveWindow);

        applyLocalRotation(
          waveRig.shoulder,
          waveRig.base.get(waveRig.shoulder)!,
          ...pose.shoulder,
        );
        applyLocalRotation(
          waveRig.arm,
          waveRig.base.get(waveRig.arm)!,
          ...pose.arm,
        );
        applyLocalRotation(
          waveRig.forearm,
          waveRig.base.get(waveRig.forearm)!,
          ...pose.forearm,
        );
        applyLocalRotation(
          waveRig.palm,
          waveRig.base.get(waveRig.palm)!,
          ...pose.palm,
        );
      }

      smoothPointer.lerp(pointer, 0.08);

      if (lookRig) {
        const lookX = THREE.MathUtils.clamp(smoothPointer.x, -1, 1);
        const lookY = THREE.MathUtils.clamp(smoothPointer.y, -1, 1);

        applyLocalRotation(
          lookRig.neck,
          lookRig.base.get(lookRig.neck)!,
          lookY * 0.12,
          -lookX * 0.18,
          lookX * 0.03,
        );
        applyLocalRotation(
          lookRig.head,
          lookRig.base.get(lookRig.head)!,
          lookY * 0.18,
          -lookX * 0.34,
          lookX * 0.05,
        );
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handlePointerLeave = () => {
      pointer.set(0, 0);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;

        mesh.geometry?.dispose();
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="relative min-h-[340px] overflow-hidden sm:min-h-[420px] lg:min-h-[520px]">
      <div
        ref={mountRef}
        className="absolute inset-0"
        aria-hidden={loadState !== "error"}
      />
      {loadState === "ready" && (
        <div className="pointer-events-none absolute left-[61%] top-[27%] hidden h-24 w-24 -rotate-12 sm:block">
          <span className="absolute left-0 top-10 h-6 w-10 animate-ping rounded-r-full border-r-2 border-t-2 border-amber-300/80" />
          <span className="absolute left-4 top-5 h-10 w-14 animate-pulse rounded-r-full border-r-2 border-t-2 border-amber-200/80" />
          <span className="absolute left-8 top-0 h-14 w-20 animate-pulse rounded-r-full border-r-2 border-t-2 border-white/45" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-[12%] bottom-4 h-16 rounded-[50%] bg-blue-950/35 blur-2xl" />
      {loadState === "loading" && (
        <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-blue-100">
          Loading...
        </div>
      )}
      {loadState === "error" && (
        <div className="absolute inset-0 grid place-items-center text-center text-sm font-semibold text-blue-100">
          Error loading.
        </div>
      )}
    </div>
  );
}

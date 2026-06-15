"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

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
  chest: THREE.Object3D | null;
  base: Map<THREE.Object3D, THREE.Quaternion>;
};
type ArmPose = {
  shoulder: [number, number, number];
  arm: [number, number, number];
  forearm: [number, number, number];
  palm: [number, number, number];
};
type TextureSlot =
  | "map"
  | "emissiveMap"
  | "normalMap"
  | "roughnessMap"
  | "metalnessMap"
  | "aoMap";
type TexturedMaterial = THREE.Material & Partial<Record<TextureSlot, THREE.Texture>>;

const HERO_MODEL_URL = "/hero-optimized.glb";
const HERO_VISUAL_OFFSET = new THREE.Vector3(0, -0.02, 0);
const MAX_PIXEL_RATIO = 1.75;
const TARGET_FRAME_MS = 1000 / 45;

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

function setLocalEuler(
  object: THREE.Object3D,
  x: number,
  y: number,
  z: number,
) {
  object.rotation.set(x, y, z, "XYZ");
}

function enableTransformUpdates(objects: THREE.Object3D[]) {
  objects.forEach((object) => {
    object.matrixAutoUpdate = true;
    object.matrixWorldAutoUpdate = true;
  });
}

function sharpenMaterialTextures(
  object: THREE.Object3D,
  renderer: THREE.WebGLRenderer,
) {
  const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material];

    materials.forEach((material) => {
      const materialWithTextures = material as TexturedMaterial;
      const textureSlots: TextureSlot[] = [
        "map",
        "emissiveMap",
        "normalMap",
        "roughnessMap",
        "metalnessMap",
        "aoMap",
      ];

      textureSlots.forEach((slot) => {
        const texture = materialWithTextures[slot];
        if (!texture) return;

        texture.anisotropy = maxAnisotropy;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
      });
    });
  });
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
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 1.2, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-label", "Learning Hub hero 3D scene");
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
    loader.setMeshoptDecoder(MeshoptDecoder);
    const timer = new THREE.Timer();
    timer.connect(document);
    const pointer = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    let waveRig: WaveRig | null = null;
    let restingRig: WaveRig | null = null;
    let lookRig: LookRig | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let frameId = 0;
    let lastFrameTime = 0;
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
      const scale = 3.08 / maxAxis;

      object.scale.setScalar(scale);
      object.position
        .set(-center.x * scale, -center.y * scale, -center.z * scale)
        .add(HERO_VISUAL_OFFSET);

      camera.position.set(0, 0.18, 5.25);
      camera.lookAt(0, 0, 0);
    };

    loader.load(
      HERO_MODEL_URL,
      (gltf) => {
        if (disposed) return;

        modelRoot.add(gltf.scene);
        fitModel(gltf.scene);
        sharpenMaterialTextures(gltf.scene, renderer);
        modelRoot.rotation.y = -0.08;

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          gltf.animations.forEach((clip) => {
            mixer?.clipAction(clip).play();
          });
        }

        const shoulder = findObjectByName(gltf.scene, "shoulder.L_015");
        const arm = findObjectByName(gltf.scene, "arm.L_00");
        const forearm = findObjectByName(gltf.scene, "forearm.L_016");
        const palm = findObjectByName(gltf.scene, "palm.L_017");
        const restingShoulder = findObjectByName(gltf.scene, "shoulder.R_039");
        const restingArm = findObjectByName(gltf.scene, "arm.R_040");
        const restingForearm = findObjectByName(gltf.scene, "forearm.R_041");
        const restingPalm = findObjectByName(gltf.scene, "palm.R_042");
        const neck = findObjectByName(gltf.scene, "neck_010");
        const chest = findObjectByName(gltf.scene, "spine.003_08");

        if (shoulder && arm && forearm && palm) {
          const parts = [shoulder, arm, forearm, palm];
          enableTransformUpdates(parts);
          waveRig = {
            shoulder,
            arm,
            forearm,
            palm,
            base: new Map(parts.map((part) => [part, part.quaternion.clone()])),
          };
        }

        if (restingShoulder && restingArm && restingForearm && restingPalm) {
          const parts = [
            restingShoulder,
            restingArm,
            restingForearm,
            restingPalm,
          ];
          enableTransformUpdates(parts);
          restingRig = {
            shoulder: restingShoulder,
            arm: restingArm,
            forearm: restingForearm,
            palm: restingPalm,
            base: new Map(parts.map((part) => [part, part.quaternion.clone()])),
          };
        }

        if (neck) {
          const parts = [neck, ...(chest ? [chest] : [])];
          enableTransformUpdates(parts);
          lookRig = {
            neck,
            chest,
            base: new Map(parts.map((part) => [part, part.quaternion.clone()])),
          };
        }

        setLoadState("ready");
      },
      undefined,
      (error) => {
        console.error(`Failed to load ${HERO_MODEL_URL}`, error);
        setLoadState("error");
      },
    );

    const animate = (time = 0) => {
      frameId = window.requestAnimationFrame(animate);
      if (time - lastFrameTime < TARGET_FRAME_MS) return;
      lastFrameTime = time;

      timer.update(time);
      const delta = timer.getDelta();
      const elapsed = timer.getElapsed();
      mixer?.update(delta);
      modelRoot.position.y = Math.sin(elapsed * 1.45) * 0.012;
      smoothPointer.lerp(pointer, 0.08);
      const lookX = THREE.MathUtils.clamp(smoothPointer.x, -1, 1);
      const lookY = THREE.MathUtils.clamp(smoothPointer.y, -1, 1);

      modelRoot.rotation.y = -0.08 + lookX * 0.055 + Math.sin(elapsed * 0.9) * 0.012;

      if (waveRig) {
        const wave = Math.sin(elapsed * 9.2);
        const smallWave = Math.sin(elapsed * 18.4);

        setLocalEuler(waveRig.shoulder, -0.05, 0.0, 0.12);
        setLocalEuler(waveRig.arm, -0.58, -0.18, -2.28);
        setLocalEuler(waveRig.forearm, -1.05, 0.58 + wave * 0.78, -0.38);
        setLocalEuler(
          waveRig.palm,
          0.08,
          -0.55 + wave * 0.95 + smallWave * 0.12,
          -0.72,
        );
      }

      if (restingRig) {
        setLocalEuler(restingRig.shoulder, -0.03, 0.0, -0.02);
        setLocalEuler(restingRig.arm, 0.06, 0.08, 0.95);
        setLocalEuler(restingRig.forearm, -2.76, -0.54, 0.4);
        setLocalEuler(restingRig.palm, 0.1, 0.38, 0.9);
      }

      if (lookRig) {
        if (lookRig.chest) {
          applyLocalRotation(
            lookRig.chest,
            lookRig.base.get(lookRig.chest)!,
            -lookY * 0.04,
            lookX * 0.07,
            0,
          );
        }

        applyLocalRotation(
          lookRig.neck,
          lookRig.base.get(lookRig.neck)!,
          -lookY * 0.1,
          lookX * 0.14,
          lookX * 0.03,
        );
      }

      modelRoot.updateMatrixWorld(true);
      renderer.render(scene, camera);
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
    frameId = window.requestAnimationFrame(animate);
    window.addEventListener("resize", resize);
    mount.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      mixer?.stopAllAction();
      timer.dispose();
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
    <div className="relative h-full min-h-[360px] overflow-hidden sm:min-h-[420px] lg:min-h-[520px]">
      <div
        ref={mountRef}
        className="absolute inset-0"
        aria-hidden={loadState !== "error"}
      />

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

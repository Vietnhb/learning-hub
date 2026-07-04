"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Loader2, MessageCircle, X } from "lucide-react";
import ChatMessage from "@/components/admin/ChatMessage";
import MessageInput from "@/components/admin/MessageInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminConversation } from "@/hooks/useAdminConversation";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

const HELP_MODEL_URL = "/help.glb";
const HELP_MAX_DELTA = 1 / 45;
const HELP_SKILL_EVENT = "learning-hub:help-skill";

function HelpModel() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 20);
    camera.position.set(0, 0.66, 6.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = "h-full w-full drop-shadow-2xl";
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x4f46e5, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(2.5, 4, 4);
    scene.add(keyLight);

    const loader = new GLTFLoader();
    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    const timer = new THREE.Timer();
    timer.connect(document);
    let mixer: THREE.AnimationMixer | null = null;
    let guardAction: THREE.AnimationAction | null = null;
    let skillAction: THREE.AnimationAction | null = null;
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
      const scale = 1.9 / maxAxis;

      object.scale.setScalar(scale);
      object.position.set(
        -center.x * scale,
        -center.y * scale - 0.04,
        -center.z * scale,
      );
      camera.lookAt(0, 0.1, 0);
    };

    loader.load(
      HELP_MODEL_URL,
      (gltf) => {
        if (disposed) return;

        modelRoot.add(gltf.scene);
        fitModel(gltf.scene);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltf.scene);
          const guardClip =
            THREE.AnimationClip.findByName(gltf.animations, "guard") ??
            gltf.animations[0];
          const skillClip = THREE.AnimationClip.findByName(
            gltf.animations,
            "skill_00_01",
          );

          guardAction = mixer.clipAction(guardClip);
          guardAction.timeScale = 0.8;
          guardAction.play();

          if (skillClip) {
            skillAction = mixer.clipAction(skillClip);
            skillAction.clampWhenFinished = true;
            skillAction.loop = THREE.LoopOnce;
          }
        }
      },
      undefined,
      (error) => {
        console.error(`Failed to load ${HELP_MODEL_URL}`, error);
      },
    );

    const animate = (time = 0) => {
      frameId = window.requestAnimationFrame(animate);
      timer.update(time);
      const elapsed = timer.getElapsed();
      const delta = Math.min(timer.getDelta(), HELP_MAX_DELTA);
      mixer?.update(delta);

      modelRoot.rotation.y = THREE.MathUtils.lerp(
        modelRoot.rotation.y,
        Math.sin(elapsed * 0.55) * 0.08,
        0.06,
      );
      modelRoot.position.y = THREE.MathUtils.lerp(
        modelRoot.position.y,
        Math.sin(elapsed * 1.1) * 0.014,
        0.08,
      );
      renderer.render(scene, camera);
    };

    const playSkill = () => {
      if (!mixer || !guardAction || !skillAction) return;

      skillAction.reset();
      skillAction.enabled = true;
      skillAction.setEffectiveTimeScale(1);
      skillAction.setEffectiveWeight(1);
      skillAction.crossFadeFrom(guardAction, 0.12, false);
      skillAction.play();

      const handleFinished = (event: { action: THREE.AnimationAction }) => {
        if (event.action !== skillAction || !guardAction || !skillAction) return;

        skillAction.fadeOut(0.12);
        guardAction.reset();
        guardAction.enabled = true;
        guardAction.fadeIn(0.12).play();
        mixer?.removeEventListener("finished", handleFinished);
      };

      mixer.addEventListener("finished", handleFinished);
    };

    window.addEventListener(HELP_SKILL_EVENT, playSkill);

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener(HELP_SKILL_EVENT, playSkill);
      resizeObserver.disconnect();
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
    <div
      ref={mountRef}
      className="pointer-events-none absolute -inset-8 overflow-visible sm:-inset-9"
    />
  );
}

export default function HelpChatWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { conversationId, loadingConversation, getReceiverId } =
    useAdminConversation({ enabled: open && !!user });

  const {
    messages,
    loading: loadingMessages,
    sending,
    send,
  } = useChat(conversationId);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleToggle = () => {
    if (authLoading) return;

    if (!user) {
      const redirect = encodeURIComponent(pathname || "/");
      router.push(`/auth/login?redirect=${redirect}`);
      return;
    }

    playSkillAnimation();
    setOpen((current) => !current);
  };

  const handleSend = async (message: string) => {
    const receiverId = getReceiverId();
    if (!conversationId || !receiverId) return;
    await send(message, receiverId);
  };

  const playSkillAnimation = () => {
    window.dispatchEvent(new Event(HELP_SKILL_EVENT));
  };

  const isChatLoading = loadingConversation || loadingMessages;
  let chatBody: ReactNode;

  if (isChatLoading) {
    chatBody = (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Đang tải tin nhắn...
      </div>
    );
  } else if (messages.length === 0) {
    chatBody = (
      <div className="flex h-full flex-col items-center justify-center text-center text-sm text-muted-foreground">
        <MessageCircle className="mb-3 h-10 w-10 opacity-50" />
        <p>Bạn cần hỗ trợ gì? Gửi tin nhắn cho admin tại đây.</p>
      </div>
    );
  } else {
    chatBody = (
      <>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </>
    );
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <div
        className={cn(
          "pointer-events-auto mb-3 flex h-[460px] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 transition-all duration-200 dark:border-white/10 dark:bg-slate-950",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
        aria-hidden={open ? undefined : "true"}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">
                Support Chat
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Nếu có gì thắc mắc, hãy gửi tin nhắn cho mình nhé!
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpen(false)}
            aria-label="Đóng khung nhắn tin"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {chatBody}
        </div>

        <div className="border-t p-3 dark:border-white/10">
          <MessageInput
            onSend={handleSend}
            disabled={sending || loadingConversation || !conversationId}
            placeholder="Nhập tin nhắn..."
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={authLoading}
        className="group pointer-events-auto relative ml-auto grid h-16 w-16 place-items-center overflow-visible rounded-full bg-transparent p-0 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-wait disabled:opacity-70 sm:h-20 sm:w-20"
        aria-label="Mở khung nhắn tin với admin"
        aria-expanded={open ? "true" : "false"}
      >
        <HelpModel />
      </button>
    </div>
  );
}

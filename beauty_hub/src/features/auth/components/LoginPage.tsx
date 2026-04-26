"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SparklesIcon } from "lucide-react";

import { LoginForm } from "./LoginForm";

gsap.registerPlugin(useGSAP);

export function LoginPage() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        timeline
          .from("[data-login-glow]", {
            autoAlpha: 0,
            scale: 0.92,
            duration: 0.9,
          })
          .from(
            "[data-login-copy]",
            {
              autoAlpha: 0,
              y: 22,
              duration: 0.7,
              stagger: 0.08,
            },
            "-=0.5"
          )
          .from(
            "[data-login-panel]",
            {
              autoAlpha: 0,
              y: 24,
              scale: 0.98,
              duration: 0.65,
            },
            "-=0.45"
          )
          .from(
            "[data-login-preview]",
            {
              autoAlpha: 0,
              x: 28,
              duration: 0.8,
            },
            "-=0.55"
          )
          .from(
            "[data-login-card]",
            {
              autoAlpha: 0,
              y: 18,
              duration: 0.55,
              stagger: 0.08,
            },
            "-=0.45"
          );
      });

      return () => media.revert();
    },
    { scope: containerRef }
  );

  return (
    <main
      ref={containerRef}
      className="relative min-h-dvh overflow-hidden bg-background text-foreground"
    >
      <div
        data-login-glow
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-72 max-w-5xl rounded-b-full bg-primary/10 blur-3xl"
      />

      <section className="relative grid min-h-dvh lg:grid-cols-[minmax(0,0.95fr)_minmax(480px,1.05fr)]">
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="flex w-full max-w-md flex-col gap-7">
            <div data-login-copy className="flex items-center gap-2">
              <SparklesIcon aria-hidden="true" className="text-primary" />
              <span className="font-heading text-lg font-medium">
                Beauty Hub
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                <span data-login-copy>
                  Tu rutina ideal empieza con una recomendacion precisa.
                </span>
              </h1>
              <p
                data-login-copy
                className="max-w-xl text-base leading-7 text-muted-foreground"
              >
                Inicia sesion para descubrir productos compatibles con tu
                perfil, tus tonos y tus objetivos de cuidado.
              </p>
            </div>

            <div data-login-panel>
              <LoginForm />
            </div>
          </div>
        </div>

        <aside
          data-login-preview
          className="relative hidden overflow-hidden p-4 lg:block"
        >
          <div className="relative h-full min-h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
            <Image
              src="/login-hero.png"
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-background/15"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-10 top-12 h-40 rounded-full bg-primary/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute right-8 bottom-8 size-64 rounded-full bg-muted/80 blur-2xl"
            />

            <div className="relative flex h-full items-end justify-end p-8">
              <div
                data-login-card
                className="max-w-sm rounded-2xl border border-border bg-background/75 p-5 shadow-sm backdrop-blur"
              >
                <p className="text-sm text-muted-foreground">
                  Tonos sugeridos
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="size-8 rounded-full border border-border bg-[#f7e7d8]" />
                  <span className="size-8 rounded-full border border-border bg-[#f1c6b6]" />
                  <span className="size-8 rounded-full border border-border bg-[#cf868b]" />
                  <span className="size-8 rounded-full border border-border bg-[#9f6b73]" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

"use client";

import { useCallback } from "react";
import Particles from "react-particles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const ParticleAnimation = () => {
  const options: any = {
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          area: 800,
        },
      },
      opacity: {
        value: 1,
      },
      size: {
        value: { min: 0, max: 0 },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#fff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: false,
        straight: false,
        outModes: "out",
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
        },
        onClick: {
          enable: false,
          mode: "push",
        },
        detect_on: "window",
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1,
          },
        },
      },
    },
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute">
      <Particles
        id="tsparticles"
        height="100vh"
        options={options}
        init={particlesInit}
      />
    </div>
  );
};

export default ParticleAnimation;

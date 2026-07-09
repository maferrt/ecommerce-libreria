"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const teamMembers = [
  {
    name: "María Fernanda Rodríguez Trinidad",
    shortName: "Mafer",
    role: "Desarrolladora Full Stack",
    image: "/images/team/Maria_Fernanda_Rodriguez_Trinidad.png",
    linkedin: "https://www.linkedin.com/in/mar%C3%ADa-fernanda-rodr%C3%ADguez-trinidad-926346396/",
    description:
      "Participa en el diseño visual, estructura frontend, experiencia de usuario, reconstrucción del proyecto en Next.js e integración del funcionamiento lógico con Java y Spring Boot.",
  },
  {
    name: "Ilse Adriana Careo Galicia",
    shortName: "Adri",
    role: "Desarrolladora",
    image: "/images/team/Ilse_Adriana_Careo_Galicia.jpg",
    linkedin: "https://www.linkedin.com/in/ilse-adriana-careo-galicia/",
    description:
      "Colabora en el desarrollo del proyecto, aportando ideas para la organización visual, construcción de secciones e integración de base de datos relacional.",
  },
];

export function TeamCarousel() {
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);

  const activeMember = teamMembers[activeMemberIndex];

  function goToNextMember() {
    setActiveMemberIndex((currentIndex) => {
      const isLastMember = currentIndex === teamMembers.length - 1;

      if (isLastMember) {
        return 0;
      }

      return currentIndex + 1;
    });
  }

  function goToPreviousMember() {
    setActiveMemberIndex((currentIndex) => {
      const isFirstMember = currentIndex === 0;

      if (isFirstMember) {
        return teamMembers.length - 1;
      }

      return currentIndex - 1;
    });
  }

  return (
    <section className="about-section about-team-section">
      <header className="about-section-header">
        <span className="about-eyebrow">
          <Sparkles size={15} />
          Equipo
        </span>

        <h2>Las personas que construyen este mundo</h2>

        <p>
          Cada integrante aporta una parte importante: diseño, código, ideas,
          organización y mucho aprendizaje en el proceso.
        </p>
      </header>

      <div className="team-carousel-shell">
        <article key={activeMember.name} className="team-carousel-card">
          <div className="team-carousel-image-wrapper">
            <Image
              src={activeMember.image}
              alt={`Foto de ${activeMember.name}`}
              width={520}
              height={520}
              className="team-carousel-image"
              priority
            />
          </div>

          <div className="team-carousel-content">
            <span className="team-carousel-role">{activeMember.role}</span>

            <h3>{activeMember.name}</h3>

            <p>{activeMember.description}</p>

            <Link
                href={activeMember.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="team-github-link"
            >
            <LinkedInIcon />
                Conectemos
            </Link>
          </div>
        </article>

        <div className="team-carousel-controls">
          <button
            type="button"
            className="team-carousel-button"
            aria-label="Ver integrante anterior"
            onClick={goToPreviousMember}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="team-carousel-dots">
            {teamMembers.map((member, index) => (
              <button
                key={member.name}
                type="button"
                aria-label={`Ver perfil de ${member.shortName}`}
                onClick={() => setActiveMemberIndex(index)}
                className={
                  index === activeMemberIndex
                    ? "team-carousel-dot team-carousel-dot-active"
                    : "team-carousel-dot"
                }
              />
            ))}
          </div>

          <button
            type="button"
            className="team-carousel-button"
            aria-label="Ver siguiente integrante"
            onClick={goToNextMember}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.1 20.45H3.54V9H7.1v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}
import { Role } from "./types";

/**
 * Catálogo de roles extraído de los carriles ("responsables") de los 6 flujos
 * homologados (Flujo 0 a Flujo 5).
 */
export const roles: Role[] = [
  {
    id: "director-negocio",
    name: "Director de Negocio",
    area: "Negocio",
    description:
      "Solicita el requerimiento, elabora el Canvas de la idea y presenta el caso de negocio ante la Dirección General.",
  },
  {
    id: "pmo",
    name: "PMO",
    area: "Portfolio Management",
    description:
      "Gestiona el backlog, prioriza iniciativas, notifica planes de trabajo y controla la ejecución y el cierre de los proyectos.",
  },
  {
    id: "bp",
    name: "Business Partner (BP)",
    area: "Negocio",
    description:
      "Revisa la calidad del Canvas, complementa el contexto de la iniciativa y da el Vo.Bo. final de las estimaciones.",
  },
  {
    id: "lider-arquitectura",
    name: "Líder de Arquitectura",
    area: "Arquitectura",
    description:
      "Recibe el Canvas, asigna al líder de dominio, realiza el análisis preliminar y da el Vo.Bo. técnico de las estimaciones.",
  },
  {
    id: "asisti",
    name: "AsisTI",
    area: "Automatización",
    description:
      "Asistente/herramienta (AsisTI DataSwat) que genera estimaciones preliminares y automatiza envíos y minutas.",
  },
  {
    id: "lideres-tecnicos",
    name: "Líderes Técnicos",
    area: "Infraestructura / Desarrollo / UX / QA",
    description:
      "Otorgan el Vo.Bo. de las estimaciones por disciplina, validan entregables y autorizan liberaciones durante la ejecución.",
  },
  {
    id: "direccion-general",
    name: "Dirección General",
    area: "Dirección",
    description:
      "Autoriza formalmente el caso de negocio; su decisión determina si la iniciativa continúa o se archiva en backlog.",
  },
  {
    id: "portafolio",
    name: "Portafolio / SE / Serv. Est.",
    area: "Portafolio",
    description:
      "Gestiona el circuito de firmas del Charter, la solicitud de PEP, la consolidación de hitos y el cierre formal del proyecto.",
  },
  {
    id: "director-finanzas",
    name: "Director de Finanzas",
    area: "Finanzas TI",
    description:
      "Revisa costos, genera los Vo.Bo. financieros, aprueba órdenes de pago y capitaliza el PEP al cierre del proyecto.",
  },
  {
    id: "equipo-tecnico",
    name: "Equipo Técnico",
    area: "Tecnología",
    description:
      "Ejecuta el desarrollo, gestiona proveedores/contratos y solicita la liberación de entregables.",
  },
];

export const roleById = (id: string): Role | undefined =>
  roles.find((role) => role.id === id);

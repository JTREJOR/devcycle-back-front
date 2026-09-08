import { User } from "./types";

const AVATAR_COLORS = [
  "#0073EA",
  "#E10098",
  "#00C875",
  "#FDAB3D",
  "#A25DDC",
  "#FF7575",
  "#037F4C",
  "#579BFC",
];

let colorCursor = 0;
const nextColor = () => AVATAR_COLORS[colorCursor++ % AVATAR_COLORS.length];

/** ~2 usuarios dummy por rol, para poblar el módulo de Usuarios y Perfiles. */
export const users: User[] = [
  { id: "u-01", name: "Mariana Solís", email: "mariana.solis@devcycle.mock", roleId: "director-negocio", area: "Negocio", avatarColor: nextColor() },
  { id: "u-02", name: "Rodrigo Peña", email: "rodrigo.pena@devcycle.mock", roleId: "director-negocio", area: "Negocio", avatarColor: nextColor() },

  { id: "u-03", name: "Ana Castillo", email: "ana.castillo@devcycle.mock", roleId: "pmo", area: "Portfolio Management", avatarColor: nextColor() },
  { id: "u-04", name: "Luis Fernández", email: "luis.fernandez@devcycle.mock", roleId: "pmo", area: "Portfolio Management", avatarColor: nextColor() },

  { id: "u-05", name: "Paola Ibarra", email: "paola.ibarra@devcycle.mock", roleId: "bp", area: "Negocio", avatarColor: nextColor() },
  { id: "u-06", name: "Diego Ramos", email: "diego.ramos@devcycle.mock", roleId: "bp", area: "Negocio", avatarColor: nextColor() },

  { id: "u-07", name: "Karla Nájera", email: "karla.najera@devcycle.mock", roleId: "lider-arquitectura", area: "Arquitectura", avatarColor: nextColor() },

  { id: "u-08", name: "AsisTI Bot", email: "asisti@devcycle.mock", roleId: "asisti", area: "Automatización", avatarColor: nextColor() },

  { id: "u-09", name: "Jorge Villaseñor", email: "jorge.villasenor@devcycle.mock", roleId: "lideres-tecnicos", area: "Desarrollo", avatarColor: nextColor() },
  { id: "u-10", name: "Fernanda Ochoa", email: "fernanda.ochoa@devcycle.mock", roleId: "lideres-tecnicos", area: "Infraestructura", avatarColor: nextColor() },
  { id: "u-11", name: "Iván Cordero", email: "ivan.cordero@devcycle.mock", roleId: "lideres-tecnicos", area: "QA", avatarColor: nextColor() },
  { id: "u-12", name: "Renata Guzmán", email: "renata.guzman@devcycle.mock", roleId: "lideres-tecnicos", area: "UX", avatarColor: nextColor() },

  { id: "u-13", name: "Eduardo Salcido", email: "eduardo.salcido@devcycle.mock", roleId: "direccion-general", area: "Dirección", avatarColor: nextColor() },

  { id: "u-14", name: "Sofía Elizondo", email: "sofia.elizondo@devcycle.mock", roleId: "portafolio", area: "Portafolio", avatarColor: nextColor() },
  { id: "u-15", name: "Héctor Miranda", email: "hector.miranda@devcycle.mock", roleId: "portafolio", area: "Portafolio", avatarColor: nextColor() },

  { id: "u-16", name: "Gabriela Treviño", email: "gabriela.trevino@devcycle.mock", roleId: "director-finanzas", area: "Finanzas TI", avatarColor: nextColor() },
  { id: "u-17", name: "Ricardo Pantoja", email: "ricardo.pantoja@devcycle.mock", roleId: "director-finanzas", area: "Finanzas TI", avatarColor: nextColor() },

  { id: "u-18", name: "Valeria Cortés", email: "valeria.cortes@devcycle.mock", roleId: "equipo-tecnico", area: "Tecnología", avatarColor: nextColor() },
  { id: "u-19", name: "Manuel Aguilar", email: "manuel.aguilar@devcycle.mock", roleId: "equipo-tecnico", area: "Tecnología", avatarColor: nextColor() },
];

export const userById = (id: string): User | undefined =>
  users.find((user) => user.id === id);

export const usersByRole = (roleId: string): User[] =>
  users.filter((user) => user.roleId === roleId);

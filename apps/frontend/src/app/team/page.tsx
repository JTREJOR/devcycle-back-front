"use client";

import { useState, useEffect } from "react";
import { EmptyState, Icon, Loader, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@vibe/core";
import { Settings, Person, Check } from "@vibe/icons";
import { useRoles, useUsers } from "@/lib/queries";
import { RoleTag } from "@/components/RoleTag";
import { useUiStore } from "@/store/uiStore";
import { BackButton } from "@/components/BackButton";

const USER_COLUMNS = [
  { id: "id", title: "ID", width: 120 },
  { id: "name", title: "Nombre", width: 220 },
  { id: "email", title: "Correo Corporativo", width: 260 },
  { id: "role", title: "Rol Asignado", width: 180 },
  { id: "area", title: "Área de Negocio", width: 160 },
];

interface ConfigField {
  id: string;
  label: string;
  help: string;
  type: "editable" | "sistema";
  value: string;
}

const INITIAL_CONFIG: ConfigField[] = [
  {
    id: "NOMBRE_APLICACION",
    label: "NOMBRE_APLICACION",
    help: "Nombre visible de la solución en Monday.com.",
    type: "editable",
    value: "DevCycle - Gestión de Portafolio e Iniciativas",
  },
  {
    id: "SUBTITULO",
    label: "SUBTITULO",
    help: "Subtítulo visible en el encabezado y vistas embebidas.",
    type: "editable",
    value: "Ciclo integral de descubrimiento y ejecución de proyectos",
  },
  {
    id: "COLOR_PRINCIPAL",
    label: "COLOR_PRINCIPAL",
    help: "Morado principal de acento e identidad corporativa.",
    type: "editable",
    value: "#833177",
  },
  {
    id: "COLOR_GUARDIA_ACTUAL",
    label: "COLOR_GUARDIA_ACTUAL",
    help: "Rosa Liverpool para estados activos y alertas destacadas.",
    type: "editable",
    value: "#E6007E",
  },
  {
    id: "COLOR_DIAS",
    label: "COLOR_DIAS",
    help: "Fondo suave de elementos secundarios y contenedores de icono.",
    type: "editable",
    value: "#FFF9FC",
  },
  {
    id: "COLOR_TEXTO",
    label: "COLOR_TEXTO",
    help: "Texto principal de alto contraste y legibilidad.",
    type: "editable",
    value: "#383838",
  },
  {
    id: "FECHA_VERSION_SISTEMA",
    label: "FECHA_VERSION_SISTEMA",
    help: "Versión homologada activa para el ciclo de vida.",
    type: "sistema",
    value: "2026-09-10",
  },
  {
    id: "ZONA_HORARIA",
    label: "ZONA_HORARIA",
    help: "Zona horaria del sistema para registro de aprobaciones.",
    type: "editable",
    value: "America/Mexico_City",
  },
];

export default function TeamPage() {
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const [activeTab, setActiveTab] = useState<"users" | "config">("users");
  const [configFields, setConfigFields] = useState<ConfigField[]>(INITIAL_CONFIG);
  const [savedFieldId, setSavedFieldId] = useState<string | null>(null);
  const setActiveMenuTitle = useUiStore((s) => s.setActiveMenuTitle);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "config") {
        setActiveTab("config");
        setActiveMenuTitle("Configuración");
      } else if (tabParam === "users") {
        setActiveTab("users");
        if (window.location.hash.includes("roles")) {
          setActiveMenuTitle("Roles");
        } else {
          setActiveMenuTitle("Usuarios");
        }
      }
    }
  }, [setActiveMenuTitle]);

  if (loadingRoles || loadingUsers) return <Loader size={48} />;

  const handleFieldChange = (id: string, val: string) => {
    setConfigFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value: val } : field)),
    );
  };

  const handleSaveField = (id: string) => {
    setSavedFieldId(id);
    setTimeout(() => setSavedFieldId(null), 2500);
  };

  return (
    <div>
      <div className="mb-3 flex items-center">
        <BackButton />
      </div>

      {/* Título de la vista */}
      <div className="mb-5">
        <h1 className="m-0 mb-1.5 text-2xl font-bold text-text-heading">
          Configuración y Perfiles de Usuario
        </h1>
        <p className="m-0 text-[13.5px] text-text-secondary">
          Administración de parámetros visuales del sistema (tokens de diseño) y catálogo de roles para gobernanza.
        </p>
      </div>

      {/* Segmented Control / Tabs inspirado en Imagen 4 */}
      <div className="mb-5">
        <div className="inline-flex flex-wrap gap-1 rounded-[10px] bg-status-gray-bg p-1">
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-none px-4 py-1.5 text-[13px] transition-all duration-150 ${
              activeTab === "users"
                ? "bg-brand-primary-light font-bold text-brand-primary shadow-2xs"
                : "bg-transparent font-medium text-text-secondary hover:text-brand-primary"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Icon icon={Person} size={15} />
            <span>Usuarios y Roles ({users?.length ?? 0})</span>
          </button>
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-none px-4 py-1.5 text-[13px] transition-all duration-150 ${
              activeTab === "config"
                ? "bg-brand-primary-light font-bold text-brand-primary shadow-2xs"
                : "bg-transparent font-medium text-text-secondary hover:text-brand-primary"
            }`}
            onClick={() => setActiveTab("config")}
          >
            <Icon icon={Settings} size={15} />
            <span>Parámetros y Tokens del Sistema (Imagen 3)</span>
          </button>
        </div>
      </div>

      {activeTab === "config" ? (
        <div id="config">
          {/* Banner informativo */}
          <div className="mb-5 flex items-center gap-3 rounded-[10px] border border-status-green-border bg-status-green-bg px-4 py-3">
            <div className="shrink-0 text-status-green-text">
              <Icon icon={Check} size={18} />
            </div>
            <div>
              <div className="text-[13px] font-bold text-status-green-text">
                Parámetros de Estilos y Configuración
              </div>
              <div className="mt-0.5 text-xs text-status-green-text">
                Los tokens visuales de color y comportamiento se sincronizan con el entorno embebido de Monday.com.
              </div>
            </div>
          </div>

          {/* Grid de Form Cards inspirado en Imagen 3 */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(360px,1fr))]">
            {configFields.map((field) => (
              <div
                key={field.id}
                className="flex flex-col justify-between gap-3.5 rounded-[10px] border border-border-default bg-bg-card px-5 py-4 shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold tracking-[0.5px] text-text-heading uppercase">
                        {field.label}
                      </div>
                      <div className="mt-[3px] text-[11.5px] text-text-secondary">
                        {field.help}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-xl border px-2.5 py-[3px] text-[11.5px] font-semibold tracking-[0.2px] whitespace-nowrap ${
                          field.type === "editable"
                            ? "border-status-purple-border bg-status-purple-bg text-status-purple-text"
                            : "border-status-gray-border bg-status-gray-bg text-status-gray-text"
                        }`}
                      >
                        {field.type === "editable" ? "Editable" : "Sistema"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <input
                      type="text"
                      className="w-full rounded-[7px] border border-[#dcdfe4] bg-bg-card px-3 py-[9px] text-[13.5px] text-text-main transition-all duration-150 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-text-secondary"
                      value={field.value}
                      disabled={field.type === "sistema"}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  {field.type === "editable" ? (
                    <div className="flex items-center gap-2">
                      {savedFieldId === field.id && (
                        <span className="text-xs font-semibold text-status-green-text">
                          ✓ Guardado
                        </span>
                      )}
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-[1.5px] border-brand-primary bg-bg-card px-3.5 py-[7px] text-[13px] font-semibold text-brand-primary transition-all duration-150 hover:bg-brand-primary-light"
                        onClick={() => handleSaveField(field.id)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11.5px] text-text-muted">
                      Se actualiza durante publicación/activación.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Catálogo de Roles */}
          <div
            className="mb-5 rounded-xl border border-border-default bg-bg-card px-6 py-5 shadow-2xs"
            id="roles"
          >
            <div className="mb-4">
              <h2 className="m-0 mb-1 text-[17px] font-bold text-text-heading">
                Gobernanza y Aprobadores por Rol
              </h2>
              <p className="m-0 text-[13px] text-text-secondary">
                Roles extraídos de los flujos homologados de la organización.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {roles?.map((role) => (
                <div
                  key={role.id}
                  className="rounded-[10px] border border-border-default bg-bg-card p-3.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <RoleTag roleId={role.id} roleName={role.name} />
                    <span className="text-[11px] font-medium text-text-muted">
                      {role.id}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-text-secondary">
                    Área: {role.area}
                  </div>
                  <div className="mt-1 text-xs leading-[1.4] text-text-main">
                    {role.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directorio de Usuarios */}
          <div
            className="rounded-xl border border-border-default bg-bg-card px-6 py-5 shadow-2xs"
            id="usuarios"
          >
            <div className="mb-4">
              <h2 className="m-0 mb-1 text-[17px] font-bold text-text-heading">
                Directorio de Integrantes
              </h2>
              <p className="m-0 text-[13px] text-text-secondary">
                Usa el selector &quot;Probar como&quot; en el encabezado para simular las decisiones de cada integrante.
              </p>
            </div>

            <Table
              columns={USER_COLUMNS}
              emptyState={<EmptyState description="No hay usuarios registrados." />}
              errorState={<EmptyState description="No se pudieron cargar los usuarios." />}
            >
              <TableHeader>
                {USER_COLUMNS.map((col) => (
                  <TableHeaderCell key={col.id} title={col.title} />
                ))}
              </TableHeader>
              <TableBody>
                {users?.map((user) => {
                  const role = roles?.find((r) => r.id === user.roleId);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <span className="inline-flex items-center rounded-xl border border-status-gray-border bg-status-gray-bg px-2.5 py-[3px] font-mono text-[11px] font-semibold tracking-[0.2px] whitespace-nowrap text-status-gray-text">
                          USR-{user.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-text-heading">{user.name}</span>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{role && <RoleTag roleId={role.id} roleName={role.name} />}</TableCell>
                      <TableCell>{user.area}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

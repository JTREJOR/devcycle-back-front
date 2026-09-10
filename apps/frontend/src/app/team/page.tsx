"use client";

import { useState } from "react";
import { EmptyState, Icon, Loader, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@vibe/core";
import { Settings, Person, Check } from "@vibe/icons";
import { useRoles, useUsers } from "@/lib/queries";
import { RoleTag } from "@/components/RoleTag";

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
      {/* Título de la vista */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px 0", color: "#1e2022" }}>
          Configuración y Perfiles de Usuario
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--color-text-secondary)", margin: 0 }}>
          Administración de parámetros visuales del sistema (tokens de diseño) y catálogo de roles para gobernanza.
        </p>
      </div>

      {/* Segmented Control / Tabs inspirado en Imagen 4 */}
      <div style={{ marginBottom: 20 }}>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <Icon icon={Person} size={15} />
            <span>Usuarios y Roles ({users?.length ?? 0})</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${activeTab === "config" ? "active" : ""}`}
            onClick={() => setActiveTab("config")}
          >
            <Icon icon={Settings} size={15} />
            <span>Parámetros y Tokens del Sistema (Imagen 3)</span>
          </button>
        </div>
      </div>

      {activeTab === "config" ? (
        <div>
          {/* Banner informativo */}
          <div className="notice-banner">
            <div className="notice-banner__icon">
              <Icon icon={Check} size={18} />
            </div>
            <div>
              <div className="notice-banner__title">Parámetros de Estilos y Configuración</div>
              <div className="notice-banner__text">
                Los tokens visuales de color y comportamiento se sincronizan con el entorno embebido de Monday.com.
              </div>
            </div>
          </div>

          {/* Grid de Form Cards inspirado en Imagen 3 */}
          <div className="config-grid">
            {configFields.map((field) => (
              <div key={field.id} className="config-card">
                <div>
                  <div className="config-card__top">
                    <div>
                      <div className="config-card__label">{field.label}</div>
                      <div className="config-card__help">{field.help}</div>
                    </div>
                    <div>
                      <span
                        className={`tag-pill ${
                          field.type === "editable" ? "tag-pill--purple" : "tag-pill--gray"
                        }`}
                      >
                        {field.type === "editable" ? "Editable" : "Sistema"}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <input
                      type="text"
                      className="config-card__input"
                      value={field.value}
                      disabled={field.type === "sistema"}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    />
                  </div>
                </div>

                <div className="config-card__bottom">
                  {field.type === "editable" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {savedFieldId === field.id && (
                        <span style={{ fontSize: 12, color: "var(--status-green-text)", fontWeight: 600 }}>
                          ✓ Guardado
                        </span>
                      )}
                      <button
                        type="button"
                        className="btn-purple-outline"
                        onClick={() => handleSaveField(field.id)}
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: 11.5, color: "var(--color-text-muted)" }}>
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
          <div className="board-card" style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px 0", color: "#1e2022" }}>
                Gobernanza y Aprobadores por Rol
              </h2>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
                Roles extraídos de los flujos homologados de la organización.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {roles?.map((role) => (
                <div
                  key={role.id}
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    padding: 14,
                    background: "#ffffff",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <RoleTag roleId={role.id} roleName={role.name} />
                    <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 500 }}>
                      {role.id}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 8, fontWeight: 600 }}>
                    Área: {role.area}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-text-main)", marginTop: 4, lineHeight: 1.4 }}>
                    {role.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Directorio de Usuarios */}
          <div className="board-card">
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px 0", color: "#1e2022" }}>
                Directorio de Integrantes
              </h2>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>
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
                        <span className="tag-pill tag-pill--gray" style={{ fontFamily: "monospace", fontSize: 11 }}>
                          USR-{user.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontWeight: 600, color: "#1e2022" }}>{user.name}</span>
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

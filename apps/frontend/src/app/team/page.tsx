"use client";

import { EmptyState, Heading, Loader, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Text } from "@vibe/core";
import { useRoles, useUsers } from "@/lib/queries";
import { RoleTag } from "@/components/RoleTag";

const USER_COLUMNS = [
  { id: "name", title: "Nombre" },
  { id: "email", title: "Correo" },
  { id: "role", title: "Rol" },
  { id: "area", title: "Área" },
];

export default function TeamPage() {
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { data: users, isLoading: loadingUsers } = useUsers();

  if (loadingRoles || loadingUsers) return <Loader size={48} />;

  return (
    <div>
      <Heading type="h1">Usuarios y Perfiles</Heading>
      <Text type="text2" color="secondary">
        Catálogo de roles extraído de los flujos homologados, y usuarios de ejemplo. Usa el selector &quot;Actuar
        como&quot; del encabezado para simular las aprobaciones de cada perfil.
      </Text>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, margin: "20px 0" }}>
        {roles?.map((role) => (
          <div key={role.id} style={{ border: "1px solid var(--ui-border-color, #e6e9ef)", borderRadius: 10, padding: 14, background: "#fff" }}>
            <RoleTag roleId={role.id} roleName={role.name} />
            <Text type="text3" color="secondary" style={{ marginTop: 6, display: "block" }}>
              {role.area}
            </Text>
            <Text type="text3" style={{ marginTop: 6, display: "block" }}>
              {role.description}
            </Text>
          </div>
        ))}
      </div>

      <Heading type="h3">Usuarios</Heading>
      <div style={{ marginTop: 12 }}>
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
                  <TableCell>{user.name}</TableCell>
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
  );
}

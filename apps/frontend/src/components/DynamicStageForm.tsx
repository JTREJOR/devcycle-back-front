"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button, Dropdown, TextArea, TextField, Toggle } from "@vibe/core";
import type { FieldDef, Project, Stage, SubStep } from "@devcycle/shared";
import { usePatchProject } from "@/lib/queries";

interface Props {
  project: Project;
  stage: Stage;
  subStep: SubStep;
}

type FormValues = Record<string, unknown>;

function TableField({ field, control, name }: { field: FieldDef; control: any; name: string }) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="dynamic-form__field dynamic-form__field--wide">
      <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>{field.label}</label>
      <table className="dynamic-table">
        <thead>
          <tr>
            {field.columns?.map((col) => (
              <th key={col.id}>{col.label}</th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {fields.map((row, index) => (
            <tr key={row.id}>
              {field.columns?.map((col) => (
                <td key={col.id}>
                  <Controller
                    control={control}
                    name={`${name}.${index}.${col.id}`}
                    render={({ field: f }) => (
                      <input
                        style={{ border: "none", width: "100%", font: "inherit" }}
                        value={(f.value as string) ?? ""}
                        onChange={(e) => f.onChange(e.target.value)}
                      />
                    )}
                  />
                </td>
              ))}
              <td>
                <button type="button" onClick={() => remove(index)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button size="small" kind="tertiary" onClick={() => append({})}>
        + Agregar fila
      </Button>
    </div>
  );
}

export function DynamicStageForm({ project, stage, subStep }: Props) {
  const patchProject = usePatchProject();
  const fields = subStep.formFields ?? [];
  const savedValues = project.stageData[stage.id] ?? {};

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: savedValues,
  });

  useEffect(() => {
    reset(project.stageData[stage.id] ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subStep.id, project.id]);

  if (fields.length === 0) return null;

  function onSubmit(values: FormValues) {
    patchProject.mutate({ id: project.id, stageData: { [stage.id]: values } });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 10 }}>
      <div className="dynamic-form">
        {fields.map((field) => (
          <FieldRenderer key={field.id} field={field} control={control} name={field.id} />
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <Button type="submit" size="small" loading={patchProject.isPending}>
          Guardar
        </Button>
        {formState.isSubmitSuccessful && !formState.isDirty && (
          <span style={{ marginLeft: 8, fontSize: 12, color: "#00854d" }}>Guardado</span>
        )}
      </div>
    </form>
  );
}

function FieldRenderer({ field, control, name }: { field: FieldDef; control: any; name: string }) {
  const wideTypes: FieldDef["type"][] = ["textarea", "table"];
  const wrapperClass = `dynamic-form__field ${wideTypes.includes(field.type) ? "dynamic-form__field--wide" : ""}`;

  if (field.type === "table") {
    return <TableField field={field} control={control} name={name} />;
  }

  return (
    <div className={wrapperClass}>
      <Controller
        control={control}
        name={name}
        render={({ field: f }) => {
          switch (field.type) {
            case "textarea":
              return (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>{field.label}</label>
                  <TextArea placeholder={field.placeholder} value={(f.value as string) ?? ""} onChange={(e) => f.onChange(e.target.value)} />
                </div>
              );
            case "select":
              return (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>{field.label}</label>
                  <Dropdown
                    size="small"
                    placeholder={field.placeholder ?? "Selecciona…"}
                    options={field.options ?? []}
                    value={(field.options ?? []).find((o) => o.value === f.value) ?? undefined}
                    onChange={(opt: any) => f.onChange(opt?.value)}
                  />
                </div>
              );
            case "multiselect":
              return (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>{field.label}</label>
                  <Dropdown
                    size="small"
                    multi
                    placeholder={field.placeholder ?? "Selecciona…"}
                    options={field.options ?? []}
                    value={(field.options ?? []).filter((o) => (f.value as string[] | undefined)?.includes(o.value))}
                    onChange={(opts: any[]) => f.onChange(opts.map((o) => o.value))}
                  />
                </div>
              );
            case "toggle":
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
                  <Toggle isSelected={Boolean(f.value)} onChange={(value) => f.onChange(value)} />
                  <span style={{ fontSize: 13 }}>{field.label}</span>
                </div>
              );
            case "number":
            case "currency":
              return (
                <TextField
                  title={field.label}
                  type="number"
                  placeholder={field.placeholder}
                  value={f.value === undefined || f.value === null ? "" : String(f.value)}
                  onChange={(value) => f.onChange(value === "" ? undefined : Number(value))}
                />
              );
            case "date":
              return (
                <TextField
                  title={field.label}
                  type="date"
                  value={(f.value as string) ?? ""}
                  onChange={(value) => f.onChange(value)}
                />
              );
            case "file":
              return (
                <TextField
                  title={field.label}
                  placeholder="Nombre del archivo (usa la zona de carga de documentos)"
                  value={(f.value as string) ?? ""}
                  onChange={(value) => f.onChange(value)}
                />
              );
            default:
              return (
                <TextField
                  title={field.label}
                  placeholder={field.placeholder}
                  value={(f.value as string) ?? ""}
                  onChange={(value) => f.onChange(value)}
                />
              );
          }
        }}
      />
    </div>
  );
}

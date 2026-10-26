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
    <div className="col-span-full">
      <label className="mb-1.5 block text-[13px] font-semibold text-text-main">
        {field.label}
      </label>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {field.columns?.map((col) => (
              <th
                key={col.id}
                className="border border-border-default px-2.5 py-2 text-left font-semibold text-text-main"
              >
                {col.label}
              </th>
            ))}
            <th className="border border-border-default px-2.5 py-2 text-left" />
          </tr>
        </thead>
        <tbody>
          {fields.map((row, index) => (
            <tr key={row.id}>
              {field.columns?.map((col) => (
                <td key={col.id} className="border border-border-default px-2.5 py-2 text-left">
                  <Controller
                    control={control}
                    name={`${name}.${index}.${col.id}`}
                    render={({ field: f }) => (
                      <input
                        className="w-full border-none bg-transparent font-sans text-inherit outline-none"
                        value={(f.value as string) ?? ""}
                        onChange={(e) => f.onChange(e.target.value)}
                      />
                    )}
                  />
                </td>
              ))}
              <td className="border border-border-default px-2.5 py-2 text-left">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="cursor-pointer border-none bg-transparent text-text-secondary hover:text-danger-500"
                >
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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2.5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {fields.map((field) => (
          <FieldRenderer key={field.id} field={field} control={control} name={field.id} />
        ))}
      </div>
      <div className="mt-3 flex items-center">
        <Button type="submit" size="small" loading={patchProject.isPending}>
          Guardar
        </Button>
        {formState.isSubmitSuccessful && !formState.isDirty && (
          <span className="ml-2 text-xs text-success-500">Guardado</span>
        )}
      </div>
    </form>
  );
}

function FieldRenderer({ field, control, name }: { field: FieldDef; control: any; name: string }) {
  const wideTypes: FieldDef["type"][] = ["textarea", "table"];
  const wrapperClass = wideTypes.includes(field.type) ? "col-span-full" : "";

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
                  <label className="mb-1 block text-[13px] font-semibold text-text-main">
                    {field.label}
                  </label>
                  <TextArea placeholder={field.placeholder} value={(f.value as string) ?? ""} onChange={(e) => f.onChange(e.target.value)} />
                </div>
              );
            case "select":
              return (
                <div>
                  <label className="mb-1 block text-[13px] font-semibold text-text-main">
                    {field.label}
                  </label>
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
                  <label className="mb-1 block text-[13px] font-semibold text-text-main">
                    {field.label}
                  </label>
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
                <div className="mt-4.5 flex items-center gap-2">
                  <Toggle isSelected={Boolean(f.value)} onChange={(value) => f.onChange(value)} />
                  <span className="text-[13px] text-text-main">{field.label}</span>
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

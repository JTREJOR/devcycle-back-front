"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Priority } from "@devcycle/shared";
import { useCreateProject } from "@/lib/queries";

const STEPS = [
  { title: "Solicitud", role: "Director de Negocio" },
  { title: "Perfilamiento y Priorización", role: "PMO" },
  { title: "Canvas de la Idea", role: "Director de Negocio" },
  { title: "Calidad y Contexto", role: "Business Partner" },
  { title: "Asignación y Envío", role: "Líder de Arquitectura" },
] as const;

const DISCIPLINES = [
  "Arquitectura",
  "Desarrollo",
  "Infraestructura",
  "UX",
  "QA",
  "Business Partner",
] as const;

const ARCHITECTS = [
  "Karla Nájera",
  "Alejandro Ramírez",
  "Mariana López",
  "Carlos Mendoza",
] as const;

type TechProcessAnswer = "si" | "no" | "";
type CanvasQuality = "completa" | "ajustes" | "";

interface WizardForm {
  name: string;
  area: string;
  owner: string;
  description: string;
  isTechProcess: TechProcessAnswer;
  priority: Priority;
  businessPortfolio: string;
  prioritizationJustification: string;
  objective: string;
  problem: string;
  benefits: string;
  scope: string;
  disciplines: string[];
  risks: string;
  canvasQuality: CanvasQuality;
  businessContext: string;
  domainArchitect: string;
  technicalComments: string;
}

const INITIAL_FORM: WizardForm = {
  name: "",
  area: "",
  owner: "",
  description: "",
  isTechProcess: "",
  priority: "Media",
  businessPortfolio: "",
  prioritizationJustification: "",
  objective: "",
  problem: "",
  benefits: "",
  scope: "",
  disciplines: [],
  risks: "",
  canvasQuality: "",
  businessContext: "",
  domainArchitect: "",
  technicalComments: "",
};

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<WizardForm>(INITIAL_FORM);
  const [validationMessage, setValidationMessage] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  const updateField = <K extends keyof WizardForm>(field: K, value: WizardForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setValidationMessage("");
    setSubmissionError("");
  };

  const toggleDiscipline = (discipline: string) => {
    updateField(
      "disciplines",
      form.disciplines.includes(discipline)
        ? form.disciplines.filter((item) => item !== discipline)
        : [...form.disciplines, discipline],
    );
  };

  const goNext = () => {
    if (currentStep === 0 && (!form.name.trim() || !form.area.trim())) {
      setValidationMessage("Completa el título y el área solicitante para continuar.");
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, STEPS.length - 1));
    setValidationMessage("");
  };

  const goPrevious = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    setValidationMessage("");
  };

  const submitProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentStep < STEPS.length - 1) {
      goNext();
      return;
    }
    if (!form.name.trim() || !form.area.trim()) {
      setCurrentStep(0);
      setValidationMessage("Completa el título y el área solicitante para registrar la iniciativa.");
      return;
    }

    setSubmissionError("");
    try {
      await createProject.mutateAsync({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        area: form.area.trim(),
        owner: form.owner.trim() || undefined,
        priority: form.priority,
        stageData: {
          priorizacion: {
            isTechProcess: form.isTechProcess === "si",
            businessPortfolio: form.businessPortfolio,
            prioritizationJustification: form.prioritizationJustification,
            objective: form.objective,
            problem: form.problem,
            benefits: form.benefits,
            scope: form.scope,
            disciplines: form.disciplines,
            risks: form.risks,
            canvasQuality: form.canvasQuality,
            businessContext: form.businessContext,
            domainArchitect: form.domainArchitect,
            technicalComments: form.technicalComments,
          },
        },
      });
      router.push("/");
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? `No fue posible registrar la iniciativa: ${error.message}`
          : "No fue posible registrar la iniciativa. Intenta nuevamente.",
      );
    }
  };

  return (
    <div className="new-project-page">
      <header className="new-project-page__header">
        <Link className="new-project-page__back-link" href="/">
          ← Volver al Portafolio
        </Link>
        <h1>Nueva Iniciativa: Fase 0 - Priorización</h1>
        <p>Flujo colaborativo de registro, evaluación y conceptualización de la idea.</p>
      </header>

      <ol className="wizard-stepper" aria-label="Progreso de registro de iniciativa">
        {STEPS.map((step, index) => (
          <li
            className={`wizard-step-item ${
              index === currentStep ? "wizard-step-item--active" : ""
            } ${index < currentStep ? "wizard-step-item--complete" : ""}`}
            key={step.title}
          >
            <button
              type="button"
              onClick={() => index <= currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              aria-current={index === currentStep ? "step" : undefined}
            >
              <span className="wizard-step-item__number">{index < currentStep ? "✓" : index + 1}</span>
              <span className="wizard-step-item__copy">
                <strong>{step.title}</strong>
                <small>{step.role}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <form className="wizard-card" onSubmit={submitProject}>
        {currentStep === 0 && (
          <section className="wizard-step-content" aria-labelledby="step-1-title">
            <div className="wizard-section-heading">
              <span className="wizard-role-badge">DIRECTOR_DE_NEGOCIO</span>
              <h2 id="step-1-title">Solicitud de la iniciativa</h2>
              <p>Registra la información inicial que permitirá identificar y perfilar la idea.</p>
            </div>
            <div className="wizard-form-grid">
              <label className="wizard-field">
                <span>Título de la iniciativa *</span>
                <input
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Ej. Renovación de onboarding digital"
                  required
                />
              </label>
              <label className="wizard-field">
                <span>Área solicitante *</span>
                <input
                  value={form.area}
                  onChange={(event) => updateField("area", event.target.value)}
                  placeholder="Ej. Banca Digital, Finanzas"
                  required
                />
              </label>
              <label className="wizard-field wizard-field--full">
                <span>Patrocinador / Líder de negocio</span>
                <input
                  value={form.owner}
                  onChange={(event) => updateField("owner", event.target.value)}
                  placeholder="Nombre del responsable de negocio"
                />
              </label>
              <label className="wizard-field wizard-field--full">
                <span>Descripción inicial del requerimiento</span>
                <textarea
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe brevemente la necesidad y el resultado esperado."
                  rows={5}
                />
              </label>
            </div>
          </section>
        )}

        {currentStep === 1 && (
          <section className="wizard-step-content" aria-labelledby="step-2-title">
            <div className="wizard-section-heading">
              <span className="wizard-role-badge">PMO</span>
              <h2 id="step-2-title">Perfilamiento y Priorización</h2>
              <p>Clasifica la solicitud y define su posición inicial dentro de la cartera.</p>
            </div>

            <fieldset className="wizard-choice-group">
              <legend>¿Es un proceso de TI?</legend>
              <div className="wizard-choice-row">
                {(["si", "no"] as const).map((answer) => (
                  <button
                    className={`wizard-choice-button ${
                      form.isTechProcess === answer ? "wizard-choice-button--selected" : ""
                    }`}
                    type="button"
                    key={answer}
                    onClick={() => updateField("isTechProcess", answer)}
                    aria-pressed={form.isTechProcess === answer}
                  >
                    {answer === "si" ? "Sí" : "No"}
                  </button>
                ))}
              </div>
            </fieldset>

            {form.isTechProcess === "no" && (
              <div className="wizard-warning" role="alert">
                <strong>Atención:</strong> Esta iniciativa se canalizará por el proceso de proyectos
                no tecnológicos (fuera de alcance de este sistema).
              </div>
            )}

            <fieldset className="wizard-choice-group">
              <legend>Nivel de prioridad</legend>
              <div className="wizard-choice-row">
                {(["Alta", "Media", "Baja"] as Priority[]).map((priority) => (
                  <button
                    className={`wizard-priority-pill wizard-priority-pill--${priority.toLowerCase()} ${
                      form.priority === priority ? "wizard-priority-pill--selected" : ""
                    }`}
                    type="button"
                    key={priority}
                    onClick={() => updateField("priority", priority)}
                    aria-pressed={form.priority === priority}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="wizard-form-grid">
              <label className="wizard-field wizard-field--full">
                <span>Cartera de negocio asignada</span>
                <input
                  value={form.businessPortfolio}
                  onChange={(event) => updateField("businessPortfolio", event.target.value)}
                  placeholder="Ej. Transformación Digital"
                />
              </label>
              <label className="wizard-field wizard-field--full">
                <span>Justificación de priorización</span>
                <textarea
                  value={form.prioritizationJustification}
                  onChange={(event) =>
                    updateField("prioritizationJustification", event.target.value)
                  }
                  placeholder="Explica el valor, urgencia e impacto esperado."
                  rows={4}
                />
              </label>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <section className="wizard-step-content" aria-labelledby="step-3-title">
            <div className="wizard-section-heading">
              <span className="wizard-role-badge">DIRECTOR_DE_NEGOCIO</span>
              <h2 id="step-3-title">Canvas de la Idea</h2>
              <p>
                Conceptualiza la iniciativa para alinear el problema, el valor esperado y las
                capacidades necesarias antes de estimarla.
              </p>
            </div>

            <div className="canvas-grid">
              <label className="canvas-card">
                <span>1. Objetivo de la iniciativa</span>
                <textarea
                  value={form.objective}
                  onChange={(event) => updateField("objective", event.target.value)}
                  placeholder="¿Qué resultado busca alcanzar?"
                  rows={5}
                />
              </label>
              <label className="canvas-card">
                <span>2. Problema a resolver / Dolor actual</span>
                <textarea
                  value={form.problem}
                  onChange={(event) => updateField("problem", event.target.value)}
                  placeholder="Describe la situación actual y sus impactos."
                  rows={5}
                />
              </label>
              <label className="canvas-card">
                <span>3. Beneficios esperados y ROI preliminar</span>
                <textarea
                  value={form.benefits}
                  onChange={(event) => updateField("benefits", event.target.value)}
                  placeholder="Incluye beneficios cuantitativos y cualitativos."
                  rows={5}
                />
              </label>
              <label className="canvas-card">
                <span>4. Alcance preliminar</span>
                <textarea
                  value={form.scope}
                  onChange={(event) => updateField("scope", event.target.value)}
                  placeholder="¿Qué incluye y qué queda fuera?"
                  rows={5}
                />
              </label>
              <fieldset className="canvas-card">
                <legend>5. Disciplinas y equipo requerido</legend>
                <div className="wizard-chip-list">
                  {DISCIPLINES.map((discipline) => (
                    <button
                      className={`wizard-chip ${
                        form.disciplines.includes(discipline) ? "wizard-chip--selected" : ""
                      }`}
                      type="button"
                      key={discipline}
                      onClick={() => toggleDiscipline(discipline)}
                      aria-pressed={form.disciplines.includes(discipline)}
                    >
                      {discipline}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="canvas-card">
                <span>6. Riesgos iniciales</span>
                <textarea
                  value={form.risks}
                  onChange={(event) => updateField("risks", event.target.value)}
                  placeholder="Registra dependencias, supuestos o riesgos conocidos."
                  rows={5}
                />
              </label>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="wizard-step-content" aria-labelledby="step-4-title">
            <div className="wizard-section-heading">
              <span className="wizard-role-badge">BUSINESS_PARTNER</span>
              <h2 id="step-4-title">Calidad y Contexto</h2>
              <p>Valida que la idea tenga información suficiente para pasar a revisión técnica.</p>
            </div>

            <fieldset className="wizard-choice-group">
              <legend>¿La información del Canvas es completa y de calidad?</legend>
              <div className="wizard-quality-options">
                <button
                  className={`wizard-quality-option ${
                    form.canvasQuality === "completa" ? "wizard-quality-option--selected" : ""
                  }`}
                  type="button"
                  onClick={() => updateField("canvasQuality", "completa")}
                  aria-pressed={form.canvasQuality === "completa"}
                >
                  Sí, información completa y clara
                </button>
                <button
                  className={`wizard-quality-option ${
                    form.canvasQuality === "ajustes" ? "wizard-quality-option--selected" : ""
                  }`}
                  type="button"
                  onClick={() => updateField("canvasQuality", "ajustes")}
                  aria-pressed={form.canvasQuality === "ajustes"}
                >
                  Requiere ajustes por parte de Negocio
                </button>
              </div>
            </fieldset>

            <label className="wizard-field">
              <span>Observaciones o contexto adicional de negocio</span>
              <textarea
                value={form.businessContext}
                onChange={(event) => updateField("businessContext", event.target.value)}
                placeholder="Agrega condiciones, recomendaciones o contexto relevante."
                rows={6}
              />
            </label>
          </section>
        )}

        {currentStep === 4 && (
          <section className="wizard-step-content" aria-labelledby="step-5-title">
            <div className="wizard-section-heading">
              <span className="wizard-role-badge">LIDER_ARQUITECTURA</span>
              <h2 id="step-5-title">Asignación y Envío</h2>
              <p>Asigna la revisión técnica y confirma los datos que se enviarán a Estimación.</p>
            </div>

            <div className="wizard-form-grid">
              <label className="wizard-field">
                <span>Arquitecto de Dominio</span>
                <select
                  value={form.domainArchitect}
                  onChange={(event) => updateField("domainArchitect", event.target.value)}
                >
                  <option value="">Selecciona un arquitecto</option>
                  {ARCHITECTS.map((architect) => (
                    <option value={architect} key={architect}>
                      {architect}
                    </option>
                  ))}
                </select>
              </label>
              <label className="wizard-field">
                <span>Comentarios de recepción técnica</span>
                <textarea
                  value={form.technicalComments}
                  onChange={(event) => updateField("technicalComments", event.target.value)}
                  placeholder="Agrega indicaciones para la revisión técnica."
                  rows={4}
                />
              </label>
            </div>

            <div className="wizard-summary">
              <h3>Resumen de la iniciativa</h3>
              <dl>
                <div>
                  <dt>Título</dt>
                  <dd>{form.name || "Sin capturar"}</dd>
                </div>
                <div>
                  <dt>Área</dt>
                  <dd>{form.area || "Sin capturar"}</dd>
                </div>
                <div>
                  <dt>Patrocinador</dt>
                  <dd>{form.owner || "Por asignar"}</dd>
                </div>
                <div>
                  <dt>Prioridad</dt>
                  <dd>{form.priority}</dd>
                </div>
                <div>
                  <dt>Proceso de TI</dt>
                  <dd>
                    {form.isTechProcess === "si"
                      ? "Sí"
                      : form.isTechProcess === "no"
                        ? "No"
                        : "Sin definir"}
                  </dd>
                </div>
                <div>
                  <dt>Disciplinas</dt>
                  <dd>{form.disciplines.join(", ") || "Sin definir"}</dd>
                </div>
                <div>
                  <dt>Arquitecto</dt>
                  <dd>{form.domainArchitect || "Por asignar"}</dd>
                </div>
              </dl>
            </div>
          </section>
        )}

        {validationMessage && (
          <p className="wizard-form-message" role="alert">
            {validationMessage}
          </p>
        )}
        {submissionError && (
          <p className="wizard-form-message wizard-form-message--error" role="alert">
            {submissionError}
          </p>
        )}

        <nav className="wizard-nav" aria-label="Navegación del formulario">
          <button
            className="wizard-button wizard-button--secondary"
            type="button"
            onClick={goPrevious}
            disabled={currentStep === 0 || createProject.isPending}
          >
            Anterior
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button className="wizard-button wizard-button--primary" type="submit">
              Siguiente
            </button>
          ) : (
            <button
              className="wizard-button wizard-button--submit"
              type="submit"
              disabled={createProject.isPending}
            >
              {createProject.isPending
                ? "Registrando iniciativa..."
                : "Registrar iniciativa y avanzar a Estimación"}
            </button>
          )}
        </nav>
      </form>
    </div>
  );
}

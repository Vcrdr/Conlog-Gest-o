import { useEffect, useState, useCallback } from "react";

export const COMPETENCIES = [
  "Comunicação",
  "Organização",
  "Trabalho em equipe",
  "Liderança",
  "Resolução de problemas",
  "Proatividade",
  "Gestão de tempo",
] as const;

export const DEPARTMENTS = [
  "Administrativo",
  "Financeiro",
  "Comercial",
  "Operações",
  "RH",
] as const;

export type Competency = (typeof COMPETENCIES)[number];
export type Department = (typeof DEPARTMENTS)[number];

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: Department;
}

export interface Evaluation {
  id: string;
  employeeId: string;
  date: string; // ISO yyyy-mm-dd
  scores: Record<Competency, number>;
  notes?: string;
}

export interface DashboardData {
  employees: Employee[];
  evaluations: Evaluation[];
}

const KEY = "conlog-dashboard-v1";

const seed = (): DashboardData => {
  const employees: Employee[] = [
    { id: "e1", name: "Arthur Sant'tana", role: "Administrador", department: "RH" },
    { id: "e2", name: "Cleir Leal", role: "Coordenadora", department: "RH" },
    { id: "e3", name: "Mariana Costa", role: "Analista Financeiro", department: "Financeiro" },
    { id: "e4", name: "Bruno Almeida", role: "Operador Logístico", department: "Operações" },
    { id: "e5", name: "Júlia Pereira", role: "Comercial Pleno", department: "Comercial" },
    { id: "e6", name: "Lucas Martins", role: "Assistente Adm.", department: "Administrativo" },
  ];
  const mkScores = (vals: number[]): Record<Competency, number> =>
    Object.fromEntries(COMPETENCIES.map((c, i) => [c, vals[i]])) as Record<Competency, number>;
  const today = new Date();
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const months = [0, 1, 2, 3].map((m) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - (3 - m));
    return iso(d);
  });
  const evaluations: Evaluation[] = [
    { id: "v1", employeeId: "e1", date: months[0], scores: mkScores([4, 5, 4, 5, 4, 5, 4]) },
    { id: "v2", employeeId: "e2", date: months[0], scores: mkScores([5, 4, 5, 4, 5, 4, 5]) },
    { id: "v3", employeeId: "e3", date: months[1], scores: mkScores([4, 4, 3, 3, 4, 4, 4]) },
    { id: "v4", employeeId: "e4", date: months[1], scores: mkScores([3, 4, 4, 3, 3, 3, 4]) },
    { id: "v5", employeeId: "e5", date: months[2], scores: mkScores([5, 4, 5, 4, 4, 5, 4]) },
    { id: "v6", employeeId: "e6", date: months[2], scores: mkScores([3, 3, 4, 2, 3, 3, 3]) },
    { id: "v7", employeeId: "e1", date: months[3], scores: mkScores([5, 5, 5, 5, 5, 5, 5]) },
    { id: "v8", employeeId: "e3", date: months[3], scores: mkScores([4, 5, 4, 4, 4, 5, 4]) },
  ];
  return { employees, evaluations };
};

function load(): DashboardData {
  if (typeof window === "undefined") return { employees: [], evaluations: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({ employees: [], evaluations: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setData(load());
    setReady(true);
  }, []);

  const persist = useCallback((next: DashboardData) => {
    setData(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const addEmployee = (e: Omit<Employee, "id">) =>
    persist({ ...data, employees: [...data.employees, { ...e, id: crypto.randomUUID() }] });

  const removeEmployee = (id: string) =>
    persist({
      employees: data.employees.filter((x) => x.id !== id),
      evaluations: data.evaluations.filter((v) => v.employeeId !== id),
    });

  const addEvaluation = (v: Omit<Evaluation, "id">) =>
    persist({ ...data, evaluations: [...data.evaluations, { ...v, id: crypto.randomUUID() }] });

  const removeEvaluation = (id: string) =>
    persist({ ...data, evaluations: data.evaluations.filter((v) => v.id !== id) });

  const importData = (next: DashboardData) => persist(next);

  const reset = () => persist(seed());

  return {
    data,
    ready,
    addEmployee,
    removeEmployee,
    addEvaluation,
    removeEvaluation,
    importData,
    reset,
  };
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Activity,
  Users,
  TrendingUp,
  Target,
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { toast, Toaster } from "sonner";
import {
  COMPETENCIES,
  DEPARTMENTS,
  type Competency,
  type Department,
  useDashboardData,
} from "@/lib/dashboard-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Gestão ADM. | Conlog — Dashboard" },
      {
        name: "description",
        content:
          "Dashboard de gestão administrativa Conlog: indicadores, avaliações e desempenho do time, com dados alimentáveis e atualizáveis.",
      },
    ],
  }),
});

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function Dashboard() {
  const {
    data,
    ready,
    addEmployee,
    removeEmployee,
    addEvaluation,
    removeEvaluation,
    importData,
    reset,
  } = useDashboardData();

  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredEmployees = useMemo(
    () =>
      data.employees.filter(
        (e) =>
          (deptFilter === "all" || e.department === deptFilter) &&
          (search === "" || e.name.toLowerCase().includes(search.toLowerCase())),
      ),
    [data.employees, deptFilter, search],
  );

  const filteredEvals = useMemo(
    () =>
      data.evaluations.filter((v) =>
        filteredEmployees.some((e) => e.id === v.employeeId),
      ),
    [data.evaluations, filteredEmployees],
  );

  const avgOverall = useMemo(() => {
    if (filteredEvals.length === 0) return 0;
    let total = 0;
    let count = 0;
    for (const ev of filteredEvals) {
      for (const c of COMPETENCIES) {
        total += ev.scores[c] ?? 0;
        count++;
      }
    }
    return count ? total / count : 0;
  }, [filteredEvals]);

  const competencyAverages = useMemo(
    () =>
      COMPETENCIES.map((c) => {
        const vals = filteredEvals.map((v) => v.scores[c]).filter((n) => typeof n === "number");
        const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
        return { competency: c, media: Number(avg.toFixed(2)) };
      }),
    [filteredEvals],
  );

  const departmentAverages = useMemo(
    () =>
      DEPARTMENTS.map((d) => {
        const empIds = data.employees.filter((e) => e.department === d).map((e) => e.id);
        const evs = data.evaluations.filter((v) => empIds.includes(v.employeeId));
        let total = 0;
        let count = 0;
        for (const ev of evs) {
          for (const c of COMPETENCIES) {
            total += ev.scores[c];
            count++;
          }
        }
        return { setor: d, media: count ? Number((total / count).toFixed(2)) : 0 };
      }),
    [data],
  );

  const evolution = useMemo(() => {
    const byMonth = new Map<string, { total: number; count: number }>();
    for (const ev of filteredEvals) {
      const m = ev.date.slice(0, 7);
      const agg = byMonth.get(m) ?? { total: 0, count: 0 };
      for (const c of COMPETENCIES) {
        agg.total += ev.scores[c];
        agg.count++;
      }
      byMonth.set(m, agg);
    }
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, v]) => ({ mes, media: Number((v.total / v.count).toFixed(2)) }));
  }, [filteredEvals]);

  const departmentDistribution = useMemo(
    () =>
      DEPARTMENTS.map((d) => ({
        name: d,
        value: data.employees.filter((e) => e.department === d).length,
      })).filter((x) => x.value > 0),
    [data.employees],
  );

  const topPerformers = useMemo(() => {
    const map = new Map<string, { total: number; count: number }>();
    for (const ev of data.evaluations) {
      const agg = map.get(ev.employeeId) ?? { total: 0, count: 0 };
      for (const c of COMPETENCIES) {
        agg.total += ev.scores[c];
        agg.count++;
      }
      map.set(ev.employeeId, agg);
    }
    return data.employees
      .map((e) => {
        const a = map.get(e.id);
        return {
          ...e,
          media: a && a.count ? Number((a.total / a.count).toFixed(2)) : 0,
          avaliacoes: data.evaluations.filter((v) => v.employeeId === e.id).length,
        };
      })
      .sort((a, b) => b.media - a.media);
  }, [data]);

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conlog-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Dados exportados");
  }

  function importJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed.employees || !parsed.evaluations) throw new Error("Arquivo inválido");
        importData(parsed);
        toast.success("Dados importados");
      } catch (e) {
        toast.error("Falha ao importar arquivo");
      }
    };
    reader.readAsText(file);
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <Header
        onExport={exportJson}
        onImport={importJson}
        onReset={() => {
          reset();
          toast.success("Dados restaurados");
        }}
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6 space-y-6 sm:px-6 lg:px-8">
        <FiltersBar
          deptFilter={deptFilter}
          setDeptFilter={setDeptFilter}
          search={search}
          setSearch={setSearch}
        />

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            icon={<Users className="h-4 w-4" />}
            label="Funcionários"
            value={filteredEmployees.length.toString()}
            sub={`${data.employees.length} no total`}
          />
          <KpiCard
            icon={<Activity className="h-4 w-4" />}
            label="Avaliações"
            value={filteredEvals.length.toString()}
            sub="No filtro atual"
          />
          <KpiCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Média geral"
            value={avgOverall.toFixed(2)}
            sub="Escala 1 a 5"
            accent
          />
          <KpiCard
            icon={<Target className="h-4 w-4" />}
            label="Top performer"
            value={topPerformers[0]?.name.split(" ")[0] ?? "—"}
            sub={topPerformers[0] ? `Média ${topPerformers[0].media}` : "Sem dados"}
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartCard title="Evolução mensal" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={evolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="media"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ fill: "var(--primary)", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribuição por setor">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {departmentDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Média por competência">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={competencyAverages}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="competency" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
                <Radar
                  name="Média"
                  dataKey="media"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.4}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Desempenho por setor">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="setor" stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="media" radius={[8, 8, 0, 0]}>
                  {departmentAverages.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <Tabs defaultValue="employees" className="w-full">
          <TabsList>
            <TabsTrigger value="employees">Funcionários</TabsTrigger>
            <TabsTrigger value="evaluations">Avaliações</TabsTrigger>
          </TabsList>

          <TabsContent value="employees">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle>Funcionários cadastrados</CardTitle>
                <NewEmployeeDialog onAdd={addEmployee} />
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Setor</TableHead>
                        <TableHead className="text-right">Média</TableHead>
                        <TableHead className="text-right">Avaliações</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topPerformers
                        .filter((e) => filteredEmployees.some((f) => f.id === e.id))
                        .map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.name}</TableCell>
                            <TableCell className="text-muted-foreground">{e.role}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{e.department}</Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              <span
                                className={
                                  e.media >= 4
                                    ? "text-primary font-semibold"
                                    : e.media >= 3
                                      ? "font-medium"
                                      : "text-destructive font-medium"
                                }
                              >
                                {e.media || "—"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">{e.avaliacoes}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeEmployee(e.id)}
                                aria-label={`Remover ${e.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evaluations">
            <Card className="shadow-[var(--shadow-card)]">
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle>Histórico de avaliações</CardTitle>
                <NewEvaluationDialog employees={data.employees} onAdd={addEvaluation} />
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Funcionário</TableHead>
                        <TableHead className="text-right">Média</TableHead>
                        {COMPETENCIES.map((c) => (
                          <TableHead key={c} className="text-right">
                            {c.split(" ")[0]}
                          </TableHead>
                        ))}
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...filteredEvals]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((v) => {
                          const emp = data.employees.find((e) => e.id === v.employeeId);
                          const vals = COMPETENCIES.map((c) => v.scores[c] ?? 0);
                          const media = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
                          return (
                            <TableRow key={v.id}>
                              <TableCell className="tabular-nums">{v.date}</TableCell>
                              <TableCell className="font-medium">{emp?.name ?? "—"}</TableCell>
                              <TableCell className="text-right font-semibold text-primary tabular-nums">
                                {media}
                              </TableCell>
                              {COMPETENCIES.map((c) => (
                                <TableCell key={c} className="text-right tabular-nums">
                                  {v.scores[c]}
                                </TableCell>
                              ))}
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeEvaluation(v.id)}
                                  aria-label="Remover avaliação"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="pt-4 pb-8 text-center text-xs text-muted-foreground">
          Gestão ADM. | Conlog · Dados salvos localmente · Exporte para fazer backup
        </footer>
      </main>
    </div>
  );
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--card-foreground)",
};

function Header({
  onExport,
  onImport,
  onReset,
}: {
  onExport: () => void;
  onImport: (f: File) => void;
  onReset: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground font-bold shadow-[var(--shadow-glow)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            C
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Gestão ADM. | Conlog</h1>
            <p className="text-xs text-muted-foreground">Dashboard de desempenho · alimentável e atualizável</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="inline-flex">
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onImport(f);
                e.target.value = "";
              }}
            />
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Importar
              </span>
            </Button>
          </label>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Resetar
          </Button>
        </div>
      </div>
    </header>
  );
}

function FiltersBar({
  deptFilter,
  setDeptFilter,
  search,
  setSearch,
}: {
  deptFilter: string;
  setDeptFilter: (s: string) => void;
  search: string;
  setSearch: (s: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar funcionário..."
          className="pl-9"
        />
      </div>
      <Select value={deptFilter} onValueChange={setDeptFilter}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Setor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os setores</SelectItem>
          {DEPARTMENTS.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <Card
      className="overflow-hidden shadow-[var(--shadow-card)]"
      style={accent ? { background: "var(--gradient-primary)", color: "var(--primary-foreground)" } : undefined}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${accent ? "opacity-90" : "text-muted-foreground"}`}>
            {label}
          </span>
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-md ${
              accent ? "bg-white/20" : "bg-accent text-accent-foreground"
            }`}
          >
            {icon}
          </span>
        </div>
        <div className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{value}</div>
        <div className={`mt-1 text-xs ${accent ? "opacity-90" : "text-muted-foreground"}`}>{sub}</div>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`shadow-[var(--shadow-card)] ${className ?? ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function NewEmployeeDialog({
  onAdd,
}: {
  onAdd: (e: { name: string; role: string; department: Department }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState<Department>("Administrativo");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Novo funcionário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar funcionário</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="emp-name">Nome</Label>
            <Input id="emp-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emp-role">Cargo</Label>
            <Input id="emp-role" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Setor</Label>
            <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!name.trim() || !role.trim()) {
                toast.error("Preencha nome e cargo");
                return;
              }
              onAdd({ name: name.trim(), role: role.trim(), department });
              toast.success("Funcionário cadastrado");
              setName("");
              setRole("");
              setOpen(false);
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewEvaluationDialog({
  employees,
  onAdd,
}: {
  employees: { id: string; name: string }[];
  onAdd: (v: {
    employeeId: string;
    date: string;
    scores: Record<Competency, number>;
    notes?: string;
  }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [scores, setScores] = useState<Record<Competency, number>>(
    Object.fromEntries(COMPETENCIES.map((c) => [c, 3])) as Record<Competency, number>,
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={employees.length === 0}>
          <Plus className="mr-2 h-4 w-4" /> Nova avaliação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar avaliação</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Funcionário</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ev-date">Data</Label>
              <Input
                id="ev-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2 rounded-md border border-border bg-muted/30 p-3">
            {COMPETENCIES.map((c) => (
              <div key={c} className="grid grid-cols-[1fr_auto] items-center gap-3">
                <Label className="text-sm font-normal">{c}</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setScores((s) => ({ ...s, [c]: n }))}
                      className={`h-8 w-8 rounded-md text-sm font-semibold transition ${
                        scores[c] === n
                          ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                          : "bg-card text-muted-foreground border border-border hover:bg-accent"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!employeeId) {
                toast.error("Selecione um funcionário");
                return;
              }
              onAdd({ employeeId, date, scores });
              toast.success("Avaliação registrada");
              setOpen(false);
              setEmployeeId("");
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

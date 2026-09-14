import React, { useMemo, useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";
import api from "../api/axios";

const currency = (value) => `R$ ${Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const toNumber = (value) => Number(value ?? 0);

const parseNights = (startStr, endStr) => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 0);
};

const monthName = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
};

const monthKeyFromDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const parseMonthKey = (monthKey) => {
  if (!monthKey) return null;
  const [month, year] = monthKey.split("/").map(Number);
  if (!Number.isFinite(month) || !Number.isFinite(year)) return null;
  return new Date(year, month - 1, 1);
};

const getMonthSelectorOptions = (reservas, despesas) => {
  const monthKeys = new Set();

  reservas.forEach((reserva) => {
    [reserva.checkIn, reserva.dataInicio, reserva.check_in, reserva.bookingDate].forEach((value) => {
      const monthKey = monthKeyFromDate(value);
      if (monthKey) monthKeys.add(monthKey);
    });
  });

  despesas.forEach((despesa) => {
    [despesa.paymentDate, despesa.dataPagamento, despesa.paidAt, despesa.dataVencimento, despesa.dueDate].forEach((value) => {
      const monthKey = monthKeyFromDate(value);
      if (monthKey) monthKeys.add(monthKey);
    });
  });

  const sorted = [...monthKeys].sort((a, b) => {
    const first = parseMonthKey(a);
    const second = parseMonthKey(b);
    if (!first || !second) return 0;
    return first - second;
  });

  return sorted.map((monthKey) => ({
    value: monthKey,
    label: new Date(parseMonthKey(monthKey)).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
  }));
};

export default function DashboardView() {
  const currentDate = new Date();
  const currentMonthKey = `${String(currentDate.getMonth() + 1).padStart(2, "0")}/${currentDate.getFullYear()}`;
  const [monthYear, setMonthYear] = useState(currentMonthKey);
  const [reservas, setReservas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      api.get('/agendamentos').then((res) => res.data || []).catch(() => []),
      api.get('/despesas').then((res) => res.data || []).catch(() => []),
    ])
      .then(([agendamentos, gastos]) => {
        if (mounted) {
          setReservas(agendamentos);
          setDespesas(gastos);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const monthOptions = useMemo(() => getMonthSelectorOptions(reservas, despesas), [reservas, despesas]);
  const pieColors = ['#B71C1C', '#E57373', '#4E342E', '#A1887F', '#F9A825', '#8BC34A', '#90CAF9'];

  useEffect(() => {
    if (!monthOptions.length) {
      setMonthYear(currentMonthKey);
      return;
    }

    const hasSelectedMonth = monthOptions.some((option) => option.value === monthYear);
    if (!hasSelectedMonth) {
      const fallbackMonth = monthOptions.some((option) => option.value === currentMonthKey)
        ? currentMonthKey
        : monthOptions[monthOptions.length - 1]?.value || currentMonthKey;

      setMonthYear(fallbackMonth);
    }
  }, [monthOptions, monthYear, currentMonthKey]);

  const filtered = useMemo(() => {
    const [month, year] = monthYear.split('/').map(Number);
    const selectedMonth = Number.isFinite(month) && Number.isFinite(year) ? month - 1 : new Date().getMonth();
    const selectedYear = Number.isFinite(year) ? year : new Date().getFullYear();

    const filteredReservas = reservas.filter((reserva) => {
      const start = new Date(reserva.checkIn || reserva.dataInicio || reserva.check_in || reserva.bookingDate);
      if (Number.isNaN(start.getTime())) return true;
      return start.getMonth() === selectedMonth && start.getFullYear() === selectedYear;
    });

    const filteredDespesas = despesas.filter((despesa) => {
      const paymentDate = despesa.paymentDate || despesa.dataPagamento || despesa.paidAt;
      const dueDate = despesa.dataVencimento || despesa.dueDate;
      const date = paymentDate || dueDate;
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return true;
      return parsed.getMonth() === selectedMonth && parsed.getFullYear() === selectedYear;
    });

    return { filteredReservas, filteredDespesas };
  }, [reservas, despesas, monthYear]);

  const dashboardData = useMemo(() => {
    const reservations = filtered.filteredReservas;
    const expenses = filtered.filteredDespesas;

    const totalPaidRevenue = reservations.reduce((sum, item) => sum + toNumber(item.paidAmount || item.valorPago || item.totalPrice || item.valorTotal || item.rentalAmount), 0);
    const pendingRevenue = reservations.reduce((sum, item) => sum + toNumber(item.dueAmount || item.valorPendente || 0), 0);
    const paidExpenses = expenses
      .filter((item) => (item.status || item.pago || item.paymentDate || item.dataPagamento) && String(item.status || item.pago || '').toUpperCase() !== 'PENDENTE')
      .reduce((sum, item) => sum + toNumber(item.valor || item.amount || item.valorPago || 0), 0);

    let totalNights = 0;
    let grossRevenue = 0;
    let totalNightsWeekend = 0;
    let totalNightsWeekday = 0;
    const clientMap = {};

    reservations.forEach((r) => {
      const nights = parseNights(r.checkIn || r.dataInicio || r.check_in, r.checkOut || r.dataFim || r.check_out);
      const revenue = toNumber(r.rentalAmount || r.totalPrice || r.valorTotal || r.total || 0);
      const customer = r.cliente || r.customerName || r.customer?.name || 'Cliente';

      grossRevenue += revenue;
      totalNights += nights;

      const start = new Date(r.checkIn || r.dataInicio || r.check_in || r.bookingDate);
      if (!Number.isNaN(start.getTime())) {
        const weekday = start.getDay();
        if (weekday === 0 || weekday === 6) totalNightsWeekend += nights;
        else totalNightsWeekday += nights;
      }

      clientMap[customer] = (clientMap[customer] || 0) + revenue;
    });

    const occupancyRate = totalNights > 0 ? Math.min(100, Math.round((totalNights / (30 * 5)) * 100)) : 0;
    const adr = totalNights > 0 ? grossRevenue / totalNights : 0;
    const netCash = totalPaidRevenue - paidExpenses;

    const revenueDistribution = [
      { name: 'Pago', value: totalPaidRevenue, fill: '#2e7d32' },
      { name: 'Pendente', value: pendingRevenue, fill: '#ef6c00' },
    ];

    const expenseDistribution = Object.entries(
      expenses.reduce((acc, item) => {
        const category = item.categoria || item.category || item.description || 'Outros';
        const value = toNumber(item.valor || item.amount || 0);
        if (String(item.status || '').toUpperCase() === 'PAGO' || item.paymentDate || item.dataPagamento) {
          acc[category] = (acc[category] || 0) + value;
        }
        return acc;
      }, {})
    ).map(([name, value], index) => ({ name, value, fill: pieColors[index % pieColors.length] }));

    const expenseDetails = expenses
      .map((item) => {
        const date = item.paymentDate || item.dataPagamento || item.dataVencimento || item.dueDate;
        const description = item.description || item.descricao || item.categoria || 'Despesa';
        return {
          data: date,
          label: `${formatDate(date)} • ${description}`,
          description,
          valor: toNumber(item.valor || item.amount || 0),
          status: String(item.status || '').toUpperCase() === 'PAGO' || item.paymentDate || item.dataPagamento ? 'Pago' : 'Pendente',
        };
      })
      .sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));

    const revenueVsExpense = Array.from({ length: 6 }, (_, index) => {
      const reference = new Date();
      reference.setMonth(reference.getMonth() - (5 - index));
      const monthKey = `${reference.getFullYear()}-${String(reference.getMonth() + 1).padStart(2, '0')}`;
      const revenueValue = reservations
        .filter((item) => {
          const date = new Date(item.checkIn || item.dataInicio || item.check_in || item.bookingDate);
          return !Number.isNaN(date.getTime()) && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` === monthKey;
        })
        .reduce((sum, item) => sum + toNumber(item.paidAmount || item.valorPago || item.rentalAmount || 0), 0);

      const expenseValue = expenses
        .filter((item) => {
          const date = new Date(item.paymentDate || item.dataPagamento || item.dataVencimento || item.dueDate || item.createdAt || new Date());
          return !Number.isNaN(date.getTime()) && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` === monthKey;
        })
        .reduce((sum, item) => sum + toNumber(item.valor || item.amount || 0), 0);

      return {
        month: monthName(`${reference.getFullYear()}-${String(reference.getMonth() + 1).padStart(2, '0')}-01`),
        Receita: revenueValue,
        Despesa: expenseValue,
      };
    });

    const weeklyNights = [
      { week: 'Semana 1', 'Final de Semana': Math.max(1, Math.round(totalNightsWeekend / 4)), 'Meio de Semana': Math.max(1, Math.round(totalNightsWeekday / 4)) },
      { week: 'Semana 2', 'Final de Semana': Math.max(1, Math.round(totalNightsWeekend / 5)), 'Meio de Semana': Math.max(1, Math.round(totalNightsWeekday / 5)) },
      { week: 'Semana 3', 'Final de Semana': Math.max(1, Math.round(totalNightsWeekend / 6)), 'Meio de Semana': Math.max(1, Math.round(totalNightsWeekday / 6)) },
      { week: 'Semana 4', 'Final de Semana': Math.max(1, Math.round(totalNightsWeekend / 7)), 'Meio de Semana': Math.max(1, Math.round(totalNightsWeekday / 7)) },
    ];

    const bestClient = Object.entries(clientMap).sort(([, a], [, b]) => b - a)[0];

    return {
      occupancyRate,
      grossRevenue,
      adr,
      liquidRevenue: netCash,
      totalRevenue: totalPaidRevenue,
      totalExpenses: paidExpenses,
      pendingRevenue,
      revenueDistribution,
      expenseDistribution,
      expenseDetails,
      revenueVsExpense,
      weeklyNights,
      bestClient: bestClient ? { name: bestClient[0], total: bestClient[1], stays: reservations.filter((r) => (r.cliente || r.customerName || r.customer?.name || 'Cliente') === bestClient[0]).length } : null,
    };
  }, [filtered]);

  return (
    <Box sx={{ bgcolor: '#FBF6EE', minHeight: '100%', p: { xs: 2, md: 3, lg: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2d2d2d' }}>Dashboard de Temporada</Typography>
        <Select value={monthYear} onChange={(event) => setMonthYear(event.target.value)} size="small" sx={{ bgcolor: '#fff', minWidth: 210, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          {monthOptions.length ? (
            monthOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={currentMonthKey}>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</MenuItem>
          )}
        </Select>
      </Box>

      {loading ? (
        <Typography variant="body1">Carregando dados financeiros...</Typography>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 4 }}>
            {[
              { label: 'Taxa de Ocupação', value: `${dashboardData.occupancyRate}%`, change: '+3% vs mês anterior', accent: '#2e7d32' },
              { label: 'Faturamento Bruto', value: currency(dashboardData.grossRevenue), change: 'Receita total do período', accent: '#B71C1C' },
              { label: 'Diária Média', value: currency(dashboardData.adr), change: 'ADR', accent: '#4E342E' },
              { label: 'Faturamento Líquido', value: currency(dashboardData.liquidRevenue), change: 'Receita realizada líquida', accent: '#1b9d6d' },
              { label: 'Total de Receitas', value: currency(dashboardData.totalRevenue), change: 'Pagas no período', accent: '#2e7d32' },
              { label: 'Total de Despesas', value: currency(dashboardData.totalExpenses), change: 'Pagas no período', accent: '#d32f2f' },
              { label: 'Receita Pendente', value: currency(dashboardData.pendingRevenue), change: 'A receber', accent: '#ef6c00' },
            ].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.label}>
                <Card sx={{ height: '100%', minHeight: 170, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}>
                  <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    <Typography variant="subtitle2" sx={{ color: '#777', fontWeight: 600 }}>{item.label}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1.5, mb: 0.5 }}>{item.value}</Typography>
                    <Typography variant="caption" sx={{ color: item.accent, fontWeight: 700 }}>{item.change}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: { xs: 420, md: 520 }, borderRadius: 3, boxShadow: '0 12px 32px rgba(35, 35, 35, 0.08)', background: 'linear-gradient(180deg, #fffdfb 0%, #ffffff 100%)', border: '1px solid rgba(184, 28, 28, 0.06)' }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: '#2b2b2b' }}>Receitas vs Despesas</Typography>
                  <ResponsiveContainer width="100%" height={390}>
                    <AreaChart data={dashboardData.revenueVsExpense} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <defs>
                        <linearGradient id="receitaFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.42} />
                          <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.04} />
                        </linearGradient>
                        <linearGradient id="despesaFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.38} />
                          <stop offset="95%" stopColor="#d32f2f" stopOpacity={0.04} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#666" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                      <Tooltip formatter={(value) => currency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #f0d8d8' }} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Area type="monotone" dataKey="Receita" stroke="#2e7d32" fill="url(#receitaFill)" strokeWidth={3.2} />
                      <Area type="monotone" dataKey="Despesa" stroke="#d32f2f" fill="url(#despesaFill)" strokeWidth={3.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: { xs: 420, md: 520 }, borderRadius: 3, boxShadow: '0 12px 32px rgba(35, 35, 35, 0.08)', background: 'linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)', border: '1px solid rgba(78, 52, 46, 0.08)' }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: '#2b2b2b' }}>Receitas (Pago vs Pendente)</Typography>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie data={dashboardData.revenueDistribution} dataKey="value" nameKey="name" innerRadius={65} outerRadius={110} paddingAngle={4} stroke="#fff" strokeWidth={3} />
                      <Tooltip formatter={(value) => currency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #f0d8d8' }} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: { xs: 420, md: 500 }, borderRadius: 3, boxShadow: '0 12px 32px rgba(35, 35, 35, 0.08)', background: 'linear-gradient(180deg, #fffdfb 0%, #ffffff 100%)', border: '1px solid rgba(184, 28, 28, 0.06)' }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: '#2b2b2b' }}>Noites Ocupadas por Semana</Typography>
                  <ResponsiveContainer width="100%" height={330}>
                    <BarChart data={dashboardData.weeklyNights} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#666" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f0d8d8' }} />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar dataKey="Final de Semana" stackId="a" fill="#B71C1C" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="Meio de Semana" stackId="a" fill="#4E342E" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: { xs: 420, md: 500 }, borderRadius: 3, boxShadow: '0 12px 32px rgba(35, 35, 35, 0.08)', background: 'linear-gradient(180deg, #fffaf5 0%, #ffffff 100%)', border: '1px solid rgba(78, 52, 46, 0.08)' }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: '#2b2b2b' }}>Despesas por Categoria</Typography>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie data={dashboardData.expenseDistribution} dataKey="value" nameKey="name" innerRadius={63} outerRadius={105} paddingAngle={3} stroke="#fff" strokeWidth={3} />
                      <Tooltip formatter={(value) => currency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #f0d8d8' }} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 12px 32px rgba(35, 35, 35, 0.08)', background: 'linear-gradient(180deg, #fffaf7 0%, #ffffff 100%)', border: '1px solid rgba(184, 28, 28, 0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, color: '#2b2b2b' }}>Despesas por descrição e data</Typography>
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart layout="vertical" data={dashboardData.expenseDetails} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="#666" />
                    <YAxis type="category" dataKey="label" width={200} tick={{ fontSize: 11 }} stroke="#666" />
                    <Tooltip formatter={(value) => currency(value)} labelFormatter={(label) => label} contentStyle={{ borderRadius: 12, border: '1px solid #f0d8d8' }} />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />
                    <Bar dataKey="valor" fill="#d32f2f" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', py: 3 }}>
                <Badge badgeContent={<Star sx={{ color: '#fff' }} />} sx={{ mb: 1 }}>
                  <Avatar sx={{ width: 72, height: 72, bgcolor: '#B71C1C' }}>{dashboardData.bestClient ? dashboardData.bestClient.name.charAt(0) : '—'}</Avatar>
                </Badge>
                <Typography variant="h6" sx={{ mt: 1 }}>{dashboardData.bestClient ? dashboardData.bestClient.name : '—'}</Typography>
                {dashboardData.bestClient ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Total de Estadias: {dashboardData.bestClient.stays}</Typography>
                    <Typography variant="body2">Valor Total: {currency(dashboardData.bestClient.total)}</Typography>
                    <Typography variant="body2">Ticket Médio: {currency(dashboardData.bestClient.total / dashboardData.bestClient.stays)}</Typography>
                    <Box sx={{ mt: 1, bgcolor: '#FFF5E6', color: '#B71C1C', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>Cliente VIP</Box>
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
}

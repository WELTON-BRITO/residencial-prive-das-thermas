import React, { useMemo, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import api from '../api/axios';
import {
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const currency = (value) => `R$ ${Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const toNumber = (value) => Number(value ?? 0);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
};

const getPeriodKey = (dateValue, period) => {
  if (period === 'Dia') return formatDate(dateValue);
  if (period === 'Ano') return dateValue.toLocaleDateString('pt-BR', { month: 'short' });
  return dateValue.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
};

const getPeriodRange = (period, customStart, customEnd) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === 'Dia') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'Mês') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'Ano') {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(11, 31);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'Personalizado' && customStart && customEnd) {
    start.setTime(new Date(customStart).setHours(0, 0, 0, 0));
    end.setTime(new Date(customEnd).setHours(23, 59, 59, 999));
  } else {
    start.setFullYear(2000, 0, 1);
    end.setFullYear(2100, 11, 31);
  }

  return { start, end };
};

const pieColors = ['#B71C1C', '#FF8A65', '#4E342E', '#FFD54F', '#90A4AE', '#A1887F', '#A5D6A7'];

export default function FinanceiroView() {
  const [reservas, setReservas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('Mês');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      api.get('/agendamentos').then((response) => response.data || []).catch(() => []),
      api.get('/despesas').then((response) => response.data || []).catch(() => []),
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

  const filteredMetrics = useMemo(() => {
    const { start, end } = getPeriodRange(period, customStart, customEnd);

    const filteredReservas = reservas.filter((reserva) => {
      const date = new Date(reserva.checkIn || reserva.dataInicio || reserva.bookingDate || new Date());
      return date >= start && date <= end;
    });

    const filteredDespesas = despesas.filter((despesa) => {
      const date = new Date(despesa.paymentDate || despesa.dataPagamento || despesa.dataVencimento || despesa.dueDate || new Date());
      return date >= start && date <= end;
    });

    const totalReceita = filteredReservas.reduce((sum, item) => sum + toNumber(item.paidAmount || item.valorPago || item.rentalAmount || item.valorTotal || 0), 0);
    const totalReceitaPendente = filteredReservas.reduce((sum, item) => sum + toNumber(item.dueAmount || item.valorPendente || 0), 0);
    const despesasPagas = filteredDespesas.filter((item) => String(item.status || '').toUpperCase() === 'PAGO' || item.paymentDate || item.dataPagamento).reduce((sum, item) => sum + toNumber(item.valor || item.amount || 0), 0);
    const despesasTotais = filteredDespesas.reduce((sum, item) => sum + toNumber(item.valor || item.amount || 0), 0);
    const lucroLiquido = totalReceita - despesasPagas;

    const barData = (() => {
      const groups = {};

      filteredReservas.forEach((reserva) => {
        const dateValue = new Date(reserva.checkIn || reserva.dataInicio || reserva.bookingDate);
        const key = getPeriodKey(dateValue, period);
        groups[key] = (groups[key] || 0) + toNumber(reserva.paidAmount || reserva.valorPago || reserva.rentalAmount || 0);
      });

      filteredDespesas.forEach((despesa) => {
        const dateValue = new Date(despesa.paymentDate || despesa.dataPagamento || despesa.dataVencimento || despesa.dueDate);
        const key = getPeriodKey(dateValue, period);
        groups[key] = (groups[key] || 0) - toNumber(despesa.valor || despesa.amount || 0);
      });

      return Object.entries(groups).map(([key, value]) => ({
        label: key,
        Receita: Math.max(value, 0),
        Despesa: Math.max(Math.abs(value), 0),
      }));
    })();

    const expenseCategoryData = Object.entries(
      filteredDespesas.reduce((acc, item) => {
        const category = item.categoria || item.category || item.description || 'Outros';
        const value = toNumber(item.valor || item.amount || 0);
        acc[category] = (acc[category] || 0) + value;
        return acc;
      }, {})
    ).map(([name, value], index) => ({ name, value, fill: pieColors[index % pieColors.length] }));

    const transactions = [
      ...filteredReservas.map((item) => ({
        data: item.checkIn || item.dataInicio || item.bookingDate,
        categoria: 'Receita',
        tipo: 'Entrada',
        valor: toNumber(item.paidAmount || item.valorPago || item.rentalAmount || item.valorTotal || 0),
        status: item.dueAmount && Number(item.dueAmount) > 0 ? 'Pendente' : 'Pago',
      })),
      ...filteredDespesas.map((item) => ({
        data: item.paymentDate || item.dataPagamento || item.dataVencimento || item.dueDate,
        categoria: item.categoria || item.category || item.description || item.descricao || 'Despesa',
        descricao: item.description || item.descricao || item.categoria || item.category || 'Despesa',
        tipo: 'Saída',
        valor: toNumber(item.valor || item.amount || 0),
        status: String(item.status || '').toUpperCase() === 'PAGO' || item.paymentDate || item.dataPagamento ? 'Pago' : 'Pendente',
      })),
    ].sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));

    return {
      totalReceita,
      totalReceitaPendente,
      despesasPagas,
      despesasTotais,
      lucroLiquido,
      barData,
      expenseCategoryData,
      transactions,
    };
  }, [reservas, despesas, period, customStart, customEnd]);

  return (
    <Box sx={{ bgcolor: '#F8F9FA', minHeight: '100%', p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Financeiro</Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <InputLabel id="finance-period-label" sx={{ fontSize: 12, mb: 0.5 }}>Período</InputLabel>
            <Select
              labelId="finance-period-label"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              size="small"
              sx={{ minWidth: 150, bgcolor: '#fff' }}
            >
              <MenuItem value="Dia">Dia</MenuItem>
              <MenuItem value="Mês">Mês</MenuItem>
              <MenuItem value="Ano">Ano</MenuItem>
              <MenuItem value="Personalizado">Personalizado</MenuItem>
              <MenuItem value="Geral">Geral</MenuItem>
            </Select>
          </Box>

          {period === 'Personalizado' && (
            <>
              <TextField label="Início" type="date" size="small" value={customStart} onChange={(event) => setCustomStart(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ bgcolor: '#fff' }} />
              <TextField label="Fim" type="date" size="small" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={{ bgcolor: '#fff' }} />
            </>
          )}
        </Box>
      </Box>

      {loading ? (
        <Typography variant="body1">Carregando dados financeiros...</Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Faturamento Líquido', value: currency(filteredMetrics.lucroLiquido), accent: '#1b9d6d' },
              { label: 'Receita Total', value: currency(filteredMetrics.totalReceita), accent: '#2e7d32' },
              { label: 'Despesas Totais', value: currency(filteredMetrics.despesasTotais), accent: '#d32f2f' },
              { label: 'Receita Pendente', value: currency(filteredMetrics.totalReceitaPendente), accent: '#ef6c00' },
            ].map((item) => (
              <Grid item xs={12} md={3} key={item.label}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ color: '#777' }}>{item.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>{item.value}</Typography>
                    <Typography variant="caption" sx={{ color: item.accent }}>Período selecionado</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ height: 360 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Entradas vs Saídas</Typography>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={filteredMetrics.barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip formatter={(value) => currency(value)} />
                      <Legend />
                      <Bar dataKey="Receita" fill="#2e7d32" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Despesa" fill="#d32f2f" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: 360 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Despesas por Categoria</Typography>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={filteredMetrics.expenseCategoryData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4} label />
                      <Tooltip formatter={(value) => currency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, mb: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Lucro Acumulado Total</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1b9d6d' }}>{currency(filteredMetrics.totalReceita - filteredMetrics.despesasTotais)}</Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>Últimos Lançamentos</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMetrics.transactions.map((item, index) => (
                    <TableRow key={`${item.data}-${item.categoria}-${index}`}>
                      <TableCell>{formatDate(item.data)}</TableCell>
                      <TableCell>{item.descricao || item.categoria}</TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{currency(item.valor)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Box>
  );
}

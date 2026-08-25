import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Button, CircularProgress, List, ListItemButton, Paper, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import type {
  CreateReservationDTO,
  Reservation,
} from "../../types/reservation";
import type { ClientSuggestion } from "../../types/client";
import { searchClients } from "../../services/clientService";

const schema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(1, "Cliente é obrigatório"),
  apartmentId: z.string().optional(),
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  rentalAmount: z.number().optional(),
  installment1: z.number().optional(),
  installment2: z.number().optional(),
  installment3: z.number().optional(),
  installment4: z.number().optional(),
});

type FormSchema = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: CreateReservationDTO) => Promise<void>;
  onDatesChange?: (dates: { checkIn?: string; checkOut?: string }) => void;
  selectedReservation?: Reservation;
  onCancelEdit?: () => void;
}

export function ReservationForm({
  onSubmit,
  onDatesChange,
  selectedReservation,
  onCancelEdit,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({ resolver: zodResolver(schema) });

  const watchCheckIn = watch("checkIn");
  const watchCustomerName = watch("customerName");
  const watchCustomerId = watch("customerId");
  const watchCheckOut = watch("checkOut");
  const watchRentalAmount = watch("rentalAmount");
  const watchInstallments = [
    watch("installment1"),
    watch("installment2"),
    watch("installment3"),
    watch("installment4"),
  ];

  const optionalNumber = {
    setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
  };

  const [suggestions, setSuggestions] = useState<ClientSuggestion[]>([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);

  useEffect(() => {
    onDatesChange?.({ checkIn: watchCheckIn, checkOut: watchCheckOut });
  }, [watchCheckIn, watchCheckOut, onDatesChange]);

  useEffect(() => {
    if (selectedReservation) {
      const installments = [1, 2, 3, 4].map((installment) => {
        const payment = selectedReservation.payments?.find(
          (item) => item.installment === installment,
        );
        return payment ? Number(payment.amount) : undefined;
      });

      reset({
        customerId: selectedReservation.customerId ?? undefined,
        customerName: selectedReservation.customer?.name ?? "",
        checkIn: selectedReservation.checkIn,
        checkOut: selectedReservation.checkOut,
        rentalAmount: Number(selectedReservation.rentalAmount),
        installment1: installments[0],
        installment2: installments[1],
        installment3: installments[2],
        installment4: installments[3],
      });
      return;
    }

    reset({
      customerId: undefined,
      customerName: "",
      checkIn: "",
      checkOut: "",
      rentalAmount: undefined,
      installment1: undefined,
      installment2: undefined,
      installment3: undefined,
      installment4: undefined,
    });
  }, [selectedReservation, reset]);

  useEffect(() => {
    if (watchCustomerId) {
      setSuggestions([]);
      setIsSearchingCustomers(false);
      return;
    }

    const query = watchCustomerName?.trim() ?? "";
    if (query.length < 2) {
      setSuggestions([]);
      setIsSearchingCustomers(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearchingCustomers(true);
      try {
        setSuggestions(await searchClients(query, controller.signal));
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsSearchingCustomers(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [watchCustomerId, watchCustomerName]);

  const nights = useMemo(() => {
    if (!watchCheckIn || !watchCheckOut) return 0;
    const d1 = dayjs(watchCheckIn);
    const d2 = dayjs(watchCheckOut);
    const diff = d2.diff(d1, "day");
    return diff > 0 ? diff : 0;
  }, [watchCheckIn, watchCheckOut]);

  const rentalAmount = Number(watchRentalAmount) || 0;
  const dailyRate = nights > 0 ? Number((rentalAmount / nights).toFixed(2)) : 0;
  const installmentTotal = watchInstallments.reduce<number>(
    (total, value) => total + (Number(value) || 0),
    0,
  );
  const paidAmount =
    rentalAmount > 0
      ? Math.min(rentalAmount, installmentTotal)
      : installmentTotal;
  const dueAmount = Math.max(Number((rentalAmount - paidAmount).toFixed(2)), 0);

  const formatCurrency = (value: number, showZero = false) =>
    value || showZero
      ? value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "";

  const dateInputValue = (value?: string) => value?.slice(0, 10) ?? "";

  const submitForm = async (data: FormSchema) => {
    const installments = [
      data.installment1,
      data.installment2,
      data.installment3,
      data.installment4,
    ].map((value) => Number(value) || 0);

    await onSubmit({
      customerId: data.customerId,
      customerName: data.customerName.trim(),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      rentalAmount: Number(data.rentalAmount) || 0,
      installments,
    });

    reset({
      customerId: undefined,
      customerName: "",
      checkIn: "",
      checkOut: "",
      rentalAmount: undefined,
      installment1: undefined,
      installment2: undefined,
      installment3: undefined,
      installment4: undefined,
    });
    setSuggestions([]);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{ display: "grid", gap: 2 }}
    >

      <Box sx={{ position: "relative" }}>
        <TextField
          label="Cliente"
          fullWidth
          value={watchCustomerName ?? ""}
          {...register("customerName", {
            onChange: (e) => {
              e.target.value = e.target.value.toUpperCase();
              setValue("customerId", undefined);
            },
          })}
          slotProps={{
            htmlInput: { style: { textTransform: "uppercase" } },
            input: { endAdornment: isSearchingCustomers ? <CircularProgress size={18} /> : undefined },
          }}
          error={!!errors.customerName}
          helperText={errors.customerName?.message as any}
        />
        {suggestions.length > 0 ? (
          <Paper elevation={4} sx={{ position: "absolute", zIndex: 10, width: "100%", maxHeight: 240, overflow: "auto" }}>
            <List disablePadding>
              {suggestions.map((client) => (
                <ListItemButton
                  key={client.id}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setValue("customerName", client.name, { shouldValidate: true });
                    setValue("customerId", client.id);
                    setSuggestions([]);
                  }}
                >
                  {client.name}
                </ListItemButton>
              ))}
            </List>
          </Paper>
        ) : null}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <TextField
            type="date"
            fullWidth
            value={dateInputValue(watchCheckIn)}
            {...register("checkIn")}
            error={!!errors.checkIn}
            helperText={errors.checkIn?.message as any}
            sx={{ width: "100%" }}
            slotProps={{ input: { sx: { height: 40 } } }}
          />
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            Check-in
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <TextField
            type="date"
            fullWidth
            value={dateInputValue(watchCheckOut)}
            {...register("checkOut")}
            error={!!errors.checkOut}
            helperText={errors.checkOut?.message as any}
            sx={{ width: "100%" }}
            slotProps={{ input: { sx: { height: 40 } } }}
          />
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            Checkout
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <TextField
            value={nights}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
            sx={{ width: "100%" }}
          />
          <Typography variant="caption" sx={{ textAlign: "center" }}>
            Diárias
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <TextField
          label="Vr Aluguel"
          type="number"
          fullWidth
          value={watchRentalAmount ?? ""}
          {...register("rentalAmount", optionalNumber)}
          error={!!errors.rentalAmount}
          helperText={errors.rentalAmount?.message as any}
        />
        <TextField
          label="Vr Diária"
          value={formatCurrency(dailyRate)}
          fullWidth
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Vr Pago"
          value={formatCurrency(paidAmount, rentalAmount > 0)}
          fullWidth
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Vr Pendente"
          value={formatCurrency(dueAmount, rentalAmount > 0)}
          fullWidth
          slotProps={{ input: { readOnly: true } }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <TextField
          label="1º Parc"
          type="number"
          fullWidth
          value={watchInstallments[0] ?? ""}
          {...register("installment1", optionalNumber)}
        />
        <TextField
          label="2º Parc"
          type="number"
          fullWidth
          value={watchInstallments[1] ?? ""}
          {...register("installment2", optionalNumber)}
        />
        <TextField
          label="3º Parc"
          type="number"
          fullWidth
          value={watchInstallments[2] ?? ""}
          {...register("installment3", optionalNumber)}
        />
        <TextField
          label="4º Parc"
          type="number"
          fullWidth
          value={watchInstallments[3] ?? ""}
          {...register("installment4", optionalNumber)}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        {selectedReservation ? (
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancelar edição
          </Button>
        ) : null}
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {selectedReservation ? "Atualizar Reserva" : "Salvar Reserva"}
        </Button>
      </Box>
    </Box>
  );
}

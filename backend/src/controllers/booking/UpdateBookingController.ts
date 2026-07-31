import { Request, Response } from 'express';
import { UpdateBookingService } from '../../services/booking/UpdateBookingService';

class UpdateBookingController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const service = new UpdateBookingService();
    try {
      const updated = await service.execute({ id, ...(req.body || {}) });
      return res.json(updated);
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(400).json({ message: err.message });
      return res.status(500).json({ message: 'Erro ao atualizar reserva' });
    }
  }
}

export { UpdateBookingController };

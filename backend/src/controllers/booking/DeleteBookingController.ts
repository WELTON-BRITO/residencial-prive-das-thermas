import { Request, Response } from 'express';
import { DeleteBookingService } from '../../services/booking/DeleteBookingService';

class DeleteBookingController {
  async handle(req: Request, res: Response) {
    const id = String(req.params.id);
    const service = new DeleteBookingService();
    try {
      const result = await service.execute(id);
      return res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(400).json({ message: err.message });
      return res.status(500).json({ message: 'Erro ao deletar reserva' });
    }
  }
}

export { DeleteBookingController };

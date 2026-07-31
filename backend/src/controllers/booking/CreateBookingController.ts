import { Request, Response } from 'express';
import { CreateBookingService } from '../../services/booking/CreateBookingService';

class CreateBookingController {
  async handle(req: Request, res: Response) {
    const data = req.body;
    const service = new CreateBookingService();
    try {
      const booking = await service.execute(data);
      return res.status(201).json(booking);
    } catch (err: unknown) {
      if (err instanceof Error) return res.status(400).json({ message: err.message });
      return res.status(500).json({ message: 'Erro ao criar reserva' });
    }
  }
}

export { CreateBookingController };

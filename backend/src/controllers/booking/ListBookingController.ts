import { Request, Response } from 'express';
import { ListBookingService } from '../../services/booking/ListBookingService';

class ListBookingController {
  async handle(_req: Request, res: Response) {
    const service = new ListBookingService();
    const bookings = await service.execute();
    return res.json(bookings);
  }
}

export { ListBookingController };

import { Request, Response } from 'express';
import { FindClientsService } from '../../services/client/FindClientsService';

export class FindClientsController {
  async handle(req: Request, res: Response) {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const clients = await new FindClientsService().execute(query);
    return res.json(clients);
  }
}

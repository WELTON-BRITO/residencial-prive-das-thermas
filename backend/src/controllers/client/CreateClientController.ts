import { Request, Response } from 'express';
import { CreateClientService, CreateClientRequest } from '../../services/client/CreateClientService';

class CreateClientController {
  async handle(req: Request, res: Response) {
    const clientData = req.body as CreateClientRequest;
    const createClientService = new CreateClientService();

    try {
      const client = await createClientService.execute(clientData);
      return res.status(201).json(client);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message.includes('Já existe um cliente cadastrado com este CPF') ||
          error.message.includes('Já existe um cliente cadastrado com este e-mail')
        ) {
          return res.status(409).json({ message: error.message });
        }

        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Erro ao criar cliente.' });
    }
  }
}

export { CreateClientController };
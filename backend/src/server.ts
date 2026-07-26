import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { router } from './routes';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL não definido. Verifique o arquivo .env ou a variável de ambiente.');
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const app = express();
const prisma = new PrismaClient({ adapter });
const port = Number(process.env.PORT! || 3333);

app.use(cors({ origin: true }));
app.use(express.json());
app.use(router);

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro capturado pelo middleware de erro:', error);
  if(error instanceof Error) {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'prive-backend' });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET ?? 'dev-secret', {
    expiresIn: '8h',
  });

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token ausente.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? 'dev-secret') as { sub: string; email: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

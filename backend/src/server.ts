import express from 'express';
import path from 'path';
import cors from 'cors';

import 'express-async-errors';

// Importando a conexão do BD
import './database/connection';
// Importando as rotas
import routes from './routes';
// Tratativa de Erros
import errorHandler from './errors/handler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(errorHandler);

app.listen(3333);
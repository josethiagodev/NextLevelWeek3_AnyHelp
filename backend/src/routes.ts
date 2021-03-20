import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrphanagesController from './controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

// Rota de listar todos Orfanatos já criados
routes.get('/orphanages', OrphanagesController.index);

// Rota de mostrar um Orfanato pegando os dados pelo ID
routes.get('/orphanages/:id', OrphanagesController.show);

// Rota de criar/cadastrar Orfanato + Carregar Imagens
routes.post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routes;
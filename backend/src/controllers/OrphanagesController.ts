import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

import Orphanage from '../models/orphanage';

export default {
  // Rota de listar todos Orfanatos já criados (pelo Método ind)
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      // Mostrando imagens ao "Listar Orfanato"
      relations: ['images']
    });

    // Renderizando vários Orfanatos (views > orphanages_view.ts)
    return response.json(orphanageView.renderMany(orphanages));
  },
  // Rota de mostrar 'Detalhe' de 1 Orfanato pegando dados pelo ID (pelo método findOneOrFail(id))
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      // Mostrando imagens ao "Detalhe do Orfanato"
      relations: ['images']
    });

    // Renderizando somente 1 Orfanato (views > orphanages_view.ts)
    return response.json(orphanageView.render(orphanage));
  },

  // Rota de criar um Orfanato
  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;
  
    const orphanagesRepository = getRepository(Orphanage);

    // Salvando o Upload das imagens do Orfanato
    const requestImages = request.files as Express.Multer.File[];
    const images = requestImages.map(image => {
      return { path: image.filename }
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    };

    // Schema de validaão do orfanato
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });
    await schema.validate(data, {
      abortEarly: false,
    });
    
    // Criando um novo Orfanato
    const orphanage = orphanagesRepository.create(data);
    // Salvando orfanato no banco de dados
    await orphanagesRepository.save(orphanage);
  
    return response.status(201).json(orphanage);
  }
}
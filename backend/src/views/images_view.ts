import Image from '../models/image';

export default {
  // Renderizando somente 1 Orfanato
  render(image: Image) {
    return {
      id: image.id,
      url: `http://192.168.1.109:3333/uploads/${image.path}`,
    };
  },

  // Renderizando vários Orfanatos
  renderMany(images: Image[]) {
    return images.map(image => this.render(image));
  }
};
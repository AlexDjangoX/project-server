import Album from '../domain/album.js';
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';

export const create = async (req, res) => {
  const albumToCreate = await Album.fromJson(req.body);
  const id = albumToCreate.idAlbum;

  try {
    const existingAlbum = await Album.findByIdAlbum(id);

    if (existingAlbum) {
      return sendDataResponse(res, 400, 'Album already exists');
    }

    const createdAlbum = await albumToCreate.save();
    return sendDataResponse(res, 200, createdAlbum.toJSON());
  } catch (error) {
    console.error('something went wrong', error.message);
    return sendMessageResponse(res, 500, 'Unable to create new album');
  }
};

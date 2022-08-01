import Album from '../domain/album.js';
import User from '../domain/user.js';
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js';

export const createNewAlbum = async (req, res) => {
  const albumToCreate = await Album.fromJson(req.body);
  const id = albumToCreate.idAlbum;
  console.log(albumToCreate);

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

export const retrieveAlbumsByUserId = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return sendDataResponse(res, 400, { email: 'Please provide valid ID' });
    }

    const albums = await Album.findAll(id);
    if (albums.length === 0) {
      throw new Error(`Albums not found`);
    }
    const data = { albums };
    return sendDataResponse(res, 200, data);
  } catch (err) {
    return sendDataResponse(res, 400, { err: err.message });
  }
};

export const deleteAlbumFromFavorites = async (req, res) => {
  const albumId = req.body.id_album;

  try {
    if (!albumId) throw new Error('The ID you have provided is incorrect');
    const data = await Album.delete(albumId);
    return sendDataResponse(res, 200, data);
  } catch (err) {
    return sendDataResponse(res, 400, { err: err.message });
  }
};

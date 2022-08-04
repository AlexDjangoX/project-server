import dbClient from '../utils/dbClient.js';

export default class Album {
  static fromDb(album) {
    return new Album(
      album.userId,
      album.idAlbum,
      album.idArtist,
      album.intYearReleased,
      album.strAlbum,
      album.strAlbumThumb,
      album.strArtist,
      album.strDescriptionEN,
      album.strGenre,
      album.strMusicBrainzID,
      album.reviewScore,
      album.myReview,
      album.id,
      album.createdAt,
      album.updatedAt
    );
  }

  static async fromJson(json) {
    const {
      userId,
      id_album,
      id_artist,
      year_released,
      str_album,
      album_thumb,
      str_artist,
      description,
      genre,
      music_brainz,
      review_score,
      my_review,
      id,
    } = json;

    return new Album(
      userId,
      id_album,
      id_artist,
      year_released,
      str_album,
      album_thumb,
      str_artist,
      description,
      genre,
      music_brainz,
      review_score,
      my_review,
      id
    );
  }

  constructor(
    userId,
    idAlbum,
    idArtist,
    intYearReleased,
    strAlbum,
    strAlbumThumb,
    strArtist,
    strDescriptionEN,
    strGenre,
    strMusicBrainzID,
    reviewScore,
    myReview,
    id,
    createdAt,
    updatedAt
  ) {
    this.userId = userId;
    this.idAlbum = idAlbum;
    this.idArtist = idArtist;
    this.intYearReleased = intYearReleased;
    this.strAlbum = strAlbum;
    this.strAlbumThumb = strAlbumThumb;
    this.strArtist = strArtist;
    this.strDescriptionEN = strDescriptionEN;
    this.strGenre = strGenre;
    this.strMusicBrainzID = strMusicBrainzID;
    this.reviewScore = reviewScore;
    this.myReview = myReview;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJSON() {
    return {
      album: {
        userId: this.userId,
        idAlbum: this.idAlbum,
        idArtist: this.idArtist,
        intYearReleased: this.intYearReleased,
        strAlbum: this.strAlbum,
        strAlbumThumb: this.strAlbumThumb,
        strArtist: this.strArtist,
        strDescriptionEN: this.strDescriptionEN,
        strGenre: this.strGenre,
        strMusicBrainzID: this.strMusicBrainzID,
        reviewScore: this.reviewScore,
        myReview: this.myReview,
        id: this.id,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      },
    };
  }

  /**
   *
   * @returns {Album}
   */

  async save() {
    const createdAlbum = await dbClient.albumArt.create({
      data: {
        idAlbum: this.idAlbum,
        idArtist: this.idArtist,
        intYearReleased: this.intYearReleased,
        strAlbum: this.strAlbum,
        strAlbumThumb: this.strAlbumThumb,
        strArtist: this.strArtist,
        strDescriptionEN: this.strDescriptionEN,
        strGenre: this.strGenre,
        strMusicBrainzID: this.strMusicBrainzID,
        reviewScore: this.reviewScore,
        myReview: this.myReview,
        id: this.id,
        user: {
          connect: {
            id: this.userId,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return Album.fromDb(createdAlbum);
  }

  static async _findByUnique(key, value) {
    const foundAlbum = await dbClient.albumArt.findFirst({
      where: {
        [key]: value,
      },
      include: {
        user: true,
      },
    });

    if (foundAlbum) {
      return Album.fromDb(foundAlbum);
    }

    return null;
  }

  static async findByIdAlbum(idAlbum) {
    return Album._findByUnique('idAlbum', idAlbum);
  }

  static async findById(id) {
    return Album._findByUnique('id', id);
  }

  static async findAll(id) {
    const foundAlbums = await dbClient.albumArt.findMany({
      where: {
        userId: id,
      },
      include: {
        user: true,
      },
    });

    return foundAlbums.map((album) => Album.fromDb(album));
  }

  static async delete(foundId) {
    await dbClient.albumArt.delete({
      where: {
        id: foundId,
      },
    });
  }

  static async updateAlbum(foundAlbumId, rating) {
    const albumToUpdate = await dbClient.albumArt.update({
      where: {
        id: foundAlbumId,
      },
      data: {
        reviewScore: rating,
      },
    });
    console.log('INSIDE UPDATE : ', albumToUpdate);
    return Album.fromDb(albumToUpdate);
  }
}

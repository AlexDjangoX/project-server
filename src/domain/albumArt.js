import dbClient from '../utils/dbClient.js';

export default class AlbumArt {
  static fromDb(albumArt) {
    return new AlbumArt(
      albumArt.id,
      albumArt.idAlbum,
      albumArt.idArtist,
      albumArt.intYearReleased,
      albumArt.strAlbum,
      albumArt.strAlbumThumb,
      albumArt.strArtist,
      albumArt.strDescriptionEN,
      albumArt.strGenre,
      albumArt.strMusicBrainzID,
      albumArt.reviewScore,
      albumArt.myReview
    );
  }

  static async fromJson(json) {
    const {
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
    } = json;

    return new AlbumArt(
      null,
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
      my_review
    );
  }

  constructor(
    id,
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
    myReview
  ) {
    this.id = id;
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
  }

  toJson() {
    return {
      albumArt: {
        id: this.id,
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
      },
    };
  }

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
      },
      include: {
        user: true,
      },
    });
    return AlbumArt.fromDb(createdAlbum);
  }

  static async findById(id) {
    const foundAlbumArt = await dbClient.albumArt.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (foundAlbumArt) {
      return AlbumArt.fromDb(foundAlbumArt);
    }
    return null;
  }
}

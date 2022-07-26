-- CreateTable
CREATE TABLE "AlbumArt" (
    "id" SERIAL NOT NULL,
    "idAlbum" TEXT NOT NULL,
    "idArtist" TEXT NOT NULL,
    "intYearReleased" TEXT NOT NULL,
    "strAlbum" TEXT NOT NULL,
    "strAlbumThumb" TEXT NOT NULL,
    "strArtist" TEXT NOT NULL,
    "strDescriptionEN" TEXT,
    "strGenre" TEXT,
    "strMusicBrainzID" TEXT,
    "reviewScore" INTEGER NOT NULL DEFAULT 0,
    "myReview" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AlbumArt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlbumArt" ADD CONSTRAINT "AlbumArt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

export class MovieCounts {
  movie: number;
  series: number;
  game: number;

  constructor(movie: number, series: number, game: number) {
    this.movie = movie;
    this.series = series;
    this.game = game;
  }
}

export class Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;

  constructor(Title: string, Year: string, imdbID: string, Type: string, Poster: string) {
    this.Title = Title;
    this.Year = Year;
    this.imdbID = imdbID;
    this.Type = Type;
    this.Poster = Poster;
  }
}

export class MovieResponse {
  results: Movie[];
  totalResults: string;

  constructor(results: Movie[], totalResults: string) {
    this.results = results;
    this.totalResults = totalResults;
  }
}
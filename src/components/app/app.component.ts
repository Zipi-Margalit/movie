import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data.service';
import { Movie, MovieCounts, MovieResponse } from 'src/models/movies';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: any;
  moviesByType: { [key: string]: any[]  } = {};
  counts: MovieCounts = { movie: 0, series: 0, game: 0 };
  searchText: string = '';
  filteredMovies: { [key: string]: Movie[]  } = {};
  selectedType: string = 'movie';
  isGridView: boolean = true;
  sortedMovies: Movie[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: keyof Movie = 'Title'; // Default sort column
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadAndCategorizeMovies();
  }

  loadAndCategorizeMovies(): void {
    this.dataService.getJSON().subscribe({
      next: (response) => {
        this.data = response;
        debugger;
        // Group by type
        this.moviesByType = response.results.reduce((acc: { [key: string]: Movie[] }, item: Movie) => {
          const type = item.Type.toLowerCase();
          if (!acc[type]) {
            acc[type] = [];
          }
          acc[type].push(item);
          return acc;
        }, {} as { [key: string]: any[] });

        // Count items by type
        this.counts = {
          movie: this.moviesByType['movie']?.length || 0,
          series: this.moviesByType['series']?.length || 0,
          game: this.moviesByType['game']?.length || 0
        };

        console.log('Movies by type:', this.moviesByType);
        console.log('Counts:', this.counts);
      },
      error: (error) => {
        console.error('Error loading movies:', error);
      }
    });
  }

  setActiveTab(type: string): void {
    this.selectedType = type;
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  performSearch(): void {
    if (!this.searchText) {
      this.filteredMovies = this.moviesByType;
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.filteredMovies = Object.keys(this.moviesByType).reduce((acc, type) => {
      acc[type] = this.moviesByType[type].filter(movie =>
        movie.Title.toLowerCase().includes(searchTerm) ||
        movie.Year.toLowerCase().includes(searchTerm)
      );
      return acc;
    }, {} as { [key: string]: Movie[] });
  }

  onSearchInput(event: any): void {
    this.searchText = event.target.value;
    this.performSearch();
  }
  onClearSearch(): void {
    this.searchText = '';
    this.performSearch();
}
  refreshData(): void {
    this.searchText = '';
    this.filteredMovies = {};
    this.loadAndCategorizeMovies();
  }
  
 sortData(): void {
  const sortArrays = (array: Movie[]) => {
    return [...array].sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' ?
          aValue.localeCompare(bValue) :
          bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ?
          aValue - bValue :
          bValue - aValue;
      }
      return 0;
    });
  };

  // Sort moviesByType
  if (this.moviesByType[this.selectedType]) {
    this.moviesByType[this.selectedType] = sortArrays(this.moviesByType[this.selectedType]);
  }

  // Sort filteredMovies if they exist
  if (this.filteredMovies[this.selectedType]) {
    this.filteredMovies[this.selectedType] = sortArrays(this.filteredMovies[this.selectedType]);
  }
}
  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortData(); // Re-sort after changing direction
  }
    updateMovieTitle(movie: Movie, newTitle: string): void {
    // Simulated API call
    this.dataService.updateMovieTitle(movie.imdbID, newTitle).subscribe({
      next: (response) => {
        // Update local state after successful API call
        const movieToUpdate = this.moviesByType[movie.Type].find(m => m.imdbID === movie.imdbID);
        if (movieToUpdate) {
          movieToUpdate.Title = newTitle;
        }
        // Update filtered movies if they exist
        if (this.filteredMovies[movie.Type]) {
          const filteredMovieToUpdate = this.filteredMovies[movie.Type].find(m => m.imdbID === movie.imdbID);
          if (filteredMovieToUpdate) {
            filteredMovieToUpdate.Title = newTitle;
          }
        }
      },
      error: (error) => {
        console.error('Error updating movie title:', error);
        // Optionally add error handling UI feedback
      }
    });
  }
}




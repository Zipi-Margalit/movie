import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Movie } from '../../../models/movies';
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() movie: Movie = new Movie(  '', '', '', '', '');
  @Output() titleChange = new EventEmitter<string>();
  @ViewChild('titleInput') titleInput!: ElementRef;
  isEditing = false;

   constructor() { }

   ngOnInit(): void {
   }
 

  startEditing(): void {
    this.isEditing = true;
    setTimeout(() => {
     this.titleInput?.nativeElement?.focus();
    });
  }

  onBlur(event: any): void {
    const newValue = event.target.value;
    if (newValue !== this.movie.Title) {
      this.titleChange.emit(newValue);
    }
    this.isEditing = false;
  }
}


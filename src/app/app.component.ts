import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

interface UserProfile {
  email: string;
  username: string;
  skillsBoostUrl: string;
  badges: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  topProfiles: UserProfile[] = [];
  remainingProfiles: UserProfile[] = [];
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.readCSV();
    this.triggerPartyPopperAnimation(); // Call the function to trigger animation
  }

  // Function to trigger party popper animation on page load
  triggerPartyPopperAnimation() {
    const poppers = document.querySelectorAll('.popper');

    poppers.forEach((popper, index) => {
      const popperElement = popper as HTMLElement; // Cast to HTMLElement
      // Delay the animation for each popper to create a staggered effect
      setTimeout(() => {
        popperElement.style.animation = 'party-popper 1s forwards'; // Apply the animation
      }, index * 300); // Delay based on index (0s, 300ms, 600ms)
    });
  }

  readCSV() {
    this.http.get('assets/Madras Institute of Technology - Chennai, India [07 Oct].csv', { responseType: 'text' }).subscribe(
      data => {
        this.parseCSV(data);
      },
      error => {
        console.error('Error reading CSV file:', error);
      }
    );
  }

  parseCSV(csvData: string) {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const profiles: UserProfile[] = result.data.map((row: any) => ({
          email: row['User Email'],
          username: row['User Name'],
          skillsBoostUrl: row['Google Cloud Skills Boost Profile URL'],
          badges: parseInt(row['# of Skill Badges Completed'], 10) || 0 // Convert badges to number
        }));

        // Sort the profiles by number of badges in descending order
        profiles.sort((a, b) => b.badges - a.badges);
        this.topProfiles = profiles.slice(0, 3);
        this.remainingProfiles = profiles.slice(3);
      }
    });
  }

  
//logic for pagination:
pg: number = 1; // Current page
fetchPages: number = 15; // Default number of items per page

get paginatedProfiles() {
  const startIndex = (this.pg - 1) * this.fetchPages;
  return this.remainingProfiles.slice(startIndex, startIndex + this.fetchPages);
}

onPageChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  this.fetchPages = +selectElement.value; // Update items per page
  this.pg = 1; // Reset to the first page
}

nextPage(): void {
  if (this.pg < this.totalPages) {
    this.pg++;
  }
}

previousPage(): void {
  if (this.pg > 1) {
    this.pg--;
  }
}

get totalPages() {
  return Math.ceil(this.remainingProfiles.length / this.fetchPages);
}

// Generate an array of page numbers for pagination links
get pageNumbers() {
  const pages = [];
  for (let i = 1; i <= this.totalPages; i++) {
    pages.push(i);
  }
  return pages;
}

// Navigate to a specific page
goToPage(page: number) {
  this.pg = page;
}
//ends the logic for pagination
}

// app.component.ts
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
        // console.log('Parsed Data:', result.data);

        // Create an array of UserProfile objects
        const profiles: UserProfile[] = result.data.map((row: any) => ({
          email: row['User Email'],
          username: row['User Name'],
          skillsBoostUrl: row['Google Cloud Skills Boost Profile URL'],
          badges: parseInt(row['# of Skill Badges Completed'], 10) || 0 // Convert badges to number
        }));

        // Sort the profiles by number of badges in descending order
        profiles.sort((a, b) => b.badges - a.badges);

        console.log('Sorted Profiles:', profiles);
        this.topProfiles = profiles.slice(0, 3);
        this.remainingProfiles = profiles.slice(3);
      }
    });
  }
}

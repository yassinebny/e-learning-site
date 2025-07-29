import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { OffersService } from 'src/app/MesServices/Offers/offers.service';
import { Offers } from 'src/app/Models/Offers';

@Component({
  selector: 'app-list-offers',
  templateUrl: './list-offers.component.html',
  styleUrls: ['./list-offers.component.css']
})
export class ListOffersComponent implements OnInit{
  ngOnInit(): void {
    this.get();
  }

  adminProjects: Offers[] = [];

constructor(private sp:OffersService , private router: Router){}
 get(){this.sp.getAll().subscribe(
    (adminProjects: Offers[]) => {
      this.adminProjects = adminProjects;
    },
    (error: any) => {
      console.error(error);
    }
  );} 
  showEventDetails(id: number) {
    this.router.navigate(['/offers-details', id]);
  }
  
}

import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-generate-certif',
  templateUrl: './generate-certif.component.html',
  styleUrls: ['./generate-certif.component.css']
})
export class GenerateCertifComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  showThankYouPopup: boolean = false;

  liste() {

    const input_name = document.getElementById('name') as HTMLInputElement | null;
    var chaine = input_name?.value;

    const input_periode = document.getElementById('periode') as HTMLInputElement | null;
    const value_periode = input_periode?.value;

    const input_formation = document.getElementById('formation') as HTMLInputElement | null;
    const value_formation = input_formation?.value;

    const input_month = document.getElementById('month') as HTMLInputElement | null;
    const value_month = input_month?.value;

    const input_date = document.getElementById('start') as HTMLInputElement | null;
    var value_date = input_date?.value ;
    if (!value_date)
      value_date = "";
    
    var date = new Date(value_date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); 
    var yyyy = date.getFullYear();
    value_date = dd + '/' + mm + '/' + yyyy;

    const article = { liste: chaine, periode:value_periode, nom_formation: value_formation, month:value_month, date:value_date};

    axios.post("http://localhost:8094/api/certif/Generer", article)
    .then( res=>{
      console.log(res.data);
      this.showThankYouPopup = true; // Afficher la fenêtre contextuelle "Thank you"

    })
    .catch( err=>{
      console.log(err)
    })

  }


}

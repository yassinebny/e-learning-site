import {Component, OnInit} from '@angular/core';
import {EncryptionService} from "../../../../MesServices/encryptionService/encryption.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestService} from "../../../../MesServices/Request/request.service";
import Swal from "sweetalert2";

interface Chapter {
  id: number;
  createdAt: Date;
  description: string;
  title: string;
}

interface Categorie {
  id: number;
  nomCate: string;
}

interface Formation {
  nomFormation: string;
  categorie: Categorie;
  chapters: Chapter[];
  createdAt: Date;
  nbChapters: number;
  nbProjects: number;
  nbExercices: number;
  nbMeetings: number;
  workspaces: number;
  price: number;
  startedDate: Date | null;
  thumbnail: string | null;
  posibility: string;
  status: number;
  id: number;
  description: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  phoneNumber: string;
  email: string;
  trainingPeriod: string;
  formation: Formation;
  requestStatus: string;
}

@Component({
  selector: 'app-training-paiement',
  templateUrl: './training-paiement.component.html',
  styleUrls: ['./training-paiement.component.css']
})
export class TrainingPaiementComponent implements OnInit {

  decryptedData: User | null = null;
  // trainingForm: FormGroup;

  dynamicForm!: FormGroup;

  totalPrice: number | undefined;
  adjustedtrainingpartPrice: number | undefined;
  adjustedtrainingplaceprice:number|undefined;
  paymentOptions: string[] = ['2months', 'month1','month2'];

  constructor(
    private route: ActivatedRoute,
    private encryptionService: EncryptionService, private fb: FormBuilder, private req:RequestService
  ) {this.init();
  }
idreq:any;
requests:any[]=[];
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      //const encryptedData = params['data'];
     /* const encryptedKey = params['ee'];
      if (encryptedData && encryptedKey) {
        const sessionKey = this.encryptionService.decryptSessionKey(encryptedKey);
        console.log("decrypted sesison s key",sessionKey)  ;  console.log('Decrypted Data:', encryptedData);
        const decryptedString = this.encryptionService.decryptData(encryptedData, sessionKey);
       this.decryptedData = JSON.parse(decryptedString);
      }*/
      const id =params['id'];
      this.idreq=id;
      this.req.getRequestsByid(id).subscribe({
        next:(res:User|any)=>{
         console.log("data ",res)
          this.decryptedData=res;
          if(this.decryptedData!=null){
            this.req.getRequestsByEmail(this.decryptedData.email).subscribe(
              {
                next:(res)=>{
                  this.requests=res;
                  console.log("requests",this.requests)
                  this.shouldDisableOption();
                }
              }
            )

          }
          this.init();



          this.dynamicForm.get('paymentOption')?.valueChanges.subscribe(value => {
            this.updatePrice(value);
          });
          var verif=false;
          this.dynamicForm.get('onlineEducation')?.valueChanges.subscribe(value => {
            if(value=='online')
            {verif=true;}
            else if (value=='onsite')
            {
              verif=false;
            }
            this.updateEducationMode(verif);
          });
        },
        error:(err)=>{console.log(err);}
      })
    });
    // Scroll to top of the page
    window.scrollTo(0, 0);

  }
init()
{
  this.dynamicForm = this.fb.group({
    paymentOption: ['', Validators.required],
    price: [{value: this.decryptedData?.formation.price, disabled: true}, Validators.required],
    adjustedPrice: [{value: '', disabled: true}],
    onlineEducation: ['onsite'],

  });
  this.totalPrice = this.decryptedData?.formation.price;
  this.adjustedtrainingpartPrice = this.totalPrice;
  this.adjustedtrainingplaceprice=this.adjustedtrainingpartPrice;
}
  updatePrice(paymentOption: string) {
    if (this.totalPrice !== undefined) {

      if (paymentOption === 'month1' ||paymentOption === 'month2' ) {
        this.adjustedtrainingpartPrice = this.totalPrice / 2;
      } else {
        this.adjustedtrainingpartPrice = this.totalPrice;
      }
      this.dynamicForm.get('adjustedPrice')?.setValue(this.adjustedtrainingpartPrice);
      // Reset onlineEducation to 'onsite'
      this.dynamicForm.get('onlineEducation')?.setValue('onsite');
    }
  }

  updateEducationMode(isOnline: boolean) {
      if (this.adjustedtrainingplaceprice !== undefined && this.adjustedtrainingpartPrice) {
    var paymentOption=  this.dynamicForm.get('paymentOption')?.value;
      if (isOnline) {
        if (paymentOption !='2months'  ) {
          this.adjustedtrainingplaceprice = this.adjustedtrainingpartPrice - 50;
        } else {
          this.adjustedtrainingplaceprice = this.adjustedtrainingpartPrice - 100;
        }
      } else {
        this.adjustedtrainingplaceprice = this.adjustedtrainingpartPrice;
      }
        this.dynamicForm.get('adjustedPrice')?.setValue(this.adjustedtrainingplaceprice);
    }

  }
  show:boolean=true;
  shouldDisableOption() {
    if (this.requests.length != null || this.decryptedData) {
console.log("fwst lmethod",this.requests);
      console.log("fwst lmethod",this.requests);
      const pending = this.requests.some((req) => req.trainingPeriod === 'pending' && req.requestStatus === 'UNPAID' && req.id===this.decryptedData?.id);
      const fullRequest = this.requests.some((req) => req.trainingPeriod === '2months' && req.requestStatus === 'PAID'&& req.id===this.decryptedData?.id);
      const period1Paid = this.requests.some((req) => req.trainingPeriod === 'month1' && req.requestStatus === 'PAID' && req.id===this.decryptedData?.id);
      const period2Paid = this.requests.some((req) => req.trainingPeriod === 'month2' && req.requestStatus === 'PAID' && req.id===this.decryptedData?.id);
      console.log("pending",pending);
      console.log("fullreq",fullRequest);
      console.log("pendio1paid",period1Paid);
      console.log("period2paid",period2Paid);
if(fullRequest || period2Paid)
{ this.show=false;

}else
if(period1Paid|| !period2Paid && !fullRequest && !pending)
{
  this.paymentOptions = ['month2'];
} else
if(!fullRequest&& !period1Paid && pending)
{ this.paymentOptions = ['2months', 'month1'];

}
    }

  }

  onSubmit() {
    if (this.decryptedData?.email && this.dynamicForm.get('paymentOption')?.value !== '' && this.dynamicForm.get('onlineEducation')?.value !== '') {
      this.req.generatepayment(this.decryptedData?.id,this.dynamicForm.get('adjustedPrice')?.value,
        this.dynamicForm.get('onlineEducation')?.value,
        this.decryptedData.email,
        this.dynamicForm.get('paymentOption')?.value,
        "ONLINE"
      ).subscribe(
        {
          next:(data)=>{
            window.location.href=data.link;
            console.log(data)
          },
          error:(error)=>{
            console.log(error)
          }
        }
      )
    }

  /*  if (this.decryptedData?.email && this.dynamicForm.get('paymentOption')?.value !== '' && this.dynamicForm.get('onlineEducation')?.value !== '') {
      this.req.updaterequestafterpaiement(
        this.dynamicForm.get('onlineEducation')?.value,
        this.decryptedData.email,
        this.dynamicForm.get('paymentOption')?.value,
        "ONLINE"
      ).subscribe({
        next: (res) => {
          var id='';

          this.route.queryParams.subscribe(params => {

             id =params['id'];})

          if(res.id!=id)
          {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'You already have an account! Check your email.',
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          }
          else {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'thank you ',
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          }
        },
        error: (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      });
    } else {
      console.log('Form data incomplete');
    }
    console.log(this.dynamicForm.value);
    // Process the form data as needed */

  }}

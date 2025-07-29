import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/MesServices/Request/request.service';
import { Request } from 'src/app/Models/Request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-request-list',
  templateUrl: './admin-request-list.component.html',
  styleUrls: ['./admin-request-list.component.css']
})
export class AdminRequestListComponent implements OnInit {


  requests!: Request[]
  selectedStatus:any='';
  selectedPeriod:string='';
  selectedPaymentType:any;
  selectedEducationPlace:any;
  idRequest!: number;
  showLoader: boolean = false;

  constructor(
    private rs: RequestService,
  ) {}


  ngOnInit(): void {
    this.getAll()
  }

  getAll() {
    this.rs.getAll().subscribe(
      (data: Request[]) => {
        this.requests = data
        console.log("datatat",data)

      }
    )
  }

  changeStatus(e:any) {

    this.rs.changeStatus(this.idRequest, this.selectedStatus).subscribe(
      () => {
        if(this.selectedStatus == 'PAID') {

          Swal.fire('Changed!', 'Status has been changed.', 'success');
          this.getAll()
        }else if(this.selectedStatus == 'UNPAID'){
          Swal.fire('Changed!', 'Status has been changed.', 'success');
          this.getAll()
        }
         else {
          Swal.fire('Changed!', 'Status has been changed.', 'success');
          this.getAll()

        }

      },
      (error: any) => {
        if( error.status === 400 &&  error.error === 'Formation not found')
          Swal.fire('Error !', 'An error occured please try again', 'error');
        else if(error.status === 400 && error.error === 'Status not modified') {
          Swal.fire('Alert', 'Status not modified', 'warning');
        }

      }
    )
    this.getreq();
  }
  period :string="";
  changePeriod(e:any) {
    this.period=this.selectedPeriod
    this.rs.changePeriod(this.idRequest, this.period).subscribe(
      () => {




      },
      (error: any) => {
        console.log(error)
        if( error.status === 400 &&  error.error === 'Formation not found')
          Swal.fire('Error !', 'An error occured please try again', 'error');
        else if(error.status === 400 && error.error === 'Period not modified') {
          Swal.fire('Alert', 'Status not modified', 'warning');
        }

      }
    )
    this.getreq();
  }
  setId(id: number) {
    this.idRequest = id;
    console.log(this.idRequest);
  }
  req:any;
  setreq(req: any) {
    this.req = req;
    console.log(req);
  }
  getreq(){
    console.log("1",this.req.trainingPeriod);
    console.log("2",this.selectedPeriod)
    if(((this.selectedPeriod && this.selectedPeriod !== 'pending') || this.req.trainingPeriod !== 'pending') &&(this.selectedStatus=='PAID'||  this.req.requestStatus=='PAID'))
    {console.log("e7em");

      var prd;
      if(this.selectedPeriod!=''){
        prd=this.selectedPeriod
        console.log(this.req.email);
        this.rs.generatepaymentonsite( this.idRequest, this.req.email,prd).subscribe({
          next:(data)=>{
            Swal.fire('Changed!', 'mail env', 'success');
            this.getAll()
            console.log( "nejhet",data)
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }
      else{
        prd= this.req.trainingPeriod
        console.log("prd",prd);
        console.log("mail",this.req.email)
        this.rs.generatepaymentonsite( this.idRequest, this.req.email,prd).subscribe({
          next:(data)=>{
            Swal.fire('Changed!', 'mail env', 'success');
            this.getAll()
            console.log( "nejhet",data)
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }

    }
  }
  paytype :string="";
  changepaytype() {
    this.paytype=this.selectedPaymentType
    this.rs.changepaytype(this.idRequest, this.paytype).subscribe(
      () => {

          Swal.fire('Changed!', 'pPayment type has been changed.', 'success');
          this.getAll()},
      (error: any) => {
        if( error.status === 400 &&  error.error === 'Formation not found')
          Swal.fire('Error !', 'An error occured please try again', 'error');
        else if(error.status === 400 && error.error === 'Status not modified') {
          Swal.fire('Alert', 'Status not modified', 'warning');
        }

      }
    )
  }
  changeeducationplace() {

    this.rs.changeeduplace(this.idRequest, this.selectedEducationPlace).subscribe(
      () => {

        Swal.fire('Changed!', 'education place  has been changed.', 'success');
        this.getAll()},
      (error: any) => {
        if( error.status === 400 &&  error.error === 'Formation not found')
          Swal.fire('Error !', 'An error occured please try again', 'error');
        else if(error.status === 400 && error.error === 'Status not modified') {
          Swal.fire('Alert', 'Status not modified', 'warning');
        }

      }
    )
  }
  pay(){


        this.rs.generatepaymentonsite(97,"malavem320@orsbap.com","2months").subscribe({
          next:(data)=>{
            Swal.fire('Changed!', 'Period has been changed.', 'success');
            this.getAll()
            console.log( "nejhet",data)
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }





}

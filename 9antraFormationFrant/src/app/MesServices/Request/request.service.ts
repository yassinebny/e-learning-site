import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Request, RequestStatus } from 'src/app/Models/Request';
import { environement } from 'src/environement/environement.dev';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

///payment //
  //http://localhost:8094/api/payment/create?amount=400
    generatepayment(id:number,amount:number,studyplace:string,email:string,period:string,paiementType:string){
    return this.http.post<any>(`${environement.BASE_URL}/payment/create`, null,{params :{amount,studyplace,id,email,period,paiementType}})
  }
  generatepaymentonsite(id:number,email:string,period:string){
    return this.http.get<any>(`${environement.BASE_URL}/payment/onsite`, {params :{id,email,period}})
  }
  addRequest(request: FormData, idFormation: number): Observable<Request> {
    return this.http.post<Request>(`${environement.BASE_URL}/request/${idFormation}`, request)
  }

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(`${environement.BASE_URL}/request`)
  }

  changeStatus(id: number, status: string) {
    return this.http.patch(`${environement.BASE_URL}/request/${id}/${status}`, [])
  }
  changepaytype(id: number, paytype: string) {
    return this.http.patch(`${environement.BASE_URL}/request/paytype/${id}/${paytype}`, [])
  }
  changePeriod(id: number, period: string) {
    return this.http.patch(`${environement.BASE_URL}/request/period/${id}/${period}`, [])
  }
  changeeduplace(id: number, educationplace: string) {
    return this.http.patch(`${environement.BASE_URL}/request/educationplace/${id}/${educationplace}`, [])
  }
  getunpaidonlineRequestsByEmail(email : string){
    return this.http.get<Request[]>(`${environement.BASE_URL}/request/getunpaidonlineRequestsByEmail`, {
      params: { email } // Pass email as a query parameter
    });

  }
  getRequestsByEmail(email : string){
    return this.http.get<Request[]>(`${environement.BASE_URL}/request/getRequestsByEmail`, {
      params: { email } // Pass email as a query parameter
    });

  }

  getRequestsByid(id:number){
    return this.http.get<Request[]>(`${environement.BASE_URL}/request/getbyid`, {
      params: {id } // Pass email as a query parameter
    });

  }
  updaterequestafterpaiement(studyplace:string,email:string,period:string,paiementType:string){
    return this.http.patch<any>(`${environement.BASE_URL}/request/updaterequestafterpaiement`, null,{
      params: {studyplace,email,period,paiementType } // Pass email as a query parameter
    });

  }
}

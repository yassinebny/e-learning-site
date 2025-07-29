import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environement} from "../../../environement/environement.dev";
import {Appointment} from "../../Models/appointment/Appointment";
import {WorkHoursModel} from "@syncfusion/ej2-angular-schedule";
import {Break} from "../../Models/appointment/Break";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http: HttpClient) {}

  getAllAppointments(){
    return this.http.get<Appointment[]>(`${environement.BASE_URL}/appointments`);
  }

  getAppointmentById(id: number){
    return this.http.get<Appointment>(`${environement.BASE_URL}/appointments/${id}`);
  }

  createAppointment(appointment: Appointment) {
    return this.http.post<Appointment>(`${environement.BASE_URL}/appointments`, appointment);
  }

  updateAppointment(id: number, appointment: Appointment){
    return this.http.put<Appointment>(`${environement.BASE_URL}/appointments/${id}`, appointment);
  }

  deleteAppointment(id: number){
    return this.http.delete<void>(`${environement.BASE_URL}/appointments/${id}`);
  }

  getWorkHours(dayOfWeek: string) {
    return this.http.get<WorkHoursModel[]>(`${environement.BASE_URL}/work-hours/${dayOfWeek}`);
  }

  saveWorkHours(workHours: WorkHoursModel) {
    return this.http.post<WorkHoursModel>(`${environement.BASE_URL}/work-hours`, workHours);
  }
  getAllBreaks() {
    return this.http.get<Break[]>(`${environement.BASE_URL}/breaks`);
  }

  addBreak(breakz: Break) {
    return this.http.post<Break>(`${environement.BASE_URL}/breaks`, breakz);
  }

  deleteBreak(id: number) {
    return this.http.delete<void>(`${environement.BASE_URL}/breaks/${id}`);
  }

}

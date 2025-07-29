import {Component, Inject, OnInit, Query} from '@angular/core';
import {
  ActionEventArgs,
  EJ2Instance,
  EventSettingsModel,
  PopupOpenEventArgs, RenderCellEventArgs, TimeScaleModel,
  View,

} from "@syncfusion/ej2-angular-schedule";
import { Predicate,DataManager } from '@syncfusion/ej2-data';

import { AppointmentService } from "../../../../../MesServices/appointment/appointment.service";
import { Appointment } from "../../../../../Models/appointment/Appointment";
import { UserAuthService } from "../../../../../MesServices/user-auth.service";
import {WorkHoursModel} from "../../../../../Models/appointment/WorkHoursModel";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Break} from "../../../../../Models/appointment/Break";



@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit {
  public data: Object[] = [];

  public selectedDate: Date = new Date();
  weekDays: string[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  selectedDays: string[] = [];
  public currentView: View = 'TimelineWeek';
  public timeScale: TimeScaleModel = { interval: 60, slotCount: 1 };
  monthDays: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  public eventSettings: EventSettingsModel={
    fields: {
      id: 'Id',
      subject: { title: 'Summary', name: 'Subject' },
      location: { title: 'Location', name: 'Location' },
      description: { title: 'Comments', name: 'Description' },
      startTime: { title: 'From', name: 'StartTime' },
      endTime: { title: 'To', name: 'EndTime' }
    },
    allowDeleting: this.userAuthService.getRoles1().includes("ADMIN"),

  };
  userLoggedIn: boolean = false;
  userIsAdmin: boolean = false;
  canAddEvent: boolean = false; // Flag to determine if user can add event
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public newWorkHours: WorkHoursModel = { dayOfWeek: '', start: '', end: '' };
  breakForm: FormGroup;

  selectedMonthDay: number | null = null;
  selectedMonth: number | null = null;
  constructor(   private fb: FormBuilder,private appointmentService: AppointmentService, private userAuthService: UserAuthService)  {
    this.breakForm = this.fb.group({
      subject: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      recurrenceType: ['DAILY', Validators.required],
      recurrenceRule: ['FREQ=DAILY;INTERVAL=1;', Validators.required],
      isBlock: [true],
      airlineId: [2, Validators.required]
    });
  }
  startOfDay?:Date;
  endOfDay?:Date;
  initializeScheduler(): void {


    this.daysOfWeek.forEach(day => {
      this.appointmentService.getWorkHours(day).subscribe(workHoursList => {
        workHoursList.forEach(workHours => {
          const startTime = workHours.start?.split(':');
          const endTime = workHours.end?.split(':');
if(startTime && endTime) {
  const startHour = parseInt(startTime[0], 10);
  const startMinute = parseInt(startTime[1], 10);
  const endHour = parseInt(endTime[0], 10);
  const endMinute = parseInt(endTime[1], 10);

  const currentDate = new Date();
  const dayIndex = this.daysOfWeek.indexOf(day);
  currentDate.setDate(currentDate.getDate() -currentDate.getDay() + dayIndex); // Set to the specific day of the week
  currentDate.setHours(0, 0, 0, 0); // Set to the start of the day


  // For each hour in the day
  for (let hour = 0; hour < 24; hour++) {
    const startOfHour = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, 0);
    const endOfHour = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour + 1, 0);

    if (startOfHour.getDay() === dayIndex) {
      if (startOfHour.getHours() < startHour || (startOfHour.getHours() === startHour && startOfHour.getMinutes() < startMinute) ||
        endOfHour.getHours() > endHour || (endOfHour.getHours() === endHour && endOfHour.getMinutes() > endMinute)) {
        // Outside the allowed time range, mark as blocked
        this.data.push({
          Id: `${day}-${hour}`,
          Subject: 'Closed',
          StartTime: startOfHour,
          EndTime: endOfHour,
          IsBlock: true,
          RecurrenceRule: `FREQ=DAILY;BYDAY=${day.substring(0, 2).toUpperCase()};INTERVAL=1;`
        });
      }
    }
  }
} });

        this.eventSettings = { dataSource: this.data };
      });
    });
  }

  onSubmit(){
    this.appointmentService.saveWorkHours(this.newWorkHours).subscribe(() => {
      // Refresh the scheduler data after saving new work hours
      this.initializeScheduler();
      this.newWorkHours = { dayOfWeek: '', start: '', end: '' }; // Reset form
    });
  }
  ngOnInit(): void {
    this.getAppointments();
    this.initializeScheduler();
    this.userLoggedIn = this.userAuthService.isLoggedIn1();
    this.userIsAdmin = this.userAuthService.getRoles1().includes("ADMIN");
    this.canAddEvent = true;// Example: Only admins can add events initially
    this.getBreaks();

  }
  onActionBegin(args: ActionEventArgs) {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange' || args.requestType === "eventRemove") {
      if (this.isPast(args)) {
        // Preventing the edit by setting up "true" to "args.cancel"
        args.cancel = true;
        alert('Adding an event to the past time and editing an event on the past time is not allowed.');
      }
    }
  }

  onRenderCell(args: RenderCellEventArgs): void {
    // Adding "e-disable-date" class to preventing the CRUD actions in the past date and time cells
    if( args.date && args.date < new Date())  {
      args.element.classList.add('e-disable-dates');
    }
  }
  scheduleObj: any;
  isPast(args: ActionEventArgs): boolean {
    let eventObj: { [key: string]: any } = args.data instanceof Array ? args.data[0] : args.data as { [key: string]: any };
    let result: boolean = eventObj['StartTime'] < new Date()

    if (!(args.data instanceof Array)) {
      let rule = new Predicate("Id", "equal", eventObj['Id'] as number, false);
     // let datas: { [key: string]: any }[] = new DataManager(this.scheduleObj.eventsData).executeLocal(new Query().where(rule)) as { [key: string]: any }[];

    //  if (datas.length > 0) {
     //   result = datas[0]['StartTime'] > new Date() ? result : datas[0]['StartTime'] < new Date();
    //  }
    }

    return result;
  }

  getAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        this.data = data.map((appointment) => ({
          Id: appointment.id,
          Subject: appointment.subject,
          StartTime: new Date(appointment.startTime),
          EndTime: new Date(appointment.endTime)
        }));

        // Append new appointments

        this.eventSettings = { dataSource: this.data };
        this.initializeScheduler();
      },
      (error) => {
        console.error('Error fetching appointments', error);
      }
    );
  }


  onActionComplete(args: any): void {
    if (args.requestType === 'eventCreated') {
      const newAppointment: Appointment = {
        subject: args.data[0].Subject,
        startTime: new Date(args.data[0].StartTime),
        endTime: new Date(args.data[0].EndTime)
      };
      this.createAppointment(newAppointment);
    } else if (args.requestType === 'eventChanged') {
      const updatedAppointment: Appointment = {
        id: args.data.Id,
        subject: args.data.Subject,
        startTime: new Date(args.data.StartTime),
        endTime: new Date(args.data.EndTime)
      };
      this.updateAppointment(updatedAppointment);
    } else if (args.requestType === 'eventRemoved') {
      if (this.userIsAdmin) {
        this.deleteAppointment(args.data[0].Id);
      } else {
        console.error('Error: Only admins can delete appointments');
        // Optionally, show a message to the user
      }
    }
  }

  createAppointment(appointment: Appointment): void {
    this.appointmentService.createAppointment(appointment).subscribe(
      () => this.getAppointments(),
      (error) => console.error('Error creating appointment', error)
    );
  }

  updateAppointment(appointment: Appointment): void {
    if (appointment.id) {
      this.appointmentService.updateAppointment(appointment.id, appointment).subscribe(
        () => this.getAppointments(),
        (error) => console.error('Error updating appointment', error)
      );
    }
  }

  deleteAppointment(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(
      {
        next: () => {
          if (this.userIsAdmin) {
            this.getAppointments()
          }
        },
        error: (error) => {
          console.error('Error deleting appointment', error)
        }
      });
  }

  getBreaks(): void {
    this.appointmentService.getAllBreaks().subscribe(
      (data) => {
        this.data = this.data.concat(
          data.map((breakz) => ({
            Id: breakz.id,
            Subject: breakz.subject,
            StartTime: new Date(breakz.startTime),
            EndTime: new Date(breakz.endTime),
            RecurrenceRule: breakz.recurrenceRule,
            IsBlock: breakz.isBlock,
            AirlineId: breakz.airlineId
          }))
        );
        this.eventSettings = { dataSource: this.data };
      },
      (error) => {
        console.error('Error fetching breaks', error);
      }
    );
  }
  addBreak(breakz: any): void {
    this.appointmentService.addBreak(breakz).subscribe(
      (data) => {
        this.data.push({
          Id: data.id,
          Subject: data.subject,
          StartTime: new Date(data.startTime),
          EndTime: new Date(data.endTime),
          RecurrenceRule: data.recurrenceRule,
          IsBlock: data.isBlock,
          AirlineId: data.airlineId
        });
        this.eventSettings = { dataSource: this.data };
      },
      (error) => {
        console.error('Error adding break', error);
      }
    );
  }


  deleteBreak(id: number){
  this.appointmentService.deleteBreak(id).subscribe(
    () => {
      this.data = this.data.filter((item:any) => item.Id !== id);
      this.eventSettings = { dataSource: this.data };
    },
    (error) => {
      console.error('Error deleting break', error);
    }
  );
}
  onSubmitBreak() {
    if (this.breakForm.valid) {
      let recurrenceRule = '';
      switch (this.breakForm.value.recurrenceType) {
        case 'DAILY':
          recurrenceRule = 'FREQ=DAILY;INTERVAL=1;';
          break;
        case 'WEEKLY':
          recurrenceRule = `FREQ=WEEKLY;INTERVAL=1;BYDAY=${this.selectedDays.join(',')}`;
          break;
        case 'MONTHLY':
          recurrenceRule = `FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=${this.selectedMonthDay}`;
          break;
        case 'YEARLY':
          recurrenceRule = `FREQ=YEARLY;INTERVAL=1;BYMONTH=${this.selectedMonth};BYMONTHDAY=${this.selectedMonthDay}`;
          break;
      }

      const breakData: Break = {

        subject: this.breakForm.value.subject,
        startTime: new Date(this.breakForm.value.startTime),
        endTime: new Date(this.breakForm.value.endTime),
        recurrenceRule: recurrenceRule,
        isBlock: this.breakForm.value.isBlock,
        airlineId: this.breakForm.value.airlineId
      };

      this.addBreak(breakData);
      this.breakForm.reset();
    }
  }

  onRecurrenceTypeChange(event: Event): void {
    const recurrenceType = (event.target as HTMLSelectElement).value;
    if (recurrenceType === 'WEEKLY') {
      this.breakForm.addControl('byDay', this.fb.control([]));
    } else {
      this.breakForm.removeControl('byDay');
    }

    if (recurrenceType === 'MONTHLY' || recurrenceType === 'YEARLY') {
      this.breakForm.addControl('byMonthDay', this.fb.control(null, Validators.required));
      if (recurrenceType === 'YEARLY') {
        this.breakForm.addControl('byMonth', this.fb.control(null, Validators.required));
      } else {
        this.breakForm.removeControl('byMonth');
      }
    } else {
      this.breakForm.removeControl('byMonthDay');
      this.breakForm.removeControl('byMonth');
    }
  }

  onDayChange(event: Event): void {
    const day = (event.target as HTMLInputElement).value;
    if ((event.target as HTMLInputElement).checked) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }

  onMonthDayChange(event: Event): void {
    this.selectedMonthDay = parseInt((event.target as HTMLSelectElement).value, 10);
  }

  onMonthChange(event: Event): void {
    this.selectedMonth = parseInt((event.target as HTMLSelectElement).value, 10);
  }

}

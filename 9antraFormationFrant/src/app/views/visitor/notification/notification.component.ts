import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/MesServices/Notification/notification.service';
import { StompService } from 'src/app/MesServices/StompService/stomp.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit{
notifications:any
notificationsNotSeen: any[] = [];
  constructor( private authService: UserAuthService,
    private notificationService: NotificationService,
    private stompService : StompService){
    }
  ngOnInit(): void {
    this.getAll();
    this.stompService.subscribe('/topic/notification',():any=>{
      this.getAll();
    })
  }
    isLoggedIn(): boolean {
      return this.authService.isLoggedIn2();
    }
  updateNotificationsNotSeen(): void {
      this.notificationsNotSeen = this.notifications.filter(
        (notification:any) => notification.status === 0
      );
    }

    getAll(){
      this.notificationService.getAll(this.authService.getId()).subscribe((res:any)=>{
        this.notifications=res
        this.updateNotificationsNotSeen();
      },(error)=>{
        console.log(error);
      })
    }
    changeStatus(){
      if(this.notificationsNotSeen.length>0){
        for(let i = 0 ;i<this.notifications.length;i++){
          this.notificationService.changeStatus(this.notifications[i].id,null).subscribe((res:any)=>{
          })
        }
        this.updateNotificationsNotSeen();
      }
    }

    changeStatusToSeenDetails(id:any){
          this.notificationService.changeStatusToSeenDetails(id,null).subscribe((res:any)=>{
          })
      }

    deleteById(id:any){
      this.notificationService.deleteById(id).subscribe((res:any)=>{
        console.log(res);
      },(error)=>{
        console.log(error);
      })
    }

    deleteAll(){
      if(this.notifications.length>0){
        Swal.fire({
          title: 'Are you sure?',
          text: 'You are about delete all the notifications',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.notificationService.deleteAll().subscribe((res:any)=>{
              this.updateNotificationsNotSeen();
            })
          }
        });
      }
    }

    changeStatusToDeleted(id:any){
      this.notificationService.changeStatusToDeleted(id,null).subscribe((res:any)=>{
        this.stompService.subscribe('/topic/notification',():any=>{
          this.getAll();
        })
      })
    }

}

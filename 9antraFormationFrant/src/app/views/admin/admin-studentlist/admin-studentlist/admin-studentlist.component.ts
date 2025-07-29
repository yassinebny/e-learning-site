import { Component, OnInit } from '@angular/core';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';

@Component({
  selector: 'app-admin-studentlist',
  templateUrl: './admin-studentlist.component.html',
  styleUrls: ['./admin-studentlist.component.css'],
})
export class AdminStudentlistComponent implements OnInit {
  taballusers: any = [];
  tabStudent: any = [];
  tabFormation: any = [];
  Formation = "";
  status = "";
  constructor(private sr: UserService, private fr: FormationsService) {}

  getfilts() {
    this.sr
      .getFormationByTypeFormationAndStatus(this.Formation, this.status)
      .subscribe((res) => {
        this.tabStudent = res;
      });
  }
  reset(){
    this.Formation=""
    this.status=""
  }
  getAllFormation() {
    this.fr.getFormations().subscribe((res) => {
      this.tabFormation = res;
      console.log(this.tabFormation);
    });
  }
  getallStudent() {
    this.sr.getAllUsers().subscribe((res) => {
      this.taballusers = res;
      console.log(this.taballusers);

      // Filter the array to get only users with role "ETUDIANT"
      this.tabStudent = this.taballusers.filter((user: { roles: any[] }) => {
        return user.roles.some((role) => role.name === 'ETUDIANT');
      });

      console.log(this.tabStudent);
    });
  }
  ngOnInit(): void {
    this.getallStudent();
    this.getAllFormation();
  }
  idUser!: Number;

  getId(id: any) {
    this.idUser = id;
    console.log(this.idUser);
  }

  updateEnable(enabled: any) {
    this.sr.updateEnabeld(this.idUser, enabled).subscribe((res) => {
      console.log(res);
      this.getallStudent();
    });
  }

}

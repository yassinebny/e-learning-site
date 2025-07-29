import { RecordService } from './../../../../MesServices/Record/record.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupService } from 'src/app/MesServices/Groups/group.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import { Groups } from 'src/app/Models/group.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { error } from 'jquery';






@Component({
  selector: 'app-coach-groups',
  templateUrl: './coach-groups.component.html',
  styleUrls: ['./coach-groups.component.css'],
})
export class CoachGroupsComponent {
  groups: any[] = [];
  RecordForm!: FormGroup;
  imagepath = '';
  selectedGroup: any = [];
  countMembers:any;
  private jwtToken: string;

  idGroupe!: any;
  constructor(
    private groupsService: GroupService,
    public userAuthService: UserAuthService,
    private formBuilder: FormBuilder,
    private RecordService: RecordService,
    private router: Router
  ) {
    this.jwtToken = localStorage.getItem('jwtToken') || '';
  }
  handleUploadClick(group: any) {
    // Implement the functionality you want to execute when the Upload button is clicked
    console.log('Upload button clicked for group:', group);
    // You can add your upload logic here
  }

  ngOnInit() {
    this.RecordForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      video: '',
    });

    if (this.jwtToken) {
      const formateurid = this.userAuthService.getId();
      this.groupsService.getGroupsByFormateurId(formateurid).subscribe((groups) => {
        this.groups = groups;
        console.log('Fetched groups:', this.groups);
      });
    } else {
      console.log('No user connected');
    }

  }

  getIdGroupe(id: any) {
    this.idGroupe = id;
    console.log(this.idGroupe);
    this.groupsService.getGroupsById(id).subscribe((group) => {
      this.selectedGroup = group;
      console.log('Fetched group:', this.selectedGroup);
    });
  }
  AddRecordsForm() {



    const formData = new FormData();
    formData.append('title', this.RecordForm.get('title')?.value);
    formData.append('groupId', this.idGroupe);
    formData.append('idUser', localStorage.getItem('id')!);

    const photoFile = this.RecordForm.get('video')?.value;
    if (photoFile instanceof File) {
      formData.append('file', photoFile, photoFile.name);
    }

    this.RecordService.addRecord(formData).subscribe((data) => {
      console.log(data);
      // Show SweetAlert success notification
      Swal.fire({
        icon: 'success',
        title: 'Record Added Successfully',
        showConfirmButton: true,

      }).then((result) => {
        if (result.isConfirmed) {
          // Construct the URL with the ID
          const newUrl = `coach/groups/${this.idGroupe}/records`;

          // Change the URL and trigger page refresh
          window.location.href = newUrl;
        }
      });
    },
    (error) => {
      console.error(error);
      // Handle error and show error notification with Swal.fire
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the record. Please try again later.',
        showConfirmButton: true,
      });
    }
  );
}


  getStudentImages(groupId: number): string[] {
    const group = this.groups.find((g) => g.id === groupId);
    if (!group || !group.etudiants) {
      return [];
    }

  // private jwtToken: string;
  // constructor(
  //   private groupsService: GroupService,
  //   public userAuthService: UserAuthService
  // ) {
  //   this.jwtToken = localStorage.getItem('jwtToken') || '';
  // }
  // ngOnInit() {
  //   if (this.jwtToken) {
  //     const formateurid = this.userAuthService.getId();
  //     this.groupsService
  //       .getGroupsByFormateurId(formateurid)
  //       .subscribe((groups) => {
  //         this.groups = groups;
  //         console.log('Fetched groups:', this.groups);
  //       });
  //   } else {
  //     console.log('No user connected');
  //   }
  // }
  // getStudentImages(groupId: number): string[] {
  //   const group = this.groups.find((g) => g.id === groupId);
  //   if (!group || !group.etudiants) {
  //     return [];
  //   }

    const studentImages: string[] = [];

    for (const student of group.etudiants.slice(0, 3)) {
      studentImages.push(student.image);
    }

    return studentImages;
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.RecordForm.get('video')!.setValue(file);
      console.log(this.RecordForm.get('video')!.value);
    } else {
      this.RecordForm.get('video')!.setValue(this.imagepath);
    }
  }

  getCountMembersByGroupId(id:any){
    this.groupsService.getCountMembersByGroupId(id).subscribe((res:any)=>{
      this.countMembers=res;
    },(error)=>{
      console.log(error)
    }
    )
  }
}

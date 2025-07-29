import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { CourseService } from 'src/app/MesServices/Course/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-course-add-form',
  templateUrl: './admin-course-add-form.component.html',
  styleUrls: ['./admin-course-add-form.component.css']
})
export class AdminCourseAddFormComponent implements OnInit {

  courseForm!: FormGroup;
  imagepath = '';
  successMessage: string = '';
  errorMessage: string = '';
  showSuccessModal: boolean = false;
  goals: any[] = []


  constructor(private formBuilder: FormBuilder, private router: Router, private courseService: CourseService) {

  }

  ngOnInit(): void {
    this.courseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      language: ['', Validators.required],
      image: ['', [Validators.required]],
      trailer: ['', [Validators.required]],
      goal: ['', Validators.required],

    })
  }

  onImageSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.courseForm.get('image')!.setValue(file);
      console.log(this.courseForm.get('image')!.value);
    } else {
      this.courseForm.get('image')!.setValue(this.imagepath);
    }
  }

  onVideoSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.courseForm.get('trailer')!.setValue(file);
      console.log(this.courseForm.get('trailer')!.value);
    } else {
      this.courseForm.get('trailer')!.setValue(this.imagepath);
    }
  }

  addCourse() {
    if (this.courseForm.valid) {

      const formData = new FormData();
      var goals = this.courseForm.get('goal')?.value.split(',');
      goals.forEach((g: any) => { this.goals.push({ description: g }) })
      const course = {
        title: this.courseForm.get('title')?.value,
        description: this.courseForm.get('description')?.value,
        duration: this.courseForm.get('duration')?.value,
        language: this.courseForm.get('language')?.value,
        goal: this.goals
      }
      formData.append('course', JSON.stringify(course));
      const photoFile = this.courseForm.get('image')?.value;
      const video = this.courseForm.get('trailer')?.value;
      if (photoFile instanceof File || video instanceof File) {
        formData.append('image', photoFile, photoFile.name);
        formData.append('video', video, video.name);
      }

      formData.forEach((key, value) => {
        console.log(key, value);
      });


      this.courseService.addCourse(formData)
        .subscribe(
          (data) => {
            Swal.fire({
              title: 'Courses has been added successfully',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            })
            // Handle successful response
            this.router.navigateByUrl("/admin/courses")
          },
          (error) => {
           this.errorMessage="Add course failed!"
          })

      // this.eventService.addEvent(formData).subscribe(
      //   () => {
      //     this.successMessage = 'Event added successfully.';
      //     this.errorMessage = '';
      //     this.showSuccessModal = true;
      //     this.router.navigateByUrl("/admin/events")
      //   },
      //   (error) => {
      //     this.successMessage = '';
      //     this.errorMessage = 'Error adding the Event. Please try again.';
      //   }
      // )



  }

  }

}

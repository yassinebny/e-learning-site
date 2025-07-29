import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormationsService} from "../../../../MesServices/Formations/formations.service";
import {RequestService} from "../../../../MesServices/Request/request.service";
import {ViewportScroller} from "@angular/common";

@Component({
  selector: 'app-requestsentdetails',
  templateUrl: './requestsentdetails.component.html',
  styleUrls: ['./requestsentdetails.component.css']
})
export class RequestsentdetailsComponent  implements OnInit, AfterViewInit{
  clickedBox: string | null = null;
  id: string | null = null; // Initialize id as null or appropriate type
formations :any=[];
showothertraining:boolean=false;
  count_page:any
  scrollPercentage: number = 0;
  page=0
  per_page=2
  constructor(private viewportScroller: ViewportScroller,private el: ElementRef,private route: ActivatedRoute,private router:Router,private formation:FormationsService, private req:RequestService) { }
  inview(ele:any){
  ele.scrollIntoView({behavior:"smooth",block:"start",inline:"start"})
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const item1 = document.getElementById('item1');
    const item2 = document.getElementById('item2');
    const item3 = document.getElementById('item3');

    if (item1 && item2 && item3) {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const offset = 200; // Adjust this value based on the height of your section titles

      const item1Position = item1.offsetTop - offset;
      const item2Position = item2.offsetTop - offset;
      const item3Position = item3.offsetTop - offset;

      if (scrollPosition >= item1Position && scrollPosition < item2Position) {
        this.selectedStep = 0;
      } else if (scrollPosition >= item2Position && scrollPosition < item3Position) {
        this.selectedStep = 2;
      } else if (scrollPosition >= item3Position) {
        this.selectedStep = 3;
      }


    }
    const scrollOffset =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    this.scrollPercentage = (scrollOffset / windowHeight) * 100
  }



  steps = [
    'Step 1: Read Training Details',
    'Step 2: Choose a Payment Method',
    'Step 2.1: Onsite Methods',
    'Step 2.2: Online Payment'
  ];

  selectedStep: number | null = null;

  selectStep(index: number) {
    this.selectedStep = index;
  }
  ngOnInit(): void {
    // Retrieve id from route parameters
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getFilteredFormations();

      // Ensure scrolling to top after data is loaded

    });

  }


  ngAfterViewInit(): void {
    // Scroll to the top of the page after the view is initialized
    window.scrollTo(0, 0);
  }
  userformation:any=[];
  filtredFormationId:number=0;
  pagedFormations: any[] = [];
  currentPage: number = 1;
  pageSize: number = 2; // Adjust as per your pagination size
  totalPages: number = 0;

  getFilteredFormations() {
    if (this.id) {
      var idreq:number=Number(this.id);
      this.req.getRequestsByid(idreq).subscribe({
        next:(result:any)=>{

          this.formation.getFormations().subscribe(
            (data: any) => {

              this.userformation = data.filter((formation: any) => result.formation.id == formation.id);
              if (this.userformation.length > 0) {
                this.filtredFormationId= this.userformation[0].id; // Extracting the id directly
              }
              this.getALLFormations();
            },
            (error) => {
              console.log(error);
            }
          );
        },
      error:(error)=>{
          console.log(error);
      }


      })

    }


  }
  getALLFormations() {
    this.formation.getFormations().subscribe(
      (data: any) => {
        // If there's a filtered formation, exclude it and adjust count_page accordingly
        if (this.filtredFormationId !== null) {
          this.formations = data.filter((formation: any) => formation.id !== this.filtredFormationId);
          this.totalPages = Math.ceil(this.formations.length / this.pageSize);
          this.setPage(1); // Initialize to first page
console.log("  this.formations",  this.formations)
        } else {
          this.formations = data;
          this.totalPages = Math.ceil(this.formations.length / this.pageSize);
          this.setPage(1); // Initialize to first page

        }
      },(error)=>{
        console.log(error);
      }
    );
  }
  setPage(page: number) {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedFormations = this.formations.slice(startIndex, startIndex + this.pageSize);
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }
  navigateToPayment() {
    // Navigate to '/payment' route with id parameter
    if (this.id) {
      this.router.navigate(['/payment'], { queryParams: { id: this.id } });
    }
  }
  toggleBox(boxId: string) {
    if (this.clickedBox === boxId) {
      this.clickedBox = null; // Toggle off if clicking the same box again
    } else {
      this.clickedBox = boxId; // Set the clicked box ID

    }
  }

  isClicked(boxId: string): boolean {
    return this.clickedBox === boxId;
  }

  isSiblingClicked(boxId: string): boolean {
    // Check if the clickedBox is set and is not the current box
    return this.clickedBox !== null && this.clickedBox !== boxId;
  }



  getImageUrl(nomCate: string): string {
    const imageMap: { [key: string]: string } = {
      'DEVOPS': 'assets/img/devops.png',
      'DEVELOPMENT': 'assets/img/web.png',
      'BI': 'assets/img/bi.webp',
      'FLUTTER': 'assets/img/flutter.webp'
    };
    const key = Object.keys(imageMap).find(k => nomCate.toUpperCase().includes(k));
    return key ? imageMap[key] : 'assets/img/default.png';
  }

  getImageClass(nomCate: string): string {
    const upperNomCate = nomCate.toUpperCase();
    return upperNomCate.includes('DEVOPS') || upperNomCate.includes('DEVELOPMENT') ? 'imgs animated' : 'imgs2 animated';
  }

  currentSection = 'section1';

  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }

  scrollTo(section: string) {
    const element = document.querySelector('#' + section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}

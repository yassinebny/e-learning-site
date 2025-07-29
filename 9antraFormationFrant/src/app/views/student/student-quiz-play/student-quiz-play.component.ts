import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/MesServices/Quiz/quiz.service';
import { interval, timeout } from 'rxjs';
@Component({
  selector: 'app-student-quiz-play',
  templateUrl: './student-quiz-play.component.html',
  styleUrls: ['./student-quiz-play.component.css']
})

export class StudentQuizPlayComponent implements OnInit{
  @ViewChild('opt') div:any;
  @ViewChild('opt1') div1:any;
  @ViewChild('opt2') div2:any;
  constructor(private quizService:QuizService,private route : ActivatedRoute,private elementRef: ElementRef){

  }

  quizId:any
  questionList: any = [];
  currentQuestion: number = 0;
  points: number = 0;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  counter = 10;
  interval$: any;
  progress: string = "0";
  isQuizCompleted : boolean = false;
   a = [0, 1, 2];
   b: any[] = [];

  options:any[]=[]
  list:any=[]

  getQuestionsByQuizId(id:any){
    this.quizService.getQuestionsByQuizId(id).subscribe((res:any)=>{
      this.questionList=res
      console.log(this.questionList[0].quizId.name);
      this.list.push({'opt':this.questionList[this.quizService.getQuizItemsCurrentQuestion()].correct_answer,'correct':true})
      this.list.push({'opt':this.questionList[this.quizService.getQuizItemsCurrentQuestion()].wrong_answer1,'correct':false})
      this.list.push({'opt':this.questionList[this.quizService.getQuizItemsCurrentQuestion()].wrong_answer2,'correct':false})
      this.random();
    })
  }


  random(): void {
    for(let i=0;i<3;i++){
      if (this.list.length > 0) {
        this.shuffle(this.list);
        let randomIndex = Math.floor(Math.random() * this.list.length);
        this.options.push(this.list[randomIndex]);
        this.list.splice(randomIndex, 1);
        console.log(this.options);
    } else {
        console.log("All elements from 'list' have been pushed to 'options'.");
    }
    }
}

shuffle(array: any[]){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


toggleCorrect() {
  if(this.options[0].correct){
    this.div.nativeElement.style.backgroundColor='green'
    this.div.nativeElement.style.color='white'
    this.div1.nativeElement.style.backgroundColor='red'
    this.div1.nativeElement.style.color='white'
    this.div2.nativeElement.style.backgroundColor='red'
    this.div2.nativeElement.style.color='white'
  }else if(this.options[1].correct){
    this.div1.nativeElement.style.backgroundColor='green'
    this.div1.nativeElement.style.color='white'
    this.div.nativeElement.style.backgroundColor='red'
    this.div.nativeElement.style.color='white'
    this.div2.nativeElement.style.backgroundColor='red'
    this.div2.nativeElement.style.color='white'
  }else{
    this.div2.nativeElement.style.backgroundColor='green'
    this.div2.nativeElement.style.color='white'
    this.div1.nativeElement.style.backgroundColor='red'
    this.div1.nativeElement.style.color='white'
    this.div.nativeElement.style.backgroundColor='red'
    this.div.nativeElement.style.color='white'
  }
}


  answer(option: any) {
    if(this.quizService.getQuizItemsCurrentQuestion()+1 == this.questionList.length){
        this.quizService.setQuizItemsIsCompleted(true);
        this.stopCounter();
    }
    if (option.correct) {
      this.quizService.setQuizItemsPoints((this.quizService.getQuizItemsPoints())+10)
      this.quizService.setQuizItemsCorrectAnswer((this.quizService.getQuizItemsCorrectAnswer())+1)
      if(this.getCurrentQuestion()+1<this.questionList.length){
        setTimeout(() => {
          this.quizService.setQuizItemsCurrentQuestion((this.quizService.getQuizItemsCurrentQuestion())+1)
        }, 1000);
      }
      this.resetCounter();
      this.getProgressPercent();
      if(this.getCurrentQuestion()<this.questionList.length){
        setTimeout(() => {
          const newUrl = `/student/student-quiz-play/${this.quizId}`;
          window.location.href = newUrl;
      }, 1000);
      }

    } else {
        this.quizService.setQuizItemsInCorrectAnswer((this.quizService.getQuizItemsInCorrectAnswer())+1)
        if(this.getCurrentQuestion()+1<this.questionList.length){
          setTimeout(() => {
            this.quizService.setQuizItemsCurrentQuestion((this.quizService.getQuizItemsCurrentQuestion())+1)
          }, 1000);
        }
        this.resetCounter();
        this.getProgressPercent();
        if(this.getCurrentQuestion()<this.questionList.length){
          setTimeout(() => {
            const newUrl = `/student/student-quiz-play/${this.quizId}`;
            window.location.href = newUrl;
        }, 1000);
        }
      let points = (this.quizService.getQuizItemsPoints())
      if(points >= 10){
        this.quizService.setQuizItemsPoints((this.quizService.getQuizItemsPoints())-10)
      }
    }
  }
  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        if(this.counter>0 ){
          this.counter--;
          if(this.counter === 0 && this.quizService.getQuizItemsCurrentQuestion()+1 == this.questionList.length){
            this.quizService.setQuizItemsIsCompleted(true);
            this.stopCounter();
          }
          if (this.counter === 0 && this.getCurrentQuestion()+1<this.questionList.length) {
             this.quizService.setQuizItemsCurrentQuestion(this.getCurrentQuestion()+1)
             const newUrl = `/student/student-quiz-play/${this.quizId}`;
             window.location.href = newUrl;
              this.counter = 10;
              if(this.getCurrentQuestion()<this.questionList.length && this.getPoints()>10){
                this.quizService.setQuizItemsPoints(this.getPoints()-10)
              }
          }
        }

      });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 100000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 10;
    this.startCounter();
  }
  resetQuiz() {
    this.resetCounter();
    this.getQuestionsByQuizId(this.quizId);
    this.quizService.setQuizItemsPoints(0)
    this.quizService.setQuizItemsCorrectAnswer(0)
    this.quizService.setQuizItemsInCorrectAnswer(0)
    this.counter = 10;
    this.quizService.setQuizItemsCurrentQuestion(0)
    this.quizService.setQuizItemsProgress("");
    const newUrl = `/student/student-quiz-play/${this.quizId}`;
    window.location.href = newUrl;
  }
  getProgressPercent() {
    let i = ((this.getCurrentQuestion()/ this.questionList.length) * 100).toString();
    this.quizService.setQuizItemsProgress(i)
    return this.getProgress();
  }
  ngOnInit() {
    this.quizId=this.route.snapshot.paramMap.get('id');
    this.getQuestionsByQuizId(this.quizId);
    this.startCounter();
  }
  getQuizById(){
  }
  clearQuizStorage(){
    this.quizService.removeQuizItemsStorage();
  }

  getCurrentQuestion(){
    return this.quizService.getQuizItemsCurrentQuestion()
  }
  getPoints(){
    return this.quizService.getQuizItemsPoints()
  }
  getCorrect(){
    return this.quizService.getQuizItemsCorrectAnswer()
  }
  getIncorrect(){
    return this.quizService.getQuizItemsInCorrectAnswer()
  }

  getProgress(){
    return this.quizService.getQuizItemsInProgress()
  }
  getIsCompleted(){
    return this.quizService.getQuizItemsIsCompleted()
  }

  nextQuestion() {
  if(this.getCurrentQuestion()+1<this.questionList.length){
    const newUrl = `/student/student-quiz-play/${this.quizId}`;
    window.location.href = newUrl;
    this.quizService.setQuizItemsCurrentQuestion(this.getCurrentQuestion()+1);
  }
  }
  previousQuestion() {
    const newUrl = `/student/student-quiz-play/${this.quizId}`;
    window.location.href = newUrl;
    this.quizService.setQuizItemsCurrentQuestion(this.getCurrentQuestion()-1);
  }
}

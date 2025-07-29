import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from 'src/app/MesServices/ChatBot/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('scrollRef') scrollRef!: ElementRef;
  chatVisible = false;
  questionsAndAnswers: { question: string, answer: string }[] = [];
  question: string = '';
  answer: string = '';
  loader:any=false

  constructor(private chatbotService: ChatbotService) { }

  toggleChat(): void {
    this.chatVisible = !this.chatVisible;
  }
  ngAfterViewInit() {
    this.scrollToBottom();
  }
  send(): void {
    if (this.question.trim() !== '') {
      this.loader=true
      this.chatbotService.Send(this.question).subscribe(
        (res: any) => {
          this.answer = res.response;
          this.questionsAndAnswers.push({ question: this.question, answer: this.answer });
          this.question = '';
          setTimeout(() => {
            this.loader=false
          }, 2000);
        },
        (error) => {
          console.log(error);
          setTimeout(() => {
            this.loader=false
          }, 2000);
        }
      );
    }
    this.scrollToBottom();
  }


  ngAfterViewChecked() {
    this.scrollToBottom();
  }

scrollToBottom(): void {
    try {
        this.scrollRef.nativeElement.scrollTop = this.scrollRef.nativeElement.scrollHeight;
    } catch(err) { }
}
}

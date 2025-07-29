import { SessionService } from './../../../MesServices/Session/session.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationsService } from 'src/app/MesServices/Formations/formations.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import { UserService } from 'src/app/MesServices/UserService/user-service.service';
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.css']
})
export class MeetComponent implements OnInit, AfterViewInit {
  domain: string = "jitsi1.geeksec.de"; // For self-hosted use your domain
  room: any;
  roomName: any;
  options: any;
  api: any;
  users: any = [];
  user: any;
  username: any;
  sessions!: any[];
  // For Custom Controls
  isAudioMuted = true;
  isVideoMuted = true;
  idSession:any;
  sessionInfo:any=[];

  constructor(
    private router: Router,
    private sr: UserService,
    private fr: FormationsService,
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute,
    private userAuth:UserAuthService
  ) {
    this.idSession = this.activatedRoute.snapshot.paramMap.get('id');
  }


  handleClose = () => {
    this.api.dispose();
    this.isUserInMeeting = false;
  }

  generateRoomName(): string {
    return 'my-meeting-room';
  }
  getSesisonbygeneratedLink(generatedLink: string) {
    this.sessionService.getbybyGeneratedLink(generatedLink).subscribe((res) => {
      this.sessionInfo = res;
      console.log("waaa",this.sessionInfo);
      this.room = "Welcome to "+ this.sessionInfo.sessionName;
    });
  }

  getUserById(id: any) :any {
    this.sr.getUserById(id).subscribe((res) => {
      this.users = res;
      console.log(this.users['firstName']);
    });
  }

  handleParticipantLeft = async (participant: any) => {
    console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
    const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant: any) => {
    console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
    const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant: any) => {
    console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
    const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
    console.log("handleVideoConferenceLeft");
    this.router.navigate(['/student']);
  }

  handleMuteStatus = (audio: any) => {
    console.log("handleMuteStatus", audio); // { muted: true }
  }

  handleVideoStatus = (video: any) => {
    console.log("handleVideoStatus", video); // { muted: true }
  }

  getParticipants() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500)
    });
  }

  executeCommand(command: string) {
    this.api.executeCommand(command);
    if (command == 'hangup') {
      this.router.navigate(['/student']);
      return;
    }

    if (command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
    }

    if (command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
    }
  }

  ngOnInit(): void {
    this.getSesisonbygeneratedLink(this.idSession);

    if(this.idSession !=null  ){
      this.initializeJitsi(this.idSession);
    }
  }

  ngAfterViewInit(): void {

  }
  private isUserInMeeting: boolean = false;
// Check if user has already attended this session
 hasAttended(sessionId: string): boolean {
    const attendedSessions = JSON.parse(localStorage.getItem('attendedSessions') || '[]');
    return attendedSessions.includes(sessionId);
  }

// Mark user as attended for this session
markAttended(sessionId: string) {
    let attendedSessions = JSON.parse(localStorage.getItem('attendedSessions') || '[]');
    attendedSessions.push(sessionId);
    localStorage.setItem('attendedSessions', JSON.stringify(attendedSessions));
  }
  initializeJitsi(roomName: string) {
    this.sr.getUserById(this.userAuth.getId()).subscribe((res) => {
      this.users = res;
      console.log(this.users['firstName']);
      console.log("luser hehda", this.users.roles[0].name);
      if(this.users.roles[0].name.toString()=="ETUDIANT") {
        this.options = {
          roomName: roomName,
          width: 1000,
          height: 600,
          configOverwrite: {prejoinPageEnabled: false, startRecording: false},
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'profile', 'chat',
              'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
              'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
              'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
            ],
            DISABLE_VIDEO_SHARING: true
          },
          parentNode: document.querySelector('#jitsi-iframe'),
          userInfo: {
            displayName: this.users['firstName'] + ' ' + this.users['lastName']
          }
        }
      }
      else if(this.users.roles[0].name.toString()=="FORMATEUR")
      { this.options = {
        roomName: roomName,
        width: 1000,
        height: 600,
        configOverwrite: {prejoinPageEnabled: false, startRecording: false},
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
          ],
          DISABLE_VIDEO_SHARING: true
        },
        parentNode: document.querySelector('#jitsi-iframe'),
        userInfo: {
          displayName: this.users['firstName'] + ' ' + this.users['lastName']
        }
      }
      }
      this.api = new JitsiMeetExternalAPI(this.domain, this.options);

      console.log("api ",this.api)
      // Event handlers
      this.api.addEventListeners({
        readyToClose: this.handleClose,
        participantLeft: this.handleParticipantLeft,
        participantJoined: this.handleParticipantJoined,
        videoConferenceJoined: (participant: any) => {
          this.handleVideoConferenceJoined(participant);
          // Mute audio and video after joining the conference
          this.api.executeCommand('toggleAudio');
          this.api.executeCommand('toggleVideo');
          // this.api.executeCommand('toggleShareScreen');

        },
        videoConferenceLeft: this.handleVideoConferenceLeft,
        audioMuteStatusChanged: this.handleMuteStatus,
        videoMuteStatusChanged: this.handleVideoStatus
      });
    });
  }


}

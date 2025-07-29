import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/MesServices/Groups/group.service';
import { SessionService } from 'src/app/MesServices/Session/session.service';
import { UserAuthService } from 'src/app/MesServices/user-auth.service';
import { Session } from 'src/app/Models/Session';
import { Groups } from 'src/app/Models/group.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-calendar',
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.css'],
})
export class StudentCalendarComponent {
  sessions: any[] = [];
  selectedSession!: Session;
  sessionGroups: Groups[] = [];
  isButtonDisabled!: boolean;
  currentDate!: Date;
  durationInMinutes!: any;
  databaseDate!: Date;
  msj!: any;
  selectedFilter: string = 'all';

  constructor(
    private sessionService: SessionService,
    private userAuthService: UserAuthService,
    private groupService: GroupService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.retrieveSessions();
    this.route.queryParams.subscribe((params) => {
      const sessionId = Number(params['sessionId']);
      if (!isNaN(sessionId) && sessionId > 0) {
        this.selectSessionById(sessionId);
      } else {
        if (this.sessions.length > 0) {
          this.selectSession(this.sessions[0]);
        }
      }
    });
  }
  applySessionFilter(sessions: Session[], selectedFilter: string): Session[] {
    switch (selectedFilter) {
      case 'upcoming':
        return sessions.filter((session) => !this.isSessionExpired(session));
      case 'expired':
        return sessions.filter((session) => this.isSessionExpired(session));
      default:
        return sessions;
    }
  }
  retrieveSessions(): void {
    this.currentDate = new Date();
    const userId = this.userAuthService.getId();
    this.sessionService.getSessionsByUserId(userId).subscribe(
      (sessions: Session[]) => {
        console.log('any', sessions);
        sessions = this.applySessionFilter(sessions, this.selectedFilter);
        this.sessions = sessions;
        // Find the first session that hasn't started yet
        const notStartedSession = sessions.find(
          (session) =>
            this.adjustDateByOneHour(session.startDate).getTime() > this.currentDate.getTime()
        );
        // If a notStartedSession is found, use it as the selectedSession
        if (notStartedSession) {
          this.selectSession(notStartedSession);
        } else {
          // If no session is found with a start time in the future,use the first session in the array as selectedSession
          this.selectedSession = sessions[0];
          this.updateButtonStatus();
        }
        const currentDate = new Date();
        const nonExpiredSessions = sessions.filter(
          (session) => !this.isSessionExpired(session)
        );
        const expiredSessions = sessions.filter((session) =>
          this.isSessionExpired(session)
        );
        this.sessions = nonExpiredSessions.sort((a, b) => {
          const startDateA = this.adjustDateByOneHour(a.startDate);
          const startDateB = this.adjustDateByOneHour(b.startDate);
          return startDateA.getTime() - startDateB.getTime();
        });
        this.sessions.push(...expiredSessions);

        if (this.selectedSession && this.selectedSession.id !== undefined) {
          this.getGroupsForSession(this.selectedSession.id);
        } else if (this.sessions.length > 0) {
          this.selectedSession = this.sessions[0];
          if (this.selectedSession.id !== undefined) {
            this.getGroupsForSession(this.selectedSession.id);
          }
        } else {
          this.sessionGroups = [];
        }
      },
      (error) => {
        console.log('Error retrieving sessions:', error);
      }
    );
  }
  isSessionExpired(session: Session): boolean {
    const currentDate = new Date();
    const sessionEndDate = this.adjustDateByOneHour(session.finishDate);
    return sessionEndDate < currentDate;
  }

  private updateButtonStatus(): void {
    const currentTime = new Date().getTime();
    const databaseTime = this.databaseDate?.getTime();
    const durationInMillis = this.durationInMinutes * 60 * 1000;
    this.msj = "You can't join this session now";
    console.log(this.msj);
    this.isButtonDisabled =
      currentTime <= databaseTime ||
      currentTime >= databaseTime + durationInMillis;

    console.log(this.isButtonDisabled);
  }

  selectSession(session: Session) {
    this.databaseDate = this.adjustDateByOneHour(session.startDate);
    this.durationInMinutes = this.calculateDuration(session);
    this.selectedSession = session;
    if (session?.id) {
      this.getGroupsForSession(session.id);
    } else {
      this.sessionGroups = [];
    }
    this.updateButtonStatus();
  }
  selectSessionById(sessionId: number | undefined) {
    if (sessionId === undefined) {
      return;
    }
    const session = this.sessions.find((s) => s.id === sessionId);
    if (session) {
      this.selectedSession = session;
      this.getGroupsForSession(session.id as number);
    }
  }

  calculateDuration(session: Session): number {
    const start = this.adjustDateByOneHour(session.startDate);
    const finish =this.adjustDateByOneHour(session.finishDate);
    const duration = (finish.getTime() - start.getTime()) / (1000 * 60);
    return duration;
  }
  getGroupsForSession(sessionId: number): void {
    this.groupService.getGroupsBySessionId(sessionId).subscribe(
      (groups: Groups[]) => {
        this.sessionGroups = groups;
        console.log('Groups for session:', groups);
      },
      (error) => {
        console.log('Error retrieving groups:', error);
      }
    );
  }
  adjustDateByOneHour(date: Date): Date {
    const adjustedDate = new Date(date);
    adjustedDate.setUTCHours(adjustedDate.getUTCHours() - 1); // Use setUTCHours instead of setHours
    return adjustedDate;
  }

}

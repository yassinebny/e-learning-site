export interface Break {
  id?: number ;
  subject: string;
  startTime: Date;
  endTime: Date;
  recurrenceRule: string;
  isBlock: boolean;
  airlineId: number;
}

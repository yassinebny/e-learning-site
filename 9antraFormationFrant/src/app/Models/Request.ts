export class Request {
    id?: number
    firstName?: string
    lastName?: string
    country?: string
    phoneNumber?: number
    email?: string
    formationName?: string
    requestStatus?: string
    trainingPeriod?: string
  paiementType?:string
  educationPlace?:string

}

export enum RequestStatus {
    PAID, UNPAID, CANCELED
}

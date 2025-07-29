import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserAuthService } from "../MesServices/user-auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: UserAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from your authentication service
    const token = this.authService.getToken();

    // Check if the token is present before modifying the request headers
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Pass the modified request to the next interceptor or the backend
    return next.handle(request);
  }
}
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }
  private staticKey: string = "1234567890123456"; // Should match the static key used on the server



  decryptSessionKey(encryptedKey: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.staticKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedKey, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Base64);
  }

  decryptData(encryptedData: string, sessionKey: string): string {
    const key = CryptoJS.enc.Base64.parse(sessionKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly http = inject(HttpClient);
  private readonly uploadUrl = 'http://localhost:4000/upload';

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post<{ success: boolean; url: string; message?: string }>(this.uploadUrl, formData)
      .pipe(map((result) => result.url));
  }
}

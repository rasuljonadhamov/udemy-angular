import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeResourceUrl {
    if (!value) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    const embedUrl = this.convertToEmbedUrl(value);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private convertToEmbedUrl(url: string): string {
    if (url.includes('embed/')) {
      return url;
    }

    const videoId = this.extractVideoId(url);

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}

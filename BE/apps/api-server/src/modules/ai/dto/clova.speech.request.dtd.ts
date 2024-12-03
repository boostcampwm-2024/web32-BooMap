export class ClovaSpeechRequestDto {
  private formData: FormData;
  private headers = {
    'X-CLOVASPEECH-API-KEY': '',
    'Content-Type': 'multipart/form-data',
  };
  private params = {
    completion: 'sync',
    diarization: { enable: false },
    language: 'ko-KR',
  };

  constructor(apiKey: string, audioFile: Express.Multer.File) {
    this.headers['X-CLOVASPEECH-API-KEY'] = apiKey;

    const blob = new Blob([audioFile.buffer], { type: audioFile.mimetype });
    this.formData = new FormData();
    this.formData.append('media', blob);
    this.formData.append('params', JSON.stringify(this.params));
  }

  getFormData() {
    return this.formData;
  }

  getHeaders() {
    return this.headers;
  }
}

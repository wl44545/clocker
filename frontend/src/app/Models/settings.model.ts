export class SettingsModel {
  languages: LanguageModel[];
  language: string;
  timerDays: number;
  constructor(languages: LanguageModel[], language: string, timerDays: number) {
    this.languages = languages;
    this.language = language;
    this.timerDays = timerDays;
  }
}

export class LanguageModel {
  code: string;
  name: string;
  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}

import fs from 'fs';
import stringSimilarity from 'string-similarity';
import { IAnswers, IQuestions } from './service.dto';

class AnswerFinder {
  contents: string;
  questions: IQuestions[];
  answers: string;

  constructor(filePath: string, lineOfParagraph: number, lineOfQuestions: number[], lineOfAnswers: number) {
    try {
      // read contents of the file
      const data = fs.readFileSync(filePath, 'UTF-8');

      // split the contents by new line
      const lines: string[] = data.split(/\r?\n/);
      this.contents = lines[lineOfParagraph - 1];
      let [start, end] = lineOfQuestions;
      this.questions = lines.slice(start - 1, end);
      this.answers = lines[lineOfAnswers - 1];
    } catch (err) {
      throw new Error(err);
    }
  }

  getParagraph(): string {
    return this.contents;
  }

  getQuestions(): IQuestions[] {
    return this.questions;
  }

  getAnswers(): IAnswers[] {
    return this.answers.split(';');
  }

  matchAnswer(q: IQuestions, toMatch: IAnswers[]): string {
    const result = stringSimilarity.findBestMatch(q, toMatch);
    return result.bestMatch.target;
  }

  getResult(): IAnswers[] {
    const answers = this.getAnswers();
    const qs = this.getQuestions();
    const paragraph = this.getParagraph().split('.');
    let result = [];
    for (let i = 0; i < qs.length; i++) {
      let bestSentence = this.matchAnswer(qs[i], paragraph);
      let answer = this.matchAnswer(bestSentence, answers);

      answers.splice(answers.indexOf(answer), 1);
      result.push(answer);
    }

    return result;
  }
}

export default AnswerFinder;

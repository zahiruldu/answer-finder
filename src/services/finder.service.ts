import fs from 'fs';
import stringSimilarity from 'string-similarity';
import { IAnswers, IQuestions } from './finder.interface';

class AnswerFinder {
  contents: string;
  questions: IQuestions[];
  answers: string;

  /**
   * @desc this class contains functions for finder class to match best answers
   * @param {string} filePath {string} path to the file. e.g. 'test.txt'
   * @param {number} lineOfParagraph {number} Line number of the paragraph part in file
   * @param {array} lineOfQuestions [2,6] range of line to indicate question in the file
   * @param {number} lineOfAnswers {number} Line number of the answers part in file
   * @return {new AnswerFinder} new instance of AnswerFinder class
   */
  constructor(filePath: string, lineOfParagraph: number, lineOfQuestions: number[], lineOfAnswers: number) {
    try {
      const data = fs.readFileSync(filePath, 'UTF-8');
      const lines: string[] = data.split(/\r?\n/);
      this.contents = lines[lineOfParagraph - 1];
      let [start, end] = lineOfQuestions;
      this.questions = lines.slice(start - 1, end);
      this.answers = lines[lineOfAnswers - 1];
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Return the paragraph content of the file
   * @returns string
   */
  getParagraph(): string {
    return this.contents;
  }

  /**
   * Return the questions of the file
   * @returns array of string
   */
  getQuestions(): IQuestions[] {
    return this.questions;
  }

  /**
   * Return the answers of the file
   * @returns array of string
   */
  getAnswers(): IAnswers[] {
    return this.answers.split(';');
  }

  /**
   * Return the matching answer of an array
   * @param q question
   * @param toMatch Array of values to match and find best matching value
   * @returns string
   */
  matchAnswer(q: IQuestions, toMatch: IAnswers[]): string {
    const result = stringSimilarity.findBestMatch(q, toMatch);
    return result.bestMatch.target;
  }

  /**
   * Return all correct answers according to the order of the questions
   * @returns string
   */
  getResult(): IAnswers {
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

    return result.join('\n');
  }
}

export default AnswerFinder;

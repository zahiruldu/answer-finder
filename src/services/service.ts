import fs from 'fs';
import stringSimilarity from 'string-similarity';

class AnswerFinder {
  contents;
  questions;
  answers;

  constructor(filePath, lineOfParagraph, lineOfQuestions, lineOfAnswers) {
    try {
      // read contents of the file
      const data = fs.readFileSync(filePath, 'UTF-8');

      // split the contents by new line
      const lines = data.split(/\r?\n/);
      this.contents = lines[lineOfParagraph - 1];
      let [start, end] = lineOfQuestions;
      this.questions = lines.slice(start - 1, end);
      this.answers = lines[lineOfAnswers - 1];
    } catch (err) {
      throw new Error(err);
    }
  }

  getParagraph() {
    return this.contents;
  }

  getQuestions() {
    return this.questions;
  }

  getAnswers() {
    return this.answers.split(';');
  }

  matchAnswer(q, toMatch) {
    const result = stringSimilarity.findBestMatch(q, toMatch);
    return result.bestMatch.target;
  }

  getResult() {
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

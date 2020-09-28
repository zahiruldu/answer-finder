import AnswerFinder from '../../src/services/finder.service';

describe('Service', () => {
  let filepath = 'test.txt';
  let service;

  beforeAll(() => {
    service = new AnswerFinder(filepath, 1, [2, 6], 7);
  });

  it('It should create the `AnswerFinder` instance ', () => {
    expect(service).toBeInstanceOf(AnswerFinder);
  });

  it('It should return paragraph ', () => {
    const paragraph = service.getParagraph();
    expect(paragraph).toBeTruthy();
    expect(typeof paragraph).toBe('string');
  });

  it('It should return questions ', () => {
    const questions = service.getQuestions();
    expect(questions).toBeTruthy();
    expect(typeof questions).toBe('object');
    expect(typeof questions[0]).toBe('string');
    expect(questions).toHaveLength(5);
  });

  it('It should return answers ', () => {
    const answers = service.getAnswers();
    expect(answers).toBeTruthy();
    expect(typeof answers).toBe('object');
    expect(typeof answers[0]).toBe('string');
    expect(answers).toHaveLength(5);
  });

  it('It should return best Matching content of an array ', () => {
    let q = ' hello';
    let toMatch = ['helloworld', 'helloo', 'hallo'];
    const result = service.matchAnswer(q, toMatch);
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toBe('helloo');
  });

  it('It should return all answer according to the order of questions ', () => {
    const result = service.getResult();
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });
});

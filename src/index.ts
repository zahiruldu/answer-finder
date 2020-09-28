import AnswerFinder from './services/finder.service';

const finder = new AnswerFinder('test.txt', 1, [2, 6], 7);

console.log(finder.getResult());

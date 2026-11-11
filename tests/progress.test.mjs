// Run with: node tests/progress.test.mjs
// Checks the progress levels and the spaced-repetition schedule.
import * as P from '../js/progress.js';
import { ladderOrder, treeOf, nextUp } from '../js/graph.js';

let failed = 0;
const ok = (c, m) => { console.log(`${c ? 'pass' : 'FAIL'}  ${m}`); if (!c) failed++; };
const DAY = 86400000;

const node = { id: 'variance', kind: 'concept', level: 2, needs: [], checks: [{}, {}], recall: [{ id: 'variance#r0' }, { id: 'variance#r1' }] };
P._setState({});
ok(P.status(node) === 'new', 'starts as not started');
P.markSeen('variance');
ok(P.status(node) === 'seen', 'opening the page makes it seen');
ok(P.recordCheck(node, 0, true) === false && P.status(node) === 'seen', 'one of two questions right is not enough');
P.recordCheck(node, 1, false);
ok(P.status(node) === 'seen', 'a wrong answer does not count');
ok(P.recordCheck(node, 1, true) === true && P.status(node) === 'understood', 'all questions right makes it understood');
ok(P.dueRecall(new Map([['variance', node]])).length === 0, 'recall questions are not due straight away');
const t1 = Date.now() + 1 * DAY + 1000;
ok(P.dueRecall(new Map([['variance', node]]), t1).length === 2, 'both recall questions are due after a day');

// Walk the boxes: 1, 3, 7, 14, 30 days.
let t = t1, lastAnswer = t1;
for (const [i, gap] of [[1, 3], [2, 7], [3, 14], [4, 30], [5, 30]]) {
  P.answerRecall('variance#r0', true, t); P.answerRecall('variance#r1', true, t); lastAnswer = t;
  const due = P.dueRecall(new Map([['variance', node]]), t + gap * DAY - 1000).length;
  const dueAfter = P.dueRecall(new Map([['variance', node]]), t + gap * DAY + 1000).length;
  ok(due === 0 && dueAfter === 2, `after correct answer ${i}, next review is ${gap} days later`);
  t += gap * DAY + 1000;
}
ok(P.status(node, lastAnswer + 1000) === 'remembered', 'right a week or more after understanding, and not overdue: remembered');
ok(P.status(node, t + 40 * DAY) === 'understood', 'once overdue, remembered drops back to understood');
P.answerRecall('variance#r0', false, t);
ok(P.dueRecall(new Map([['variance', node]]), t + DAY + 1000).some(d => d.q.id === 'variance#r0'), 'a wrong answer goes back to 1 day');
ok(P.status(node, t + 1000) === 'understood', 'a question back at the start means not remembered');

// Export / import round trip.
const before = P.status(node);
const json = P.exportJSON();
P.resetAll();
ok(P.status(node) === 'new', 'reset clears progress');
P.importJSON(json);
ok(P.status(node) === before && before !== 'new', `import restores progress (${before})`);
let threw = false; try { P.importJSON('{"nope":1}'); } catch { threw = true; }
ok(threw, 'importing a wrong file is refused');

// Ladder order respects needs.
const mk = (id, needs, level = 1) => [id, { id, kind: 'concept', level, needs, pieces: [], title: id, recall: [], checks: [{}] }];
const nodes = new Map([mk('a', []), mk('b', ['a']), mk('c', ['a', 'b']), mk('d', ['c']), ['s', { id: 's', kind: 'slide', needs: [], pieces: ['d', 'b'], title: 's' }]]);
const order = ladderOrder(nodes, treeOf(nodes, 's'));
ok(order.join(',') === 'a,b,c,d', `ladder order puts needs first (got ${order.join(',')})`);
P._setState({ understood: { a: 1 } });
ok(nextUp(nodes, 's').id === 'b', 'next up is the lowest unfinished concept');

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);

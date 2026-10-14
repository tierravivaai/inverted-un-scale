const assert=require('node:assert/strict');
const {counts,baseline,allocateEquity,weightsForRatio}=require('./model.js');
assert.equal(counts.reduce((a,b)=>a+b),142);
const base=allocateEquity(baseline);
assert.equal(base.denominator,175.95);
assert.equal(Math.round(base.perParty[0]),8525149);
assert.equal(Math.round(base.perParty[5]),2273373);
assert.equal(base.ratio,3.75);
assert.deepEqual(weightsForRatio(3.75),baseline);
for(let r=1;r<=10;r+=.01){const result=allocateEquity(weightsForRatio(r));assert.ok(Math.abs(result.ratio-r)<1e-10);assert.ok(Math.abs(result.totals.reduce((a,b)=>a+b)-1e9)<1e-5);assert.equal(result.status,r===1?'equal':'strict');}
assert.ok(allocateEquity(weightsForRatio(1)).perParty.every(a=>Math.abs(a-1e9/142)<1e-8));
assert.equal(allocateEquity([1.5,1.5,1.1,.95,.75,.4]).comparisons[0],'equal');
assert.equal(allocateEquity([1,2,1.1,.95,.75,.4]).comparisons[0],'violation');
assert.throws(()=>allocateEquity([0,0,0,0,0,0]));
assert.throws(()=>allocateEquity([-1,1,1,1,1,1]));
assert.throws(()=>allocateEquity([NaN,1,1,1,1,1]));
assert.equal(allocateEquity([1,1,1,1,1,0]).ratio,Infinity);
assert.ok(Number.isNaN(allocateEquity([0,1,1,1,1,0]).ratio));
console.log('Passed: baseline, fund conservation, slider range, equality, violations, invalid and zero weights.');

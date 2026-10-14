/* Pure equity model: no DOM, no SOSAC or TSAC allocation. */
(function(root){
'use strict';
const counts=Object.freeze([31,59,30,18,3,1]);
const baseline=Object.freeze([1.5,1.3,1.1,.95,.75,.4]);
function weightsForRatio(ratio){
 if(!Number.isFinite(ratio)||ratio<1||ratio>10) throw Error('Ratio must be between 1 and 10.');
 if(ratio===3.75)return [...baseline];
 const power=Math.log(ratio)/Math.log(3.75);
 return baseline.map(w=>.4*Math.pow(w/.4,power));
}
function allocateEquity(weights,fund=1e9,parties=counts){
 if(weights.length!==6||parties.length!==6||!weights.every(w=>Number.isFinite(w)&&w>=0)||!Number.isFinite(fund)||fund<0||!parties.every(n=>Number.isInteger(n)&&n>0))throw Error('Use six non-negative finite weights and positive Party counts.');
 const denominator=weights.reduce((sum,w,i)=>sum+w*parties[i],0);
 if(!Number.isFinite(denominator)||denominator<=0)throw Error('At least one weight must be greater than zero.');
 const perParty=weights.map(w=>fund*(w/denominator));
 const totals=perParty.map((a,i)=>a*parties[i]);
 const comparisons=weights.slice(0,-1).map((w,i)=>w===weights[i+1]?'equal':w>weights[i+1]?'strict':'violation');
 return {perParty,totals,denominator,comparisons,ratio:weights[5]===0?(weights[0]===0?NaN:Infinity):weights[0]/weights[5],status:comparisons.includes('violation')?'violation':comparisons.includes('equal')?'equal':'strict'};
}
const api={counts,baseline,weightsForRatio,allocateEquity};
if(typeof module!=='undefined')module.exports=api;else root.IUSAF=api;
})(typeof window!=='undefined'?window:globalThis);

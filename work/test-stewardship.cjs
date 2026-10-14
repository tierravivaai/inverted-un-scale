const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');const dir=path.resolve('outputs/iusaf-stewardship');
const ctx=vm.createContext({});vm.runInContext(fs.readFileSync(dir+'/countries.js','utf8')+'\n'+fs.readFileSync(dir+'/stewardship-data.js','utf8')+'\nthis.countries=IUSAFCountries;this.data=StewardshipData;',ctx);
const {allocate}=require(dir+'/stewardship-model.js'),{baseline,weightsForRatio}=require(dir+'/model.js');
for(const fund of [5e7,2e8,5e8,1e9])for(const key of ['pure','ocean','strict','gini','boundary'])for(const weights of [baseline,weightsForRatio(1),weightsForRatio(10),[1,2,0,1,1,.4]]){
const m=allocate(ctx.countries,ctx.data,weights,fund,key);assert(Math.abs(m.rows.reduce((s,c)=>s+c.total,0)-fund)<.01);assert(m.rows.every(c=>c.total>=0));
if(weights===baseline)for(const c of m.rows){const d=ctx.data[c.code];if(key==='strict')assert(Math.abs(c.total/fund-d.referenceStrict)<1e-12);if(key==='gini')assert(Math.abs(c.total/fund-d.referenceGini)<1e-12);if(key==='boundary')assert(Math.abs(c.total/fund-(d.referenceStrict+1.5*(d.referenceGini-d.referenceStrict)))<1e-12);}
}
assert.equal(ctx.countries.filter(c=>ctx.data[c.code].sids).length,39);
console.log('Passed: 80 scenarios, fund conservation, 142-country reference matching, 39 SIDS, exploratory weights.');

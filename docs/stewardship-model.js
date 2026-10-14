(function(root){
const presets={pure:{sosac:0,tsac:0},ocean:{sosac:.03,tsac:0},strict:{sosac:.03,tsac:.015},gini:{sosac:.03,tsac:.025},boundary:{sosac:.03,tsac:.03}};
function allocate(countries,data,weights,fund,key){
 const p=presets[key];if(!p)throw Error('Unknown preset');
 const denominator=countries.reduce((s,c)=>s+weights[c.band-1],0),sids=countries.filter(c=>data[c.code].sids).length;
 if(!(denominator>0)||weights.some(w=>!Number.isFinite(w)||w<0)||!Number.isFinite(fund)||fund<=0)throw Error('Invalid allocation inputs');
 const rows=countries.map(c=>{const d=data[c.code],pure=fund*weights[c.band-1]/denominator,equity=pure*(1-p.sosac-p.tsac),ocean=d.sids?fund*p.sosac/sids:0,land=fund*p.tsac*d.landShare;return {...c,pure,equity,ocean,land,total:equity+ocean+land};});
 const bands=Array.from({length:6},(_,i)=>{const group=rows.filter(c=>c.band===i+1),sum=k=>group.reduce((s,c)=>s+c[k],0);return {band:i+1,n:group.length,total:sum('total'),mean:sum('total')/group.length,min:Math.min(...group.map(c=>c.total)),max:Math.max(...group.map(c=>c.total)),equity:sum('equity')/group.length,ocean:sum('ocean')/group.length,land:sum('land')/group.length};});
 const compare=(a,b)=>Math.abs(a-b)<fund*1e-12?'equal':a>b?'strict':'violation';
 return {rows,bands,preset:p,means:bands.slice(0,5).map((b,i)=>compare(b.mean,bands[i+1].mean)),ranges:bands.slice(0,5).map((b,i)=>compare(b.min,bands[i+1].max))};
}
const api={allocate,presets};if(typeof module!=='undefined')module.exports=api;else root.IUSAFStewardship=api;
})(typeof window!=='undefined'?window:globalThis);

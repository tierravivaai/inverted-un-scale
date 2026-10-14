'use strict';
const {counts,baseline,weightsForRatio,allocateEquity}=IUSAF;
const $=id=>document.getElementById(id);
const dollars=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
const words={strict:'Strictly decreasing',equal:'Equal adjacent steps',violation:'Monotonicity violated'};
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors={strict:'#087586',equal:'#a46500',violation:'#c23c53'};
const expandedBands=new Set();
let fund=Number($('fund').value),weights=[...baseline],model=allocateEquity(weights,fund),shown=[...model.perParty],frame;
$('weights').innerHTML=weights.map((w,i)=>`<label for="w${i}">Band ${i+1}<input id="w${i}" type="number" min="0" step="any" value="${w}" inputmode="decimal"></label>`).join('');
function draw(values){
 const width=$('chart').clientWidth,height=$('chart').clientHeight,left=48,right=8,top=38,bottom=48,plot=height-top-bottom,step=(width-left-right)/6;
 // Fixed scale during normal slider use; expand only for large custom allocations.
 const unit=4*fund/1e9,max=Math.max(12*fund/1e9,Math.ceil(Math.max(...model.perParty)/1e6/unit)*unit),y=v=>height-bottom-v/1e6/max*plot;
 let s=`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><title>Allocation per Party by band, USD millions</title>`;
 for(let t=0;t<=4;t++){const value=max*t/4,yy=y(value*1e6);s+=`<line x1="${left}" x2="${width-right}" y1="${yy}" y2="${yy}" stroke="#dfe8ed"/><text x="${left-10}" y="${yy+4}" text-anchor="end" fill="#526775" font-size="12">${Number(value.toFixed(4))}</text>`;}
 values.forEach((v,i)=>{let status='strict';const adjacent=[model.comparisons[i-1],model.comparisons[i]];if(adjacent.includes('violation'))status='violation';else if(adjacent.includes('equal'))status='equal';const x=left+i*step,yy=y(v),c=colors[status];s+=`<rect x="${x}" y="${yy}" width="${step}" height="${height-bottom-yy}" fill="${c}" opacity=".13"/><line x1="${x}" x2="${x+step}" y1="${yy}" y2="${yy}" stroke="${c}" stroke-width="4"/><text x="${x+step/2}" y="${yy-12}" text-anchor="middle" fill="#193445" font-size="${width<500?12:18}" font-weight="600">${(v/1e6).toFixed(2)}</text><text x="${x+step/2}" y="${height-27}" text-anchor="middle" fill="#193445" font-size="${width<500?11:14}">Band ${i+1}</text><text x="${x+step/2}" y="${height-9}" text-anchor="middle" fill="#526775" font-size="${width<500?10:12}">${counts[i]} ${counts[i]===1?'Party':'Parties'}</text>`;if(i<5)s+=`<line x1="${x+step}" x2="${x+step}" y1="${yy}" y2="${y(values[i+1])}" stroke="${colors[model.comparisons[i]]}" stroke-width="3" ${model.comparisons[i]==='violation'?'stroke-dasharray="5 3"':''}/>`;});
 $('chart').innerHTML=s+'</svg>';
 $('chart').setAttribute('aria-label',values.map((v,i)=>`Band ${i+1}: ${dollars(v)} per Party`).join('; '));
}
function render(animate=true){
 cancelAnimationFrame(frame);model=allocateEquity(weights,fund);
 $('fund-total').textContent=dollars(fund);
 $('ratio').textContent=Number.isNaN(model.ratio)?'Undefined (0 / 0)':!Number.isFinite(model.ratio)?'∞ : 1':`${Number(model.ratio.toFixed(3))} : 1`;
 $('status').textContent=words[model.status];
 $('comparisons').innerHTML=model.comparisons.map((c,i)=>`<div class="comparison ${c}"><b>${i+1} ${c==='strict'?'>':c==='equal'?'=':'<'} ${i+2}</b>${c==='strict'?'Decrease':c==='equal'?'Equal':'Violation'}</div>`).join('');
 $('rows').innerHTML=weights.map((w,i)=>{
 const band=i+1,open=expandedBands.has(band);
 const header=`<tr class="band-total"><th scope="row"><button class="band-toggle" data-band="${band}" aria-expanded="${open}">${open?'▾':'▸'} Band ${band} · ${open?'Hide':'View'} countries</button></th><td>${counts[i]}</td><td>${Number(w.toPrecision(8))}</td><td>${dollars(model.perParty[i])}</td><td>${dollars(model.totals[i])}</td></tr>`;
 const children=IUSAFCountries.filter(c=>c.band===band).map(c=>`<tr class="country-detail" data-country-band="${band}" ${open?'':'hidden'}><th scope="row">${escapeHTML(c.name)}</th><td>1</td><td>${Number(w.toPrecision(8))}</td><td>${dollars(model.perParty[i])}</td><td>${dollars(model.perParty[i])}</td></tr>`).join('');
 return header+children;
 }).join('');
 renderCountries();renderStewardship();
 if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){shown=[...model.perParty];draw(shown);return;}
 const from=[...shown],start=performance.now();function tick(now){const t=Math.min(1,(now-start)/320),e=1-Math.pow(1-t,3);shown=from.map((v,i)=>v+(model.perParty[i]-v)*e);draw(shown);if(t<1)frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);
}
function clearError(){document.body.classList.remove('invalid');$('error').textContent='';for(let i=0;i<6;i++)$('w'+i).setAttribute('aria-invalid','false');}
function syncInputs(){weights.forEach((w,i)=>$('w'+i).value=Number(w.toPrecision(12)));}
function applyRatio(r,source){
 clearError();$('ratio-error').textContent='';$('ratio-input').setAttribute('aria-invalid','false');
 weights=weightsForRatio(r);syncInputs();$('steepness').value=r;
 if(source!=='Typed')$('ratio-input').value=r;
 $('target').textContent=`${r} : 1`;$('mode').textContent=r===3.75?'Paper baseline':'Exploratory';render();
}
$('fund').addEventListener('change',()=>{fund=Number($('fund').value);render(false);});
$('steepness').addEventListener('input',()=>applyRatio(+$('steepness').value,'Slider'));
$('ratio-input').addEventListener('input',()=>{
 const r=$('ratio-input').valueAsNumber;
 if(!Number.isFinite(r)||r<1||r>10||Math.abs(r*100-Math.round(r*100))>1e-8){$('ratio-error').textContent='Enter 1 to 10, with up to two decimal places. The last valid allocation is retained.';$('ratio-input').setAttribute('aria-invalid','true');return;}
 applyRatio(r,'Typed');
});
for(let i=0;i<6;i++)$('w'+i).addEventListener('input',()=>{clearError();const proposed=counts.map((_,j)=>$('w'+j).valueAsNumber);try{allocateEquity(proposed);}catch(error){cancelAnimationFrame(frame);document.body.classList.add('invalid');$('error').textContent=proposed.every(w=>w===0)?'Enter at least one weight above zero. Showing last valid result.':'Use finite weights of zero or above. Showing last valid result.';proposed.forEach((w,j)=>$('w'+j).setAttribute('aria-invalid',String(!Number.isFinite(w)||w<0||proposed.every(v=>v===0))));return;}weights=proposed;const actual=proposed[5]>0?proposed[0]/proposed[5]:NaN;$('ratio-input').value=Number.isFinite(actual)&&actual>=1&&actual<=10?Number(actual.toFixed(8)):'';$('ratio-error').textContent='';$('ratio-input').setAttribute('aria-invalid','false');$('mode').textContent='Manual';$('target').textContent='Move to reshape';render();});
$('reset').addEventListener('click',()=>{$('ratio-input').value=3.75;$('ratio-error').textContent='';$('ratio-input').setAttribute('aria-invalid','false');clearError();weights=[...baseline];syncInputs();$('steepness').value=3.75;$('target').textContent='3.75 : 1';$('mode').textContent='Paper baseline';render();});
$('fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('fullscreen').textContent='Use browser full screen';}});
document.addEventListener('fullscreenchange',()=>{$('fullscreen').textContent=document.fullscreenElement?'Exit full screen':'Present full screen';});
new ResizeObserver(()=>draw(shown)).observe($('chart'));render(false);

function renderCountries(){
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,'');
 const query=normalize($('country-search').value.trim());
 const list=IUSAFCountries.filter(c=>normalize(c.name+' '+c.code).includes(query));
 $('country-count').textContent=`${list.length} of 142 Parties${document.body.classList.contains('invalid')?' · Last valid allocation':''}`;
 $('country-rows').innerHTML=list.length?list.map(c=>`<tr><th scope="row">${escapeHTML(c.name)} <span class="country-code">${c.code}</span></th><td>${c.band}</td><td>${dollars(model.perParty[c.band-1])}</td></tr>`).join(''):'<tr><td colspan="3">No matching Party in this 142-Party scenario. Try part of its name or its three-letter code.</td></tr>';
}
$('country-search').addEventListener('input',renderCountries);

$('rows').addEventListener('click',event=>{
 const button=event.target.closest('.band-toggle');if(!button)return;
 const band=Number(button.dataset.band);if(expandedBands.has(band))expandedBands.delete(band);else expandedBands.add(band);
 const open=expandedBands.has(band);button.setAttribute('aria-expanded',String(open));button.textContent=`${open?'▾':'▸'} Band ${band} · ${open?'Hide':'View'} countries`;
 document.querySelectorAll(`[data-country-band="${band}"]`).forEach(row=>row.hidden=!open);
});

$("scenario").addEventListener("change",()=>renderStewardship());
$("combined-search").addEventListener("input",()=>renderStewardship());
$("stewardship-reset").addEventListener("click",()=>{$("scenario").value="strict";$("reset").click();});

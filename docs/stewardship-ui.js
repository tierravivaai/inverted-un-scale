function renderStewardship(){
 const key=$('scenario').value,m=IUSAFStewardship.allocate(IUSAFCountries,StewardshipData,weights,fund,key),p=m.preset;
 $('pool-summary').textContent=`IUSAF ${Number(((1-p.sosac-p.tsac)*100).toFixed(1))}% · SOSAC ${p.sosac*100}% · TSAC ${Number((p.tsac*100).toFixed(1))}%`;
 const baselineShape=weights.every((w,i)=>Math.abs(w-baseline[i])<1e-10);
 $('preset-note').textContent=(key==='gini'?'Gini minimum is constrained by band-order preservation, not the unconstrained optimum. ':key==='boundary'?'The recorded 3% boundary preset is slightly beyond the Band 5–6 mean crossover. ':'')+'Preset percentages come from the recorded baseline scenarios; they are not recalibrated when weights change.'+(!baselineShape?' You are using exploratory equity weights.':'');
 function checks(id,title,values){const issues=values.map((v,i)=>v==='strict'?null:`Bands ${i+1}–${i+2}: ${v==='equal'?'equality':'order not preserved'}`).filter(Boolean);$(id).textContent=title+': '+(issues.length?issues.join('; '):'strictly decreasing across all adjacent bands');$(id).className=issues.length?'check-warning':'';}
 checks('mean-order','Band order (mean allocation per Party, as in the paper)',m.means);
 const overlaps=m.ranges.map((v,i)=>v==='strict'?null:`${i+1}–${i+2}`).filter(Boolean);
 $('country-order').textContent='Additional country-level information: '+(overlaps.length?'allocation ranges overlap or touch between bands '+overlaps.join(', ')+'. This is not the paper’s band-order test.':'adjacent country allocation ranges are separated.');
 $('country-order').className='hint';
 const max=Math.max(...m.bands.map(b=>b.mean))*1.2,W=900,H=290,left=60,bottom=245,plot=195,step=135,bar=85;
 let svg=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><title>Mean combined allocation per Party by band, USD millions</title>`;
 for(let i=0;i<=4;i++){const v=max*i/4,y=bottom-v/max*plot;svg+=`<line x1="${left}" x2="880" y1="${y}" y2="${y}" stroke="#dfe8ed"/><text x="52" y="${y+4}" text-anchor="end" font-size="12" fill="#526775">${Number((v/1e6).toFixed(2))}</text>`;}
 m.bands.forEach((b,i)=>{const x=left+i*step+20;let y=bottom;for(const [k,c]of [['equity','#147D92'],['ocean','#8761a8'],['land','#D7AE64']]){const h=b[k]/max*plot;y-=h;svg+=`<rect x="${x}" y="${y}" width="${bar}" height="${h}" fill="${c}"/>`;}svg+=`<text x="${x+bar/2}" y="${y-9}" text-anchor="middle" font-size="16" fill="#193445">${(b.mean/1e6).toFixed(2)}</text><text x="${x+bar/2}" y="270" text-anchor="middle" font-size="14">Band ${b.band}</text>`;});$('combined-chart').innerHTML=svg+'</svg>';
 $('combined-bands').innerHTML=m.bands.map(b=>`<tr><th>Band ${b.band}</th><td>${b.n}</td><td>${dollars(b.mean)}</td><td>${dollars(b.min)} – ${dollars(b.max)}</td><td>${dollars(b.total)}</td></tr>`).join('');
 const q=$('combined-search').value.trim().toLowerCase(),list=m.rows.filter(c=>(c.name+' '+c.code).toLowerCase().includes(q));
 $('combined-count').textContent=`${list.length} of 142 Parties · all components in USD`;
 $('combined-countries').innerHTML=list.map(c=>`<tr><th>${escapeHTML(c.name)}${StewardshipData[c.code].sids?' · SIDS':''}</th><td>${c.band}</td><td>${dollars(c.equity)}</td><td>${dollars(c.ocean)}</td><td>${dollars(c.land)}</td><td><strong>${dollars(c.total)}</strong></td><td>${c.total-c.pure>=0?'+':''}${dollars(c.total-c.pure)}</td></tr>`).join('')||'<tr><td colspan="7">No matching Party.</td></tr>';
 $('combined-total').textContent=`Full fund: ${dollars(fund)} = IUSAF ${dollars(fund*(1-p.sosac-p.tsac))} + SOSAC ${dollars(fund*p.sosac)} + TSAC ${dollars(fund*p.tsac)}. Rounded rows may differ slightly.`;
}

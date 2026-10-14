from pathlib import Path
import csv,json,hashlib
p=Path('outputs/iusaf');source=Path('/Users/pauloldham/Documents/cali-allocation-model-unscale-v3/country_allocations_full.csv')
rows=list(csv.DictReader(source.open()));counts=[31,59,30,18,3,1];weights=[1.5,1.3,1.1,.95,.75,.4]
countries=sorted([{'name':r['party'],'code':r['iso3c'],'band':int(r['un_band'].split(':')[0].split()[1])} for r in rows],key=lambda x:x['name'])
assert len(countries)==len({c['code'] for c in countries})==len({c['name'] for c in countries})==142
assert [sum(c['band']==b for c in countries) for b in range(1,7)]==counts
for r in rows:
 b=int(r['un_band'].split(':')[0].split()[1])-1
 assert float(r['band_weight'])==weights[b]
 assert abs(float(r['alloc_iusaf'])-1e9*weights[b]/175.95)<.51
(p/'countries.js').write_text('/* Version 3 country membership snapshot. See COUNTRY-SOURCE.md. */\nconst IUSAFCountries = '+json.dumps(countries,ensure_ascii=False,indent=2)+';\n')
f=p/'index.html';s=f.read_text().replace('<th>Band</th><th>Parties</th>','<th>Band / countries</th><th>Parties</th>')
s=s.replace('</table></div></section>','''</table></div>
<div class="country-lookup"><h2>Find a country’s allocation</h2><p>Each listed Party receives its band’s per-Party amount under the current weights.</p><label for="country-search">Country name or three-letter code</label><input id="country-search" type="search" placeholder="For example, Kenya or KEN" autocomplete="off"><p id="country-count" role="status"></p><div class="country-results table-wrap"><table><thead><tr><th>Country / Party</th><th>Band</th><th>Allocation per Party (USD)</th></tr></thead><tbody id="country-rows"></tbody></table></div><p class="country-note">Membership: version 3 model snapshot, 142 Parties. High-income Parties are excluded except eligible SIDS. A country absent from this list is outside this scenario; absence does not mean a calculated allocation of zero.</p></div></section>''',1)
s=s.replace('<script src="app.js">','<script src="countries.js"></script><script src="app.js">')
f.write_text(s)
f=p/'app.js';s=f.read_text();s=s.replace("const colors=", "const escapeHTML=s=>String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',\"'\":'&#39;'}[c]));\nconst colors=")
s=s.replace('<th scope="row">Band ${i+1}</th>','<th scope="row"><details class="band-countries" data-band="${i+1}" ${openBands.has(i+1)?\'open\':\'\'}><summary>Band ${i+1} · View countries</summary><div>${IUSAFCountries.filter(c=>c.band===i+1).map(c=>escapeHTML(c.name)).join(\'; \')}</div></details></th>')
s=s.replace(" $('rows').innerHTML=", " const openBands=new Set([...document.querySelectorAll('.band-countries[open]')].map(el=>Number(el.dataset.band)));\n $('rows').innerHTML=")
s=s.replace(" if(!animate||matchMedia", " renderCountries();\n if(!animate||matchMedia")
s += '''
function renderCountries(){
 const normalize=s=>s.normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/[’']/g,'');
 const query=normalize($('country-search').value.trim());
 const list=IUSAFCountries.filter(c=>normalize(c.name+' '+c.code).includes(query));
 $('country-count').textContent=`${list.length} of 142 Parties${document.body.classList.contains('invalid')?' · Last valid allocation':''}`;
 $('country-rows').innerHTML=list.length?list.map(c=>`<tr><th scope="row">${escapeHTML(c.name)} <span class="country-code">${c.code}</span></th><td>${c.band}</td><td>${dollars(model.perParty[c.band-1])}</td></tr>`).join(''):'<tr><td colspan="3">No matching Party in this 142-Party scenario. Try part of its name or its three-letter code.</td></tr>';
}
$('country-search').addEventListener('input',renderCountries);
'''
f.write_text(s)
f=p/'style.css';f.write_text(f.read_text()+'''
.band-countries{margin:0;max-width:420px;font-size:14px}.band-countries summary{font-weight:600}.band-countries div{font-weight:400;line-height:1.7;white-space:normal;padding:12px 0;color:#526775}.country-lookup{border-top:1px solid #dfe8ed;margin-top:26px;padding-top:24px}.country-lookup>p{font-size:14px}.country-lookup input{display:block;width:min(100%,440px);font:inherit;padding:12px;border:1px solid #b8c9d2;border-radius:5px;margin-top:8px}.country-results{max-height:380px;overflow:auto}.country-results thead{position:sticky;top:0;background:white}.country-code{color:#526775;font-weight:400;font-size:12px;margin-left:8px}.country-note{max-width:900px}.country-results th:first-child{width:55%}
''')
(p/'COUNTRY-SOURCE.md').write_text(f'''# Country membership provenance

Source: `{source}`
SHA-256: `{hashlib.sha256(source.read_bytes()).hexdigest()}`
Imported: 2026-10-09.

The originally supplied UNSCALE repository is archived version 1; its README directs readers to version 3. Country names, ISO3 codes, and band membership were extracted from the local version 3 table. No stewardship or combined allocation amounts were imported. All displayed allocations are recalculated using the app's current pure equity weights.

Validation: 142 distinct names and codes; band counts {counts}; every baseline weight matches; every source alloc_iusaf amount agrees with the app within whole-dollar rounding. Band 5 contains Brazil, India, and Mexico; Band 6 contains China. This is a fixed scenario snapshot, not a live statement of eligibility. The version 3 configuration describes this scenario as high-income Parties excluded except SIDS.
''')
print('Validated and added 142 countries; all band counts and baseline amounts match.')

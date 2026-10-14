from pathlib import Path
base=Path('work/allocation-diagram/build.mjs').read_text();comp=Path('work/allocation-diagram/comparison.mjs').read_text()
common=base[base.index('const ink='):base.index("text('A possible")]
def function(name,source,start):
 body=source[source.index(start):source.index('await (await PresentationFile.exportPptx')]
 return 'function '+name+'(){const s=p.slides.add();s.background.fill="#FFFFFF";\n'+common+body+'\n}\n'
s=base[:base.index('const p=')]+'''const p=Presentation.create({slideSize:{width:1600,height:900}});
'''
s+=function('proposal',base,"text('A possible")+function('comparison',comp,"text('Criterion C:")
s+='function formula(){const s=p.slides.add();s.background.fill="#FFFFFF";\n'+common+'''
text('The AHTEG allocation framework',70,40,1460,75,48,ink,true);
text('Equality Base plus weighted criteria for allocations to recipient Parties',70,125,1460,45,28,'#526775');
box(70,230,480,440,'#E8F4F5',teal);
text('Equality Base',95,275,430,65,39,teal,true,'center');
text('50%',95,365,430,95,68,teal,true,'center');
text('Starting pool divided equally\\nbetween recipient Parties',100,480,420,100,28,ink,false,'center');
text('+',566,390,70,85,58,ink,true,'center');
box(655,230,875,440,'#FBF4E6','#D7AE64');
text('Weighted criteria',680,260,825,65,39,gold,true,'center');
text('Remaining allocation pool',680,332,825,45,28,ink,false,'center');
text('A   Biodiversity richness',700,410,775,45,29,ink,true);
text('B   Geographic origin of genetic resources underlying DSI',700,468,775,70,26,ink,true);
text('C   Capacity needs for conservation and sustainable use',700,545,775,45,26,teal,true);
text('D   Traditional knowledge and IP & LC contributions',700,608,775,45,26,ink,true);
text('Country allocation = Equality Base + w₁Cₐ + w₂Cᵦ + w₃C꜀ + w₄Cᴅ',70,725,1460,70,34,ink,true,'center');
text('The GNI option adjusts the Equality Base for LDCs and SIDS. Criterion B remains a placeholder pending suitable data.',70,818,1460,46,23,'#526775');
s.speakerNotes.textFrame.setText('Based on user-supplied cali-allocation-blocks.pptx slide 1 and CBD/DSI/AHTEG/2026/2/3 Annex II. https://www.cbd.int/doc/c/db87/84a9/9022dd04f7afc8880d009149/dsi-ahteg-2026-02-03-en.pdf . This slide concerns the recipient-Party allocation pool, not a division of the whole fund between Parties and indigenous peoples and local communities. Equality Base is spelled out to distinguish it from criterion B. The original 50% base is modified by a 25% base uplift for LDC/SIDS under the GNI option. Weights and other details follow the report, including the current lack of applicable data for criterion B. This is a summary redrawn for widescreen, not an exact reproduction of the original block slide.');
}
async function figure(name,description){const s=p.slides.add();s.background.fill='#FFFFFF';s.images.add({blob:new Uint8Array(await fs.readFile(root+'/outputs/iusaf-distribution/'+name+'.png')),contentType:'image/png',alt:description,fit:'contain',position:{left:0,top:0,width:1600,height:900}});s.speakerNotes.textFrame.setText(description+'\\nExisting figure from this task. Sources and data: outputs/iusaf-distribution/README.md and figure-data.csv; stewardship details in stewardship-notes.md. Figures retain their existing labels. The UN input is the repository 2027 column. The assessment period is 2025–2027, although the four-panel figure retains the user-requested 2024–2027 label.');}
formula();
comparison();
await figure('country-distributions-four-panels','Recorded UN assessments, banded zoom, raw inversion and banded IUSAF. Independent vertical scales within the zoom.');
await figure('band-share-comparison','Total shares by band within the 142-Party cohort. UN assessment shares normalized within the cohort for this comparison.');
await figure('stewardship-adjustments','Four stewardship scenarios with SOSAC 3% and TSAC 0%, 1.5%, 2.5% and 3%. The 3% boundary marginally reverses Band 5 and Band 6 mean ordering.');
proposal();
await figure('full-un-assessment-distribution','Appendix: full UN assessment distribution for 193 assessed Member States, before recipient eligibility filtering.');
await fs.mkdir(out+'/deck-previews',{recursive:true});
await (await PresentationFile.exportPptx(p)).save(tmp+'/deck-candidate.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:tmp+'/deck-candidate.pptx',finalPath:out+'/cali-fund-allocation-deck.pptx',pythonExecutable:'/Users/pauloldham/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:tmp+'/deck-validation.json'});
for(let i=0;i<7;i++){const img=await p.export({slide:p.slides.getItem(i),format:'png',scale:.8});await fs.writeFile(out+'/deck-previews/slide-'+(i+1)+'.png',new Uint8Array(await img.arrayBuffer()));}
console.log('Exported 7-slide deck.');
'''
Path('work/allocation-diagram/deck.mjs').write_text(s)

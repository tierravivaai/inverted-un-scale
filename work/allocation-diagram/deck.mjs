import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {resolvePresentationFont,finalizePresentation} from '/Users/pauloldham/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root=process.cwd(), tmp=root+'/work/allocation-diagram',out=root+'/outputs/cali-allocation-proposal';
const skill='/Users/pauloldham/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const font=resolvePresentationFont();
const p=Presentation.create({slideSize:{width:1600,height:900}});
function proposal(){const s=p.slides.add();s.background.fill="#FFFFFF";
const ink='#193445',teal='#147D92',gold='#A77923';
function box(x,y,w,h,fill,stroke='none'){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:stroke,width:stroke==='none'?0:2}})}
function text(t,x,y,w,h,size=28,color=ink,bold=false,align='left'){let a=box(x,y,w,h,'none');a.text=t;a.text.style={typeface:font,fontSize:size,color,bold,alignment:align,verticalAlignment:'middle',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};return a}
function arrow(a,b,color='#788994'){s.shapes.connect(a,b,{fromSide:'bottom',toSide:'top',kind:'straight',line:{fill:color,width:3},tail:{type:'triangle',width:'med',length:'med'}})}
text('A possible Cali Fund allocation approach',70,40,1460,70,49,ink,true);
text('Equality Base and economic capacity, combined with biodiversity stewardship',70,117,1460,45,27,'#526775');
text('EQUALITY AND ECONOMIC CAPACITY',85,204,660,40,22,teal,true);
const l=box(85,280,660,120,'#E8F4F5',teal);
text('Equality Base  +  Criterion C',110,298,610,44,33,teal,true,'center');
text('Equal share between Parties + economic capacity',110,350,610,34,23,ink,false,'center');
const il=box(85,490,660,126,teal);
text('IUSAF',110,505,610,45,36,'#FFFFFF',true,'center');
text('Inverted UN Scale of Assessments',110,555,610,38,26,'#FFFFFF',false,'center');
arrow(l,il,teal);

const proc=box(910,195,550,76,'#EEF1F3','#83919A');
text('IPBES Rapid Assessment',930,213,510,40,30,ink,true,'center');
const r=box(855,330,660,92,'#FBF4E6',gold);
text('A: Species   B: DSI   D: Traditional knowledge',875,349,620,53,25,gold,true,'center');
arrow(proc,r);
const ir=box(855,490,660,126,'#D7AE64');
text('Biodiversity Stewardship Index',875,503,620,60,32,ink,true,'center');
text('Combines criteria A, B and D',880,563,610,34,25,ink,false,'center');
arrow(r,ir,gold);
text('+',758,521,84,60,52,ink,true,'center');
const result=box(495,709,610,74,'#F1F5F6');
text('Combined allocation',515,723,570,46,34,ink,true,'center');
s.shapes.connect(il,result,{fromSide:'bottom',toSide:'left',kind:'elbow',line:{fill:teal,width:3},tail:{type:'triangle'}});
s.shapes.connect(ir,result,{fromSide:'bottom',toSide:'right',kind:'elbow',line:{fill:gold,width:3},tail:{type:'triangle'}});
s.speakerNotes.textFrame.setText('Source: user-supplied cali-allocation-blocks.pptx, slide 2, and subsequent user clarifications. This is a possible solution, not an assertion of an adopted AHTEG allocation formula. Equality Base is distinct from criterion B (DSI). The user requested teal for Equality Base plus criterion C through IUSAF, gold for Biodiversity Stewardship Index criteria A, B and D, and a grey IPBES Rapid Assessment process block feeding the index. No component weights, 50:50 split, country scores or disbursement mechanism are implied. DSI = digital sequence information.');

}
function comparison(){const s=p.slides.add();s.background.fill="#FFFFFF";
const ink='#193445',teal='#147D92',gold='#A77923';
function box(x,y,w,h,fill,stroke='none'){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:stroke,width:stroke==='none'?0:2}})}
function text(t,x,y,w,h,size=28,color=ink,bold=false,align='left'){let a=box(x,y,w,h,'none');a.text=t;a.text.style={typeface:font,fontSize:size,color,bold,alignment:align,verticalAlignment:'middle',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};return a}
function arrow(a,b,color='#788994'){s.shapes.connect(a,b,{fromSide:'bottom',toSide:'top',kind:'straight',line:{fill:color,width:3},tail:{type:'triangle',width:'med',length:'med'}})}
text('Criterion C: inverted GNI per capita or IUSAF?',70,35,1460,75,48,ink,true);
text('Strengths and trade-offs of the two options in the AHTEG report',70,110,1460,45,27,'#526775');
box(70,175,1460,65,'#F1F5F6');
text('Both are economic proxies. Neither directly measures biodiversity capacity needs.',90,183,1420,49,23,ink);
text('Inverted GNI per capita',70,270,690,48,36,teal,true);
text('Option 1: Equality Base uplift of 25% for LDCs and SIDS',70,320,690,45,23,'#526775');
text('IUSAF (banded UN scale)',850,270,680,48,36,teal,true);
text('Option 2: equal Equality Base, plus six capacity bands',850,320,680,45,23,'#526775');
box(798,270,2,490,'#DCE4E8');
text('STRENGTHS',70,388,690,30,22,teal,true);
text('STRENGTHS',850,388,680,30,22,teal,true);
const lpros=[
'Direct link to average income per person.',
'Continuous scores can retain differences between countries.',
'Avoids directly penalising countries for a larger population.'
];
const rpros=[
'Uses the agreed, GNI-based UN capacity-to-pay reference.',
'Incorporates debt and low per capita income adjustments.',
'Bands set an explicit ratio for the capacity component.'
];
for(let i=0;i<3;i++){text(lpros[i],70,431+i*60,690,54,25);text(rpros[i],850,431+i*60,680,54,25)}
text('LIMITATIONS / CHOICES',70,628,690,30,22,gold,true);
text('LIMITATIONS / CHOICES',850,628,680,30,22,gold,true);
const lcons=[
'AHTEG identified bias against LDCs/SIDS, prompting a 25% base uplift.',
'Results depend on inversion, normalisation and data choices.',
'GNI alone omits debt burdens and within-country inequality.'
];
const rcons=[
'Input reflects economy size and UN contribution rules.',
'Bands create steps and equal scores within bands.',
'Weights and ratio are a policy choice.'
];
for(let i=0;i<3;i++){text(lcons[i],70,670+i*55,690,52,25);text(rcons[i],850,670+i*55,680,52,25)}
s.speakerNotes.textFrame.setText(`Sources and interpretation (12 October 2026):
UN Committee on Contributions, scale of assessments 2025–2027: https://www.un.org/en/ga/contributions/budget.shtml and https://www.un.org/ldcportal/node/933 . GNI is the starting point, with debt-burden and low-per-capita-income adjustments, minimum assessment and ceilings. The UN agreement concerns contributions, not adoption of IUSAF for Cali allocations.
World Bank, GNI per capita methodology and limitations: https://datahelpdesk.worldbank.org/knowledgebase/articles/378831-why-use-gni-per-capita-to-classify-economies-into and https://datahelpdesk.worldbank.org/knowledgebase/articles/378832-what-is-the-world-bank-atlas-method . GNI per capita does not describe within-country inequality. Atlas conversion smooths but does not eliminate exchange-rate effects. Data availability and reference-year choices require checking under either approach.
IUSAF banding and 3.75:1 ratio: user's paper and modelling files previously inspected in this task, https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6809586 . IUSAF here means the banded version, not raw reciprocal UN assessments.
Analytical deductions: with equal treatment of Parties and normalized reciprocal weighting, inverse total GNI favours smaller economies whereas inverse per-capita GNI favours lower income per person. Raw reciprocal sensitivity and concentration depend on data spread. Continuous differentiation applies before introducing bands. Band thresholds and within-band equality are consequences of the banded model.
Fair comparison: distinguish the capacity indicator from the transformation. Either GNI or UN assessments can be banded, smoothed or given a chosen ratio range. Neither input directly measures biodiversity stewardship. Both require explicit treatment of missing data, allocation normalization, and integration with the Equality Base and other criteria. AHTEG report CBD/DSI/AHTEG/2026/2/3, Annex II paragraphs 4(c) and 5 (pages 10–11): https://www.cbd.int/doc/c/db87/84a9/9022dd04f7afc8880d009149/dsi-ahteg-2026-02-03-en.pdf . The report specifies per-capita GNI. The 25% uplift is relative to the base allocation, not 25 percentage points of the fund. Paragraph 28 discusses the weak biodiversity-specific connection of these proxies. Exact inversion and normalisation should be checked in the implementation before quantitative comparisons. No numerical ranking or claim of superiority is made.`);

}
function formula(){const s=p.slides.add();s.background.fill="#FFFFFF";
const ink='#193445',teal='#147D92',gold='#A77923';
function box(x,y,w,h,fill,stroke='none'){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:stroke,width:stroke==='none'?0:2}})}
function text(t,x,y,w,h,size=28,color=ink,bold=false,align='left'){let a=box(x,y,w,h,'none');a.text=t;a.text.style={typeface:font,fontSize:size,color,bold,alignment:align,verticalAlignment:'middle',autoFit:'none',insets:{left:0,right:0,top:0,bottom:0}};return a}
function arrow(a,b,color='#788994'){s.shapes.connect(a,b,{fromSide:'bottom',toSide:'top',kind:'straight',line:{fill:color,width:3},tail:{type:'triangle',width:'med',length:'med'}})}

text('The AHTEG allocation framework',70,40,1460,75,48,ink,true);
text('Equality Base plus weighted criteria for allocations to recipient Parties',70,125,1460,45,28,'#526775');
box(70,230,480,440,'#E8F4F5',teal);
text('Equality Base',95,275,430,65,39,teal,true,'center');
text('50%',95,365,430,95,68,teal,true,'center');
text('Starting pool divided equally\nbetween recipient Parties',100,480,420,100,28,ink,false,'center');
text('+',566,390,70,85,58,ink,true,'center');
box(655,230,875,440,'#FBF4E6','#D7AE64');
text('Weighted criteria',680,260,825,65,39,gold,true,'center');
text('Remaining allocation pool',680,332,825,45,28,ink,false,'center');
text('A   Biodiversity richness',700,410,775,45,29,ink,true);
text('B   Geographic origin of genetic resources underlying DSI',700,468,775,70,26,ink,true);
text('C   Capacity needs for conservation and sustainable use',700,545,775,45,26,teal,true);
text('D   Traditional knowledge and IP & LC contributions',700,608,775,45,26,ink,true);
text('Country allocation = Equality Base + w1·CA + w2·CB + w3·CC + w4·CD',70,725,1460,70,34,ink,true,'center');
text('The GNI option adjusts the Equality Base for LDCs and SIDS. Criterion B remains a placeholder pending suitable data.',70,818,1460,46,23,'#526775');
s.speakerNotes.textFrame.setText('Based on user-supplied cali-allocation-blocks.pptx slide 1 and CBD/DSI/AHTEG/2026/2/3 Annex II. https://www.cbd.int/doc/c/db87/84a9/9022dd04f7afc8880d009149/dsi-ahteg-2026-02-03-en.pdf . This slide concerns the recipient-Party allocation pool, not a division of the whole fund between Parties and indigenous peoples and local communities. Equality Base is spelled out to distinguish it from criterion B. The original 50% base is modified by a 25% base uplift for LDC/SIDS under the GNI option. Weights and other details follow the report, including the current lack of applicable data for criterion B. This is a summary redrawn for widescreen, not an exact reproduction of the original block slide.');
}
async function figure(name,description){const s=p.slides.add();s.background.fill='#FFFFFF';s.images.add({blob:new Uint8Array(await fs.readFile(root+'/outputs/iusaf-distribution/'+name+'.png')),contentType:'image/png',alt:description,fit:'contain',position:{left:0,top:0,width:1600,height:900}});s.speakerNotes.textFrame.setText(description+'\nExisting figure from this task. Sources and data: outputs/iusaf-distribution/README.md and figure-data.csv; stewardship details in stewardship-notes.md. Figures retain their existing labels. The UN input is the repository 2027 column. The assessment period is 2025–2027, although the four-panel figure retains the user-requested 2024–2027 label.');}
formula();
comparison();
await figure('band-share-comparison','Total shares by band within the 142-Party cohort. UN assessment shares normalized within the cohort for this comparison.');
await figure('country-distributions-four-panels','Recorded UN assessments, banded zoom, raw inversion and banded IUSAF. Independent vertical scales within the zoom.');
await figure('stewardship-adjustments','Four stewardship scenarios with SOSAC 3% and TSAC 0%, 1.5%, 2.5% and 3%. The 3% boundary marginally reverses Band 5 and Band 6 mean ordering.');
proposal();
await figure('full-un-assessment-distribution','Appendix: full UN assessment distribution for 193 assessed Member States, before recipient eligibility filtering.');
await fs.mkdir(out+'/deck-previews',{recursive:true});
await (await PresentationFile.exportPptx(p)).save(tmp+'/deck-candidate.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:tmp+'/deck-candidate.pptx',finalPath:out+'/cali-fund-allocation-deck-v2.pptx',pythonExecutable:'/Users/pauloldham/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:tmp+'/deck-validation-v2.json'});
for(let i=0;i<7;i++){const img=await p.export({slide:p.slides.getItem(i),format:'png',scale:.8});await fs.writeFile(out+'/deck-previews/slide-'+(i+1)+'.png',new Uint8Array(await img.arrayBuffer()));}
console.log('Exported 7-slide deck.');

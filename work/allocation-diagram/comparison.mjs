import fs from 'node:fs/promises';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {resolvePresentationFont,finalizePresentation} from '/Users/pauloldham/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations/container_tools/artifact_tool_utils.mjs';
const root=process.cwd(), tmp=root+'/work/allocation-diagram',out=root+'/outputs/cali-allocation-proposal';
const skill='/Users/pauloldham/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const font=resolvePresentationFont();
const p=Presentation.create({slideSize:{width:1600,height:900}}),s=p.slides.add();s.background.fill='#FFFFFF';
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
await (await PresentationFile.exportPptx(p)).save(tmp+'/comparison-candidate.pptx');
const preview=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(out+'/criterion-c-comparison.png',new Uint8Array(await preview.arrayBuffer()));
await finalizePresentation({workspaceDir:root,candidatePath:tmp+'/comparison-candidate.pptx',finalPath:out+'/criterion-c-options-revised-v3.pptx',pythonExecutable:'/Users/pauloldham/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:tmp+'/comparison-validation-revised-v3.json'});
console.log('Created editable diagram and PNG');

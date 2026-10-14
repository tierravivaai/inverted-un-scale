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
await (await PresentationFile.exportPptx(p)).save(tmp+'/candidate.pptx');
const preview=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(out+'/cali-allocation-proposal.png',new Uint8Array(await preview.arrayBuffer()));
await finalizePresentation({workspaceDir:root,candidatePath:tmp+'/candidate.pptx',finalPath:out+'/cali-allocation-diagram-v2.pptx',pythonExecutable:'/Users/pauloldham/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:tmp+'/validation-v2.json'});
console.log('Created editable diagram and PNG');

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
text('Issues for Consideration',70,45,1460,85,52,ink,true);
const questions=[
'Should Parties accept the IUCN/GEF STAR index weightings (GEF8/GEF9)?',
'What has happened to the allocation for indigenous peoples and local communities?',
'What would the time frame and cost be for an IPBES Rapid Assessment?',
'What should be used in the interim, knowing that interim measures tend to become permanent?',
'Is it desirable that Parties have full oversight and ultimate control over the allocation methodology?'
];
questions.forEach((q,i)=>{const y=185+i*130;text(String(i+1).padStart(2,'0'),70,y,85,72,36,teal,true);text(q,185,y,1345,96,34,ink,false);if(i<4)box(185,y+112,1345,1,'#DCE4E8');});
s.speakerNotes.textFrame.setText('Discussion questions supplied by the user. Separate standalone slide for insertion into the user’s edited presentation. The questions present issues for consideration and do not assert findings or conclusions.');
await (await PresentationFile.exportPptx(p)).save(tmp+'/issues-candidate.pptx');
const preview=await p.export({slide:s,format:'png',scale:1.5});await fs.writeFile(out+'/issues-for-consideration.png',new Uint8Array(await preview.arrayBuffer()));
await finalizePresentation({workspaceDir:root,candidatePath:tmp+'/issues-candidate.pptx',finalPath:out+'/issues-for-consideration.pptx',pythonExecutable:'/Users/pauloldham/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:skill+'/container_tools/inspect_presentation_package_integrity.py',layoutValidatorPath:skill+'/container_tools/inspect_presentation_layout_geometry.py',layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit'],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:tmp+'/issues-validation.json'});
console.log('Created editable diagram and PNG');

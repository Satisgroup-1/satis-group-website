import pptxgen from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

const SHOTS = new URL('./shots/', import.meta.url).pathname;
const INK='000000', MUTED='5C6366', FAINT='9AA0A2', ACCENT='B3400C', PANEL='ECEEEE';
const F='Work Sans';
const FOOT='SATIS GROUP · EDITING THE WEBSITE WITH CLAUDE';

function pngSize(file){const b=fs.readFileSync(path.join(SHOTS,file));return {w:b.readUInt32BE(16),h:b.readUInt32BE(20)};}
const ratio = f => { const s=pngSize(f); return s.w/s.h; };

const pres = new pptxgen();
pres.defineLayout({name:'SATIS', width:13.3327, height:7.5});
pres.layout='SATIS';

function chrome(s,eyebrow,num){
  s.background={color:'FFFFFF'};
  s.addText(eyebrow,{x:0.62,y:0.34,w:10.693,h:0.28,fontSize:9.5,charSpacing:2.6,color:MUTED,fontFace:F,align:'left',margin:0,valign:'middle'});
  s.addShape(pres.ShapeType.line,{x:0.62,y:0.76,w:12.093,h:0,line:{color:INK,width:0.75}});
  s.addText('SATIS',{x:11.313,y:0.27,w:1.4,h:0.24,fontSize:11,charSpacing:5,color:INK,fontFace:F,align:'right',margin:0,valign:'middle'});
  s.addText('GROUP',{x:11.313,y:0.50,w:1.4,h:0.16,fontSize:5.5,charSpacing:3.4,color:MUTED,fontFace:F,align:'right',margin:0,valign:'middle'});
  s.addText(FOOT,{x:0.62,y:7.08,w:7.0,h:0.22,fontSize:7,charSpacing:2,color:FAINT,fontFace:F,margin:0,valign:'middle'});
  s.addText(num,{x:11.713,y:7.08,w:1.0,h:0.22,fontSize:8,charSpacing:1,color:FAINT,fontFace:F,align:'right',margin:0,valign:'middle'});
}
const title = (s,t) => s.addText(t,{x:0.62,y:1.02,w:12.093,h:0.62,fontSize:25,color:INK,fontFace:F,align:'left',margin:0,valign:'middle'});
const sub = (s,t,w=11.6,h=0.52) => s.addText(t,{x:0.62,y:1.66,w,h,fontSize:11.5,color:MUTED,fontFace:F,margin:0,valign:'middle',lineSpacing:16});

function step(s,n,x,y,w,head,body,bodyH=0.454,headH=0.30){
  s.addShape(pres.ShapeType.ellipse,{x,y:y+0.015,w:0.27,h:0.27,fill:{color:ACCENT}});
  s.addText(String(n),{x:x-0.05,y:y-0.013,w:0.37,h:0.32,fontSize:10.5,bold:true,color:'FFFFFF',fontFace:F,align:'center',margin:0,valign:'middle'});
  s.addText(head,{x:x+0.46,y,w,h:headH,fontSize:12,bold:true,color:INK,fontFace:F,margin:0,valign:'middle'});
  s.addText(body,{x:x+0.46,y:y+headH,w,h:bodyH,fontSize:10.5,color:MUTED,fontFace:F,margin:0,valign:'top',lineSpacing:14.91});
}
function panel(s,x,y,w,h,label,head,body,white=false){
  if(white) s.addShape(pres.ShapeType.rect,{x,y,w,h,fill:{color:'FFFFFF'},line:{color:INK,width:0.75}});
  else s.addShape(pres.ShapeType.rect,{x,y,w,h,fill:{color:PANEL}});
  s.addText(label,{x:x+0.24,y:y+0.16,w:w-0.48,h:0.2,fontSize:7.5,charSpacing:2,color:MUTED,fontFace:F,margin:0,valign:'middle'});
  s.addText([{text:head+'\n',options:{fontSize:11,bold:true,color:INK,fontFace:F,lineSpacing:13.8}},
             {text:body,options:{fontSize:10,color:MUTED,fontFace:F,lineSpacing:13.8}}],
            {x:x+0.24,y:y+0.40,w:w-0.48,h:h-0.56,margin:0,valign:'top'});
}
function caption(s,x,y,w,head,body,h=1.05){
  s.addText([{text:head+'\n',options:{fontSize:11,bold:true,color:INK,fontFace:F,lineSpacing:14}},
             {text:body,options:{fontSize:10,color:MUTED,fontFace:F,lineSpacing:14}}],
            {x,y,w,h,margin:0,valign:'top'});
}
const shotW = (s,f,x,y,w) => s.addImage({path:path.join(SHOTS,f),x,y,w,h:+(w/ratio(f)).toFixed(3)});
const shotH = (s,f,x,y,h) => { const w=+(h*ratio(f)).toFixed(3); s.addImage({path:path.join(SHOTS,f),x,y,w,h}); return w; };

/* ============ 1  AGENDA  (replaces slide 2) ============ */
{
const s=pres.addSlide();
chrome(s,'IN THIS WEBINAR','02');
title(s,'What this session covers.');
sub(s,'Under an hour, no technical background needed. By the end you can request any website change yourself — and look at it before anyone else does.',9.6);
const items=[
 ['01','The one idea behind everything','The live site is a printed brochure: you change the master copy, not the print.'],
 ['02','Starting a Claude session','Where to go, what to click, what you need access to.'],
 ['03','Connecting a different GitHub account','Pointing Claude at a repository another account or organisation owns.'],
 ['04','How to ask for changes','Proven plain-English requests you can copy verbatim.'],
 ['05','The magic words','“…then commit and push the change”, and what happens next.'],
 ['06','Previewing before it goes live','Branch previews on Vercel, and how to find one.'],
 ['07','Bigger jobs','Adding a whole new development in one request.'],
 ['08','Skills and safety nets','Where the 105 playbooks live, and how nothing is ever lost.'],
];
items.forEach((it,i)=>{
  const col=i<4?0:1,row=i%4;
  const nx=col?6.942:0.62, tx=col?7.492:1.170, y=2.44+row*0.92;
  s.addText(it[0],{x:nx,y,w:0.5,h:0.3,fontSize:11,charSpacing:1.5,color:MUTED,fontFace:F,margin:0,valign:'middle'});
  s.addText(it[1],{x:tx,y:y-0.02,w:5.222,h:0.3,fontSize:12.5,bold:true,color:INK,fontFace:F,margin:0,valign:'middle'});
  s.addText(it[2],{x:tx,y:y+0.28,w:5.222,h:0.42,fontSize:9.5,color:MUTED,fontFace:F,margin:0,valign:'top',lineSpacing:13});
});
s.addNotes('Run through the agenda quickly. Two sections are new since the last run of this webinar: connecting a different GitHub account (03), and previewing a change on its own web address before it reaches the live site (06). Emphasise the promise: by the end of the session everyone here can change the website themselves, safely.');
}

/* ============ 2  GITHUB: THE CONNECTED ACCOUNT  (new, page 05) ============ */
{
const s=pres.addSlide();
chrome(s,'ACCESS','05');
title(s,'Connecting Claude to a different GitHub account.');
sub(s,'The repositories you can pick in a session are exactly the ones the connected GitHub account can see. Working on a site owned by another account or organisation means changing that connection. It is a one-time job.');
const W=5.30;
step(s,1,0.62,2.28,W,'Settings → Connectors → GitHub','In claude.ai, open Settings, then Connectors. The GitHub row names the account in use.');
step(s,2,0.62,3.17,W,'Choose Reconnect','Or Disconnect and then Connect. Either way GitHub asks you to authorise the connection again.');
step(s,3,0.62,4.06,W,'Sign in as the other account','If the browser signs you straight back in as the old one, sign out of github.com first, then retry.');
panel(s,0.62,5.05,5.76,1.45,'GOOD TO KNOW','Two things people confuse',
 'A session can reach any repository the connected account can see. Installing the Claude app on a repository is a separate step — that is what switches on pull-request previews and automatic CI fixes.');
shotW(s,'claude-connectors.png',6.62,2.20,6.09);
caption(s,6.62,2.20+6.09/ratio('claude-connectors.png')+0.24,6.09,'claude.ai → Settings → Connectors',
 'The account named here is the one every session will use. Change it here and the repository list changes with it.',0.7);
s.addNotes('This is the question that comes up whenever somebody joins with a personal GitHub login. The model to give them: Claude sees exactly what the connected GitHub account sees, no more and no less. So "I cannot find the repository" is almost always "I am connected as the wrong account". Step three is where people get stuck — the browser silently reuses the old GitHub session, so tell them to sign out of github.com first.');
}

/* ============ 3  GITHUB: ACCOUNT + REPOSITORIES  (new, page 06) ============ */
{
const s=pres.addSlide();
chrome(s,'ACCESS','06');
title(s,'Choosing the account, then the repositories.');
sub(s,'GitHub then asks two questions in turn: whose repositories, and which of them. Answer both for the organisation that owns the site.');
const H=3.12, y=2.30;
const w1=shotH(s,'github-choose-account.png',0.62,y,H);
const w2=shotH(s,'github-repo-access.png',12.713-H*ratio('github-repo-access.png'),y,H);
const x2=12.713-w2;
caption(s,0.62,y+H+0.26,w1-0.20,'1 — Where do you want to install Claude?',
 'Pick the organisation that owns the site: Satisgroup-1. Your personal account will not contain it. If the organisation is missing from the list, a GitHub owner has to approve the Claude app once.',1.15);
caption(s,x2,y+H+0.26,w2,'2 — Repository access',
 'Choose “Only select repositories” and tick satis-group-website, then Install & Authorize. To change it later: github.com → Settings → Applications → Claude → Configure.',1.15);
s.addNotes('Two screens, two questions. The first is about the owner and the second about the repositories. Recommend "Only select repositories" over "All repositories" — it is the safer default and it costs one extra tick. The line worth repeating is the last one: this is all reversible at any time from GitHub Settings, Applications, Claude, Configure.');
}

/* ============ 4  PREVIEW: THE IDEA  (new, page 10) ============ */
{
const s=pres.addSlide();
chrome(s,'PREVIEWS','10');
title(s,'Seeing a change before it goes live.');
sub(s,'Every branch gets its own private copy of the whole website, at its own web address. Vercel builds it automatically. Nothing on www.satisgroup.co.uk moves until that branch is merged.');
const W=5.40;
step(s,1,0.62,2.28,W,'Ask for a branch, not a direct change','End your request with: “…then commit and push to a new branch and open a pull request.” Claude will not touch the live site.');
step(s,2,0.62,3.24,W,'Vercel builds the preview by itself','Within a minute or two the branch has a complete copy of the site — pages, photographs, navigation, all of it — on its own address.');
step(s,3,0.62,4.20,W,'Ask Claude for the link','“What is the preview URL for this branch?” is the fastest route of all. Claude reads it off the pull request and hands you the address.');
panel(s,0.62,5.20,6.28,1.30,'GOOD TO KNOW','A preview is a rehearsal, not a broadcast',
 'The address is unlisted and entirely separate from the live site. Share it, click around it, change your mind — the public site is untouched until someone merges the branch.');
shotW(s,'vercel-pr-comment.png',7.20,2.28,5.51);
panel(s,7.20,2.28+5.51/ratio('vercel-pr-comment.png')+0.28,5.51,1.80,'WHAT YOU SHOULD SEE',
 'Every pull request grows a table',
 'Vercel posts it as a comment within a couple of minutes: the project name, a green Ready, and a Visit Preview link. That link is your change, working, on its own address — and anyone can open it without a Vercel login.',true);
s.addNotes('This is the slide that changes behaviour. Until now people have asked for a change and hoped; from here they can look first. Make the distinction explicit: a preview is a full working copy of the site at a different address, not a screenshot and not a staging server anyone has to maintain. Land the last point hard — the quickest route to a preview is to ask Claude, in the same session, for the link.');
}

/* ============ 5  PREVIEW: VERCEL NAVIGATION  (new, page 11) ============ */
{
const s=pres.addSlide();
chrome(s,'PREVIEWS','11');
title(s,'Finding a preview in Vercel, click by click.');
sub(s,'If you would rather go and look for yourself, the route is four clicks from the Vercel dashboard. Sign in with the Satis Group team account.');
const IW=5.90, y=2.26;
shotW(s,'vercel-deployments.png',0.62,y,IW);
shotW(s,'vercel-preview-url.png',6.81,y,IW);
const sy=y+IW/ratio('vercel-deployments.png')+0.32;
const SW=2.55;
step(s,1,0.62,sy,SW,'Open the project','vercel.com → the satis-group team → satis-group-website.',0.9,0.28);
step(s,2,3.68,sy,SW,'Deployments, then filter','Every build ever made, newest first. Type the branch name to find yours.',0.9,0.28);
step(s,3,6.74,sy,SW,'Open the Ready one','Green is built. Amber is still building — wait a moment and refresh.',0.9,0.28);
step(s,4,9.80,sy,SW,'Visit, or copy the link','Visit opens the preview. The …-git-branch-… address is the one to share.',0.9,0.28);
s.addNotes('Walk the room along the two screenshots, left to right. The one thing worth memorising is the shape of the preview address: the project name, then -git-, then the branch, then the team. Anyone who sees that in a browser bar knows straight away they are looking at a preview and not the live site. Amber means still building, and that is the single most common "the link is broken" report.');
}

/* ============ 6  WHERE SKILLS LIVE  (new, page 14) ============ */
{
const s=pres.addSlide();
chrome(s,'SKILLS','14');
title(s,'Where the skills are, and what one actually is.');
sub(s,'A skill is a written playbook: a professional procedure Claude loads when a job calls for it, so the same work is done the same way every time. They reach a session from two places.');
const H=3.05, y=2.30;
const w1=shotH(s,'claude-skills-slash.png',0.62,y,H);
const w2=shotH(s,'claude-skills-settings.png',12.713-H*ratio('claude-skills-settings.png'),y,H);
const x2=12.713-w2;
caption(s,0.62,y+H+0.28,w1-0.30,'In the session — type “/”',
 'All 105 playbooks are committed to this repository, so they are there in every session, for everyone, with nothing to install. Type “/” to list them and keep typing to narrow it down.',1.2);
caption(s,x2,y+H+0.28,w2,'In your account — Settings → Capabilities',
 'Skills you switch on here follow your Claude account into every session you start. “Code execution and file creation” has to be on first, or none of them can run.',1.2);
s.addNotes('Define a skill in one sentence and move on: it is a written procedure, not a plug-in and not a piece of software to install. Nobody in this room needs to install anything — the repository already carries all 105, which is why an accessibility audit or an SEO sweep is a one-sentence request. The account-level settings page only matters to people who also use Claude outside this website. Demonstrate the slash menu live if the connection allows; it lands better than the screenshot.');
}

/* ============ 7  RECAP  (replaces slide 12, page 17) ============ */
{
const s=pres.addSlide();
s.background={color:'000000'};
s.addText('RECAP',{x:0.62,y:0.34,w:10.693,h:0.28,fontSize:9.5,charSpacing:2.6,color:'B9BDBE',fontFace:F,margin:0,valign:'middle'});
s.addShape(pres.ShapeType.line,{x:0.62,y:0.76,w:12.093,h:0,line:{color:'3A3A3A',width:0.75}});
s.addText('SATIS',{x:11.313,y:0.27,w:1.4,h:0.24,fontSize:11,charSpacing:5,color:'FFFFFF',fontFace:F,align:'right',margin:0,valign:'middle'});
s.addText('GROUP',{x:11.313,y:0.50,w:1.4,h:0.16,fontSize:5.5,charSpacing:3.4,color:'B9BDBE',fontFace:F,align:'right',margin:0,valign:'middle'});
s.addText(FOOT,{x:0.62,y:7.08,w:7.0,h:0.22,fontSize:7,charSpacing:2,color:'B9BDBE',fontFace:F,margin:0,valign:'middle'});
s.addText('17',{x:11.713,y:7.08,w:1.0,h:0.22,fontSize:8,charSpacing:1,color:'B9BDBE',fontFace:F,align:'right',margin:0,valign:'middle'});
s.addText('What to remember.',{x:0.62,y:1.06,w:12.093,h:0.6,fontSize:24,color:'FFFFFF',fontFace:F,margin:0,valign:'middle'});
const pts=[
 'The live site reprints from a master copy; Claude is how you edit the master.',
 'Describe outcomes in plain English; include the page and exact wording you want.',
 'Repository missing from the list? You are connected as the wrong GitHub account — Settings → Connectors.',
 'Ask for a branch and you get a preview address; the live site only moves when it is merged.',
 'End with “…then commit and push the change”, then verify on the live page.',
 'New development = one request with five ingredients.',
 'Ask for outcomes and the specialist skills load themselves.',
];
s.addText(pts.map((t,i)=>({text:t,options:{fontSize:11.5,color:'FFFFFF',fontFace:F,lineSpacing:16.5,paraSpaceAfter:7,breakLine:i<pts.length-1}})),
 {x:0.67,y:1.90,w:7.30,h:4.50,margin:0,valign:'top'});
s.addShape(pres.ShapeType.line,{x:8.55,y:2.00,w:0,h:3.6,line:{color:'3A3A3A',width:0.75}});
s.addText('WHERE TO GET HELP',{x:8.95,y:2.00,w:3.70,h:0.24,fontSize:8.5,charSpacing:2.4,color:'B9BDBE',fontFace:F,margin:0,valign:'middle'});
const help=[
 'The written walkthrough: /admin/guide → “Making changes with Claude”.',
 'Stuck mid-session? Ask Claude itself: “explain what just happened” works.',
 'Access to claude.ai/code, or to the Vercel dashboard: ask the development team once.',
];
s.addText(help.map((t,i)=>({text:t,options:{fontSize:10.5,color:'B9BDBE',fontFace:F,lineSpacing:15,paraSpaceAfter:9,breakLine:i<help.length-1}})),
 {x:8.95,y:2.40,w:3.75,h:3.20,margin:0,valign:'top'});
s.addText('SATIS',{x:0,y:6.35,w:13.3327,h:0.5,fontSize:20,charSpacing:15,color:'FFFFFF',fontFace:F,align:'center',margin:0,valign:'middle'});
s.addText('GROUP',{x:0,y:6.82,w:13.3327,h:0.24,fontSize:7.5,charSpacing:6,color:'B9BDBE',fontFace:F,align:'center',margin:0,valign:'middle'});
s.addNotes('Recap the takeaways, answer questions, and point everyone at the written guide. The two new lines are the third and fourth: the connected GitHub account is the answer to almost every "I cannot see the repository", and asking for a branch is how you look before you leap. Invite the room to try one small real request this week — a typo fix or a status change — and to open its preview before merging it.');
}

await pres.writeFile({fileName: new URL('./new.pptx', import.meta.url).pathname});
console.log('ok');

import { chromium } from 'playwright';
import fs from 'fs';

const OUT = new URL('./shots/', import.meta.url).pathname;

const BASE = `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:#e8e9ea;-webkit-font-smoothing:antialiased}
.win{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 18px rgba(0,0,0,.14);border:1px solid #d6d8da}
.chrome{background:#e9eaec;border-bottom:1px solid #d6d8da;padding:9px 12px;display:flex;align-items:center;gap:10px}
.dots{display:flex;gap:6px}.dots i{width:10px;height:10px;border-radius:50%;display:block}
.d1{background:#ff5f57}.d2{background:#febc2e}.d3{background:#28c840}
.url{flex:1;background:#fff;border:1px solid #dcdee0;border-radius:6px;padding:5px 11px;font-size:12.5px;color:#5c6366}
.url b{color:#1a1d1e;font-weight:600}
.hl{outline:2.5px solid #B3400C;outline-offset:3px;border-radius:6px;position:relative}
.tag{position:absolute;background:#B3400C;color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:4px;white-space:nowrap;z-index:9}
`;

function page(css, body, w = 960) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}${css}</style></head><body style="width:${w}px;font-size:16px">${body}</body></html>`;
}

function chrome(url) {
  return `<div class="chrome"><div class="dots"><i class="d1"></i><i class="d2"></i><i class="d3"></i></div>
  <div class="url">${url}</div></div>`;
}

const CLAUDE_CSS = `
.cl{display:flex}
.snav,.body{min-height:430px}
.snav{width:196px;background:#faf9f7;border-right:1px solid #ececea;padding:22px 14px}
.snav h4{font-size:11px;letter-spacing:.09em;color:#8b8b86;margin:0 0 12px 8px;font-weight:600}
.snav a{display:block;padding:8px 10px;border-radius:7px;font-size:13.5px;color:#3d3d3a;text-decoration:none;margin-bottom:2px}
.snav a.on{background:#efece7;font-weight:600;color:#1a1a18}
.body{flex:1;padding:30px 34px;background:#fff}
.body h1{font-size:22px;font-weight:600;color:#1a1a18;margin-bottom:6px}
.body p.sub{font-size:13.5px;color:#75756f;margin-bottom:24px;line-height:1.5}
.card{border:1px solid #e6e4e0;border-radius:10px;padding:16px 18px;display:flex;align-items:center;gap:14px;margin-bottom:12px}
.card .ic{width:36px;height:36px;border-radius:8px;background:#1a1a18;color:#fff;display:flex;align-items:center;justify-content:center;font-size:19px}
.card .tx{flex:1}.card .tx b{display:block;font-size:14.5px;color:#1a1a18;margin-bottom:2px}
.card .tx span{font-size:12.5px;color:#7c7c76}
.btn{background:#1a1a18;color:#fff;border-radius:7px;padding:8px 15px;font-size:13px;font-weight:600}
.btn.g{background:#fff;color:#3d3d3a;border:1px solid #dedcd8}
.btn.o{background:#B3400C}
.sw{width:38px;height:22px;border-radius:11px;background:#c9c7c2;position:relative;flex:none}
.sw.on{background:#B3400C}.sw i{position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;left:3px}
.sw.on i{left:19px}
.row{display:flex;align-items:center;gap:14px;padding:13px 4px;border-bottom:1px solid #f0eeeb}
.row .tx{flex:1}.row .tx b{display:block;font-size:13.5px;color:#1a1a18}
.row .tx span{font-size:12px;color:#83837d}
`;

const shots = [];

/* ---------- 1. claude.ai Settings > Connectors : GitHub ---------- */
shots.push(['claude-connectors', page(CLAUDE_CSS, `
<div class="win">${chrome('claude.ai/<b>settings/connectors</b>')}
<div class="cl">
 <div class="snav"><h4>SETTINGS</h4>
  <a>Profile</a><a>Appearance</a><a>Capabilities</a>
  <a class="on hl" style="position:relative">Connectors<span class="tag" style="left:118px;top:6px">STEP 1</span></a>
  <a>Claude Code</a><a>Data controls</a><a>Account</a>
 </div>
 <div class="body">
  <h1>Connectors</h1>
  <p class="sub">Connect Claude to the tools you use. Claude Code sessions clone repositories<br>using the GitHub account connected here.</p>
  <div class="card"><div class="ic">&#128187;</div><div class="tx"><b>GitHub</b><span>Connected as <b style="display:inline;font-weight:600">rohan-personal</b> &middot; 3 organisations</span></div>
   <div class="hl" style="position:relative"><div class="btn o">Reconnect</div><span class="tag" style="right:0;top:-30px">STEP 2 &mdash; SIGN IN AS THE OTHER ACCOUNT</span></div>
   <div class="btn g">Disconnect</div></div>
  <div class="card"><div class="ic" style="background:#4285f4">&#9993;</div><div class="tx"><b>Gmail</b><span>Not connected</span></div><div class="btn g">Connect</div></div>
  <div class="card"><div class="ic" style="background:#0061ff">&#9729;</div><div class="tx"><b>Dropbox</b><span>Not connected</span></div><div class="btn g">Connect</div></div>
 </div></div></div>`)]);

/* ---------- 2. GitHub: choose the account to install on ---------- */
const GH = `
.gh{background:#fff;padding:0}
.ghhead{background:#24292f;padding:12px 22px;color:#fff;font-size:14px;display:flex;align-items:center;gap:10px}
.ghhead b{font-weight:600}
.ghbody{padding:34px 0 40px;text-align:center;background:#f6f8fa}
.panel{width:500px;margin:0 auto;background:#fff;border:1px solid #d0d7de;border-radius:8px;overflow:hidden;text-align:left}
.panel h2{font-size:19px;font-weight:600;color:#1f2328;padding:18px 20px;border-bottom:1px solid #d0d7de;margin:0}
.acct{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid #eaeef2}
.av{width:32px;height:32px;border-radius:50%;background:#57606a;flex:none}
.av.sq{border-radius:6px;background:#B3400C}
.acct .n{flex:1;font-size:14.5px;color:#1f2328;font-weight:500}
.acct .m{font-size:12px;color:#656d76}
.chev{color:#656d76;font-size:16px}
.note{width:500px;margin:20px auto 0;font-size:12.5px;color:#656d76;text-align:left;line-height:1.6}
.ghtitle{font-size:20px;font-weight:600;color:#1f2328;margin-bottom:6px}
.ghsub{font-size:13.5px;color:#656d76;margin-bottom:22px}
`;
shots.push(['github-choose-account', page(GH, `
<div class="win">${chrome('github.com/<b>apps/claude/installations/select_target</b>')}
<div class="gh"><div class="ghhead">&#9679; <b>GitHub</b></div>
<div class="ghbody">
 <div class="ghtitle">Install Claude</div>
 <div class="ghsub">Choose the account or organisation the repository belongs to.</div>
 <div class="panel">
  <h2>Where do you want to install Claude?</h2>
  <div class="acct"><div class="av"></div><div class="n">rohan-personal<div class="m">Personal account</div></div><div class="chev">&#8250;</div></div>
  <div class="acct hl" style="position:relative;background:#fff8f4"><div class="av sq"></div><div class="n">Satisgroup-1<div class="m">Organisation &middot; satis-group-website</div></div><div class="chev">&#8250;</div>
   <span class="tag" style="right:44px;top:50%;margin-top:-11px">PICK THE ACCOUNT THAT OWNS THE SITE</span></div>
  <div class="acct" style="border-bottom:none"><div class="av"></div><div class="n">another-org<div class="m">Organisation</div></div><div class="chev">&#8250;</div></div>
 </div>
 <div class="note">Don't see the organisation? A GitHub owner of that organisation has to approve the Claude app first.</div>
</div></div></div>`)]);

/* ---------- 3. GitHub: repository access ---------- */
shots.push(['github-repo-access', page(GH + `
.radio{display:flex;gap:10px;padding:13px 20px;align-items:flex-start;border-bottom:1px solid #eaeef2}
.rd{width:16px;height:16px;border-radius:50%;border:1px solid #b9c0c8;flex:none;margin-top:2px}
.rd.on{border:5px solid #0969da}
.radio .n{font-size:14px;color:#1f2328}
.radio .m{font-size:12px;color:#656d76;margin-top:2px}
.repo{display:flex;align-items:center;gap:9px;margin:10px 0 0 26px;border:1px solid #d0d7de;border-radius:6px;padding:8px 12px;font-size:13.5px;color:#1f2328;width:330px}
.instbtn{margin:18px 20px;background:#1f883d;color:#fff;border-radius:6px;padding:9px 18px;font-size:14px;font-weight:600;display:inline-block}
`, `
<div class="win">${chrome('github.com/<b>apps/claude/installations/new/permissions?target_id=…</b>')}
<div class="gh"><div class="ghhead">&#9679; <b>GitHub</b></div>
<div class="ghbody">
 <div class="ghtitle">Install Claude on Satisgroup-1</div>
 <div class="ghsub">Grant access to the repositories Claude may clone and push to.</div>
 <div class="panel">
  <h2>Repository access</h2>
  <div class="radio"><div class="rd"></div><div><div class="n">All repositories</div><div class="m">Includes future repositories in this organisation.</div></div></div>
  <div class="radio hl" style="position:relative;background:#fff8f4"><div class="rd on"></div><div><div class="n">Only select repositories</div>
   <div class="m">Recommended. Choose exactly what Claude can see.</div>
   <div class="repo">&#128193; Satisgroup-1/<b>satis-group-website</b></div></div>
   <span class="tag" style="right:20px;top:14px">TICK THE WEBSITE REPOSITORY</span></div>
  <div class="instbtn">Install &amp; Authorize</div>
 </div>
 <div class="note">To change this later: github.com &rarr; Settings &rarr; Applications &rarr; Claude &rarr; Configure.</div>
</div></div></div>`)]);

/* ---------- 4. Vercel deployments tab ---------- */
const VC = `
.v{background:#fff}
.vtop{border-bottom:1px solid #ebebeb;padding:13px 24px;display:flex;align-items:center;gap:10px;font-size:13.5px;color:#171717}
.vtop .lg{width:20px;height:18px;background:#000;clip-path:polygon(50% 0,100% 100%,0 100%)}
.vtop .crumb{color:#8f8f8f}
.vtabs{display:flex;gap:22px;padding:0 24px;border-bottom:1px solid #ebebeb;background:#fff;position:relative;align-items:center}
.vtabs a{padding:12px 2px 11px;font-size:13.5px;color:#666;border-bottom:2px solid transparent;text-decoration:none}
.vtabs a.on{color:#000;font-weight:500;border-bottom-color:#000}
.vmain{padding:22px 24px 26px;background:#fafafa}
.filters{display:flex;gap:10px;margin-bottom:16px}
.inp{border:1px solid #e0e0e0;background:#fff;border-radius:7px;padding:8px 12px;font-size:13px;color:#171717}
.inp.grow{flex:1}
.inp .ph{color:#a0a0a0}
.dep{background:#fff;border:1px solid #ebebeb;border-radius:9px;padding:15px 18px;margin-bottom:10px;display:flex;align-items:center;gap:16px}
.dep .st{display:flex;align-items:center;gap:7px;font-size:13px;color:#171717;width:88px}
.dot{width:8px;height:8px;border-radius:50%;background:#0070f3}.dot.g{background:#45a557}.dot.a{background:#f5a623}
.dep .mid{flex:1;min-width:0}
.dep .mid b{display:block;font-size:13.5px;color:#171717;font-weight:500;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dep .mid span{font-size:12.5px;color:#8f8f8f;display:block}
.pill{display:inline-block;border:1px solid #e0e0e0;border-radius:20px;padding:2px 10px;font-size:11.5px;color:#666;background:#fafafa}
.pill.prod{border-color:#000;color:#000;font-weight:600}
`;
shots.push(['vercel-deployments', page(VC, `
<div class="win">${chrome('vercel.com/<b>satis-group/satis-group-website/deployments</b>')}
<div class="v">
 <div class="vtop"><div class="lg"></div><b>satis-group</b><span class="crumb">/</span><b>satis-group-website</b></div>
 <div class="vtabs"><a>Project</a><a class="on hl">Deployments</a><a>Analytics</a><a>Speed Insights</a><a>Logs</a><a>Settings</a><span class="tag" style="right:24px;top:14px">STEP 1 &mdash; OPEN DEPLOYMENTS</span></div>
 <div class="vmain">
  <div class="filters">
   <div class="inp grow hl" style="position:relative">&#128269; <span style="color:#171717">claude/</span><span class="ph">— filter by branch</span><span class="tag" style="right:10px;top:7px">STEP 2 &mdash; TYPE THE BRANCH NAME</span></div>
   <div class="inp">Status &#9662;</div><div class="inp">Environment &#9662;</div>
  </div>
  <div class="dep hl" style="position:relative">
   <div class="st"><span class="dot g"></span>Ready</div>
   <div class="mid"><b>Newsletter signup wording on the contact page</b>
    <span>&#9663; claude/newsletter-copy-a4f2 &middot; 2m ago by claude</span></div>
   <div class="pill">Preview</div>
   <span class="tag" style="right:120px;top:22px">STEP 3 &mdash; CLICK THE DEPLOYMENT</span></div>
  <div class="dep"><div class="st"><span class="dot a"></span>Building</div>
   <div class="mid"><b>Add The Foundry to the portfolio</b><span>&#9663; claude/foundry-listing-9c31 &middot; 40s ago by claude</span></div><div class="pill">Preview</div></div>
  <div class="dep"><div class="st"><span class="dot g"></span>Ready</div>
   <div class="mid"><b>Cover the newsletter signup list in the privacy policy</b><span>&#9663; main &middot; 6h ago by claude</span></div><div class="pill prod">Production</div></div>
 </div></div></div>`)]);

/* ---------- 5. Vercel deployment detail: Visit ---------- */
shots.push(['vercel-preview-url', page(VC + `
.hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.hd h2{font-size:19px;font-weight:600;color:#171717}
.vbtn{background:#000;color:#fff;border-radius:7px;padding:9px 20px;font-size:13.5px;font-weight:500}
.vbtn.g{background:#fff;color:#171717;border:1px solid #e0e0e0}
.panel2{background:#fff;border:1px solid #ebebeb;border-radius:9px;padding:20px 22px}
.k{font-size:11.5px;letter-spacing:.05em;color:#8f8f8f;margin-bottom:6px}
.vlink{font-size:14px;color:#0070f3;word-break:break-all;margin-bottom:16px}
`, `
<div class="win">${chrome('vercel.com/<b>satis-group/satis-group-website/DpQ8x2Kv</b>')}
<div class="v">
 <div class="vtop"><div class="lg"></div><b>satis-group</b><span class="crumb">/</span><b>satis-group-website</b><span class="crumb">/</span><span class="crumb">DpQ8x2Kv</span></div>
 <div class="vtabs"><a>Project</a><a class="on">Deployments</a><a>Analytics</a><a>Speed Insights</a><a>Logs</a><a>Settings</a></div>
 <div class="vmain">
  <div class="hd"><h2>Deployment &middot; <span style="font-weight:400;color:#666">Preview</span></h2>
   <div style="display:flex;gap:9px"><div class="vbtn g">Instant Rollback</div>
    <div class="hl" style="position:relative"><div class="vbtn">Visit &#8599;</div><span class="tag" style="right:0;top:-28px">STEP 4 &mdash; OPENS THE PREVIEW SITE</span></div></div></div>
  <div class="panel2">
   <div class="k">STATUS</div><div style="font-size:14px;margin-bottom:16px"><span class="dot g" style="display:inline-block"></span> Ready &middot; built in 1m 12s</div>
   <div class="k">DOMAINS</div>
   <div class="vlink hl" style="position:relative;display:inline-block">satis-group-website-git-claude-newsletter-copy-a4f2-satis-group.vercel.app
     <span class="tag" style="left:100%;margin-left:14px;top:3px">THE SHAREABLE PREVIEW LINK &mdash; SEND IT TO ANYONE</span></div>
   <div class="k">SOURCE</div><div style="font-size:14px;margin-bottom:16px">&#9663; claude/newsletter-copy-a4f2 &nbsp;&middot;&nbsp; <span style="color:#8f8f8f">3f9ac21</span> Newsletter signup wording on the contact page</div>
   <div class="k">ENVIRONMENT</div><div style="font-size:14px">Preview &mdash; not the live site</div>
  </div>
 </div></div></div>`)]);

/* ---------- 6. GitHub PR: Vercel bot comment ---------- */
shots.push(['vercel-pr-comment', page(GH + `
.prwrap{padding:24px 24px 30px;background:#fff}
.prtitle{font-size:21px;color:#1f2328;font-weight:500;margin-bottom:4px}
.prtitle span{color:#8c959f;font-weight:400}
.prmeta{font-size:12.5px;color:#656d76;margin-bottom:20px}
.cmt{border:1px solid #d0d7de;border-radius:8px;overflow:hidden}
.cmthead{background:#f6f8fa;border-bottom:1px solid #d0d7de;padding:9px 14px;font-size:13px;color:#1f2328}
.cmthead b{font-weight:600}
.cmtbody{padding:16px}
table{border-collapse:collapse;width:100%;font-size:13px}
th{background:#f6f8fa;text-align:left;padding:8px 12px;border:1px solid #d0d7de;color:#1f2328;font-weight:600}
td{padding:10px 12px;border:1px solid #d0d7de;color:#1f2328}
a.lnk{color:#0969da;text-decoration:none;font-weight:500}
`, `
<div class="win">${chrome('github.com/<b>Satisgroup-1/satis-group-website/pull/70</b>')}
<div class="gh"><div class="ghhead">&#9679; <b>GitHub</b> &nbsp;<span style="opacity:.7">Satisgroup-1 / satis-group-website</span></div>
<div class="prwrap">
 <div class="prtitle">Newsletter signup wording on the contact page <span>#70</span></div>
 <div class="prmeta">&#9679; Open &nbsp;&middot;&nbsp; claude wants to merge 1 commit into <b>main</b> from <b>claude/newsletter-copy-a4f2</b></div>
 <div class="cmt hl" style="position:relative">
  <div class="cmthead"><b>vercel</b> bot commented 2 minutes ago</div>
  <div class="cmtbody">
   <p style="font-size:13.5px;color:#1f2328;margin-bottom:12px">The latest updates on your project:</p>
   <table><tr><th>Name</th><th>Status</th><th>Preview</th><th>Updated</th></tr>
   <tr><td>satis-group-website</td><td>&#9989; Ready</td><td><a class="lnk">Visit Preview</a> &nbsp;&middot;&nbsp; <a class="lnk">Comment</a></td><td>2 minutes ago</td></tr></table>
  </div>
  <span class="tag" style="right:14px;top:8px">THE QUICKEST ROUTE &mdash; NO VERCEL LOGIN NEEDED</span>
 </div>
</div></div></div>`)]);

/* ---------- 7. Claude Code session: slash menu of skills ---------- */
shots.push(['claude-skills-slash', page(CLAUDE_CSS + `
.sess{display:flex;background:#faf9f7}
.side{width:172px;border-right:1px solid #ececea;padding:18px 12px}
.side .nb{background:#B3400C;color:#fff;border-radius:8px;padding:9px;font-size:13px;text-align:center;font-weight:600;margin-bottom:16px}
.side .it{font-size:12.5px;color:#6c6c66;padding:7px 9px;border-radius:6px;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.side .it.on{background:#efece7;color:#1a1a18}
.conv{flex:1;padding:22px 26px;display:flex;flex-direction:column}
.repo2{display:inline-flex;align-items:center;gap:8px;border:1px solid #e6e4e0;border-radius:20px;padding:5px 13px;font-size:12.5px;color:#3d3d3a;background:#fff;margin-bottom:18px;align-self:flex-start}
.menu{border:1px solid #e0ded9;border-radius:11px;background:#fff;box-shadow:0 6px 24px rgba(0,0,0,.09);overflow:hidden;margin-bottom:10px}
.mi{display:flex;gap:12px;padding:9px 15px;align-items:baseline;border-bottom:1px solid #f5f3f0}
.mi:last-child{border-bottom:none}
.mi b{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;color:#B3400C;font-weight:600;width:190px;flex:none}
.mi span{font-size:12.5px;color:#7c7c76;line-height:1.4}
.mi.sel{background:#faf7f4}
.mhead{padding:7px 15px;font-size:10.5px;letter-spacing:.09em;color:#9a9a94;background:#faf9f7;border-bottom:1px solid #f0eeeb;font-weight:600}
.box{border:1px solid #dcdad5;border-radius:12px;padding:13px 15px;background:#fff;font-size:14px;color:#1a1a18;display:flex;align-items:center}
.caret{display:inline-block;width:1.5px;height:17px;background:#1a1a18;margin-left:2px}
`, `
<div class="win">${chrome('claude.ai/<b>code</b>')}
<div class="sess">
 <div class="side"><div class="nb">+ New session</div>
  <div class="it on">Newsletter signup wording</div><div class="it">Foundry portfolio card</div><div class="it">Fix contact page typo</div><div class="it">Accessibility sweep</div></div>
 <div class="conv">
  <div class="repo2">&#128193; Satisgroup-1/satis-group-website &nbsp;&#9663; main</div>
  <div class="menu hl" style="position:relative">
   <div class="mhead" style="display:flex;justify-content:space-between;align-items:center">SKILLS IN THIS REPOSITORY &mdash; 105 AVAILABLE<span style="background:#B3400C;color:#fff;font-size:10.5px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:4px">TYPE &ldquo;/&rdquo; TO SEE THE WHOLE CATALOGUE</span></div>
   <div class="mi sel"><b>/accessibility-audit</b><span>Run a full WCAG accessibility audit and fix what it finds.</span></div>
   <div class="mi"><b>/seo-audit-orchestration</b><span>Run the whole SEO audit suite and collate the findings.</span></div>
   <div class="mi"><b>/design-standards</b><span>Check a page against the site's spacing, contrast and type rules.</span></div>
   <div class="mi"><b>/code-review</b><span>Review the current change for bugs and security issues.</span></div>
   <div class="mi"><b>/content-and-copy</b><span>Write or edit page copy in the house voice.</span></div>
   <div class="mi"><b>/brand-style-guide</b><span>Build or audit the brand guidelines document.</span></div>
  </div>
  <div class="box">/<span class="caret"></span></div>
 </div></div></div>`)]);

/* ---------- 8. claude.ai Settings > Capabilities > Skills ---------- */
shots.push(['claude-skills-settings', page(CLAUDE_CSS, `
<div class="win">${chrome('claude.ai/<b>settings/capabilities</b>')}
<div class="cl">
 <div class="snav"><h4>SETTINGS</h4><a>Profile</a><a>Appearance</a>
  <a class="on hl" style="position:relative">Capabilities<span class="tag" style="left:98px;top:6px">STEP 1</span></a>
  <a>Connectors</a><a>Claude Code</a><a>Data controls</a><a>Account</a></div>
 <div class="body">
  <h1>Capabilities</h1>
  <p class="sub">Turn features on for your account. Skills need code execution switched on first.</p>
  <div class="card" style="margin-bottom:22px"><div class="tx"><b>Code execution and file creation</b><span>Required before any skill can run.</span></div><div class="sw on"><i></i></div></div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
    <h1 style="font-size:16px;position:relative" class="hl">Skills<span class="tag" style="left:74px;top:2px">STEP 2 &mdash; TOGGLE WHAT YOU WANT</span></h1>
    <div class="btn g">Browse skills &#8599;</div></div>
  <p class="sub" style="margin-bottom:10px">Skills enabled here travel with your account into every Claude Code session.</p>
  <div class="row"><div class="tx"><b>pptx</b><span>Create and edit PowerPoint decks.</span></div><div class="sw on"><i></i></div></div>
  <div class="row"><div class="tx"><b>xlsx</b><span>Create and edit spreadsheets.</span></div><div class="sw on"><i></i></div></div>
  <div class="row"><div class="tx"><b>docx</b><span>Create and edit Word documents.</span></div><div class="sw on"><i></i></div></div>
  <div class="row" style="border-bottom:none"><div class="tx"><b>pdf</b><span>Read and fill PDF files.</span></div><div class="sw"><i></i></div></div>
 </div></div></div>`)]);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ deviceScaleFactor: 2 });
for (const [name, html] of shots) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1000, height: 800 });
  await p.setContent(html, { waitUntil: 'load' });
  const el = await p.$('.win');
  await el.screenshot({ path: OUT + name + '.png' });
  console.log('wrote', name);
  await p.close();
}
await browser.close();

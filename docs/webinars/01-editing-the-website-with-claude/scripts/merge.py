import os, re, shutil, zipfile, sys

S = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(S, 'unpacked')     # original 12-slide package
NEW = os.path.join(S, 'unpacked_new') # generated 6-slide package
OUT = os.path.join(S, 'out.pptx')

# fresh unpack of both
for d, z in ((SRC, 'deck.pptx'), (NEW, 'new.pptx')):
    if os.path.isdir(d): shutil.rmtree(d)
    zipfile.ZipFile(os.path.join(S, z)).extractall(d)

def rd(p): return open(p, encoding='utf-8').read()
def wr(p, s): open(p, 'w', encoding='utf-8').write(s)

# ---- generated slide index -> role
# new.pptx: 1 agenda, 2 github, 3 preview, 4 vercelnav, 5 skills, 6 recap
REPLACE = {1: 2, 7: 12}          # new slide N replaces original slide M
INSERT  = {2: 4, 3: 4, 4: 7, 5: 7, 6: 9}
INSERT_ORDER = [2, 3, 4, 5, 6]

# ---------- 1. replace slide 2 and 12 bodies ----------
for n, m in REPLACE.items():
    body = rd(f'{NEW}/ppt/slides/slide{n}.xml')
    assert 'r:embed' not in body, f'new slide {n} unexpectedly has images'
    wr(f'{SRC}/ppt/slides/slide{m}.xml', body)
    # replace the notes text too
    notes_new = rd(f'{NEW}/ppt/notesSlides/notesSlide{n}.xml')
    wr(f'{SRC}/ppt/notesSlides/notesSlide{m}.xml', notes_new)

# ---------- 2. add the four new slides ----------
ct   = rd(f'{SRC}/[Content_Types].xml')
prel = rd(f'{SRC}/ppt/_rels/presentation.xml.rels')
pres = rd(f'{SRC}/ppt/presentation.xml')

next_slide = 13
next_notes = 13
next_rid   = max(int(x) for x in re.findall(r'Id="rId(\d+)"', prel)) + 1
next_sldid = max(int(x) for x in re.findall(r'<p:sldId id="(\d+)"', pres)) + 1
media_seq  = 0
added = {}   # new-deck slide no -> (src slide filename, rId)

for n in INSERT_ORDER:
    sl = rd(f'{NEW}/ppt/slides/slide{n}.xml')
    rels = rd(f'{NEW}/ppt/slides/_rels/slide{n}.xml.rels')

    # copy media, rewrite targets
    new_rels = []
    for rid, typ, tgt in re.findall(r'<Relationship Id="([^"]+)" Type="([^"]+)" Target="([^"]+)"/>', rels):
        kind = typ.rsplit('/', 1)[1]
        if kind == 'image':
            media_seq += 1
            ext = os.path.splitext(tgt)[1]
            name = f'image-added-{media_seq}{ext}'
            shutil.copy(os.path.join(NEW, 'ppt', tgt.replace('../', '')),
                        f'{SRC}/ppt/media/{name}')
            new_rels.append((rid, typ, f'../media/{name}'))
        elif kind == 'slideLayout':
            new_rels.append((rid, typ, '../slideLayouts/slideLayout1.xml'))
        elif kind == 'notesSlide':
            new_rels.append((rid, typ, f'../notesSlides/notesSlide{next_notes}.xml'))
        else:
            raise SystemExit('unexpected rel type ' + kind)

    wr(f'{SRC}/ppt/slides/_rels/slide{next_slide}.xml.rels',
       '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
       '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
       + ''.join(f'<Relationship Id="{r}" Type="{t}" Target="{g}"/>' for r, t, g in new_rels)
       + '</Relationships>')
    wr(f'{SRC}/ppt/slides/slide{next_slide}.xml', sl)

    # notes slide + its rels
    wr(f'{SRC}/ppt/notesSlides/notesSlide{next_notes}.xml', rd(f'{NEW}/ppt/notesSlides/notesSlide{n}.xml'))
    wr(f'{SRC}/ppt/notesSlides/_rels/notesSlide{next_notes}.xml.rels',
       '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
       '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
       f'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="../slides/slide{next_slide}.xml"/>'
       '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster" Target="../notesMasters/notesMaster1.xml"/>'
       '</Relationships>')

    # content types
    ct = ct.replace('</Types>',
        f'<Override PartName="/ppt/slides/slide{next_slide}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
        f'<Override PartName="/ppt/notesSlides/notesSlide{next_notes}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/></Types>')

    # presentation rels
    rid = f'rId{next_rid}'
    prel = prel.replace('</Relationships>',
        f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{next_slide}.xml"/></Relationships>')
    added[n] = (next_slide, rid, next_sldid)
    next_rid += 1; next_sldid += 1; next_slide += 1; next_notes += 1

# ---------- 3. reorder <p:sldIdLst> ----------
lst = re.search(r'<p:sldIdLst>(.*?)</p:sldIdLst>', pres, re.S).group(1)
entries = re.findall(r'<p:sldId [^/]*/>', lst)   # index i -> original slide i+1
assert len(entries) == 12, len(entries)

def entry_for(n):
    _, rid, sid = added[n]
    return f'<p:sldId id="{sid}" r:id="{rid}"/>'

order = []
for i, e in enumerate(entries, start=1):
    order.append(e)
    for n in INSERT_ORDER:
        if INSERT[n] == i:
            order.append(entry_for(n))
pres = pres.replace(f'<p:sldIdLst>{lst}</p:sldIdLst>', '<p:sldIdLst>' + ''.join(order) + '</p:sldIdLst>')

wr(f'{SRC}/[Content_Types].xml', ct)
wr(f'{SRC}/ppt/_rels/presentation.xml.rels', prel)
wr(f'{SRC}/ppt/presentation.xml', pres)

# ---------- 4. renumber footers on shifted original slides ----------
# original slide -> new page number
RENUM = {5: '07', 6: '08', 7: '09', 8: '12', 9: '13', 10: '15', 11: '16'}
for orig, num in RENUM.items():
    p = f'{SRC}/ppt/slides/slide{orig}.xml'
    x = rd(p)
    old = f'{orig:02d}'
    marker = f'<a:t>{old}</a:t>'
    assert x.count(marker) == 1, (orig, x.count(marker))
    wr(p, x.replace(marker, f'<a:t>{num}</a:t>'))

# ---------- 5. docProps slide count ----------
app = rd(f'{SRC}/docProps/app.xml')
app = app.replace('<Slides>12</Slides>', '<Slides>17</Slides>').replace('<Notes>12</Notes>', '<Notes>17</Notes>')
app = app.replace('<vt:variant><vt:lpstr>Slide Titles</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>12</vt:i4></vt:variant>',
                  '<vt:variant><vt:lpstr>Slide Titles</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>17</vt:i4></vt:variant>')
app = app.replace('<vt:vector size="15" baseType="lpstr">', '<vt:vector size="20" baseType="lpstr">')
app = app.replace('<vt:lpstr>Slide 12</vt:lpstr>',
                  ''.join(f'<vt:lpstr>Slide {i}</vt:lpstr>' for i in range(12,18)))
wr(f'{SRC}/docProps/app.xml', app)

# ---------- 6. repack ----------
if os.path.exists(OUT): os.remove(OUT)
zf = zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED)
for root, _, files in os.walk(SRC):
    for f in files:
        full = os.path.join(root, f)
        zf.write(full, os.path.relpath(full, SRC))
zf.close()
print('wrote', OUT, '- slides:', len(order))

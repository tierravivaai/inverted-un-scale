import csv,math,json
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Patch
p=Path('/Users/pauloldham/Documents/cali-allocation-model-unscale-v3');o=Path('outputs/iusaf-distribution')
def read(f):return list(csv.DictReader(f.open()))
raw=read(p/'data-raw/UNGA_scale_of_assessment.csv');rawdict={r['Member State'].strip():r['2027'] for r in raw}
fig={r['party_name']:float(r['un_share']) for r in read(p/'figures/un_scale_distribution/fig_2_non_high_income.csv')}
rows=read(p/'country_allocations_full.csv')
master={r['party']:r.get('un_scale_name') for r in read(p/'config/party_master.csv')}
mapping={r['party_raw']:r['party_mapped'] for r in read(p/'data-raw/manual_name_map.csv')}
canonical={mapping.get(k,k):v for k,v in rawdict.items()}
missing=[]
for r in rows:
 name=r['party'];v=fig[name]; candidate=rawdict.get(master.get(name) or name,canonical.get(name))
 if candidate is not None:
  try:assert abs(float(candidate)-v)<1e-10,(name,candidate,v)
  except ValueError:assert v==0
 else:missing.append((name,v));assert v==0,(name,v)
 r['assessment']=v;r['band']=int(r['un_band'].split(':')[0].split()[1]);r['weight']=float(r['band_weight'])
print('Missing direct raw entries:',missing)
rows.sort(key=lambda r:(r['assessment'],r['party']))
assert len(rows)==142
n=np.array([sum(r['band']==b for r in rows) for b in range(1,7)]);assert list(n)==[31,59,30,18,3,1]
u=np.array([r['assessment'] for r in rows]);w=np.array([r['weight'] for r in rows]);inv=np.array([1/x if x>0 else 0 for x in u]);rawshare=100*inv/inv.sum();bandshare=100*w/w.sum();unshare=100*u/u.sum()
assert abs(rawshare.sum()-100)<1e-8 and abs(bandshare.sum()-100)<1e-8
colors=['#147D92','#48A9A6','#89B9B0','#D7AE64','#CE7950','#98465A'];cs=[colors[r['band']-1] for r in rows]
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':12,'axes.spines.top':False,'axes.spines.right':False,'axes.spines.left':False,'axes.spines.bottom':False,'svg.fonttype':'none','text.color':'#193445','axes.labelcolor':'#193445','xtick.color':'#526775','ytick.color':'#526775'})
def save(fig,name):
 for ext in ['png','svg']:fig.savefig(o/(name+'.'+ext),dpi=240,facecolor='white')
 plt.close(fig)
fig,axs=plt.subplots(3,1,figsize=(16,9));fig.subplots_adjust(left=.08,right=.97,top=.84,bottom=.22,hspace=.64)
fig.text(.08,.943,'From UN assessments to IUSAF allocations',fontsize=25,weight='bold')
fig.text(.08,.902,'Same 142 Parties • ordered by increasing UN assessment • paper’s six-band baseline',fontsize=13,color='#526775')
series=[u,rawshare,bandshare];titles=['1  UN assessment as recorded','2  Raw inversion: normalised 1 / assessment','3  Banded inversion: paper baseline, 3.75 : 1'];labels=['UN budget (%)','Allocation (%)','Allocation (%)']
for ax,vals,title,label in zip(axs,series,titles,labels):
 ax.bar(np.arange(142),vals,color=cs,width=.88,zorder=3);ax.set_xlim(-1,142);ax.set_ylabel(label,fontsize=11);ax.set_title(title,loc='left',fontsize=14,weight='bold',pad=10);ax.grid(axis='y',alpha=.18,zorder=0);ax.tick_params(length=0);ax.set_xticks([]);ax.set_ylim(0,max(vals)*1.24)
 for b in range(1,6):ax.axvline(sum(n[:b])-.5,color='#cad5db',lw=.7,zorder=1)
axs[0].annotate('China 20.004%',(141,u[-1]),xytext=(112,18),fontsize=11,arrowprops={'arrowstyle':'-','color':'#526775'})
axs[1].text(42,2.05,f'28 Parties at 0.001% receive {sum(rawshare[u==.001]):.1f}% of raw-inversion allocations',fontsize=11)
axs[2].set_xticks([0,30,60,90,120,141],['1','31','61','91','121','142'],fontsize=10)
axs[2].set_xlabel('Party position (same order in all panels)',fontsize=10)
fig.legend(handles=[Patch(color=c,label=f'Band {i+1} (n={n[i]})') for i,c in enumerate(colors)],loc='lower center',bbox_to_anchor=(.5,.119),ncol=6,frameon=False,fontsize=10)
fig.text(.08,.10,'Panels use different vertical scales. Each bar represents one Party; colours identify its IUSAF band.',fontsize=11)
fig.text(.08,.063,'Cook Islands, Niue and State of Palestine: no positive UN assessment; raw model allocation = 0, banded allocation > 0.',fontsize=10)
fig.text(.08,.033,'Source: repository UN scale, 2027 column; version 3 Party list and Table 1 weights. Pure IUSAF only; no SOSAC or TSAC.',fontsize=10,color='#526775')
save(fig,'country-distributions')
# Common 100% stacked comparison, UN assessments normalized within the same cohort.
shares=[]
for vals in [unshare,rawshare,bandshare]:shares.append([sum(v for v,r in zip(vals,rows) if r['band']==b) for b in range(1,7)])
fig,ax=plt.subplots(figsize=(16,9));fig.subplots_adjust(left=.22,right=.96,top=.76,bottom=.29)
fig.text(.07,.93,'How the distribution shifts between bands',fontsize=25,weight='bold')
fig.text(.07,.882,'Each bar totals 100% within the same 142-Party scenario',fontsize=15,color='#526775')
for j,vals in enumerate(shares):
 left=0
 for i,v in enumerate(vals):
  ax.barh(2-j,v,left=left,height=.48,color=colors[i]);
  if v>=4:ax.text(left+v/2,2-j,f'{v:.1f}%',ha='center',va='center',fontsize=15,color='white' if i in [0,5] else '#142f40',weight='bold')
  left+=v
ax.set_yticks([2,1,0],['UN assessment\n(within cohort)','Raw inversion','Banded inversion'],fontsize=15);ax.set_xlim(0,100);ax.set_xticks([0,25,50,75,100],['0%','25%','50%','75%','100%']);ax.tick_params(length=0,pad=12)
fig.legend(handles=[Patch(color=c,label=f'Band {i+1} (n={n[i]})') for i,c in enumerate(colors)],loc='lower center',bbox_to_anchor=(.5,.19),ncol=6,frameon=False,fontsize=12)
fig.text(.07,.137,f'The 142 Parties account for {u.sum():.3f}% of the full UN assessment scale; the first bar rescales that subtotal to 100%.',fontsize=11)
fig.text(.07,.098,'Raw inversion excludes three zero/no-assessment Parties from its denominator and assigns them zero, following the original model.',fontsize=11)
fig.text(.07,.058,'Source: UN scale, 2027 column; version 3 membership; paper weights 1.50, 1.30, 1.10, 0.95, 0.75, 0.40. No SOSAC or TSAC.',fontsize=10,color='#526775')
save(fig,'band-share-comparison')
with (o/'figure-data.csv').open('w') as f:
 writer=csv.writer(f);writer.writerow(['Party','ISO3','Band','UN assessment percent','UN share within cohort percent','Raw inversion allocation percent','Banded allocation percent'])
 for i,r in enumerate(rows):writer.writerow([r['party'],r['iso3c'],r['band'],u[i],unshare[i],rawshare[i],bandshare[i]])
(o/'README.md').write_text('''# UN scale → raw inversion → banded inversion

Two 16:9 figures, each supplied as a high-resolution PNG and an SVG. Insert PNG into PowerPoint for predictable appearance; SVG remains sharp when resized and can be converted to editable shapes in compatible PowerPoint versions.

`country-distributions` shows one bar per Party, in the same ascending-assessment order in all three panels. Vertical scales differ and are explicitly labelled. The first panel retains actual UN percentages, without rescaling. The next two show normalized allocation percentages, not dollars. Multiply allocation percent by USD 10 million for a USD 1 billion fund.

`band-share-comparison` uses 100% stacked bars grouped by the paper's bands. The original UN assessment subtotal is normalized within the 142-Party cohort for this figure only. This chart shows total band shares, not allocations per Party; larger band membership affects segment size. It cannot be used to assess per-Party monotonicity.

Data: local cali-allocation-model-unscale-v3/data-raw/UNGA_scale_of_assessment.csv, column 2027; country_allocations_full.csv provides the 142-Party membership and band weights. The existing fig_2_non_high_income.csv provides canonical-name matching; all positive assessment values were checked against the raw source using repository name mappings.

Cook Islands, Niue and State of Palestine have no positive UN assessment. Raw 1/0 is undefined; following the original model, they receive zero and are excluded from normalization of reciprocal weights. This is a model convention, not the mathematical inverse of zero. Banded inversion assigns them Band 1 weight 1.50. They remain visible in the fixed 142-Party cohort.

Baseline weights: [1.50,1.30,1.10,0.95,0.75,0.40]; counts: [31,59,30,18,3,1]. No stewardship allocation. Data are a repository snapshot, not an updated eligibility assessment.

figure-data.csv contains the unrounded plotted values. All normalized series sum to 100% within numerical precision.
''')
print('UN total',u.sum(),'stacked',shares)

full=[]
for r in raw:
 try:v=float(r['2027'])
 except (ValueError,TypeError):continue
 if v>0 and r['Member State'].strip()!='Total':full.append((r['Member State'].strip(),v))
full.sort(key=lambda t:t[1]);assert len(full)==193,len(full)
fig,ax=plt.subplots(figsize=(16,9));fig.subplots_adjust(left=.08,right=.97,top=.78,bottom=.22)
fig.text(.08,.93,'The full UN assessment distribution',fontsize=25,weight='bold')
fig.text(.08,.878,'All 193 assessed Member States • original percentages • 2027 column',fontsize=15,color='#526775')
ax.bar(range(len(full)),[v for _,v in full],color=['#98465A' if name=='China' else '#147D92' for name,v in full],width=.88)
ax.set_xticks([0,49,99,149,192],['1','50','100','150','193']);ax.set_ylabel('UN budget assessment (%)');ax.set_xlabel('Member State position, ordered by increasing assessment');ax.set_ylim(0,27);ax.set_xlim(-1,194);ax.grid(axis='y',alpha=.18);ax.set_axisbelow(True)
for k in [-1,-2,-3]:
 idx=len(full)+k;name,v=full[k];label={'United States of America':'United States','China':'China','Japan':'Japan'}.get(name,name)
 ax.annotate(f'{label}  {v:.3f}%',(idx,v),xytext=(idx-38,v+2),fontsize=12,arrowprops={'arrowstyle':'-','color':'#526775'})
fig.text(.08,.12,'This full-source view includes countries outside the 142-Party IUSAF scenario.',fontsize=12)
fig.text(.08,.075,'The companion three-panel and stacked figures hold the IUSAF membership fixed for comparison.',fontsize=12)
fig.text(.08,.035,'Source: data-raw/UNGA_scale_of_assessment.csv, 2027 column. Positive assessments only; aggregate Total row excluded.',fontsize=10,color='#526775')
save(fig,'full-un-assessment-distribution')

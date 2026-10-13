const B=document.body,P=document.querySelector('.paper'),T=(f,ms)=>setTimeout(f,ms);
function print(){B.classList.remove('closed','printed');void P.offsetWidth;B.classList.add('printing')}
P.addEventListener('animationend',()=>{B.classList.remove('printing');B.classList.add('printed')});
T(()=>B.classList.add('show'),300);
T(()=>B.classList.add('dissolve'),3400);
T(()=>B.classList.add('machine'),4600);
T(print,5800);
document.querySelector('.x').onclick=()=>{B.classList.remove('printed','printing');B.classList.add('closed')};
document.getElementById('again').onclick=print;
addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('#cart.open,#rcpt.open'))location.hash='receipt'});

const ROWS=[["A Little Something", "about", 654], ["Compliments of the House", "house", 761], ["More Than Whats on the Menu", "menu", 868], ["The Place to Be", "place", 975], ["Advertising You Take Home", "work", 1082], ["Designed to Feel Old", "process", 1189], ["Proof I was here", "proof", 1296], ["A little Something (50)", "fifty", 1403]],pop=document.getElementById('pop'),pp=pop.querySelector('.pp');
ROWS.forEach(r=>{const a=document.createElement('a');a.className='hot';a.href='#'+r[1];a.style.top=((r[2]-52)/1854*100).toFixed(2)+'%';a.setAttribute('aria-label',r[0]);pp.insertBefore(a,pp.querySelector('.x'))});
/* Pressing the title at the top of the popup receipt goes back to the printer page and prints again */
(()=>{const a=document.createElement('a');a.className='hot hd';a.href='#receipt';a.setAttribute('aria-label','Back to the receipt');pp.insertBefore(a,pp.querySelector('.x'))})();
addEventListener('hashchange',()=>{if(location.hash==='#receipt'){B.classList.remove('printing','printed','closed');setTimeout(print,250)}});
const openPop=()=>{pop.querySelector('img').src=document.querySelector('.paper img').src;pop.classList.remove('open');void pop.offsetWidth;pop.classList.add('open');document.body.classList.add('popopen')},closePop=()=>{pop.classList.remove('open');document.body.classList.remove('popopen')};
document.addEventListener('click',e=>{if(e.target.closest('[data-open]'))openPop();else if(e.target.closest('#pop .x,#pop .hot')||(pop.classList.contains('open')&&!e.target.closest('.pp')))closePop()});
addEventListener('hashchange',closePop);
addEventListener('keydown',e=>{if(e.key==='Escape')closePop()});

/* Auto-trim: for matchbook images marked data-autotrim, measure the empty space
   around the picture and trim it so the top lines up with the body text.
   (Needs the page to be served, e.g. VS Code Live Server. Opening the file directly
   just skips this step.) */
document.querySelectorAll('.mbw[data-autotrim] img').forEach(img=>{
  const run=()=>{try{
    const w=img.naturalWidth,h=img.naturalHeight,sc=Math.min(1,400/Math.max(w,h));
    const cw=Math.round(w*sc),ch=Math.round(h*sc);
    const c=document.createElement('canvas');c.width=cw;c.height=ch;
    const g=c.getContext('2d');g.drawImage(img,0,0,cw,ch);
    const d=g.getImageData(0,0,cw,ch).data;
    let x0=cw,y0=ch,x1=0,y1=0;
    for(let y=0;y<ch;y++)for(let x=0;x<cw;x++){const i=(y*cw+x)*4;
      if(d[i+3]>8&&Math.min(d[i],d[i+1],d[i+2])<235){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y;}}
    if(x1<=x0||y1<=y0)return;
    x0/=sc;y0/=sc;x1=Math.min(w,x1/sc+14);y1=Math.min(h,y1/sc+16);
    const bw=x1-x0,bh=y1-y0,p=img.parentElement.style;
    p.setProperty('--cw',bw);p.setProperty('--ch',bh);p.setProperty('--iw',w/bw);p.setProperty('--il',-x0/bw);p.setProperty('--it',-y0/bh);
  }catch(e){}};
  img.complete?run():img.addEventListener('load',run);
});

/* ---------- Shop: "A little Something (50)" ---------- */
(function(){
  const shop=document.getElementById('fifty');if(!shop)return;
  const tiles=[...shop.querySelectorAll('.tile')];
  const $=id=>document.getElementById(id);
  const cart=$('cart'),list=$('cartlist'),cnt=$('cartn'),btn=$('cartbtn'),go=$('cartgo'),rc=$('rcpt'),paper=$('rpaper'),wrap=$('rwrap');
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  let sel=[];
  try{sel=JSON.parse(localStorage.getItem('als-cart')||'[]').filter(n=>Number.isInteger(n)&&tiles[n-1])}catch(e){}
  const save=()=>{try{localStorage.setItem('als-cart',JSON.stringify(sel))}catch(e){}};
  const nm=n=>tiles[n-1].dataset.name,src=n=>tiles[n-1].querySelector('img').src;
  function render(){
    tiles.forEach((t,i)=>{const on=sel.includes(i+1);t.classList.toggle('on',on);t.setAttribute('aria-pressed',on);t.querySelector('.chip').textContent=on?'added ✓':'+ add'});
    cnt.textContent=sel.length;
    list.innerHTML=sel.length?sel.map(n=>`<li><img src="${src(n)}" alt=""><span>${esc(nm(n))}</span><button data-rm="${n}" aria-label="Remove ${esc(nm(n))}">&times;</button></li>`).join(''):'<li class="empty">Nothing yet. Add a little something.</li>';
    go.disabled=!sel.length;
  }
  const toggle=n=>{const i=sel.indexOf(n);i<0?sel.push(n):sel.splice(i,1);save();render()};
  tiles.forEach((t,i)=>t.addEventListener('click',()=>toggle(i+1)));
  list.addEventListener('click',e=>{const b=e.target.closest('[data-rm]');if(b)toggle(+b.dataset.rm)});
  const openCart=()=>cart.classList.add('open'),closeCart=()=>cart.classList.remove('open');
  btn.addEventListener('click',()=>cart.classList.toggle('open'));
  $('cartx').addEventListener('click',closeCart);
  $('cartclr').addEventListener('click',()=>{sel=[];save();render()});
  document.addEventListener('click',e=>{if(cart.classList.contains('open')&&!cart.contains(e.target)&&!btn.contains(e.target))closeCart()});
  function receipt(){
    const n=sel.length,order=Math.floor(100+Math.random()*900);
    const when=new Date().toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
    paper.innerHTML='<div class="rhead">A little something</div>'
      +'<div class="rl"><span>Server: Yeonwoo Kang</span><span>Table: 08</span></div><div class="rd"></div>'
      +'<div>Order: #'+order+'</div><div class="rd"></div>'
      +'<div class="rcol"><span>Qty</span><span>Item</span></div>'
      +sel.map(k=>'<div class="rit"><span>1</span><span>'+esc(nm(k))+'</span><span>$0.00</span></div>').join('')
      +'<div class="rd"></div><div class="rsum"><span>SubTotal</span><span>0.00</span><span>Tax</span><span>0.00</span><span>Total</span><span>0.00</span></div>'
      +'<div class="rfoot">'+n+' little '+(n===1?'something':'somethings')+', compliments of the house.<br>'+esc(when)+'<br>Thank you. Keep them.</div>';
    const dur=Math.min(7,2.2+n*0.16);
    paper.style.setProperty('--dur',dur+'s');paper.style.setProperty('--st',Math.round(dur*14));
    paper.classList.remove('go');void paper.offsetWidth;wrap.scrollTop=0;
    rc.classList.add('open');void paper.offsetWidth;paper.classList.add('go');
  }
  const closeRc=()=>{rc.classList.remove('open');paper.classList.remove('go')};
  go.addEventListener('click',()=>{if(!sel.length)return;closeCart();receipt()});
  $('rcx').addEventListener('click',closeRc);$('rkeep').addEventListener('click',closeRc);
  $('rclear').addEventListener('click',()=>{sel=[];save();render();closeRc()});
  addEventListener('keydown',e=>{if(e.key==='Escape'){if(rc.classList.contains('open'))closeRc();else closeCart()}});
  addEventListener('hashchange',()=>{closeCart();closeRc()});
  render();
})();

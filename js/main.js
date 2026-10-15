'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const IMG='assets/images/';
/* DEMO catalogue — names, prices, ratings are sample data */
const PRODUCTS=[
{id:1,name:'IronCrease Pro Series Cricket Bat',cat:'bats',price:38500,old:44000,img:'bat.jpg',contain:1,badge:'Best Seller',rating:4.8,desc:'A balanced bat built around control and pickup. Demo listing.'},
{id:2,name:'IronCrease Elite Batting Gloves',cat:'gloves',price:8900,img:'gloves.jpg',badge:'New',rating:4.6,desc:'Segmented protection with a secure, comfortable fit. Demo listing.'},
{id:3,name:'IronCrease Performance Leg Guards',cat:'pads',price:14500,old:16500,img:'pads.jpg',badge:'Protection',rating:4.7,desc:'Lightweight batting pads with strapped, adjustable fit. Demo listing.'},
{id:4,name:'IronCrease Match Cricket Ball',cat:'balls',price:2200,img:'ball.jpg',badge:'Match',rating:4.5,desc:'A seamed match ball for consistent bounce and carry. Demo listing.'},
{id:5,name:'IronCrease Professional Wicketkeeping Gloves',cat:'wk',price:9800,img:'wk.jpg',rating:4.6,desc:'Padded keeping gloves for secure catching. Demo listing.'},
{id:6,name:'IronCrease Training Accessories',cat:'acc',price:6500,img:'accessories.jpg',badge:'Kit',rating:4.4,desc:'Helmet, cap, thigh guard and gloves for training sessions. Demo listing.'}];
const GROUPS={gear:['gloves','pads','wk']};
const pkr=n=>'PKR '+n.toLocaleString('en-PK');
const stars=r=>'★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));
let cart={};try{cart=JSON.parse(localStorage.getItem('ic-cart'))||{}}catch(e){}
const save=()=>{try{localStorage.setItem('ic-cart',JSON.stringify(cart))}catch(e){}};
const cls=p=>p.contain?' class="contain"':'';
/* toast */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),1800)}
/* products */
function render(filter='all'){
  const list=PRODUCTS.filter(p=>filter==='all'||p.cat===filter||(GROUPS[filter]||[]).includes(p.cat));
  $('#grid').innerHTML=list.map(p=>`<article class="card"><button class="pimg" data-qv="${p.id}" aria-label="Quick view: ${p.name}"><img${cls(p)} loading="lazy" src="${IMG+p.img}" alt="${p.name}">${p.badge?`<span class="badge">${p.badge}</span>`:''}</button>
  <div class="pbody"><h3>${p.name}</h3><div class="rt"><span class="stars" aria-label="${p.rating} out of 5">${stars(p.rating)}</span> <small>(sample)</small></div>
  <div class="price">${pkr(p.price)}${p.old?`<s>${pkr(p.old)}</s>`:''}</div>
  <div class="pact"><button class="btn ghost" data-qv="${p.id}">Quick View</button><button class="btn" data-add="${p.id}">Add to Cart</button></div></div></article>`).join('');
  $$('.filters button').forEach(b=>b.classList.toggle('on',b.dataset.filter===filter));
  observe();
}
/* cart */
function drawCart(){
  const ids=Object.keys(cart).filter(i=>PRODUCTS.some(p=>p.id==i));let total=0,n=0;
  $('#cartItems').innerHTML=ids.length?ids.map(i=>{const p=PRODUCTS.find(x=>x.id==i),q=cart[i];total+=p.price*q;n+=q;
    return `<div class="ci"><img${cls(p)} src="${IMG+p.img}" alt="${p.name}"><div><b>${p.name}</b><div>${pkr(p.price)}</div><div class="qty"><button data-dec="${i}" aria-label="Decrease quantity">−</button><span aria-live="polite">${q}</span><button data-inc="${i}" aria-label="Increase quantity">+</button><button class="rm" data-rm="${i}">Remove</button></div></div></div>`}).join(''):'<p class="note">Your cart is empty.</p>';
  $('#subtotal').textContent=pkr(total);$('#cartCount').textContent=n;
}
const change=(id,d)=>{cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];save();drawCart()};
function cartOpen(o){$('#drawer').classList.toggle('on',o);$('#scrim').classList.toggle('on',o);$('#drawer').setAttribute('aria-hidden',!o);if(o)$('#cartClose').focus();else $('#cartBtn').focus()}
/* quick view */
function quick(id){const p=PRODUCTS.find(x=>x.id==id),d=$('#qv');
  d.innerHTML=`<div class="qvb"><img${cls(p)} src="${IMG+p.img}" alt="${p.name}"><div><button class="icon x" aria-label="Close" data-close>✕</button><span class="mono">${p.cat}</span><h2>${p.name}</h2><span class="stars">${stars(p.rating)} <small>(sample)</small></span><p class="lead">${p.desc}</p><div class="price">${pkr(p.price)}${p.old?`<s>${pkr(p.old)}</s>`:''}</div><button class="btn" data-add="${p.id}" data-close>Add to Cart <i>→</i></button></div></div>`;d.showModal()}
/* events */
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-add],[data-qv],[data-inc],[data-dec],[data-rm],[data-filter],[data-close]');if(!t)return;
  if(t.dataset.add){change(t.dataset.add,1);toast('Added to cart');}
  if(t.dataset.qv)quick(t.dataset.qv);
  if(t.dataset.inc)change(t.dataset.inc,1);if(t.dataset.dec)change(t.dataset.dec,-1);if(t.dataset.rm)change(t.dataset.rm,-t.dataset.rm*0-cart[t.dataset.rm]);
  if(t.dataset.filter&&!t.matches('.filters button')){render(t.dataset.filter);closeMenu();$('#sd').open&&$('#sd').close()}
  else if(t.matches('.filters button'))render(t.dataset.filter);
  if(t.dataset.close&&$('#qv').open)$('#qv').close();
});
$('#cartBtn').onclick=()=>cartOpen(true);$('#cartClose').onclick=()=>cartOpen(false);$('#scrim').onclick=()=>{cartOpen(false);closeMenu()};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){cartOpen(false);closeMenu()}});
$('#checkout').onclick=()=>{$('#checkMsg').textContent=Object.keys(cart).length?'Demo only: checkout and payments are not connected to a real service.':'Your cart is empty.'};
/* menu */
const burger=$('#burger'),menu=$('#menu');
function closeMenu(){menu.classList.remove('on');burger.setAttribute('aria-expanded','false');$('#scrim').classList.remove('on')}
burger.onclick=()=>{const o=!menu.classList.contains('on');menu.classList.toggle('on',o);burger.setAttribute('aria-expanded',o);$('#scrim').classList.toggle('on',o)};
$$('#menu a').forEach(a=>a.addEventListener('click',closeMenu));
/* search */
$('#searchBtn').onclick=()=>{$('#sd').showModal();$('#q').focus()};
$('#q').oninput=e=>{const v=e.target.value.trim().toLowerCase();
  const r=v?PRODUCTS.filter(p=>(p.name+p.cat+p.desc).toLowerCase().includes(v)):[];
  $('#results').innerHTML=v?(r.length?r.map(p=>`<button data-qv="${p.id}"><span>${p.name}</span><span>${pkr(p.price)}</span></button>`).join(''):'<p>No products found.</p>'):'';};
$('#results').addEventListener('click',e=>{if(e.target.closest('[data-qv]'))$('#sd').close()});
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
/* newsletter (frontend demo — nothing is stored) */
$('#newsForm').onsubmit=e=>{e.preventDefault();const v=$('#email').value.trim(),m=$('#newsMsg');
  if(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.className='ok';m.textContent='Valid email. Demo only: no subscription service is connected yet, so nothing was saved.'}
  else{m.className='err';m.textContent='Please enter a valid email address.'}};
/* nav state, reveal, tilt, parallax */
const nav=$('#nav');const heroImg=$('.hero-img');const onScroll=()=>{nav.classList.toggle('solid',scrollY>40);
  if(!reduce&&heroImg)heroImg.style.setProperty('--p',Math.min(1,Math.max(0,scrollY/(innerHeight*.8))).toFixed(3));
  if(!reduce)$$('[data-parallax]').forEach(el=>{const r=el.parentElement.getBoundingClientRect();el.style.transform=`translateY(${r.top*-.08}px)`})};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
addEventListener('scroll',onScroll,{passive:true});
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
function observe(){$$('.rv:not(.in)').forEach((el,i)=>{if(!io){el.classList.add('in');return}el.style.transitionDelay=(i%4)*70+'ms';io.observe(el)})}
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
  document.addEventListener('pointermove',e=>{const t=e.target.closest?.('.tilt');$$('.tilt').forEach(x=>{if(x!==t)x.style.transform=''});
    if(!t)return;const r=t.getBoundingClientRect(),d=+t.dataset.depth||6,px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
    t.style.transform=`perspective(900px) rotateY(${px*d}deg) rotateX(${-py*d}deg)`});
  document.addEventListener('pointerleave',()=>$$('.tilt').forEach(x=>x.style.transform=''),true)}
/* active link */
const secs=$$('main section[id]');addEventListener('scroll',()=>{let c='home';secs.forEach(s=>{if(s.getBoundingClientRect().top<200)c=s.id});$$('#menu a').forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+c&&!a.dataset.filter||(c==='shop'&&a.textContent==='Shop')))},{passive:true});
render();drawCart();onScroll();

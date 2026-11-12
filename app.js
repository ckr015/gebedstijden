(function(){
'use strict';

// Op een eigen adres (GitHub Pages) mogen locatie, kompas, agenda-bestanden en offline-opslag. Binnen Claude niet.
var OWN = /(^|\.)github\.io$|^localhost$|^127\.0\.0\.1$/.test(window.location.hostname);

/* ---------- vaste gegevens ---------- */
var NL='Europe/Amsterdam', BE='Europe/Brussels', DE='Europe/Berlin', TR='Europe/Istanbul';
var CITIES=[
['Amsterdam',52.3676,4.9041,NL],['Rotterdam',51.9244,4.4777,NL],['Den Haag',52.0705,4.3007,NL],['Utrecht',52.0907,5.1214,NL],['Eindhoven',51.4416,5.4697,NL],
['Tilburg',51.5555,5.0913,NL],['Groningen',53.2194,6.5665,NL],['Almere',52.3508,5.2647,NL],['Breda',51.5719,4.7683,NL],['Nijmegen',51.8126,5.8372,NL],
['Enschede',52.2215,6.8937,NL],['Arnhem',51.9851,5.8987,NL],['Haarlem',52.3874,4.6462,NL],['Zaandam',52.4420,4.8292,NL],['Amersfoort',52.1561,5.3878,NL],
['Apeldoorn',52.2112,5.9699,NL],['Den Bosch',51.6978,5.3037,NL],['Zwolle',52.5168,6.0830,NL],['Leiden',52.1601,4.4970,NL],['Dordrecht',51.8133,4.6901,NL],
['Maastricht',50.8514,5.6910,NL],['Deventer',52.2661,6.1552,NL],['Venlo',51.3704,6.1724,NL],['Schiedam',51.9170,4.3988,NL],['Leeuwarden',53.2012,5.7999,NL],
['Alkmaar',52.6324,4.7534,NL],['Delft',52.0116,4.3571,NL],['Hengelo',52.2658,6.7931,NL],['Almelo',52.3567,6.6625,NL],['Roermond',51.1942,5.9870,NL],
['Zoetermeer',52.0575,4.4931,NL],['Amstelveen',52.3114,4.8701,NL],['Diemen',52.3380,4.9597,NL],['Hoofddorp',52.3061,4.6907,NL],['Purmerend',52.5050,4.9597,NL],
['Hoorn',52.6424,5.0602,NL],['Hilversum',52.2292,5.1669,NL],['Lelystad',52.5185,5.4714,NL],['Ede',52.0402,5.6649,NL],['Veenendaal',52.0286,5.5589,NL],
['Gouda',52.0115,4.7105,NL],['Alphen aan den Rijn',52.1290,4.6575,NL],['Vlaardingen',51.9125,4.3420,NL],['Helmond',51.4793,5.6570,NL],['Oss',51.7650,5.5180,NL],
['Bergen op Zoom',51.4946,4.2872,NL],['Heerlen',50.8882,5.9795,NL],['Sittard',51.0000,5.8694,NL],['Emmen',52.7792,6.9069,NL],['Assen',52.9929,6.5642,NL],
['Middelburg',51.4988,3.6110,NL],['Den Helder',52.9563,4.7608,NL],['Tiel',51.8876,5.4279,NL],['Waalwijk',51.6828,5.0707,NL],
['Antwerpen',51.2194,4.4025,BE],['Brussel',50.8503,4.3517,BE],['Gent',51.0543,3.7174,BE],['Genk',50.9650,5.5008,BE],
['Keulen',50.9375,6.9603,DE],['Duisburg',51.4344,6.7623,DE],['Berlijn',52.5200,13.4050,DE],
['İstanbul',41.0082,28.9784,TR],['Ankara',39.9334,32.8597,TR],['İzmir',38.4237,27.1428,TR],['Konya',37.8746,32.4932,TR],['Kayseri',38.7205,35.4826,TR]];

// begin van de hijri-maanden volgens de Diyanet-tabellen
var HIJRI=[['2026-10-12','Cemaziyelevvel',1448],['2026-11-10','Cemaziyelahir',1448],['2026-12-10','Recep',1448],['2027-01-09','Şaban',1448],['2027-02-08','Ramazan',1448],['2027-03-09','Şevval',1448],
['2027-04-08','Zilkade',1448],['2027-05-07','Zilhicce',1448],['2027-06-06','Muharrem',1449],['2027-07-05','Safer',1449],['2027-08-03','Rebiulevvel',1449],['2027-09-02','Rebiulahir',1449],
['2027-10-01','Cemaziyelevvel',1449],['2027-10-31','Cemaziyelahir',1449],['2027-11-29','Recep',1449],['2027-12-29','Şaban',1449]];
var RAM={start:'2027-02-08',end:'2027-03-08'};
var DAYS=[
{d:'2026-12-10',night:1,h:'1 Recep 1448',n:{nl:'Regaib Kandili',tr:'Regaib Kandili',en:'Regaib Kandili'},s:{nl:'Ook het begin van de drie maanden',tr:'Üç ayların başlangıcı',en:'Also the start of the three months'}},
{d:'2027-01-04',night:1,h:'26 Recep 1448',n:{nl:'Miraç Kandili',tr:'Miraç Kandili',en:'Miraç Kandili'}},
{d:'2027-01-22',night:1,h:'14 Şaban 1448',n:{nl:'Berat Kandili',tr:'Berat Kandili',en:'Berat Kandili'}},
{d:'2027-02-08',h:'1 Ramazan 1448',n:{nl:'Begin van Ramadan',tr:'Ramazan başlangıcı',en:'Start of Ramadan'},s:{nl:'Eerste vastendag',tr:'İlk oruç',en:'First day of fasting'}},
{d:'2027-03-05',night:1,h:'26 Ramazan 1448',n:{nl:'Kadir Gecesi',tr:'Kadir Gecesi',en:'Kadir Gecesi'}},
{d:'2027-03-09',h:'1 Şevval 1448',n:{nl:'Ramazan Bayramı',tr:'Ramazan Bayramı',en:'Ramazan Bayramı (Eid al-Fitr)'},s:{nl:'3 dagen',tr:'3 gün',en:'3 days'}},
{d:'2027-05-16',h:'10 Zilhicce 1448',n:{nl:'Kurban Bayramı',tr:'Kurban Bayramı',en:'Kurban Bayramı (Eid al-Adha)'},s:{nl:'4 dagen',tr:'4 gün',en:'4 days'}},
{d:'2027-06-06',h:'1 Muharrem 1449',n:{nl:'Hijri nieuwjaar',tr:'Hicri yılbaşı',en:'Hijri new year'}},
{d:'2027-06-15',h:'10 Muharrem 1449',n:{nl:'Aşure-dag',tr:'Aşure günü',en:'Day of Ashura'}},
{d:'2027-08-13',night:1,h:'11 Rebiulevvel 1449',n:{nl:'Mevlid Kandili',tr:'Mevlid Kandili',en:'Mevlid Kandili'}},
{d:'2027-11-29',h:'1 Recep 1449',n:{nl:'Begin van de drie maanden',tr:'Üç ayların başlangıcı',en:'Start of the three months'}},
{d:'2027-12-02',night:1,h:'4 Recep 1449',n:{nl:'Regaib Kandili',tr:'Regaib Kandili',en:'Regaib Kandili'}}];

var PR=['sabah','ogle','ikindi','aksam','yatsi'];
var NAME={cuma:'Cuma',sabah:'Sabah',gunes:'Güneş',ogle:'Öğle',ikindi:'İkindi',aksam:'Akşam',yatsi:'Yatsı'};
var GUIDE={
sabah:[{k:'sunnet',s:['Kâfirun','İhlas']},{k:'farz',s:['Kevser','İhlas']}],
ogle:[{k:'sunnet',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',s:['Kâfirun','Nasr',null,null]},{k:'son',s:['Felak','Nas']}],
ikindi:[{k:'sunnetG',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',s:['Kâfirun','Nasr',null,null]}],
aksam:[{k:'farz',s:['Kevser','İhlas',null]},{k:'sunnet',s:['Felak','Nas']}],
yatsi:[{k:'sunnetG',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',s:['Kâfirun','Nasr',null,null]},{k:'son',s:['Felak','Nas']},{k:'vitir',s:['Kâfirun','İhlas','Felak']}],
cuma:[{k:'sunnet',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',imam:1,s:[null,null]},{k:'son',s:['Kâfirun','Nasr','Felak','Nas']}]};
var KMIN=45*60000, K2=10*60000; // kerahat na zonsopgang en voor zonsondergang; istiva kort voor öğle

/* ---------- toestand ---------- */
var KEY='gebedstijden.v1';
var S={lang:null,city:0,geo:null,chosen:false,prayed:{},kaza:{},fasted:{},guide:'',mode:'auto',sinceMs:0,work:{on:false,from:'09:00',to:'17:30'},
  set:{start:true,ask:true,askMin:20,remind:true,remindMin:15,ikindi:true,kerahat:false,cuma:true,sound:'bel'}};
(function load(){ try{ var raw=window.localStorage.getItem(KEY); if(raw){ var o=JSON.parse(raw);
    for(var k in o){ if(k==='set'){ for(var j in o.set) S.set[j]=o.set[j]; } else S[k]=o[k]; }
    if(o.cityChosen) S.chosen=true; } }catch(e){}
  if(S.set.sound==='eigen') S.set.sound='bel';
  if(!(S.city>=0 && S.city<CITIES.length)) S.city=0;
  if(!L[S.lang]){ var nav=(window.navigator.language||'nl').slice(0,2).toLowerCase(); S.lang=L[nav]?nav:'nl'; }
  if(!S.sinceMs) S.sinceMs=Date.now();
  if(!S.kaza) S.kaza={};
  if(!S.work || typeof S.work.from!=='string') S.work={on:false,from:'09:00',to:'17:30'}; })();
function save(){ try{ window.localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }

function t(k,v){ var s=L[S.lang][k]; if(s===undefined) s=L.nl[k]; if(v){ for(var x in v) s=s.split('{'+x+'}').join(v[x]); } return s; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pad(n){ return n<10?'0'+n:''+n; }

/* ---------- plaats en tijd ---------- */
function nearest(lat,lng){ var bi=0,bd=1e9; CITIES.forEach(function(c,i){ var dy=(c[1]-lat)*111, dx=(c[2]-lng)*111*Math.cos(lat*Math.PI/180), d=Math.sqrt(dx*dx+dy*dy); if(d<bd){ bd=d; bi=i; } }); return {i:bi,km:bd}; }
function place(){ if(S.geo){ var tz=null; try{ tz=Intl.DateTimeFormat().resolvedOptions().timeZone; }catch(e){}
    var n=nearest(S.geo.lat,S.geo.lng); return {name:n.km<12?CITIES[n.i][0]:t('myLoc'),lat:S.geo.lat,lng:S.geo.lng,tz:tz||CITIES[n.i][3]}; }
  var c=CITIES[S.city]; return {name:c[0],lat:c[1],lng:c[2],tz:c[3]}; }
var fmtCache={};
function fmt(tz){ if(!fmtCache[tz]) fmtCache[tz]=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'short'}); return fmtCache[tz]; }
function parts(ms,tz){ var o={}; fmt(tz).formatToParts(new Date(ms)).forEach(function(p){ o[p.type]=p.value; });
  return {y:+o.year,m:+o.month,d:+o.day,h:(+o.hour)%24,mi:+o.minute,s:+o.second,wd:o.weekday}; }
function keyOf(y,m,d){ return y+'-'+pad(m)+'-'+pad(d); }
function splitKey(k){ var a=k.split('-'); return {y:+a[0],m:+a[1],d:+a[2]}; }
function addDays(k,n){ var a=splitKey(k), dt=new Date(Date.UTC(a.y,a.m-1,a.d+n)); return keyOf(dt.getUTCFullYear(),dt.getUTCMonth()+1,dt.getUTCDate()); }
function dayDiff(a,b){ var x=splitKey(a),y=splitKey(b); return Math.round((Date.UTC(y.y,y.m-1,y.d)-Date.UTC(x.y,x.m-1,x.d))/86400000); }
function hm(ms){ var p=parts(ms,place().tz); return pad(p.h)+':'+pad(p.mi); }
function longDate(k,opts){ var a=splitKey(k); try{ var o={timeZone:'UTC'}; for(var x in opts) o[x]=opts[x]; return new Intl.DateTimeFormat(t('locale'),o).format(new Date(Date.UTC(a.y,a.m-1,a.d,12))); }catch(e){ return k; } }
function hijri(k){ var best=null,bi=-1; for(var i=0;i<HIJRI.length;i++){ if(HIJRI[i][0]<=k){ best=HIJRI[i]; bi=i; } }
  if(!best) return ''; var n=dayDiff(best[0],k)+1; if(n>30 || (n===30 && !HIJRI[bi+1])) return ''; return n+' '+best[1]+' '+best[2]; }
function inRamadan(k){ return k>=RAM.start && k<=RAM.end; }

/* ---------- tijden ---------- */
var tcache={};
function clearTimes(){ tcache={}; }
function timesFor(k){ if(tcache[k]) return tcache[k]; var p=place(), a=splitKey(k); return (tcache[k]=PT.compute(a.y,a.m,a.d,p.lat,p.lng)); }
function buildDay(k){ var x=timesFor(k), n=timesFor(addDays(k,1));
  return {key:k,t:x,
    prayers:[{id:'sabah',start:x.fajr,end:x.rise},{id:'ogle',start:x.noon,end:x.asr},{id:'ikindi',start:x.asr,end:x.set},{id:'aksam',start:x.set,end:x.isha},{id:'yatsi',start:x.isha,end:n.fajr}]
      .map(function(p){ p.key=k+':'+p.id; p.day=k; return p; }),
    kerahat:[{id:'k1',start:x.rise,end:x.rise+KMIN},{id:'k2',start:x.noon-K2,end:x.noon},{id:'k3',start:x.set-KMIN,end:x.set}]}; }
function ctx(){ var p=place(), now=Date.now(), pp=parts(now,p.tz), today=keyOf(pp.y,pp.m,pp.d);
  var days=[buildDay(addDays(today,-1)),buildDay(today),buildDay(addDays(today,1))], all=[], ks=[];
  days.forEach(function(d){ all=all.concat(d.prayers); ks=ks.concat(d.kerahat); });
  var cur=null,next=null,ker=null,nextKer=null;
  all.forEach(function(x){ if(x.start<=now && now<x.end) cur=x; if(!next && x.start>now) next=x; });
  ks.forEach(function(x){ if(x.start<=now && now<x.end) ker=x; if(!nextKer && x.start>now) nextKer=x; });
  var dark = S.mode==='dark' || (S.mode==='auto' && (now>=days[1].t.set || now<days[1].t.rise));
  return {now:now,place:p,today:today,day:days[1],tom:days[2],cur:cur,next:next,ker:ker,nextKer:nextKer,wd:pp.wd,dark:dark}; }
function pname(id){ return NAME[id]; }
function cd(ms){ if(ms<0) ms=0; var s=Math.floor(ms/1000), h=Math.floor(s/3600), m=Math.floor((s%3600)/60); return h+':'+pad(m)+':'+pad(s%60); }
function prayed(key){ return !!S.prayed[key]; }
function missedList(c){ var out=[], k=c.today; for(var n=0;n<30;n++){ var d=buildDay(k);
    for(var i=4;i>=0;i--){ var p=d.prayers[i]; if(p.end<=c.now && p.start>=S.sinceMs && !S.prayed[p.key] && !S.kaza[p.key]) out.push(p); }
    if(d.t.fajr<S.sinceMs) break; k=addDays(k,-1); } return out; }
function upcomingDays(c){ return DAYS.filter(function(d){ return d.d>=c.today; }); }

/* ---------- iconen ---------- */
var IC={
check:'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8"></path></svg>',
ok:'<svg class="c-accent" width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8"></circle><path d="M6.5 10.2l2.4 2.4 4.6-5"></path></svg>',
no:'<svg class="c-warn" width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="8"></circle><path d="M6 10h8"></path></svg>',
play:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"></path></svg>',
on:'<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="2"></circle><circle cx="11" cy="11" r="5" fill="currentColor"></circle></svg>',
off:'<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="none" stroke="currentColor" stroke-width="2"></circle></svg>',
nav:{vandaag:'<circle cx="11" cy="11" r="8"></circle><path d="M11 6.5V11l3 2"></path>',overzicht:'<rect x="4" y="5" width="14" height="13" rx="2"></rect><path d="M4 9.5h14M8 3v4M14 3v4"></path>',kible:'<circle cx="11" cy="11" r="8"></circle><path d="M14.5 7.5l-2 5-5 2 2-5z"></path>',gids:'<path d="M11 5c-2-1.3-4.5-1.5-7-1v13c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V4c-2.5-.5-5-.3-7 1zM11 5v13"></path>',meer:'<circle cx="5" cy="11" r="1.5"></circle><circle cx="11" cy="11" r="1.5"></circle><circle cx="17" cy="11" r="1.5"></circle>'}};

/* ---------- onderdelen ---------- */
function sw(id,on,label){ return '<button class="switch" role="switch" aria-checked="'+(on?'true':'false')+'" aria-label="'+esc(label)+'" data-act="toggle" data-id="'+id+'"><span><span></span></span></button>'; }
function back(){ return '<a href="#meer" class="back">‹ '+esc(t('mTitle'))+'</a>'; }
function citySelect(id){ var idx=CITIES.map(function(c,i){ return i; }).sort(function(a,b){ return CITIES[a][0].localeCompare(CITIES[b][0],'nl'); });
  var h='<select id="'+id+'" aria-label="'+esc(t('place'))+'">'; idx.forEach(function(i){ h+='<option value="'+i+'"'+(i===S.city?' selected':'')+'>'+esc(CITIES[i][0])+'</option>'; }); return h+'</select>'; }
function langCtl(){ return '<div class="segctl"><button data-act="lang" data-id="nl" aria-pressed="'+(S.lang==='nl')+'">Nederlands</button><button data-act="lang" data-id="tr" aria-pressed="'+(S.lang==='tr')+'">Türkçe</button><button data-act="lang" data-id="en" aria-pressed="'+(S.lang==='en')+'">English</button></div>'; }
function stepper(id,val,min,max,step){ return '<div class="stepper"><button data-act="step" data-id="'+id+'" data-d="-'+step+'" data-min="'+min+'" data-max="'+max+'" aria-label="−">−</button><span>'+val+' '+esc(t('min'))+'</span><button data-act="step" data-id="'+id+'" data-d="'+step+'" data-min="'+min+'" data-max="'+max+'" aria-label="+">+</button></div>'; }
function kerStatus(c){ var k3=c.ker.id==='k3', open=k3 && !prayed(c.today+':ikindi');
  var title=open?t('k3Pray'):t('kerahatNow'), sub=open?t('k3PraySub',{t:hm(c.ker.end)}):t(k3?'kerahatOnlyAsr':'kerahatUntil',{t:hm(c.ker.end)});
  return '<a class="status no" href="#vensters">'+IC.no+'<div class="col grow"><span class="title">'+esc(title)+'</span><span class="small">'+esc(sub)+'</span></div><span aria-hidden="true">›</span></a>'; }
function okStatus(c){ var nk=c.nextKer, pk=parts(nk.start,c.place.tz), pre=keyOf(pk.y,pk.m,pk.d)!==c.today?t('tomorrow')+' ':'';
  return '<a class="status" href="#vensters">'+IC.ok+'<div class="col grow"><span class="title">'+esc(t('allowed'))+'</span><span class="small muted">'+esc(t('nextKerahat',{a:pre+hm(nk.start),b:hm(nk.end)}))+'</span></div><span aria-hidden="true">›</span></a>'; }
function whenTxt(c,d){ var n=dayDiff(c.today,d.d); return n===0?t('dIn0'):n===1?t('dIn1'):t('dIn',{n:n}); }

/* ---------- schermen ---------- */
function viewWelcome(){ var h='<div class="welcome"><div class="col" style="gap:6px"><span class="small muted">'+esc(t('welcome'))+'</span><h1 style="font-size:32px">'+esc(t('appName'))+'</h1><span class="muted">'+esc(t('welcomeSub'))+'</span></div>'+langCtl();
  if(OWN) h+='<button class="btn wide" data-act="geo">'+esc(t('useLoc'))+'</button><span class="small c-warn" id="geomsg" style="font-weight:600"></span>';
  h+='<div class="card"><label for="city0" style="font-size:15px;color:var(--ink)">'+esc(OWN?t('orCity'):t('place'))+'</label>'+citySelect('city0')+'<button class="btn '+(OWN?'soft':'')+' wide" data-act="start">'+esc(t('cont'))+'</button></div>'+
     '<span class="note center">'+esc(t('indep'))+'</span></div>'; return h; }

function viewToday(c){ var p=c.place, d=c.day, x=d.t, h='', hj=hijri(c.today);
  h+='<header class="between"><div class="col"><a href="#dagen" class="small" style="font-weight:600;text-decoration:none;min-height:28px;display:flex;align-items:center">'+esc(longDate(c.today,{weekday:'short',day:'numeric',month:'short'}))+(hj?' · '+esc(hj):'')+' ›</a>'+
     '<h1>'+esc(p.name)+'</h1></div><a class="chip tap" href="#instellingen" aria-label="'+esc(t('mSettings'))+'">'+S.lang.toUpperCase()+'</a></header>';
  var target, lbl, sub, a0;
  if(c.cur){ target=c.cur.end; a0=c.cur.start; lbl=t('now')+': '+pname(c.cur.id); sub=(c.cur.id==='sabah'?t('untilSun'):t('untilEnd',{p:pname(c.cur.id)})); }
  else { target=c.next.start; a0=x.rise; lbl=t('next')+': '+pname(c.next.id); sub=t('untilNext'); }
  var pg=Math.max(0,Math.min(100,(c.now-a0)/(target-a0)*100));
  h+='<section class="hero'+(c.ker?' kerahat':'')+'"><div class="between"><span class="lbl">'+esc(lbl)+'</span><span class="dim">'+esc(pname(c.next.id))+' '+esc(t('at'))+' '+hm(c.next.start)+'</span></div>'+
     '<div class="big" data-cd="'+target+'">'+cd(target-c.now)+'</div><div class="sub">'+esc(sub)+'</div>'+
     '<div class="bar" aria-hidden="true">'+((c.cur && c.cur.id==='ikindi')?'<b style="width:'+(KMIN/(target-a0)*100).toFixed(1)+'%"></b>':'')+'<i data-pg="'+a0+','+target+'" style="width:'+pg.toFixed(1)+'%"></i></div>'+
     '<div class="between dim num"><span>'+hm(a0)+'</span>'+((c.cur && c.cur.id==='ikindi')?'<span>kerahat '+hm(target-KMIN)+'</span>':'')+'<span>'+hm(target)+'</span></div>';
  if(c.cur){ h+= prayed(c.cur.key)
      ? '<div class="between"><span class="sub">'+esc(t('prayedDone',{p:pname(c.cur.id)}))+'</span><button class="btn onhero" data-act="pray" data-key="'+c.cur.key+'">'+esc(t('undo'))+'</button></div>'
      : '<button class="btn gold wide" data-act="pray" data-key="'+c.cur.key+'">'+esc(t('prayedBtn',{p:pname(c.cur.id)}))+'</button>'; }
  h+='</section>';
  h+= c.ker ? kerStatus(c) : okStatus(c);
  if(S.set.sound!=='stil' && (S.set.start||S.set.remind) && !soundOn) h+='<button class="status" style="width:100%;text-align:left" data-act="soundon"><div class="col grow"><span class="title">'+esc(t('soundOff'))+'</span></div><span class="chip">'+esc(t('soundEnable'))+'</span></button>';
  var up=upcomingDays(c); if(up.length){ var dn=dayDiff(c.today,up[0].d); if(dn<=1) h+='<a class="status" href="#dagen"><div class="col grow"><span class="title">'+esc(t(dn===0?'dTodayIs':'dTomorrow',{n:up[0].n[S.lang]}))+'</span><span class="small muted">'+esc(up[0].h)+'</span></div><span aria-hidden="true">›</span></a>'; }
  if(c.wd==='Fri' && c.now<x.asr) h+='<div class="status"><div class="col"><span class="title">'+esc(t('cumaToday'))+'</span><span class="small muted">'+esc(t('cumaAt',{t:hm(x.noon)}))+'</span></div></div>';
  if(c.wd==='Thu' && c.now>=x.set) h+='<div class="status"><div class="col"><span class="title">'+esc(t('cumaTomorrow'))+'</span><span class="small muted">'+esc(t('cumaTomorrowSub',{t:hm(c.tom.t.noon)}))+'</span></div></div>';
  if(inRamadan(c.today)) h+=ramadanCard(c);
  var rows=[
    {id:'sabah',n:t('sabahName'),time:x.fajr,note:t('until',{t:hm(x.rise)})},
    {id:'gunes',n:pname('gunes'),time:x.rise,note:''},
    {id:'ogle',n:(c.wd==='Fri'?'Cuma · ':'')+pname('ogle'),time:x.noon,note:t('until',{t:hm(x.asr)})},
    {id:'ikindi',n:pname('ikindi'),time:x.asr,note:t('until',{t:hm(x.set)})},
    {id:'aksam',n:pname('aksam'),time:x.set,note:t('until',{t:hm(x.isha)})},
    {id:'yatsi',n:pname('yatsi'),time:x.isha,note:t('until',{t:hm(c.tom.t.fajr)})}], cnt=0;
  h+='<section class="list">';
  rows.forEach(function(r){ var key=c.today+':'+r.id, isNow=c.cur && c.cur.key===key, done=prayed(key); if(done && r.id!=='gunes') cnt++;
    h+='<div class="item'+(isNow?' now':'')+'"'+(isNow?' aria-current="true"':'')+'><div class="col grow"><span class="title" style="font-size:16px">'+esc(r.n)+'</span>'+(r.note?'<span class="small muted">'+esc(r.note)+'</span>':'')+'</div>'+
       '<span class="time">'+hm(r.time)+'</span>'+
       (r.id==='gunes' ? '<span class="nop">'+esc(t('noPrayer'))+'</span>'
        : '<button class="check'+(done?' on':'')+'" data-act="pray" data-key="'+key+'" aria-pressed="'+(done?'true':'false')+'" aria-label="'+esc(t('prayedBtn',{p:pname(r.id)}))+'">'+IC.check+'</button>')+'</div>'; });
  var miss=missedList(c).length;
  h+='</section>'+dayCard(c)+duaCard(c)+'<a href="#overzicht" class="small center" style="font-weight:600;text-decoration:none;min-height:44px;display:flex;align-items:center;justify-content:center">'+esc(t('summary',{n:cnt}))+(miss?' · '+esc(t('kazaCount',{n:miss})):'')+' ›</a>'+
     '<div class="note center">'+esc(t('srcCalc'))+'</div>';
  return h; }

var DUAS=[
{r:'Bakara 2:201',nl:'Onze Heer, geef ons het goede in deze wereld en het goede in het hiernamaals, en bescherm ons tegen de straf van het vuur.',tr:'Rabbimiz, bize dünyada iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',en:'Our Lord, give us good in this world and good in the hereafter, and protect us from the punishment of the fire.'},
{r:'Âl-i İmrân 3:8',nl:'Onze Heer, laat onze harten niet afdwalen nadat U ons hebt geleid, en schenk ons barmhartigheid van Uw kant. U bent de Schenker.',tr:'Rabbimiz, bizi doğru yola ilettikten sonra kalplerimizi eğriltme. Bize katından rahmet bağışla. Şüphesiz sen çok bağışlayansın.',en:'Our Lord, do not let our hearts stray after You have guided us, and grant us mercy from Yourself. You are the Giver.'},
{r:'İbrâhîm 14:40',nl:'Mijn Heer, maak mij en mijn nakomelingen tot mensen die het gebed onderhouden. Onze Heer, aanvaard mijn gebed.',tr:'Rabbim, beni ve soyumdan gelenleri namazı dosdoğru kılanlardan eyle. Rabbimiz, duamı kabul et.',en:'My Lord, make me and my descendants people who keep up the prayer. Our Lord, accept my prayer.'},
{r:'İbrâhîm 14:41',nl:'Onze Heer, vergeef mij, mijn ouders en de gelovigen op de dag van de afrekening.',tr:'Rabbimiz, hesap görülecek günde beni, anamı babamı ve müminleri bağışla.',en:'Our Lord, forgive me, my parents and the believers on the day of reckoning.'},
{r:'Furkân 25:74',nl:'Onze Heer, schenk ons vreugde in onze echtgenoten en kinderen, en maak ons tot een voorbeeld voor wie U vrezen.',tr:'Rabbimiz, eşlerimizi ve çocuklarımızı bize göz aydınlığı kıl ve bizi takva sahiplerine önder eyle.',en:'Our Lord, grant us joy in our spouses and children, and make us an example for those who are mindful of You.'},
{r:'A’râf 7:23',nl:'Onze Heer, wij hebben onszelf onrecht aangedaan. Als U ons niet vergeeft en ons niet genadig bent, horen wij zeker bij de verliezers.',tr:'Rabbimiz, biz kendimize zulmettik. Bizi bağışlamaz ve bize acımazsan mutlaka ziyana uğrayanlardan oluruz.',en:'Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers.'},
{r:'Mü’minûn 23:118',nl:'Mijn Heer, vergeef en wees genadig. U bent de beste van de barmhartigen.',tr:'Rabbim, bağışla ve merhamet et. Sen merhamet edenlerin en hayırlısısın.',en:'My Lord, forgive and have mercy. You are the best of the merciful.'},
{r:'Kehf 18:10',nl:'Onze Heer, schenk ons barmhartigheid van Uw kant en wijs ons de juiste weg in onze zaak.',tr:'Rabbimiz, bize katından rahmet ver ve işimizde bize doğruyu göster.',en:'Our Lord, grant us mercy from Yourself and guide us rightly in our affair.'},
{r:'Haşr 59:10',nl:'Onze Heer, vergeef ons en onze broeders die ons in het geloof zijn voorgegaan, en laat in onze harten geen wrok zijn tegen de gelovigen. Onze Heer, U bent mild en genadevol.',tr:'Rabbimiz, bizi ve bizden önce iman etmiş kardeşlerimizi bağışla. Kalplerimizde iman edenlere karşı kin bırakma. Rabbimiz, sen çok şefkatli, çok merhametlisin.',en:'Our Lord, forgive us and our brothers who came before us in faith, and leave no ill will in our hearts towards the believers. Our Lord, You are kind and merciful.'},
{r:'Tâhâ 20:114',nl:'Mijn Heer, vermeerder mijn kennis.',tr:'Rabbim, ilmimi artır.',en:'My Lord, increase me in knowledge.'},
{r:'Enbiyâ 21:87',nl:'Er is geen god dan U. U bent verheven. Ik heb werkelijk onrecht gedaan.',tr:'Senden başka ilah yoktur. Seni tenzih ederim. Gerçekten ben zalimlerden oldum.',en:'There is no god but You. Glory be to You. I have truly done wrong.'},
{r:'İsrâ 17:24',nl:'Mijn Heer, wees hun genadig, zoals zij mij hebben opgevoed toen ik klein was.',tr:'Rabbim, onlar beni küçükken nasıl yetiştirdilerse sen de onlara merhamet et.',en:'My Lord, have mercy on them, as they raised me when I was small.'},
{r:'Bakara 2:127',nl:'Onze Heer, aanvaard dit van ons. U bent de Alhorende, de Alwetende.',tr:'Rabbimiz, bizden kabul buyur. Şüphesiz sen hakkıyla işiten, hakkıyla bilensin.',en:'Our Lord, accept this from us. You are the All-Hearing, the All-Knowing.'},
{r:'Tâhâ 20:25–28',nl:'Mijn Heer, verruim mijn borst, maak mijn taak licht en maak de knoop in mijn tong los, zodat zij mijn woorden begrijpen.',tr:'Rabbim, gönlüme ferahlık ver, işimi kolaylaştır, dilimdeki düğümü çöz ki sözümü anlasınlar.',en:'My Lord, open my heart, make my task easy and untie the knot in my tongue, so that they understand my words.'}];
function duaCard(c){ if(typeof DUA_AR==='undefined') return ''; var n=((dayDiff('2026-01-01',c.today)%DUAS.length)+DUAS.length)%DUAS.length, d=DUAS[n];
  return '<section class="card" style="gap:6px"><span class="small muted" style="font-weight:600">'+esc(t('duaTitle'))+'</span><div class="ar" lang="ar" dir="rtl" style="font-size:20px">'+esc(DUA_AR[n])+'</div><span>'+esc(d[S.lang])+'</span><span class="small muted">'+esc(d.r)+'</span></section>'; }
function mins(ms,tz){ var p=parts(ms,tz); return p.h*60+p.mi; }
function dur(ms){ var m=Math.round(ms/60000), h=Math.floor(m/60); return (h?h+' '+t('hU')+' ':'')+(m%60)+' '+t('min'); }
function workRange(c){ if(!S.work.on || c.wd==='Sat' || c.wd==='Sun') return null; var a=S.work.from.split(':'), b=S.work.to.split(':'), ws=+a[0]*60+ +a[1], we=+b[0]*60+ +b[1]; return we>ws?{ws:ws,we:we}:null; }
function dayCard(c){ var x=c.day.t, tz=c.place.tz, M=function(ms){ return mins(ms,tz); }, W=workRange(c);
  var lines=[], wins=[{id:'sabah',s:x.fajr,e:x.rise},{id:'ogle',s:x.noon,e:x.asr},{id:'ikindi',s:x.asr,e:x.set-KMIN},{id:'aksam',s:x.set,e:x.isha},{id:'yatsi',s:x.isha,e:c.tom.t.fajr}];
  if(c.now<x.asr){
    if(W){ var inW=wins.filter(function(w){ var ws=M(w.s), we=ws+(w.e-w.s)/60000; return Math.max(0,W.ws-ws)+Math.max(0,we-W.we)<20; }).map(function(w){ return pname(w.id); });
      lines.push(inW.length?t('dayWork',{p:inW.join(', ')}):t('dayWorkNone')); }
    else { var left=wins.filter(function(w){ return w.e>c.now; }), tight=null; left.forEach(function(w){ if(!tight || (w.e-w.s)<(tight.e-tight.s)) tight=w; });
      if(tight) lines.push(t('dayTight',{p:pname(tight.id),d:dur(tight.e-tight.s),a:hm(tight.s),b:hm(tight.e)})); }
    if(!prayed(c.today+':ogle') && c.wd!=='Fri') lines.push(t('dayOne',{a:hm(x.asr-15*60000),b:hm(x.asr)})); }
  else { if(c.now<x.isha) lines.push(t('dayEve',{a:hm(x.set),b:hm(x.isha)})); lines.push(t('dayTom',{a:hm(c.tom.t.fajr),b:hm(c.tom.t.rise)})); }
  if(!lines.length) return '';
  var h='<section class="card" style="gap:6px">';
  lines.slice(0,2).forEach(function(l){ h+='<span class="small">'+esc(l)+'</span>'; });
  if(!S.work.on && c.now<x.asr) h+='<a class="small" style="font-weight:600;text-decoration:none" href="#instellingen">'+esc(t('daySet'))+' ›</a>';
  return h+'</section>'; }
function ramadanCard(c){ var x=c.day.t, n=dayDiff(RAM.start,c.today)+1, h='<section class="hero night"><div class="between"><span class="lbl">'+esc(t('rDay',{n:n}))+'</span><span class="dim">'+esc(t('rImsak'))+' '+hm(x.fajr)+' · '+esc(t('rIftar'))+' '+hm(x.set)+'</span></div>';
  if(c.now<x.fajr){ h+='<div class="sub">'+esc(t('rSahurIn'))+'</div><div class="big" data-cd="'+x.fajr+'">'+cd(x.fajr-c.now)+'</div>'; }
  else if(c.now<x.set){ var pg=(c.now-x.fajr)/(x.set-x.fajr)*100; h+='<div class="sub">'+esc(t('rIftarIn'))+'</div><div class="big" data-cd="'+x.set+'">'+cd(x.set-c.now)+'</div><div class="bar" aria-hidden="true"><i data-pg="'+x.fajr+','+x.set+'" style="width:'+pg.toFixed(1)+'%"></i></div>'; }
  else { h+='<div class="sub">'+esc(t('rIftarWas',{t:hm(x.set)}))+'</div><div class="sub">'+esc(t('rTeravih',{t:hm(x.isha)}))+'</div><div class="sub">'+esc(t('rSahurTom',{t:hm(c.tom.t.fajr)}))+'</div>'; }
  var f=!!S.fasted[c.today];
  h+='<div class="between"><div class="col"><span style="font-weight:600">'+esc(t('rFast'))+'</span><span class="dim">'+esc(t('rFastSub'))+'</span></div><button class="check gold'+(f?' on':'')+'" data-act="fast" data-key="'+c.today+'" aria-pressed="'+(f?'true':'false')+'" aria-label="'+esc(t('rFast'))+'">'+IC.check+'</button></div></section>';
  return h; }

function viewWindows(c){ var x=c.day.t, n=c.tom.t.fajr, now=c.now;
  var segs=[[x.fajr,x.rise,pname('sabah'),t('wSabah'),1],[x.rise,x.rise+KMIN,t('wK1'),t('wK1s'),0],[x.rise+KMIN,x.noon-K2,t('wFree'),t('wFrees'),1],[x.noon-K2,x.noon,t('wK2'),t('wK2s'),0],
    [x.noon,x.asr,pname('ogle'),t('wOgle'),1],[x.asr,x.set-KMIN,pname('ikindi'),t('wIkindi'),1],[x.set-KMIN,x.set,t('wK3'),t('wK3s'),0],[x.set,x.isha,pname('aksam'),t('wAksam'),1],[x.isha,n,pname('yatsi'),t('wYatsi',{t:hm((x.set+n)/2)}),1]];
  var h='<a href="#vandaag" class="back">‹ '+esc(t('navToday'))+'</a><header class="col"><h1>'+esc(t('winTitle'))+'</h1><span class="small muted">'+esc(t('winSub',{c:c.place.name}))+'</span></header>';
  h+= c.ker ? kerStatus(c) : okStatus(c);
  h+='<section style="display:flex;flex-direction:column;gap:6px">';
  segs.forEach(function(s){ var cur=s[0]<=now && now<s[1];
    h+='<div class="seg'+(s[4]?'':' no')+(cur?' cur':'')+'"><span class="t">'+hm(s[0])+' – '+hm(s[1])+'</span><div class="col grow"><span class="title" style="font-size:14px">'+esc(s[2])+(cur?' · '+esc(t('now').toLocaleLowerCase(t('locale'))):'')+'</span><span class="small'+(s[4]?' muted':'')+'">'+esc(s[3])+'</span></div><span class="chip'+(s[4]?'':' no')+'">'+esc(t(s[4]?'ok':'no'))+'</span></div>'; });
  h+='</section><div class="note center">'+esc(t('kNote'))+'</div>'; return h; }

function bearing(lat,lng){ var R=Math.PI/180, f1=lat*R, f2=21.4225*R, dl=(39.8262-lng)*R;
  var b=Math.atan2(Math.sin(dl),Math.cos(f1)*Math.tan(f2)-Math.sin(f1)*Math.cos(dl))/R; return (b+360)%360; }
var compass={on:false,failed:false,heading:null,bearing:0};
function viewQibla(c){ var p=c.place, b=bearing(p.lat,p.lng), w=t('wind'), dir=w[Math.round(b/45)%8], deg=b.toFixed(1).replace('.',','); compass.bearing=b;
  var rot=(compass.on && compass.heading!==null)?-compass.heading:0, F='font-family="Space Grotesk, sans-serif" font-size="15" font-weight="700" text-anchor="middle"';
  var h='<h1>'+esc(t('qTitle'))+'</h1><section class="card" style="align-items:center">'+
    '<svg width="230" height="230" viewBox="0 0 220 220" role="img" aria-label="'+esc(t('qFrom',{d:deg,w:dir}))+'"><circle cx="110" cy="110" r="104" style="fill:var(--ground);stroke:var(--line-strong)" stroke-width="2"></circle><circle cx="110" cy="110" r="78" style="fill:var(--card);stroke:var(--line)"></circle>'+
    '<g id="dial" transform="rotate('+rot.toFixed(1)+' 110 110)"><text x="110" y="26" '+F+' style="fill:var(--ink)">'+w[0]+'</text><text x="198" y="115" '+F+' style="fill:var(--muted)">'+w[2]+'</text><text x="110" y="204" '+F+' style="fill:var(--muted)">'+w[4]+'</text><text x="22" y="115" '+F+' style="fill:var(--muted)">'+w[6]+'</text>'+
    '<g transform="rotate('+b.toFixed(1)+' 110 110)"><path d="M110 42 L122 110 L110 122 L98 110 Z" style="fill:var(--accent-ink)"></path><rect x="101" y="20" width="18" height="18" rx="3" fill="#14201D" stroke="#F2C879" stroke-width="1"></rect><rect x="101" y="25" width="18" height="3" fill="#F2C879"></rect></g></g>'+
    '<circle cx="110" cy="110" r="6" style="fill:var(--ink)"></circle>'+(compass.on?'<path d="M110 2 L117 14 L103 14 Z" style="fill:var(--warn-text)"></path>':'')+'</svg>'+
    '<div class="num" style="font-size:28px;font-weight:700">'+deg+'° '+dir+'</div><div class="small muted center">'+esc(t('qFrom',{d:deg,w:dir}))+' · '+esc(p.name)+'</div>';
  if(compass.on && !compass.failed) h+='<div class="small center" id="cstat">'+esc(t('qCompassOn'))+'</div><button class="btn line wide" data-act="compassoff">'+esc(t('qStop'))+'</button>';
  else { h+='<div class="small muted center">'+esc(compass.failed?t('qCompassNo'):t('qHelp'))+'</div>'; if(OWN && !compass.failed) h+='<button class="btn wide" data-act="compass">'+esc(t('qCompass'))+'</button>'; }
  h+='</section>'+mosqueBlock(p)+'<a class="linkcard" href="https://www.google.com/maps/search/'+t('mosqueWord')+'/@'+p.lat.toFixed(4)+','+p.lng.toFixed(4)+',13z" target="_blank" rel="noopener"><div class="col grow"><span class="title">'+esc(t('qMosque'))+'</span><span class="small muted">'+esc(t('qMosqueSub',{c:p.name}))+'</span></div><span class="chip">'+esc(t('qOpen'))+' ›</span></a>';
  return h; }
var mosq={state:'idle',list:[],key:''};
function distKm(a,b,c,d){ var R=Math.PI/180, dy=(c-a)*111.2, dx=(d-b)*111.2*Math.cos(a*R); return Math.sqrt(dx*dx+dy*dy); }
function mosqueBlock(p){ if(!OWN) return ''; var key=p.lat.toFixed(3)+','+p.lng.toFixed(3), m=(mosq.key===key)?mosq:{state:'idle',list:[]};
  if(m.state==='idle') return '<button class="btn wide" data-act="mosq">'+esc(t('mosFind'))+'</button>';
  if(m.state==='busy') return '<div class="status"><span class="title">'+esc(t('mosBusy'))+'</span></div>';
  if(m.state==='fail') return '<div class="status no"><span class="small">'+esc(t('mosFail'))+'</span></div>';
  if(!m.list.length) return '<div class="status"><span class="small muted">'+esc(t('mosNone'))+'</span></div>';
  var h='<section class="list"><div class="item"><h2 class="grow">'+esc(t('qMosque'))+'</h2></div>';
  m.list.forEach(function(x){ h+='<div class="item"><div class="col grow"><span class="title">'+esc(x.name||t('mosNoName'))+'</span><span class="small muted">'+(x.km<1?Math.round(x.km*1000)+' m':x.km.toFixed(1).replace('.',',')+' km')+'</span></div><a class="btn soft" href="https://www.google.com/maps/dir/?api=1&amp;destination='+x.lat.toFixed(5)+','+x.lng.toFixed(5)+'" target="_blank" rel="noopener">'+esc(t('mosRoute'))+'</a></div>'; });
  return h+'</section><div class="note center">'+esc(t('mosSrc'))+'</div>'; }
function findMosques(){ var p=place(), key=p.lat.toFixed(3)+','+p.lng.toFixed(3); mosq={state:'busy',list:[],key:key}; render();
  function fail(){ mosq={state:'fail',list:[],key:key}; render(); }
  var q='[out:json][timeout:20];nwr(around:12000,'+p.lat.toFixed(3)+','+p.lng.toFixed(3)+')["amenity"="place_of_worship"]["religion"="muslim"];out center 80;';
  try{ window.fetch('https://overpass-api.de/api/interpreter',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(q)})
    .then(function(r){ if(!r.ok) throw new Error('http'); return r.json(); })
    .then(function(j){ var seen={}, list=[]; (j.elements||[]).forEach(function(e){ var la=e.lat||(e.center&&e.center.lat), lo=e.lon||(e.center&&e.center.lon); if(typeof la!=='number' || typeof lo!=='number') return;
        var nm=(e.tags&&e.tags.name)||'', id=nm+'|'+la.toFixed(3)+'|'+lo.toFixed(3); if(seen[id]) return; seen[id]=1; list.push({name:String(nm).slice(0,60),lat:la,lng:lo,km:distKm(p.lat,p.lng,la,lo)}); });
      list.sort(function(a,b){ return a.km-b.km; }); mosq={state:'ok',list:list.slice(0,8),key:key}; render(); })
    .catch(fail); }catch(e){ fail(); } }
function onOri(e){ var hd=null; if(typeof e.webkitCompassHeading==='number') hd=e.webkitCompassHeading; else if(e.absolute && typeof e.alpha==='number') hd=360-e.alpha;
  if(hd===null || isNaN(hd)) return; compass.heading=hd;
  var g=document.getElementById('dial'); if(g) g.setAttribute('transform','rotate('+(-hd).toFixed(1)+' 110 110)');
  var st=document.getElementById('cstat'); if(st){ var diff=Math.abs(((compass.bearing-hd+540)%360)-180), ok=diff<5; st.textContent=ok?t('qCompassOk'):t('qCompassOn'); st.style.fontWeight=ok?'700':'400'; } }
function stopCompass(){ window.removeEventListener('deviceorientationabsolute',onOri,true); window.removeEventListener('deviceorientation',onOri,true); compass.on=false; compass.heading=null; }
function startCompass(){ function fail(){ compass.failed=true; compass.on=false; render(); }
  function go(){ compass.on=true; compass.failed=false; compass.heading=null; window.addEventListener('deviceorientationabsolute',onOri,true); window.addEventListener('deviceorientation',onOri,true);
    window.setTimeout(function(){ if(compass.on && compass.heading===null) fail(); },4000); render(); }
  try{ var D=window.DeviceOrientationEvent;
    if(D && typeof D.requestPermission==='function'){ D.requestPermission().then(function(r){ if(r==='granted') go(); else fail(); }).catch(fail); }
    else if(D) go(); else fail(); }catch(e){ fail(); } }

function viewGuide(c){ var sel=S.guide || (c.cur?c.cur.id:c.next.id); if(!S.guide && sel==='ogle' && c.wd==='Fri') sel='cuma';
  var h='<header class="col"><h1>'+esc(t('gTitle'))+'</h1><span class="small muted">'+esc(t('gSub'))+'</span></header><div class="segctl tight">';
  PR.concat(['cuma']).forEach(function(id){ h+='<button data-act="guide" data-id="'+id+'" aria-pressed="'+(id===sel?'true':'false')+'">'+pname(id)+'</button>'; });
  h+='</div>';
  GUIDE[sel].forEach(function(u){ var n=u.s.length;
    h+='<section class="card"><h2>'+esc(t('u_'+u.k))+' · '+n+' '+esc(t('gRekat'))+'</h2>';
    u.s.forEach(function(s,i){ h+='<div class="row"><span class="rk">'+(i+1)+'</span><span class="title">'+(u.imam?esc(t('gImam')):s?sureBtn('Fatiha','Fatiha')+' + '+sureBtn(s,s):sureBtn('Fatiha',t('gOnly')))+'</span></div>'; });
    var note= u.imam?t('n_cuma'): u.k==='vitir'?t('n_vitir'): u.k==='sunnetG'?t('n_sunnetG'): (n>2?t('n_farz4'):t('n_std'));
    h+='<span class="small muted">'+esc(note)+'</span></section>'; });
  h+='<div class="note center">'+esc(t('gFoot'))+'</div>'; return h; }

var curSure='Fatiha';
function sureBtn(id,label){ return (typeof SURES!=='undefined' && SURES[id]) ? '<button class="surebtn" data-act="sure" data-id="'+esc(id)+'">'+esc(label)+'</button>' : esc(label); }
// Turkse uitspraak (okunuş) per vers. Hulpmiddel bij het leren; laten nalezen door een imam.
var BESMELE='Bismillâhirrahmânirrahîm.';
var OKUNUS={
'Fatiha':['Bismillâhirrahmânirrahîm.','Elhamdü lillâhi rabbil’âlemîn.','Errahmânirrahîm.','Mâliki yevmiddîn.','İyyâke na’büdü ve iyyâke neste’în.','İhdinessırâtel müstakîm.','Sırâtallezîne en’amte aleyhim ğayril mağdûbi aleyhim veleddâllîn.'],
'Fil':['Elem tera keyfe fe’ale rabbüke biashâbilfîl.','Elem yec’al keydehüm fî tadlîl.','Ve ersele aleyhim tayran ebâbîl.','Termîhim bihicâratin min siccîl.','Fece’alehüm ke’asfin me’kûl.'],
'Kureyş':['Li’îlâfi kureyş.','Îlâfihim rıhleteşşitâi vessayf.','Felya’büdû rabbe hâzelbeyt.','Ellezî et’amehüm min cû’in ve âmenehüm min havf.'],
'Maun':['Era’eytellezî yükezzibü biddîn.','Fezâlikellezî yedu’ulyetîm.','Ve lâ yehuddu alâ ta’âmilmiskîn.','Feveylün lilmusallîn.','Ellezîne hüm an salâtihim sâhûn.','Ellezîne hüm yürâûn.','Ve yemne’ûnelmâ’ûn.'],
'Kevser':['İnnâ a’taynâkelkevser.','Fesalli lirabbike venhar.','İnne şânieke hüvel’ebter.'],
'Kâfirun':['Kul yâ eyyühelkâfirûn.','Lâ a’büdü mâ ta’büdûn.','Ve lâ entüm âbidûne mâ a’büd.','Ve lâ ene âbidün mâ abedtüm.','Ve lâ entüm âbidûne mâ a’büd.','Leküm dînüküm veliye dîn.'],
'Nasr':['İzâ câe nasrullâhi velfeth.','Ve raeytennâse yedhulûne fî dînillâhi efvâcâ.','Fesebbih bihamdi rabbike vestağfirh. İnnehû kâne tevvâbâ.'],
'İhlas':['Kul hüvallâhü ehad.','Allâhüssamed.','Lem yelid ve lem yûled.','Ve lem yekün lehû küfüven ehad.'],
'Felak':['Kul e’ûzü birabbilfelak.','Min şerri mâ halak.','Ve min şerri ğâsikın izâ vekab.','Ve min şerrinneffâsâti fil’ukad.','Ve min şerri hâsidin izâ hased.'],
'Nas':['Kul e’ûzü birabbinnâs.','Melikinnâs.','İlâhinnâs.','Min şerrilvesvâsilhannâs.','Ellezî yüvesvisü fî sudûrinnâs.','Minelcinneti vennâs.']};
function viewSure(){ var su=(typeof SURES!=='undefined')?SURES[curSure]:null, ok=OKUNUS[curSure], bk='<a href="#gids" class="back">‹ '+esc(t('gTitle'))+'</a>'; if(!su) return bk;
  var ar=S.sureMode==='ar' || !ok || ok.length!==su.v.length;
  var h=bk+'<header class="col"><h1>'+esc(curSure)+'</h1><span class="small muted">'+esc(t('sureNo',{n:su.no,v:su.v.length}))+'</span></header>'+
    '<div class="segctl"><button data-act="suremode" data-id="tr" aria-pressed="'+(!ar)+'">'+esc(t('sureTr'))+'</button><button data-act="suremode" data-id="ar" aria-pressed="'+ar+'">'+esc(t('sureAr'))+'</button></div>';
  if(OWN) h+='<section class="card" style="gap:6px"><span class="small muted" style="font-weight:600">'+esc(t('sureListen'))+'</span><audio controls preload="none" style="width:100%" src="https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/'+su.no+'.mp3"></audio><span class="small muted">'+esc(t('sureAudioSrc'))+'</span></section>';
  if(ar){ h+='<section class="card" lang="ar" dir="rtl">'; if(su.no!==1) h+='<div class="ar center" style="color:var(--muted)">'+esc(SURES.Fatiha.v[0])+'</div>';
    su.v.forEach(function(v,i){ h+='<div class="ar">'+esc(v)+' <span class="vn">'+(i+1)+'</span></div>'; }); h+='</section><div class="note center">'+esc(t('sureSrc'))+'</div>'; }
  else { h+='<section class="card" lang="tr" style="gap:12px">'; if(su.no!==1) h+='<div class="muted center" style="font-size:17px">'+esc(BESMELE)+'</div>';
    ok.forEach(function(v,i){ h+='<div class="row" style="align-items:flex-start"><span class="vn" style="flex:0 0 auto;margin-top:2px">'+(i+1)+'</span><span style="font-size:19px;line-height:1.5">'+esc(v)+'</span></div>'; }); h+='</section><div class="note center">'+esc(t('sureOkNote'))+'</div>'; }
  return h; }
function icsLink(d){ var a=d.d.replace(/-/g,''), b=addDays(d.d,1).replace(/-/g,'');
  var txt=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//gebedstijden//NL','BEGIN:VEVENT','UID:'+a+'@gebedstijden','DTSTAMP:'+a+'T000000Z','DTSTART;VALUE=DATE:'+a,'DTEND;VALUE=DATE:'+b,'SUMMARY:'+d.n[S.lang],'END:VEVENT','END:VCALENDAR'].join('\r\n');
  return 'data:text/calendar;charset=utf-8,'+encodeURIComponent(txt); }
function viewDays(c){ var today=c.today, hj=hijri(today), up=upcomingDays(c);
  var h=back()+'<header class="col"><h1>'+esc(t('dTitle'))+'</h1><span class="small muted">'+esc(t('dToday'))+': '+esc(longDate(today,{day:'numeric',month:'long',year:'numeric'}))+(hj?' · '+esc(hj):'')+'</span></header>';
  function dateTxt(d){ return longDate(d.d,{weekday:'long'})+(d.night?(S.lang==='tr'?' ':'')+t('dEve'):'')+' '+longDate(d.d,{day:'numeric',month:'long',year:'numeric'}); }
  if(!up.length) return h+'<div class="status no"><span class="title">'+esc(t('dNoMore'))+'</span></div>';
  var f=up[0];
  h+='<section class="hero"><span class="lbl">'+esc(t('dNext'))+'</span><div class="num" style="font-size:30px;font-weight:700;line-height:1.1">'+esc(f.n[S.lang])+'</div><div class="sub">'+esc(dateTxt(f))+(f.h?' · '+esc(f.h):'')+'</div>'+
    '<div class="between"><span class="chip gold" style="font-size:14px;padding:6px 12px">'+esc(whenTxt(c,f))+'</span>'+(f.s?'<span class="dim">'+esc(f.s[S.lang])+'</span>':'')+'</div>'+
    (OWN?'<a class="btn onhero" href="'+icsLink(f)+'" download="'+f.d+'.ics">'+esc(t('dCal'))+'</a>':'')+'</section>';
  if(up.length>1){ h+='<section class="list">'; up.slice(1).forEach(function(d){
    h+='<div class="item"><span class="num c-accent" style="width:64px;font-size:14px;font-weight:700;flex:0 0 auto">'+esc(longDate(d.d,{day:'numeric',month:'short'}))+'</span><div class="col grow"><span class="title">'+esc(d.n[S.lang])+'</span><span class="small muted">'+esc(longDate(d.d,{weekday:'long'}))+(d.h?' · '+esc(d.h):'')+(d.s?' · '+esc(d.s[S.lang]):'')+' · '+esc(whenTxt(c,d))+'</span></div>'+
      (OWN?'<a class="chip tap" href="'+icsLink(d)+'" download="'+d.d+'.ics" aria-label="'+esc(t('dCal'))+'">+</a>':'')+'</div>'; });
    h+='</section>'; }
  h+='<div class="note center">'+esc(t('dSrc'))+'</div>'; return h; }

function viewRamadan(c){ var p=c.place, h=back()+'<h1>'+esc(t('rTitle'))+' 1448</h1>';
  if(inRamadan(c.today)) h+=ramadanCard(c);
  else { var n=dayDiff(c.today,RAM.start), f=timesFor(RAM.start);
    if(n>0) h+='<section class="hero night"><span class="lbl">'+esc(t('rStarts',{n:n}))+'</span><div class="sub">'+esc(t('rFirst',{c:p.name}))+'</div><div class="grid2"><div class="col"><span class="dim">'+esc(t('rImsak'))+'</span><span class="big" style="font-size:40px">'+hm(f.fajr)+'</span></div><div class="col"><span class="dim">'+esc(t('rIftar'))+'</span><span class="big" style="font-size:40px">'+hm(f.set)+'</span></div></div><div class="dim">'+esc(t('rAuto'))+'</div></section>'; }
  h+='<section class="card"><h2>'+esc(t('rTable',{c:p.name}))+'</h2><div class="tablewrap"><table><thead><tr><th>#</th><th>'+esc(t('rDate'))+'</th><th class="num">'+esc(t('rImsak'))+'</th><th class="num">'+esc(t('rIftar'))+'</th><th class="num">Yatsı</th></tr></thead><tbody>';
  for(var i=0,k=RAM.start;k<=RAM.end;k=addDays(k,1),i++){ var x=timesFor(k);
    h+='<tr'+(k===c.today?' class="today"':'')+'><td class="num">'+(i+1)+'</td><td>'+esc(longDate(k,{weekday:'short',day:'numeric',month:'short'}))+(k==='2027-03-05'?' · Kadir':'')+'</td><td class="num">'+hm(x.fajr)+'</td><td class="num">'+hm(x.set)+'</td><td class="num">'+hm(x.isha)+'</td></tr>'; }
  h+='</tbody></table></div><span class="note">'+esc(t('srcCalc'))+'</span></section>'; return h; }

function viewOverview(c){ var h=back()+'<header class="col"><h1>'+esc(t('ovTitle'))+'</h1><span class="small muted">'+esc(t('ovSub'))+'</span></header><section class="card"><div class="ov"><span></span>';
  PR.forEach(function(id){ h+='<span class="hd">'+esc(pname(id).slice(0,3))+'</span>'; });
  for(var n=0,k=c.today;n<7;n++,k=addDays(k,-1)){ var d=buildDay(k);
    h+='<span class="small" style="font-weight:600">'+esc(longDate(k,{weekday:'short',day:'numeric',month:'short'}))+'</span>';
    d.prayers.forEach(function(p){ var st=S.prayed[p.key]?'done':S.kaza[p.key]?'kaza':(p.end<=c.now && p.start>=S.sinceMs)?'miss':'';
      h+='<button class="cell '+st+'" data-act="cell" data-key="'+p.key+'" aria-label="'+esc(pname(p.id)+' '+longDate(k,{day:'numeric',month:'short'})+(st?' · '+t(st==='done'?'ovLegDone':st==='kaza'?'ovLegKaza':'ovLegMiss'):''))+'">'+IC.check+'</button>'; }); }
  h+='</div><div class="legend"><span><i class="dot" style="background:var(--accent)"></i>'+esc(t('ovLegDone'))+'</span><span><i class="dot" style="border:2px solid var(--accent-ink)"></i>'+esc(t('ovLegKaza'))+'</span><span><i class="dot" style="background:var(--warn-soft);border:1px solid var(--warn-line)"></i>'+esc(t('ovLegMiss'))+'</span></div></section>';
  var miss=missedList(c);
  h+='<section class="list"><div class="item"><h2 class="grow">'+esc(t('ovKaza'))+(miss.length?' ('+miss.length+')':'')+'</h2></div>';
  if(!miss.length) h+='<div class="item"><span class="small muted">'+esc(t('ovNone'))+'</span></div>';
  miss.forEach(function(p){ h+='<div class="item"><div class="col grow"><span class="title">'+esc(pname(p.id))+'</span><span class="small muted">'+esc(longDate(p.day,{weekday:'long',day:'numeric',month:'long'}))+'</span></div><button class="btn soft" data-act="kaza" data-key="'+p.key+'">'+esc(t('ovDone'))+'</button></div>'; });
  return h+'</section>'; }

var monthOff=0;
function viewMonth(c){ var a=splitKey(c.today), dt=new Date(Date.UTC(a.y,a.m-1+monthOff,1)), y=dt.getUTCFullYear(), m=dt.getUTCMonth()+1, first=keyOf(y,m,1);
  var h=back()+'<div class="between"><button class="btn line" data-act="month" data-d="-1" aria-label="‹">‹</button><h1 class="center" style="font-size:20px">'+esc(longDate(first,{month:'long',year:'numeric'}))+'</h1><button class="btn line" data-act="month" data-d="1" aria-label="›">›</button></div><span class="small muted center">'+esc(c.place.name)+'</span>';
  h+='<section class="card" style="padding:8px"><div class="tablewrap"><table><thead><tr><th></th><th class="num">İms</th><th class="num">Gün</th><th class="num">Öğl</th><th class="num">İki</th><th class="num">Akş</th><th class="num">Yat</th></tr></thead><tbody>';
  for(var k=first; splitKey(k).m===m; k=addDays(k,1)){ var x=timesFor(k);
    h+='<tr'+(k===c.today?' class="today"':'')+'><td>'+esc(longDate(k,{weekday:'short',day:'numeric'}))+'</td><td class="num">'+hm(x.fajr)+'</td><td class="num">'+hm(x.rise)+'</td><td class="num">'+hm(x.noon)+'</td><td class="num">'+hm(x.asr)+'</td><td class="num">'+hm(x.set)+'</td><td class="num">'+hm(x.isha)+'</td></tr>'; }
  return h+'</tbody></table></div></section><div class="note center">'+esc(t('srcCalc'))+'</div>'; }

function linkCard(href,title,sub){ return '<a class="linkcard" href="'+href+'"><div class="col grow"><span class="title">'+esc(title)+'</span><span class="small muted">'+esc(sub)+'</span></div><span aria-hidden="true">›</span></a>'; }
function viewMore(c){ var up=upcomingDays(c), miss=missedList(c).length;
  return '<h1>'+esc(t('mTitle'))+'</h1>'+
    linkCard('#vensters',t('mKerahat'),t('mKerahatSub'))+
    linkCard('#maand',t('mMonth'),t('mMonthSub'))+
    linkCard('#overzicht',t('mOverview'),miss?t('kazaCount',{n:miss}):t('mOverviewSub'))+
    linkCard('#dagen',t('mDays'),up.length?t('dNext')+': '+up[0].n[S.lang]+', '+whenTxt(c,up[0]):t('dNoMore'))+
    linkCard('#ramadan',t('mRam'),t('mRamSub'))+
    linkCard('#meldingen',t('mAlerts'),t('mAlertsSub'))+
    linkCard('#instellingen',t('mSettings'),t('mSettingsSub'))+
    '<div class="note center">'+esc(t('indep'))+'</div>'; }

var SOUNDS=['bel','druppel','ney','akkoord','stil'];
function sname(id){ return t('s'+id.charAt(0).toUpperCase()+id.slice(1)); }
function viewAlerts(){ var s=S.set, h=back()+'<h1>'+esc(t('mAlerts'))+'</h1>';
  h+= soundOn ? '<div class="status">'+IC.ok+'<span class="title">'+esc(t('soundIsOn'))+'</span></div>'
              : '<button class="btn wide" data-act="soundon">'+esc(t('soundEnable'))+'</button>';
  h+='<section class="list"><div class="item"><h2 class="grow">'+esc(t('alerts'))+'</h2></div>'+
     '<div class="item"><span class="title grow">'+esc(t('aStart'))+'</span>'+sw('start',s.start,t('aStart'))+'</div>'+
     '<div class="item"><div class="col grow"><span class="title">'+esc(t('aAsk'))+'</span><span class="small muted">'+esc(t('aAskSub'))+'</span></div>'+sw('ask',s.ask,t('aAsk'))+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aAskMin'))+'</span>'+stepper('askMin',s.askMin,5,60,5)+'</div>'+
     '<div class="item"><div class="col grow"><span class="title">'+esc(t('aRemind'))+'</span><span class="small muted">'+esc(t('aRemindSub'))+'</span></div>'+sw('remind',s.remind,t('aRemind'))+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aMin'))+'</span>'+stepper('remindMin',s.remindMin,5,45,5)+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aIkindi'))+'</span>'+sw('ikindi',s.ikindi,t('aIkindi'))+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aKerahat'))+'</span>'+sw('kerahat',s.kerahat,t('aKerahat'))+'</div>'+
     '<div class="item"><div class="col grow"><span class="title">'+esc(t('aCuma'))+'</span><span class="small muted">'+esc(t('aCumaSub'))+'</span></div>'+sw('cuma',s.cuma,t('aCuma'))+'</div></section><div class="note">'+esc(t('aNote'))+'</div>';
  h+='<section class="list"><div class="item"><h2 class="grow">'+esc(t('sound'))+'</h2></div>';
  SOUNDS.forEach(function(id){ h+='<div class="item"><button class="radio" data-act="sound" data-id="'+id+'" aria-pressed="'+(s.sound===id)+'" aria-label="'+esc(sname(id))+'">'+(s.sound===id?IC.on:IC.off)+'</button><span class="title grow">'+esc(sname(id))+'</span>'+(id==='stil'?'':'<button class="play" data-act="play" data-id="'+id+'" aria-label="'+esc(t('sPlay',{s:sname(id)}))+'">'+IC.play+'</button>')+'</div>'; });
  h+='<div class="item"><button class="radio" data-act="sound" data-id="eigen" aria-pressed="'+(s.sound==='eigen')+'" aria-label="'+esc(t('sEigen'))+'"'+(customUrl?'':' disabled')+'>'+(s.sound==='eigen'?IC.on:IC.off)+'</button><div class="col grow"><label for="file" style="font-size:15px;color:var(--ink)">'+esc(t('sEigen'))+'</label><input id="file" type="file" accept="audio/*" style="font-size:13px;max-width:100%"></div>'+(customUrl?'<button class="play" data-act="play" data-id="eigen" aria-label="'+esc(t('sPlay',{s:t('sEigen')}))+'">'+IC.play+'</button>':'')+'</div></section><div class="note">'+esc(t('sNote'))+'</div>';
  return h; }
function viewSettings(c){ var h=back()+'<h1>'+esc(t('mSettings'))+'</h1>';
  h+='<section class="card"><h2>'+esc(t('lang'))+'</h2>'+langCtl()+'</section>';
  h+='<section class="card"><label for="city" style="font-size:15px;font-weight:700;color:var(--ink)">'+esc(t('place'))+'</label>'+(S.geo?'<span class="small muted">'+esc(t('myLoc'))+': '+esc(c.place.name)+' ('+S.geo.lat.toFixed(2)+', '+S.geo.lng.toFixed(2)+')</span>':'')+
     (OWN?'<button class="btn '+(S.geo?'soft':'')+' wide" data-act="geo">'+esc(t('useLoc'))+'</button><span class="small c-warn" id="geomsg" style="font-weight:600"></span>':'')+citySelect('city')+'</section>';
  h+='<section class="card"><h2>'+esc(t('look'))+'</h2><div class="segctl"><button data-act="mode" data-id="auto" aria-pressed="'+(S.mode==='auto')+'">'+esc(t('lookAuto'))+'</button><button data-act="mode" data-id="light" aria-pressed="'+(S.mode==='light')+'">'+esc(t('lookLight'))+'</button><button data-act="mode" data-id="dark" aria-pressed="'+(S.mode==='dark')+'">'+esc(t('lookDark'))+'</button></div><span class="small muted">'+esc(t('lookSub'))+'</span></section>';
  h+='<section class="card"><div class="between"><div class="col"><h2>'+esc(t('work'))+'</h2><span class="small muted">'+esc(t('workSub'))+'</span></div><button class="switch" role="switch" aria-checked="'+(S.work.on?'true':'false')+'" aria-label="'+esc(t('work'))+'" data-act="work"><span><span></span></span></button></div>'+
     (S.work.on?'<div class="grid2"><div class="col"><label for="wfrom">'+esc(t('workFrom'))+'</label><input id="wfrom" type="time" value="'+esc(S.work.from)+'"></div><div class="col"><label for="wto">'+esc(t('workTo'))+'</label><input id="wto" type="time" value="'+esc(S.work.to)+'"></div></div>':'')+'</section>';
  h+='<section class="card"><h2>'+esc(t('src'))+'</h2><span class="small muted">'+esc(t('srcText'))+'</span><span class="small muted">'+esc(t('indep'))+'</span></section>';
  return h; }

/* ---------- geluid ---------- */
var AC=null, soundOn=false, customUrl=null, customAudio=null;
function ac(){ if(!AC){ try{ var C=window.AudioContext||window.webkitAudioContext; if(C) AC=new C(); }catch(e){ AC=null; } }
  if(AC && AC.state==='suspended'){ try{ AC.resume(); }catch(e){} } if(AC) soundOn=true; return AC; }
function tone(a,type,f,at,dur,vol,f2,attack){ var o=a.createOscillator(), g=a.createGain(), t0=a.currentTime+at;
  o.type=type; o.frequency.setValueAtTime(f,t0); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t0+dur*0.6);
  g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(vol,t0+(attack||0.02)); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0+dur+0.05); }
function play(kind,fromClick){ try{
  if(kind==='stil') return;
  if(kind==='eigen'){ if(customUrl){ if(!customAudio) customAudio=new window.Audio(customUrl); customAudio.currentTime=0; var pr=customAudio.play(); if(pr && pr.catch) pr.catch(function(){}); } return; }
  var a= fromClick ? ac() : AC; if(!a) return;
  if(kind==='bel'){ [0,1.1].forEach(function(d){ tone(a,'sine',880,d,1.6,0.25); tone(a,'sine',1320,d,1.2,0.10); tone(a,'sine',2640,d,0.5,0.04); }); }
  else if(kind==='druppel'){ [0,0.45,0.9].forEach(function(d,i){ tone(a,'sine',1300-i*120,d,0.35,0.3,480); }); }
  else if(kind==='ney'){ [[293.7,0,1.3],[349.2,1.1,1.1],[392,2.0,1.1],[440,2.9,1.9]].forEach(function(n){ tone(a,'triangle',n[0],n[1],n[2],0.22,0,0.25); tone(a,'sine',n[0]*2,n[1],n[2],0.05,0,0.3); }); }
  else if(kind==='akkoord'){ [220,277.2,329.6,440].forEach(function(f,i){ tone(a,'sine',f,i*0.12,3.2,0.14,0,0.4); }); }
  }catch(e){} }

/* ---------- meldingen in de app ---------- */
var fired={}, snooze={}, toastTimer=null;
function hideToast(){ document.getElementById('toast').hidden=true; if(toastTimer){ window.clearTimeout(toastTimer); toastTimer=null; } }
function toast(title,sub,btns,autoMs){ var h='<strong style="font-size:16px">'+esc(title)+'</strong>'+(sub?'<span style="font-size:14px;color:#E3E9E7">'+esc(sub)+'</span>':'')+'<div class="row" style="gap:8px;flex-wrap:wrap">';
  btns.forEach(function(b){ h+='<button class="btn grow '+b.cls+'" data-act="'+b.act+'"'+(b.key?' data-key="'+b.key+'"':'')+'>'+esc(b.l)+'</button>'; });
  document.getElementById('toast-box').innerHTML=h+'</div>'; document.getElementById('toast').hidden=false;
  if(toastTimer) window.clearTimeout(toastTimer); toastTimer=autoMs?window.setTimeout(hideToast,autoMs):null; }
function alerts(c){ var s=S.set, now=c.now, closeB={l:t('close'),cls:'dark',act:'closetoast'};
  function once(id,fn){ if(!fired[id]){ fired[id]=1; fn(); } }
  if(c.cur){ var p=c.cur, nm=pname(p.id);
    if(s.start && now-p.start<60000) once('s'+p.key,function(){ toast(t('tStart',{p:nm}),t('tStartSub',{t:hm(p.end)}),[closeB]); play(s.sound); });
    if(s.ask && !prayed(p.key)){ var since=now-p.start; if(since>=s.askMin*60000 && since<s.askMin*60000+60000 && now<p.end) once('a'+p.key,function(){ toast(t('tAsk',{p:nm}),'',[{l:t('yes'),cls:'gold',act:'toastpray',key:p.key},closeB]); play(s.sound); }); }
    if(snooze[p.key] && now>=snooze[p.key]){ delete snooze[p.key]; delete fired['r'+p.key]; }
    if(s.remind && !prayed(p.key) && !snooze[p.key]){ var dl=(p.id==='ikindi' && s.ikindi)?p.end-KMIN:p.end, left=dl-now;
      if(left>0 && left<=s.remindMin*60000) once('r'+p.key,function(){ toast(t('tRemind',{n:Math.ceil(left/60000),p:nm}),t('tRemindSub',{p:nm}),[{l:t('iPrayed'),cls:'gold',act:'toastpray',key:p.key},{l:t('snooze'),cls:'dark',act:'snooze',key:p.key},closeB]); play(s.sound); }); } }
  if(s.kerahat && c.ker && now-c.ker.start<60000) once('k'+c.ker.start,function(){ toast(t('tKerahat'),t('tKerahatSub',{t:hm(c.ker.end)}),[closeB]); play(s.sound); });
  if(s.cuma && c.wd==='Fri'){ var d=c.day.t.noon-now; if(d>0 && d<=3600000 && d>3540000) once('c'+c.today,function(){ toast(t('tCuma'),t('cumaAt',{t:hm(c.day.t.noon)}),[closeB]); play(s.sound); }); } }

/* ---------- weergave ---------- */
var ROUTES={vandaag:viewToday,vensters:viewWindows,kible:viewQibla,gids:viewGuide,meer:viewMore,dagen:viewDays,ramadan:viewRamadan,overzicht:viewOverview,maand:viewMonth,sure:viewSure,meldingen:viewAlerts,instellingen:viewSettings};
var NAV=[['vandaag','navToday'],['kible','navQibla'],['gids','navGuide'],['meer','navMore']];
function route(){ var h=(window.location.hash||'').replace('#',''); return ROUTES[h]?h:'vandaag'; }
var lastSig='';
function sig(c){ return [route(),c.today,c.cur?c.cur.key:'-',c.next?c.next.key:'-',c.ker?c.ker.id:'-',c.dark?1:0,inRamadan(c.today)?(c.now<c.day.t.fajr?0:c.now<c.day.t.set?1:2):'-'].join('|'); }
function render(){ var c=ctx(), r=route(); lastSig=sig(c);
  document.documentElement.lang=S.lang; document.title=t('appName');
  document.body.setAttribute('data-mode',c.dark?'dark':'light');
  if(!S.chosen){ document.getElementById('app').innerHTML=viewWelcome(); document.getElementById('nav').innerHTML=''; return; }
  document.getElementById('app').innerHTML=ROUTES[r](c);
  var navId=NAV.some(function(x){ return x[0]===r; })?r:(r==='sure'?'gids':r==='vensters'?'vandaag':'meer'), n='';
  NAV.forEach(function(x){ n+='<a href="#'+x[0]+'"'+(x[0]===navId?' aria-current="page"':'')+'><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC.nav[x[0]]+'</svg>'+esc(t(x[1]))+'</a>'; });
  document.getElementById('nav').innerHTML=n; }
function tick(){ var c=ctx(), now=c.now, ae=document.activeElement, typing=ae && /^(INPUT|SELECT)$/.test(ae.tagName);
  if(sig(c)!==lastSig && !typing){ render(); }
  else { var i, els=document.querySelectorAll('[data-cd]'); for(i=0;i<els.length;i++) els[i].textContent=cd(+els[i].getAttribute('data-cd')-now);
    els=document.querySelectorAll('[data-pg]'); for(i=0;i<els.length;i++){ var q=els[i].getAttribute('data-pg').split(','); els[i].style.width=Math.max(0,Math.min(100,(now-q[0])/(q[1]-q[0])*100)).toFixed(1)+'%'; } }
  if(S.chosen) alerts(c); }

function askGeo(){ var msg=document.getElementById('geomsg'); function fail(){ var m=document.getElementById('geomsg'); if(m) m.textContent=t('locFail'); }
  if(msg) msg.textContent=t('locBusy');
  try{ if(!window.navigator.geolocation){ fail(); return; }
    window.navigator.geolocation.getCurrentPosition(function(p){ var la=p.coords.latitude, lo=p.coords.longitude;
      if(!isFinite(la) || !isFinite(lo) || Math.abs(la)>62){ fail(); return; }
      S.geo={lat:+la.toFixed(4),lng:+lo.toFixed(4)}; S.chosen=true; clearTimes(); save(); render(); }, fail, {maximumAge:600000,timeout:15000}); }catch(e){ fail(); } }
function prune(){ var lim=addDays(ctx().today,-40), k; for(k in S.prayed){ if(k.slice(0,10)<lim) delete S.prayed[k]; } for(k in S.kaza){ if(k.slice(0,10)<lim) delete S.kaza[k]; } }

document.addEventListener('click',function(e){ var el=e.target.closest ? e.target.closest('[data-act]') : null; if(!el) return;
  var act=el.getAttribute('data-act'), id=el.getAttribute('data-id'), k=el.getAttribute('data-key');
  if(act==='pray'){ if(S.prayed[k]){ delete S.prayed[k]; hideToast(); } else { S.prayed[k]=1; delete S.kaza[k]; toast(t('checked',{p:pname(k.split(':')[1])}),'',[{l:t('undo'),cls:'dark',act:'undo',key:k}],5000); } prune(); }
  else if(act==='toastpray'){ S.prayed[k]=1; delete S.kaza[k]; hideToast(); }
  else if(act==='undo'){ delete S.prayed[k]; hideToast(); }
  else if(act==='snooze'){ snooze[k]=Date.now()+300000; hideToast(); return; }
  else if(act==='closetoast'){ hideToast(); return; }
  else if(act==='cell'){ if(S.prayed[k]) delete S.prayed[k]; else if(S.kaza[k]) delete S.kaza[k]; else S.prayed[k]=1; }
  else if(act==='kaza'){ S.kaza[k]=1; }
  else if(act==='fast'){ if(S.fasted[k]) delete S.fasted[k]; else S.fasted[k]=1; }
  else if(act==='toggle'){ S.set[id]=!S.set[id]; }
  else if(act==='step'){ var v=S.set[id]+(+el.getAttribute('data-d')); S.set[id]=Math.max(+el.getAttribute('data-min'),Math.min(+el.getAttribute('data-max'),v)); }
  else if(act==='guide'){ S.guide=id; }
  else if(act==='suremode'){ S.sureMode=id; }
  else if(act==='sure'){ curSure=id; if(route()!=='sure'){ window.location.hash='#sure'; return; } }
  else if(act==='lang'){ S.lang=id; }
  else if(act==='mode'){ S.mode=id; }
  else if(act==='sound'){ S.set.sound=id; play(id,true); }
  else if(act==='play'){ play(id,true); if(soundOn && route()==='meldingen') render(); return; }
  else if(act==='soundon'){ ac(); play(S.set.sound,true); }
  else if(act==='geo'){ askGeo(); return; }
  else if(act==='compass'){ startCompass(); return; }
  else if(act==='compassoff'){ stopCompass(); }
  else if(act==='mosq'){ findMosques(); return; }
  else if(act==='month'){ monthOff+= +el.getAttribute('data-d'); }
  else if(act==='work'){ S.work.on=!S.work.on; }
  else if(act==='start'){ var sel=document.getElementById('city0'); S.city=+sel.value; S.geo=null; S.chosen=true; clearTimes(); }
  save(); render(); });
document.addEventListener('change',function(e){ var el=e.target;
  if(el.id==='city'){ S.city=+el.value; S.geo=null; S.chosen=true; clearTimes(); save(); render(); }
  else if(el.id==='city0'){ S.city=+el.value; }
  else if((el.id==='wfrom' || el.id==='wto') && /^\d\d:\d\d$/.test(el.value)){ S.work[el.id==='wfrom'?'from':'to']=el.value; save(); render(); }
  else if(el.id==='file' && el.files && el.files[0]){ try{ if(customUrl) window.URL.revokeObjectURL(customUrl); customUrl=window.URL.createObjectURL(el.files[0]); customAudio=null; S.set.sound='eigen'; save(); render(); }catch(err){} } });
window.addEventListener('hashchange',function(){ if(compass.on && route()!=='kible') stopCompass(); render(); try{ window.scrollTo(0,0); }catch(e){} });

render();
window.setInterval(tick,1000);
if(OWN && S.geo && window.navigator.geolocation){ try{ window.navigator.geolocation.getCurrentPosition(function(p){ var la=p.coords.latitude, lo=p.coords.longitude;
  if(isFinite(la) && isFinite(lo) && Math.abs(la)<=62 && distKm(S.geo.lat,S.geo.lng,la,lo)>2){ S.geo={lat:+la.toFixed(4),lng:+lo.toFixed(4)}; clearTimes(); save(); render(); } }, function(){}, {maximumAge:600000,timeout:15000}); }catch(e){} }
if(OWN && 'serviceWorker' in window.navigator){ try{ window.navigator.serviceWorker.register('sw.js').catch(function(){}); }catch(e){} }
})();

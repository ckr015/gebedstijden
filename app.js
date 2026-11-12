(function(){
'use strict';

/* ---------- vaste gegevens ---------- */
var CITIES=[
['Amsterdam',52.3676,4.9041,'Europe/Amsterdam'],['Rotterdam',51.9244,4.4777,'Europe/Amsterdam'],['Den Haag',52.0705,4.3007,'Europe/Amsterdam'],
['Utrecht',52.0907,5.1214,'Europe/Amsterdam'],['Eindhoven',51.4416,5.4697,'Europe/Amsterdam'],['Tilburg',51.5555,5.0913,'Europe/Amsterdam'],
['Groningen',53.2194,6.5665,'Europe/Amsterdam'],['Almere',52.3508,5.2647,'Europe/Amsterdam'],['Breda',51.5719,4.7683,'Europe/Amsterdam'],
['Nijmegen',51.8126,5.8372,'Europe/Amsterdam'],['Enschede',52.2215,6.8937,'Europe/Amsterdam'],['Arnhem',51.9851,5.8987,'Europe/Amsterdam'],
['Haarlem',52.3874,4.6462,'Europe/Amsterdam'],['Zaandam',52.4420,4.8292,'Europe/Amsterdam'],['Amersfoort',52.1561,5.3878,'Europe/Amsterdam'],
['Apeldoorn',52.2112,5.9699,'Europe/Amsterdam'],['Den Bosch',51.6978,5.3037,'Europe/Amsterdam'],['Zwolle',52.5168,6.0830,'Europe/Amsterdam'],
['Leiden',52.1601,4.4970,'Europe/Amsterdam'],['Dordrecht',51.8133,4.6901,'Europe/Amsterdam'],['Maastricht',50.8514,5.6910,'Europe/Amsterdam'],
['Deventer',52.2661,6.1552,'Europe/Amsterdam'],['Venlo',51.3704,6.1724,'Europe/Amsterdam'],['Schiedam',51.9170,4.3988,'Europe/Amsterdam'],
['Leeuwarden',53.2012,5.7999,'Europe/Amsterdam'],['Alkmaar',52.6324,4.7534,'Europe/Amsterdam'],['Delft',52.0116,4.3571,'Europe/Amsterdam'],
['Hengelo',52.2658,6.7931,'Europe/Amsterdam'],['Almelo',52.3567,6.6625,'Europe/Amsterdam'],['Roermond',51.1942,5.9870,'Europe/Amsterdam'],
['Zoetermeer',52.0575,4.4931,'Europe/Amsterdam'],['Amstelveen',52.3114,4.8701,'Europe/Amsterdam'],['Diemen',52.3380,4.9597,'Europe/Amsterdam'],
['Hoofddorp',52.3061,4.6907,'Europe/Amsterdam'],['Purmerend',52.5050,4.9597,'Europe/Amsterdam'],['Hoorn',52.6424,5.0602,'Europe/Amsterdam'],
['Hilversum',52.2292,5.1669,'Europe/Amsterdam'],['Lelystad',52.5185,5.4714,'Europe/Amsterdam'],['Ede',52.0402,5.6649,'Europe/Amsterdam'],
['Veenendaal',52.0286,5.5589,'Europe/Amsterdam'],['Gouda',52.0115,4.7105,'Europe/Amsterdam'],['Alphen aan den Rijn',52.1290,4.6575,'Europe/Amsterdam'],
['Vlaardingen',51.9125,4.3420,'Europe/Amsterdam'],['Helmond',51.4793,5.6570,'Europe/Amsterdam'],['Oss',51.7650,5.5180,'Europe/Amsterdam'],
['Bergen op Zoom',51.4946,4.2872,'Europe/Amsterdam'],['Heerlen',50.8882,5.9795,'Europe/Amsterdam'],['Sittard',51.0000,5.8694,'Europe/Amsterdam'],
['Emmen',52.7792,6.9069,'Europe/Amsterdam'],['Assen',52.9929,6.5642,'Europe/Amsterdam'],['Middelburg',51.4988,3.6110,'Europe/Amsterdam'],
['Den Helder',52.9563,4.7608,'Europe/Amsterdam'],['Tiel',51.8876,5.4279,'Europe/Amsterdam'],['Waalwijk',51.6828,5.0707,'Europe/Amsterdam'],
['Antwerpen',51.2194,4.4025,'Europe/Brussels'],['Brussel',50.8503,4.3517,'Europe/Brussels'],['Gent',51.0543,3.7174,'Europe/Brussels'],
['Genk',50.9650,5.5008,'Europe/Brussels'],['Keulen',50.9375,6.9603,'Europe/Berlin'],['Duisburg',51.4344,6.7623,'Europe/Berlin'],
['Berlijn',52.5200,13.4050,'Europe/Berlin'],['İstanbul',41.0082,28.9784,'Europe/Istanbul'],['Ankara',39.9334,32.8597,'Europe/Istanbul'],
['İzmir',38.4237,27.1428,'Europe/Istanbul'],['Konya',37.8746,32.4932,'Europe/Istanbul'],['Kayseri',38.7205,35.4826,'Europe/Istanbul']];

// begin van de hijri-maanden volgens de Diyanet-kalender (1448)
var HIJRI=[['2026-10-12','Cemaziyelevvel',1448],['2026-11-10','Cemaziyelahir',1448],['2026-12-10','Recep',1448],['2027-01-09','Şaban',1448],['2027-02-08','Ramazan',1448],['2027-03-09','Şevval',1448],
['2027-04-08','Zilkade',1448],['2027-05-07','Zilhicce',1448],['2027-06-06','Muharrem',1449],['2027-07-05','Safer',1449],['2027-08-03','Rebiulevvel',1449],['2027-09-02','Rebiulahir',1449],
['2027-10-01','Cemaziyelevvel',1449],['2027-10-31','Cemaziyelahir',1449],['2027-11-29','Recep',1449],['2027-12-29','Şaban',1449]];
var RAM={start:'2027-02-08',end:'2027-03-08'};
var DAYS=[
{d:'2026-12-10',night:1,h:'1 Recep 1448',n:{nl:'Regaib Kandili',tr:'Regaib Kandili'},s:{nl:'Ook het begin van de drie maanden',tr:'Üç ayların başlangıcı'}},
{d:'2027-01-04',night:1,h:'26 Recep 1448',n:{nl:'Miraç Kandili',tr:'Miraç Kandili'}},
{d:'2027-01-22',night:1,h:'14 Şaban 1448',n:{nl:'Berat Kandili',tr:'Berat Kandili'}},
{d:'2027-02-08',h:'1 Ramazan 1448',n:{nl:'Begin van Ramadan',tr:'Ramazan başlangıcı'},s:{nl:'Eerste vastendag',tr:'İlk oruç'}},
{d:'2027-03-05',night:1,h:'26 Ramazan 1448',n:{nl:'Kadir Gecesi',tr:'Kadir Gecesi'}},
{d:'2027-03-09',h:'1 Şevval 1448',n:{nl:'Ramazan Bayramı',tr:'Ramazan Bayramı'},s:{nl:'3 dagen',tr:'3 gün'}},
{d:'2027-05-16',h:'10 Zilhicce 1448',n:{nl:'Kurban Bayramı',tr:'Kurban Bayramı'},s:{nl:'4 dagen',tr:'4 gün'}},
{d:'2027-06-06',h:'1 Muharrem 1449',n:{nl:'Hijri nieuwjaar',tr:'Hicri yılbaşı'}},
{d:'2027-06-15',h:'10 Muharrem 1449',n:{nl:'Aşure-dag',tr:'Aşure günü'}},
{d:'2027-08-13',night:1,h:'11 Rebiulevvel 1449',n:{nl:'Mevlid Kandili',tr:'Mevlid Kandili'}},
{d:'2027-11-29',h:'1 Recep 1449',n:{nl:'Begin van de drie maanden',tr:'Üç ayların başlangıcı'}},
{d:'2027-12-02',night:1,h:'4 Recep 1449',n:{nl:'Regaib Kandili',tr:'Regaib Kandili'}}];

var PR=['sabah','ogle','ikindi','aksam','yatsi'];
var NAME={cuma:'Cuma',sabah:'Sabah',gunes:'Güneş',ogle:'Öğle',ikindi:'İkindi',aksam:'Akşam',yatsi:'Yatsı'};

var GUIDE={
sabah:[{k:'sunnet',s:['Kâfirun','İhlas']},{k:'farz',s:['Kevser','İhlas']}],
ogle:[{k:'sunnet',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',s:['Kâfirun','Nasr',null,null]},{k:'son',s:['Felak','Nas']}],
ikindi:[{k:'sunnetG',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',s:['Kâfirun','Nasr',null,null]}],
aksam:[{k:'farz',s:['Kevser','İhlas',null]},{k:'sunnet',s:['Felak','Nas']}],
cuma:[{k:'sunnet',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',imam:1,s:[null,null]},{k:'son',s:['Kâfirun','Nasr','Felak','Nas']}],
yatsi:[{k:'sunnetG',s:['Fil','Kureyş','Maun','Kevser']},{k:'farz',s:['Kâfirun','Nasr',null,null]},{k:'son',s:['Felak','Nas']},{k:'vitir',s:['Kâfirun','İhlas','Felak']}]};

/* ---------- teksten ---------- */
var L={nl:{
navToday:'Vandaag',navWin:'Vensters',navQibla:'Kıble',navGuide:'Gids',navMore:'Meer',
now:'Nu',next:'Volgende',untilEnd:'tot het einde van {p}',untilNext:'tot het volgende gebed',untilSun:'tot zonsopgang',at:'om',
prayedBtn:'Ik heb {p} gebeden',prayedDone:'{p} is afgevinkt',undo:'Ongedaan maken',
allowed:'Bidden is nu toegestaan',kerahatNow:'Kerahat: nu niet bidden',kerahatUntil:'Tot {t}',kerahatOnlyAsr:'Tot {t}. Alleen de ikindi-farz van vandaag mag nog.',
nextKerahat:'Volgende kerahat: {a} – {b}',tomorrow:'morgen',
until:'tot {t}',kerahatFrom:'kerahat vanaf {t}',kerahatTill:'kerahat tot {t}',noPrayer:'geen gebed',sabahName:'Sabah (İmsak)',
summary:'{n} van 5 gebeden vandaag afgevinkt',srcCalc:'Tijden volgens Diyanet',
cumaToday:'Vandaag is het cuma',cumaAt:'Vrijdaggebed in de öğle-tijd, vanaf {t}',cumaTomorrow:'Morgen is het cuma',cumaTomorrowSub:'Vrijdaggebed vanaf {t}',
winTitle:'Wanneer mag je bidden?',winSub:'Vandaag in {c}, Hanefi-regels',ok:'Mag',no:'Niet',
wSabah:'Alleen sünnet en farz van sabah. Kaza mag, andere nafile niet.',wK1:'Kerahat – zonsopgang',wK1s:'Geen enkel gebed',wFree:'Vrije tijd',wFrees:'Kaza en nafile (duha)',
wK2:'Kerahat – istiva',wK2s:'Zon op het hoogste punt',wOgle:'Tot ikindi begint',wIkindi:'Na de farz geen nafile meer. Kaza mag.',
wK3:'Kerahat – zonsondergang',wK3s:'Alleen ikindi-farz van vandaag',wAksam:'Liefst direct, niet uitstellen',wYatsi:'Yatsı en vitir tot imsak. Liefst vóór {t}, het midden van de nacht.',k3Pray:'Bid nu nog je ikindi-farz',k3PraySub:'Tot {t} mag alleen dit gebed. Zo laat bidden zonder reden is mekruh.',
qTitle:'Kıble en moskee',qFrom:'{d}° vanaf het noorden, richting {w}',qHelp:'Houd je telefoon plat met de bovenkant naar het noorden. De pijl wijst dan naar de kıble.',
qNote:'Een kompas dat meedraait komt in de iPhone-app. Deze webpagina mag de sensoren van je telefoon niet gebruiken.',
qMosque:'Moskeeën in de buurt',qMosqueSub:'Opent Google Maps rond {c}',qOpen:'Open kaart',
gTitle:'Gebedsgids',gSub:'Wat lees je in welke rekat · Hanefi',gOnly:'Alleen Fatiha',gRekat:'rekat',
u_sunnet:'Sünnet',u_sunnetG:'Sünnet (gayr-i müekked)',u_farz:'Farz',u_son:'Son sünnet',u_vitir:'Vitir',
n_std:'Eerste rekat begint met Sübhaneke. Laatste zit: Ettehiyyatü, Salli-Barik, Rabbena.',
n_farz4:'Na rekat 2: Ettehiyyatü. Laatste zit: Ettehiyyatü, Salli-Barik, Rabbena.',
n_sunnetG:'Na rekat 2: Ettehiyyatü en Salli-Barik. Rekat 3 begint weer met Sübhaneke.',
n_vitir:'Rekat 3: na de sure tekbir en de Kunut-dua’s, daarna rükû.',
gImam:'Met de imam',n_cuma:'Achter de imam lees je zelf geen Fatiha of sure. Het cuma-gebed komt in de plaats van öğle.',
gFoot:'De sure’s zijn een voorstel met korte sure’s in de volgorde van de Koran. Je mag andere kiezen.',
dTitle:'Heilige dagen en nachten',dToday:'Vandaag',dNext:'Eerstvolgende',dIn:'over {n} dagen',dIn1:'morgen',dIn0:'vandaag',dEve:'avond',dSrc:'Bron: Diyanet, dinî günler takvimi 2026 en 2027',
rTitle:'Ramadan',rStarts:'Ramadan begint over {n} dagen',rFirst:'Maandag 8 februari 2027 in {c}',rDay:'Ramadan · dag {n}',rIftarIn:'İftar over',rSahurIn:'Sahur nog',rIftarWas:'İftar was om {t}',
rImsak:'İmsak',rIftar:'İftar',rFast:'Ik vast vandaag',rFastSub:'Gemiste dagen kun je later inhalen',rTeravih:'Teravih na yatsı, vanaf {t}',rSahurTom:'Sahur morgen tot {t}',
rTable:'İmsakiye voor {c}',rDate:'Datum',rAuto:'Deze weergave gaat vanzelf aan op 1 Ramazan.',
mTitle:'Meer',mDays:'Heilige dagen en nachten',mRam:'Ramadan',mRamSub:'Teller, vasten afvinken, imsakiye',
lang:'Taal',place:'Plaats',pickCity:'Kies je stad',pickCitySub:'Eén keer kiezen, daarna onthoudt de app het.',
src:'Bron van de tijden',srcText:'De app rekent de tijden zelf uit met de regels van Diyanet, ook de zomerregels voor Nederland. Je hoeft niets in te stellen. Vergeleken met de officiële Diyanet-tabel is het verschil meestal 0 en hooguit 3 minuten.',
alerts:'Meldingen',aStart:'Bij begin van elk gebed',aRemind:'Herinnering vóór het einde',aRemindSub:'Alleen als je niet hebt afgevinkt',aMin:'Hoe lang van tevoren',
aIkindi:'İkindi: herinner vóór de kerahat',aKerahat:'Kerahat begint',aCuma:'Vrijdaggebed (cuma)',aCumaSub:'1 uur voor cuma',
aNote:'Meldingen werken alleen zolang deze pagina open staat. Echte meldingen en de volledige ezan komen in de iPhone-app.',
kNote:'Kerahat volgens Diyanet: ongeveer 45 minuten na zonsopgang, kort voor öğle als de zon op haar hoogst staat, en ongeveer 45 minuten voor zonsondergang.',min:'min',
sound:'Geluid',sBel:'Zachte bel',sDruppel:'Waterdruppel',sNey:'Ney-toon',sAkkoord:'Rustig akkoord',sStil:'Stil',sEigen:'Eigen geluidsbestand',sPick:'Kies een bestand',sPlay:'Beluister {s}',
sNote:'Tik één keer op een afspeelknop. Daarna mag de pagina geluid maken zolang hij open staat. Een eigen bestand blijft bewaard tot je de pagina sluit.',
tStart:'Tijd voor {p}',tStartSub:'Bidden kan tot {t}.',tRemind:'Nog {n} min voor {p}',tRemindSub:'Je hebt {p} nog niet afgevinkt.',tKerahat:'Kerahat is begonnen',tKerahatSub:'Niet bidden tot {t}.',tCuma:'Over een uur is het cuma',
close:'Sluit',iPrayed:'Ik heb gebeden',
wind:['N','NO','O','ZO','Z','ZW','W','NW'],locale:'nl-NL'
},tr:{
navToday:'Bugün',navWin:'Vakitler',navQibla:'Kıble',navGuide:'Rehber',navMore:'Diğer',
now:'Şimdi',next:'Sıradaki',untilEnd:'{p} vaktinin çıkmasına',untilNext:'sıradaki vakte kalan',untilSun:'güneşin doğmasına',at:'saat',
prayedBtn:'{p} namazını kıldım',prayedDone:'{p} işaretlendi',undo:'Geri al',
allowed:'Şu an namaz kılınabilir',kerahatNow:'Kerahat: şu an namaz kılınmaz',kerahatUntil:'{t} saatine kadar',kerahatOnlyAsr:'{t} saatine kadar. Yalnızca o günün ikindi farzı kılınabilir.',
nextKerahat:'Sıradaki kerahat: {a} – {b}',tomorrow:'yarın',
until:'{t} saatine kadar',kerahatFrom:'kerahat {t} itibarıyla',kerahatTill:'kerahat {t} saatine kadar',noPrayer:'namaz yok',sabahName:'İmsak / Sabah',
summary:'Bugün 5 vakitten {n} tanesi işaretlendi',srcCalc:'Vakitler Diyanet’e göre',
cumaToday:'Bugün cuma',cumaAt:'Cuma namazı öğle vaktinde, {t} itibarıyla',cumaTomorrow:'Yarın cuma',cumaTomorrowSub:'Cuma namazı {t} itibarıyla',
winTitle:'Ne zaman namaz kılınır?',winSub:'Bugün {c}, Hanefî hükümleri',ok:'Olur',no:'Olmaz',
wSabah:'Yalnız sabahın sünneti ve farzı. Kaza olur, başka nafile olmaz.',wK1:'Kerahat – güneş doğarken',wK1s:'Hiçbir namaz kılınmaz',wFree:'Serbest vakit',wFrees:'Kaza ve nafile (duha)',
wK2:'Kerahat – istiva',wK2s:'Güneş tepe noktasında',wOgle:'İkindi girene kadar',wIkindi:'Farzdan sonra nafile kılınmaz. Kaza olur.',
wK3:'Kerahat – güneş batarken',wK3s:'Yalnızca o günün ikindi farzı',wAksam:'Geciktirmeden kılınmalı',wYatsi:'Yatsı ve vitir imsaka kadar. {t} (gece yarısı) öncesi tercih edilir.',k3Pray:'İkindi farzını şimdi kılın',k3PraySub:'{t} saatine kadar yalnız bu namaz kılınır. Özürsüz bu vakte bırakmak mekruhtur.',
qTitle:'Kıble ve cami',qFrom:'Kuzeyden {d}°, {w} yönü',qHelp:'Telefonu düz tutun, üst kenarı kuzeye baksın. Ok kıbleyi gösterir.',
qNote:'Dönen pusula iPhone uygulamasında olacak. Bu web sayfası telefonun sensörlerini kullanamaz.',
qMosque:'Yakındaki camiler',qMosqueSub:'{c} çevresinde Google Haritalar açılır',qOpen:'Haritayı aç',
gTitle:'Namaz rehberi',gSub:'Hangi rekâtta ne okunur · Hanefî',gOnly:'Yalnızca Fatiha',gRekat:'rekât',
u_sunnet:'Sünnet',u_sunnetG:'Sünnet (gayr-i müekked)',u_farz:'Farz',u_son:'Son sünnet',u_vitir:'Vitir',
n_std:'İlk rekât Sübhaneke ile başlar. Son oturuş: Ettehiyyatü, Salli-Barik, Rabbena.',
n_farz4:'2. rekâttan sonra: Ettehiyyatü. Son oturuş: Ettehiyyatü, Salli-Barik, Rabbena.',
n_sunnetG:'2. rekâttan sonra: Ettehiyyatü ve Salli-Barik. 3. rekât yine Sübhaneke ile başlar.',
n_vitir:'3. rekât: sureden sonra tekbir ve Kunut duaları, sonra rükû.',
gImam:'İmamla',n_cuma:'İmamın arkasında Fatiha ve sure okunmaz. Cuma namazı öğlenin yerine kılınır.',
gFoot:'Sureler, Kur’an sırasına göre kısa surelerden bir öneridir. Başka sure de okuyabilirsiniz.',
dTitle:'Dinî gün ve geceler',dToday:'Bugün',dNext:'Sıradaki',dIn:'{n} gün sonra',dIn1:'yarın',dIn0:'bugün',dEve:'akşamı',dSrc:'Kaynak: Diyanet, dinî günler takvimi 2026 ve 2027',
rTitle:'Ramazan',rStarts:'Ramazan’a {n} gün kaldı',rFirst:'8 Şubat 2027 Pazartesi, {c}',rDay:'Ramazan · {n}. gün',rIftarIn:'İftara kalan',rSahurIn:'Sahurun bitmesine',rIftarWas:'İftar {t} saatindeydi',
rImsak:'İmsak',rIftar:'İftar',rFast:'Bugün oruçluyum',rFastSub:'Tutulamayan günler sonra kaza edilir',rTeravih:'Teravih yatsıdan sonra, {t} itibarıyla',rSahurTom:'Yarın sahur {t} saatine kadar',
rTable:'{c} imsakiyesi',rDate:'Tarih',rAuto:'Bu görünüm 1 Ramazan’da kendiliğinden açılır.',
mTitle:'Diğer',mDays:'Dinî gün ve geceler',mRam:'Ramazan',mRamSub:'Sayaç, oruç takibi, imsakiye',
lang:'Dil',place:'Konum',pickCity:'Şehrinizi seçin',pickCitySub:'Bir kez seçin, uygulama hatırlar.',
src:'Vakitlerin kaynağı',srcText:'Uygulama vakitleri Diyanet’in kurallarıyla, Hollanda için yaz kuralları dahil, kendisi hesaplar. Ayar yapmanız gerekmez. Resmî Diyanet tablosuyla fark çoğunlukla 0, en çok 3 dakikadır.',
alerts:'Bildirimler',aStart:'Her vakit girdiğinde',aRemind:'Vakit çıkmadan hatırlat',aRemindSub:'Yalnızca işaretlemediyseniz',aMin:'Ne kadar önce',
aIkindi:'İkindi: kerahatten önce hatırlat',aKerahat:'Kerahat başlayınca',aCuma:'Cuma namazı',aCumaSub:'Cumadan 1 saat önce',
aNote:'Bildirimler yalnızca bu sayfa açıkken çalışır. Gerçek bildirimler ve tam ezan iPhone uygulamasında olacak.',
kNote:'Diyanet’e göre kerahat: güneş doğduktan sonra yaklaşık 45 dakika, güneş tepedeyken öğleden hemen önce ve güneş batmadan önce yaklaşık 45 dakika.',min:'dk',
sound:'Ses',sBel:'Yumuşak zil',sDruppel:'Su damlası',sNey:'Ney sesi',sAkkoord:'Sakin akor',sStil:'Sessiz',sEigen:'Kendi ses dosyam',sPick:'Dosya seç',sPlay:'{s} dinle',
sNote:'Bir kez oynat düğmesine dokunun. Sonra sayfa açık kaldıkça ses çalabilir. Kendi dosyanız sayfa kapanana kadar saklanır.',
tStart:'{p} vakti girdi',tStartSub:'{t} saatine kadar kılınabilir.',tRemind:'{p} vaktinin çıkmasına {n} dk',tRemindSub:'{p} henüz işaretlenmedi.',tKerahat:'Kerahat başladı',tKerahatSub:'{t} saatine kadar namaz kılınmaz.',tCuma:'Cumaya bir saat kaldı',
close:'Kapat',iPrayed:'Kıldım',
wind:['K','KD','D','GD','G','GB','B','KB'],locale:'tr-TR'
}};

/* ---------- toestand ---------- */
var KEY='gebedstijden.v1';
var S={lang:'nl',city:0,cityChosen:false,prayed:{},fasted:{},guide:'',
  set:{start:true,remind:true,remindMin:15,ikindi:true,kerahat:false,cuma:true,kerahatMin:45,sound:'bel'}};
(function load(){ try{ var raw=window.localStorage.getItem(KEY); if(raw){ var o=JSON.parse(raw);
  for(var k in o){ if(k==='set'){ for(var j in o.set) S.set[j]=o.set[j]; } else S[k]=o[k]; } } }catch(e){}
  if(S.set.sound==='eigen') S.set.sound='bel';
  S.set.kerahatMin=45;
  if(!(S.city>=0 && S.city<CITIES.length)) S.city=0; })();
function save(){ try{ window.localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){} }

function t(k,v){ var s=L[S.lang][k]; if(s===undefined) s=L.nl[k]; if(v){ for(var x in v) s=s.split('{'+x+'}').join(v[x]); } return s; }
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pad(n){ return n<10?'0'+n:''+n; }

/* ---------- plaats en tijd ---------- */
function place(){ var c=CITIES[S.city]; return {name:c[0],lat:c[1],lng:c[2],tz:c[3]}; }
var fmtCache={};
function fmt(tz){ if(!fmtCache[tz]) fmtCache[tz]=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',weekday:'short'}); return fmtCache[tz]; }
function parts(ms,tz){ var o={}; fmt(tz).formatToParts(new Date(ms)).forEach(function(p){ o[p.type]=p.value; });
  return {y:+o.year,m:+o.month,d:+o.day,h:(+o.hour)%24,mi:+o.minute,s:+o.second,wd:o.weekday}; }
function keyOf(y,m,d){ return y+'-'+pad(m)+'-'+pad(d); }
function splitKey(k){ var a=k.split('-'); return {y:+a[0],m:+a[1],d:+a[2]}; }
function addDays(k,n){ var a=splitKey(k), dt=new Date(Date.UTC(a.y,a.m-1,a.d+n)); return keyOf(dt.getUTCFullYear(),dt.getUTCMonth()+1,dt.getUTCDate()); }
function dayDiff(a,b){ var x=splitKey(a),y=splitKey(b); return Math.round((Date.UTC(y.y,y.m-1,y.d)-Date.UTC(x.y,x.m-1,x.d))/86400000); }
function hm(ms){ var p=parts(ms,place().tz); return pad(p.h)+':'+pad(p.mi); }
function longDate(k,opts){ var a=splitKey(k); try{ return new Intl.DateTimeFormat(t('locale'),Object.assign({timeZone:'UTC'},opts)).format(new Date(Date.UTC(a.y,a.m-1,a.d,12))); }catch(e){ return k; } }
function hijri(k){ var best=null; for(var i=0;i<HIJRI.length;i++){ if(HIJRI[i][0]<=k) best=HIJRI[i]; }
  if(!best) return ''; var n=dayDiff(best[0],k)+1; if(n>30) return ''; var i2=HIJRI.indexOf(best);
  if(n===30 && !HIJRI[i2+1]) return ''; return n+' '+best[1]+' '+best[2]; }
function inRamadan(k){ return k>=RAM.start && k<=RAM.end; }

/* ---------- tijden ---------- */
var tcache={};
function clearTimes(){ tcache={}; }
function timesFor(k){ if(tcache[k]) return tcache[k]; var p=place(), a=splitKey(k), r=PT.compute(a.y,a.m,a.d,p.lat,p.lng);
  tcache[k]=r; return r; }
var K2=10*60000; // istiva: kort voor öğle
function buildDay(k){ var x=timesFor(k), n=timesFor(addDays(k,1)), K=S.set.kerahatMin*60000;
  return {key:k,t:x,
    prayers:[{id:'sabah',start:x.fajr,end:x.rise},{id:'ogle',start:x.noon,end:x.asr},{id:'ikindi',start:x.asr,end:x.set},{id:'aksam',start:x.set,end:x.isha},{id:'yatsi',start:x.isha,end:n.fajr}]
      .map(function(p){ p.key=k+':'+p.id; p.day=k; return p; }),
    kerahat:[{id:'k1',start:x.rise,end:x.rise+K},{id:'k2',start:x.noon-K2,end:x.noon},{id:'k3',start:x.set-K,end:x.set}]}; }
function nowMs(){ return Date.now(); }
function ctx(){ var p=place(), now=nowMs(), pp=parts(now,p.tz), today=keyOf(pp.y,pp.m,pp.d);
  var days=[buildDay(addDays(today,-1)),buildDay(today),buildDay(addDays(today,1))], all=[], ks=[];
  days.forEach(function(d){ all=all.concat(d.prayers); ks=ks.concat(d.kerahat); });
  var cur=null,next=null,ker=null,nextKer=null;
  all.forEach(function(x){ if(x.start<=now && now<x.end) cur=x; if(!next && x.start>now) next=x; });
  ks.forEach(function(x){ if(x.start<=now && now<x.end) ker=x; if(!nextKer && x.start>now) nextKer=x; });
  return {now:now,place:p,today:today,day:days[1],tom:days[2],cur:cur,next:next,ker:ker,nextKer:nextKer,wd:pp.wd}; }
function pname(id){ return NAME[id]; }
function cd(ms){ if(ms<0) ms=0; var s=Math.floor(ms/1000), h=Math.floor(s/3600), m=Math.floor((s%3600)/60); return h+':'+pad(m)+':'+pad(s%60); }

/* ---------- iconen ---------- */
var IC={
check:'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8"></path></svg>',
ok:'<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="#0F4C45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="8"></circle><path d="M6.5 10.2l2.4 2.4 4.6-5"></path></svg>',
no:'<svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="#8A4B08" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="8"></circle><path d="M6 10h8"></path></svg>',
play:'<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="#0F4C45"></path></svg>',
on:'<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="none" stroke="#0F4C45" stroke-width="2"></circle><circle cx="11" cy="11" r="5" fill="#0F4C45"></circle></svg>',
off:'<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="none" stroke="#6B7875" stroke-width="2"></circle></svg>',
nav:{vandaag:'<circle cx="11" cy="11" r="8"></circle><path d="M11 6.5V11l3 2"></path>',vensters:'<path d="M4 5h14M4 11h9M4 17h12"></path>',kible:'<circle cx="11" cy="11" r="8"></circle><path d="M14.5 7.5l-2 5-5 2 2-5z"></path>',gids:'<path d="M11 5c-2-1.3-4.5-1.5-7-1v13c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V4c-2.5-.5-5-.3-7 1zM11 5v13"></path>',meer:'<circle cx="5" cy="11" r="1.5"></circle><circle cx="11" cy="11" r="1.5"></circle><circle cx="17" cy="11" r="1.5"></circle>'}};

/* ---------- onderdelen ---------- */
function sw(id,on,label){ return '<button class="switch" role="switch" id="sw-'+id+'" aria-checked="'+(on?'true':'false')+'" aria-label="'+esc(label)+'" data-act="toggle" data-id="'+id+'"><span><span></span></span></button>'; }
function prayed(key){ return !!S.prayed[key]; }

function kerStatus(c){ var k3=c.ker.id==='k3', open=k3 && !prayed(c.today+':ikindi');
  var title=open?t('k3Pray'):t('kerahatNow'), sub=open?t('k3PraySub',{t:hm(c.ker.end)}):t(k3?'kerahatOnlyAsr':'kerahatUntil',{t:hm(c.ker.end)});
  return '<div class="status no">'+IC.no+'<div class="col"><span class="title">'+esc(title)+'</span><span class="small" style="color:#5C3A0A">'+esc(sub)+'</span></div></div>'; }
function viewToday(c){ var p=c.place, d=c.day, x=d.t, h='', tzToday=c.today;
  var hj=hijri(tzToday);
  h+='<header class="between"><div class="col"><a href="#dagen" class="small" style="font-weight:600;text-decoration:none;min-height:28px;display:flex;align-items:center">'+esc(longDate(tzToday,{weekday:'short',day:'numeric',month:'short'}))+(hj?' · '+esc(hj):'')+' ›</a>'+
     '<h1>'+esc(p.name)+'</h1></div><a class="chip" style="min-height:44px;padding:0 12px" href="#meer">Diyanet · '+(S.lang==='nl'?'NL':'TR')+'</a></header>';
  if(!S.cityChosen) h+='<section class="card" style="border:2px solid #0F4C45"><div class="col"><label for="city" style="font-size:15px;color:#14201D">'+esc(t('pickCity'))+'</label><span class="small muted">'+esc(t('pickCitySub'))+'</span></div>'+citySelect()+'</section>';
  // hoofdkaart
  var target, lbl, sub, a0, cls='hero';
  if(c.ker){ cls+=' kerahat'; }
  if(c.cur){ target=c.cur.end; a0=c.cur.start; lbl=t('now')+': '+pname(c.cur.id); sub=(c.cur.id==='sabah'?t('untilSun'):t('untilEnd',{p:pname(c.cur.id)})); }
  else { target=c.next.start; a0=c.day.t.rise; lbl=t('next')+': '+pname(c.next.id); sub=t('untilNext'); }
  var pg=Math.max(0,Math.min(100,(c.now-a0)/(target-a0)*100));
  h+='<section class="'+cls+'"><div class="between"><span class="lbl">'+esc(lbl)+'</span><span class="small" style="color:#E7F2EE">'+esc(pname(c.next.id))+' '+t('at')+' '+hm(c.next.start)+'</span></div>'+
     '<div class="big" data-cd="'+target+'">'+cd(target-c.now)+'</div><div class="sub">'+esc(sub)+'</div>'+
     '<div class="bar" aria-hidden="true"><i data-pg="'+a0+','+target+'" style="width:'+pg.toFixed(1)+'%"></i></div>';
  if(c.cur){ h+= prayed(c.cur.key)
      ? '<div class="between"><span class="sub">'+esc(t('prayedDone',{p:pname(c.cur.id)}))+'</span><button class="btn line" style="color:#fff;border-color:#CFE5DE" data-act="pray" data-key="'+c.cur.key+'">'+esc(t('undo'))+'</button></div>'
      : '<button class="btn gold wide" data-act="pray" data-key="'+c.cur.key+'">'+esc(t('prayedBtn',{p:pname(c.cur.id)}))+'</button>'; }
  h+='</section>';
  // status
  if(c.ker){ h+=kerStatus(c); }
  else { var nk=c.nextKer, pk=parts(nk.start,p.tz), pre=keyOf(pk.y,pk.m,pk.d)!==c.today?t('tomorrow')+' ':'';
    h+='<div class="status">'+IC.ok+'<div class="col"><span class="title">'+esc(t('allowed'))+'</span><span class="small muted">'+esc(t('nextKerahat',{a:pre+hm(nk.start),b:hm(nk.end)}))+'</span></div></div>'; }
  // cuma
  if(c.wd==='Fri' && c.now<x.asr){ h+='<div class="status"><div class="col"><span class="title">'+esc(t('cumaToday'))+'</span><span class="small muted">'+esc(t('cumaAt',{t:hm(x.noon)}))+'</span></div></div>'; }
  if(c.wd==='Thu' && c.now>=x.set){ h+='<div class="status"><div class="col"><span class="title">'+esc(t('cumaTomorrow'))+'</span><span class="small muted">'+esc(t('cumaTomorrowSub',{t:hm(c.tom.t.noon)}))+'</span></div></div>'; }
  if(inRamadan(tzToday)) h+=ramadanCard(c);
  // lijst
  var K=S.set.kerahatMin*60000, rows=[
    {id:'sabah',n:t('sabahName'),time:x.fajr,note:t('until',{t:hm(x.rise)})},
    {id:'gunes',n:pname('gunes'),time:x.rise,note:t('kerahatTill',{t:hm(x.rise+K)})},
    {id:'ogle',n:pname('ogle'),time:x.noon,note:t('until',{t:hm(x.asr)})},
    {id:'ikindi',n:pname('ikindi'),time:x.asr,note:t('kerahatFrom',{t:hm(x.set-K)})},
    {id:'aksam',n:pname('aksam'),time:x.set,note:t('until',{t:hm(x.isha)})},
    {id:'yatsi',n:pname('yatsi'),time:x.isha,note:t('until',{t:hm(c.tom.t.fajr)})}], cnt=0;
  h+='<section class="list">';
  rows.forEach(function(r){ var key=tzToday+':'+r.id, isNow=c.cur && c.cur.key===key, done=prayed(key); if(done && r.id!=='gunes') cnt++;
    h+='<div class="item"><div class="col grow"><div class="row" style="gap:8px"><span class="title" style="font-size:16px">'+esc(r.n)+'</span>'+(isNow?'<span class="chip now" style="min-height:0;padding:2px 7px;font-size:11px">'+esc(t('now').toLocaleUpperCase(t('locale')))+'</span>':'')+'</div><span class="small muted">'+esc(r.note)+'</span></div>'+
       '<span class="time">'+hm(r.time)+'</span>'+
       (r.id==='gunes' ? '<span class="small" style="width:44px;text-align:center;font-weight:700;color:#8A4B08;font-size:11px">'+esc(t('noPrayer'))+'</span>'
        : '<button class="check'+(done?' on':'')+'" data-act="pray" data-key="'+key+'" aria-pressed="'+(done?'true':'false')+'" aria-label="'+esc(t('prayedBtn',{p:pname(r.id)}))+'">'+IC.check+'</button>')+'</div>'; });
  h+='</section><div class="small muted" style="text-align:center">'+esc(t('summary',{n:cnt}))+' · '+esc(t('srcCalc'))+'</div>';
  return h; }

function ramadanCard(c){ var x=c.day.t, n=dayDiff(RAM.start,c.today)+1, h='<section class="hero night"><div class="between"><span class="lbl">'+esc(t('rDay',{n:n}))+'</span><span class="small" style="color:#C9D3D0">'+esc(t('rImsak'))+' '+hm(x.fajr)+' · '+esc(t('rIftar'))+' '+hm(x.set)+'</span></div>';
  if(c.now<x.fajr){ h+='<div class="sub">'+esc(t('rSahurIn'))+'</div><div class="big" data-cd="'+x.fajr+'">'+cd(x.fajr-c.now)+'</div>'; }
  else if(c.now<x.set){ var pg=(c.now-x.fajr)/(x.set-x.fajr)*100; h+='<div class="sub">'+esc(t('rIftarIn'))+'</div><div class="big" data-cd="'+x.set+'">'+cd(x.set-c.now)+'</div><div class="bar" aria-hidden="true"><i data-pg="'+x.fajr+','+x.set+'" style="width:'+pg.toFixed(1)+'%"></i></div>'; }
  else { h+='<div class="sub">'+esc(t('rIftarWas',{t:hm(x.set)}))+'</div><div class="sub">'+esc(t('rTeravih',{t:hm(x.isha)}))+'</div><div class="sub">'+esc(t('rSahurTom',{t:hm(c.tom.t.fajr)}))+'</div>'; }
  var f=!!S.fasted[c.today];
  h+='<div class="between"><div class="col"><span style="font-weight:600">'+esc(t('rFast'))+'</span><span class="small" style="color:#C9D3D0">'+esc(t('rFastSub'))+'</span></div><button class="check'+(f?' on':'')+'" style="'+(f?'background:#F2C879;border-color:#F2C879':'background:transparent;border-color:#C9D3D0')+'" data-act="fast" data-key="'+c.today+'" aria-pressed="'+(f?'true':'false')+'" aria-label="'+esc(t('rFast'))+'">'+IC.check.replace('#fff','#10201D')+'</button></div></section>';
  return h; }

function viewWindows(c){ var x=c.day.t, K=S.set.kerahatMin*60000, n=c.tom.t.fajr, now=c.now;
  var segs=[[x.fajr,x.rise,pname('sabah'),t('wSabah'),1],[x.rise,x.rise+K,t('wK1'),t('wK1s'),0],[x.rise+K,x.noon-K2,t('wFree'),t('wFrees'),1],[x.noon-K2,x.noon,t('wK2'),t('wK2s'),0],
    [x.noon,x.asr,pname('ogle'),t('wOgle'),1],[x.asr,x.set-K,pname('ikindi'),t('wIkindi'),1],[x.set-K,x.set,t('wK3'),t('wK3s'),0],[x.set,x.isha,pname('aksam'),t('wAksam'),1],[x.isha,n,pname('yatsi'),t('wYatsi',{t:hm((x.set+n)/2)}),1]];
  var h='<header class="col"><h1>'+esc(t('winTitle'))+'</h1><span class="small muted">'+esc(t('winSub',{c:c.place.name}))+'</span></header>';
  h+= c.ker ? kerStatus(c)
            : '<div class="status">'+IC.ok+'<div class="col"><span class="title">'+esc(t('allowed'))+'</span><span class="small muted">'+esc(t('nextKerahat',{a:hm(c.nextKer.start),b:hm(c.nextKer.end)}))+'</span></div></div>';
  h+='<section style="display:flex;flex-direction:column;gap:6px">';
  segs.forEach(function(s){ var cur=s[0]<=now && now<s[1];
    h+='<div class="seg'+(s[4]?'':' no')+(cur?' cur':'')+'"><span class="t">'+hm(s[0])+' – '+hm(s[1])+'</span><div class="col grow"><span class="title" style="font-size:14px">'+esc(s[2])+(cur?' · '+esc(t('now').toLocaleLowerCase(t('locale'))):'')+'</span><span class="small" style="color:'+(s[4]?'#4E5B58':'#5C3A0A')+'">'+esc(s[3])+'</span></div><span class="chip'+(s[4]?'':' no')+'" style="min-height:0;padding:3px 8px;font-size:11px">'+esc(t(s[4]?'ok':'no'))+'</span></div>'; });
  h+='</section><div class="note" style="text-align:center">'+esc(t('kNote'))+'</div>';
  return h; }

function stepper(id,val,min,max,step){ return '<div class="stepper" id="'+(id==='kerahatMin'?'kmin':'st-'+id)+'"><button data-act="step" data-id="'+id+'" data-d="-'+step+'" data-min="'+min+'" data-max="'+max+'" aria-label="−">−</button><span>'+val+' '+esc(t('min'))+'</span><button data-act="step" data-id="'+id+'" data-d="'+step+'" data-min="'+min+'" data-max="'+max+'" aria-label="+">+</button></div>'; }

function bearing(lat,lng){ var R=Math.PI/180, f1=lat*R, f2=21.4225*R, dl=(39.8262-lng)*R;
  var b=Math.atan2(Math.sin(dl),Math.cos(f1)*Math.tan(f2)-Math.sin(f1)*Math.cos(dl))/R; return (b+360)%360; }
function viewQibla(c){ var p=c.place, b=bearing(p.lat,p.lng), w=t('wind'), dir=w[Math.round(b/45)%8];
  var h='<h1>'+esc(t('qTitle'))+'</h1><section class="card" style="align-items:center">'+
    '<svg width="230" height="230" viewBox="0 0 220 220" role="img" aria-label="'+esc(t('qFrom',{d:b.toFixed(1).replace('.',','),w:dir}))+'"><circle cx="110" cy="110" r="104" fill="#F3F6F4" stroke="#C9D3D0" stroke-width="2"></circle><circle cx="110" cy="110" r="78" fill="#fff" stroke="#DDE4E1"></circle>'+
    '<text x="110" y="26" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="700" fill="#14201D">'+w[0]+'</text><text x="198" y="115" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="700" fill="#4E5B58">'+w[2]+'</text>'+
    '<text x="110" y="204" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="700" fill="#4E5B58">'+w[4]+'</text><text x="22" y="115" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="700" fill="#4E5B58">'+w[6]+'</text>'+
    '<g transform="rotate('+b.toFixed(1)+' 110 110)"><path d="M110 40 L122 110 L110 122 L98 110 Z" fill="#0F4C45"></path><rect x="101" y="18" width="18" height="18" rx="3" fill="#14201D"></rect><rect x="101" y="23" width="18" height="3" fill="#F2C879"></rect></g><circle cx="110" cy="110" r="6" fill="#14201D"></circle></svg>'+
    '<div class="num" style="font-size:28px;font-weight:700">'+b.toFixed(1).replace('.',',')+'° '+dir+'</div><div class="small muted" style="text-align:center">'+esc(t('qFrom',{d:b.toFixed(1).replace('.',','),w:dir}))+' · '+esc(p.name)+'</div><div class="small muted" style="text-align:center">'+esc(t('qHelp'))+'</div></section>';
  h+='<a class="linkcard" href="https://www.google.com/maps/search/'+(S.lang==='nl'?'moskee':'cami')+'/@'+p.lat.toFixed(4)+','+p.lng.toFixed(4)+',13z" target="_blank" rel="noopener"><div class="col grow"><span class="title">'+esc(t('qMosque'))+'</span><span class="small muted">'+esc(t('qMosqueSub',{c:p.name}))+'</span></div><span class="chip">'+esc(t('qOpen'))+' ›</span></a>';
  h+='<div class="note" style="text-align:center">'+esc(t('qNote'))+'</div>'; return h; }

function viewGuide(c){ var sel=S.guide || (c.cur?c.cur.id:c.next.id); if(!S.guide && sel==='ogle' && c.wd==='Fri') sel='cuma'; var h='<header class="col"><h1>'+esc(t('gTitle'))+'</h1><span class="small muted">'+esc(t('gSub'))+'</span></header><div class="segctl">';
  PR.concat(['cuma']).forEach(function(id){ h+='<button style="font-size:13px;padding:0 2px" data-act="guide" data-id="'+id+'" aria-pressed="'+(id===sel?'true':'false')+'">'+pname(id)+'</button>'; });
  h+='</div>';
  GUIDE[sel].forEach(function(u){ var n=u.s.length;
    h+='<section class="card"><h2>'+esc(t('u_'+u.k))+' · '+n+' '+esc(t('gRekat'))+'</h2>';
    u.s.forEach(function(s,i){ h+='<div class="row"><span class="num" style="width:32px;height:32px;border-radius:16px;background:#DCEBE6;color:#0F4C45;font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 auto">'+(i+1)+'</span><span class="title">'+(u.imam?esc(t('gImam')):s?'Fatiha + '+s:esc(t('gOnly')))+'</span></div>'; });
    var note= u.imam?t('n_cuma'): u.k==='vitir'?t('n_vitir'): u.k==='sunnetG'?t('n_sunnetG'): (n>2?t('n_farz4'):t('n_std'));
    h+='<span class="small muted">'+esc(note)+'</span></section>'; });
  h+='<div class="note" style="text-align:center">'+esc(t('gFoot'))+'</div>'; return h; }

function viewDays(c){ var today=c.today, hj=hijri(today), up=DAYS.filter(function(d){ return d.d>=today; });
  var h='<a href="#meer" class="small" style="font-weight:600;text-decoration:none;min-height:44px;display:flex;align-items:center;align-self:flex-start">‹ '+esc(t('mTitle'))+'</a><header class="col"><h1>'+esc(t('dTitle'))+'</h1><span class="small muted">'+esc(t('dToday'))+': '+esc(longDate(today,{day:'numeric',month:'long',year:'numeric'}))+(hj?' · '+esc(hj):'')+'</span></header>';
  function when(d){ var n=dayDiff(today,d.d); return n===0?t('dIn0'):n===1?t('dIn1'):t('dIn',{n:n}); }
  function dateTxt(d){ return longDate(d.d,{weekday:'long'})+(d.night?(S.lang==='nl'?t('dEve'):' '+t('dEve')):'')+' '+longDate(d.d,{day:'numeric',month:'long',year:'numeric'}); }
  if(up.length){ var f=up[0];
    h+='<section class="hero"><span class="lbl">'+esc(t('dNext'))+'</span><div class="num" style="font-size:30px;font-weight:700;line-height:1.1">'+esc(f.n[S.lang])+'</div><div class="sub">'+esc(dateTxt(f))+(f.h?' · '+esc(f.h):'')+'</div>'+
      '<div class="between"><span class="chip" style="background:#F2C879;color:#14201D;font-size:14px;padding:6px 12px">'+esc(when(f))+'</span>'+(f.s?'<span class="small" style="color:#CFE5DE">'+esc(f.s[S.lang])+'</span>':'')+'</div></section>';
    if(up.length>1){ h+='<section class="list">'; up.slice(1).forEach(function(d){
      h+='<div class="item"><span class="num" style="width:64px;font-size:14px;font-weight:700;color:#0F4C45;flex:0 0 auto">'+esc(longDate(d.d,{day:'numeric',month:'short'}))+'</span><div class="col grow"><span class="title">'+esc(d.n[S.lang])+'</span><span class="small muted">'+esc(longDate(d.d,{weekday:'long'}))+(d.h?' · '+esc(d.h):'')+(d.s?' · '+esc(d.s[S.lang]):'')+'</span></div><span class="small muted" style="white-space:nowrap">'+esc(when(d))+'</span></div>'; });
      h+='</section>'; } }
  h+='<div class="note" style="text-align:center">'+esc(t('dSrc'))+'</div>'; return h; }

function viewRamadan(c){ var p=c.place, h='<a href="#meer" class="small" style="font-weight:600;text-decoration:none;min-height:44px;display:flex;align-items:center;align-self:flex-start">‹ '+esc(t('mTitle'))+'</a><h1>'+esc(t('rTitle'))+' 1448</h1>';
  if(inRamadan(c.today)) h+=ramadanCard(c);
  else { var n=dayDiff(c.today,RAM.start), f=timesFor(RAM.start);
    if(n>0) h+='<section class="hero night"><span class="lbl">'+esc(t('rStarts',{n:n}))+'</span><div class="sub">'+esc(t('rFirst',{c:p.name}))+'</div><div class="grid2"><div class="col"><span class="small" style="color:#C9D3D0">'+esc(t('rImsak'))+'</span><span class="big" style="font-size:40px">'+hm(f.fajr)+'</span></div><div class="col"><span class="small" style="color:#C9D3D0">'+esc(t('rIftar'))+'</span><span class="big" style="font-size:40px">'+hm(f.set)+'</span></div></div><div class="small" style="color:#C9D3D0">'+esc(t('rAuto'))+'</div></section>'; }
  h+='<section class="card"><h2>'+esc(t('rTable',{c:p.name}))+'</h2><div class="tablewrap"><table><thead><tr><th>#</th><th>'+esc(t('rDate'))+'</th><th class="num">'+esc(t('rImsak'))+'</th><th class="num">'+esc(t('rIftar'))+'</th><th class="num">Yatsı</th></tr></thead><tbody>';
  for(var i=0,k=RAM.start;k<=RAM.end;k=addDays(k,1),i++){ var x=timesFor(k);
    h+='<tr'+(k===c.today?' style="background:#DCEBE6;font-weight:700"':'')+'><td class="num">'+(i+1)+'</td><td>'+esc(longDate(k,{weekday:'short',day:'numeric',month:'short'}))+(k==='2027-03-05'?' · Kadir':'')+'</td><td class="num">'+hm(x.fajr)+'</td><td class="num">'+hm(x.set)+'</td><td class="num">'+hm(x.isha)+'</td></tr>'; }
  h+='</tbody></table></div><span class="note">'+esc(t('srcCalc'))+'</span></section>'; return h; }

var SOUNDS=['bel','druppel','ney','akkoord','stil'];
function sname(id){ return t('s'+id.charAt(0).toUpperCase()+id.slice(1)); }
function viewMore(c){ var p=c.place, s=S.set, h='<h1>'+esc(t('mTitle'))+'</h1>';
  h+='<a class="linkcard" href="#dagen"><div class="col grow"><span class="title">'+esc(t('mDays'))+'</span><span class="small muted">'+esc(nextDayLine(c))+'</span></div><span aria-hidden="true">›</span></a>';
  h+='<a class="linkcard" href="#ramadan"><div class="col grow"><span class="title">'+esc(t('mRam'))+'</span><span class="small muted">'+esc(t('mRamSub'))+'</span></div><span aria-hidden="true">›</span></a>';
  // taal
  h+='<section class="card"><h2>'+esc(t('lang'))+'</h2><div class="segctl"><button data-act="lang" data-id="nl" aria-pressed="'+(S.lang==='nl')+'">Nederlands</button><button data-act="lang" data-id="tr" aria-pressed="'+(S.lang==='tr')+'">Türkçe</button></div></section>';
  // plaats
  h+='<section class="card"><label for="city" style="font-size:15px;font-weight:700;color:#14201D">'+esc(t('place'))+'</label>'+citySelect()+'</section>';
  h+='<section class="card"><h2>'+esc(t('src'))+'</h2><span class="small muted">'+esc(t('srcText'))+'</span></section>';
  // meldingen
  h+='<section class="list"><div class="item"><h2 class="grow">'+esc(t('alerts'))+'</h2></div>'+
     '<div class="item"><span class="title grow">'+esc(t('aStart'))+'</span>'+sw('start',s.start,t('aStart'))+'</div>'+
     '<div class="item"><div class="col grow"><span class="title">'+esc(t('aRemind'))+'</span><span class="small muted">'+esc(t('aRemindSub'))+'</span></div>'+sw('remind',s.remind,t('aRemind'))+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aMin'))+'</span>'+stepper('remindMin',s.remindMin,5,45,5)+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aIkindi'))+'</span>'+sw('ikindi',s.ikindi,t('aIkindi'))+'</div>'+
     '<div class="item"><span class="title grow">'+esc(t('aKerahat'))+'</span>'+sw('kerahat',s.kerahat,t('aKerahat'))+'</div>'+
     '<div class="item"><div class="col grow"><span class="title">'+esc(t('aCuma'))+'</span><span class="small muted">'+esc(t('aCumaSub'))+'</span></div>'+sw('cuma',s.cuma,t('aCuma'))+'</div></section><div class="note">'+esc(t('aNote'))+'</div>';
  // geluid
  h+='<section class="list"><div class="item"><h2 class="grow">'+esc(t('sound'))+'</h2></div>';
  SOUNDS.forEach(function(id){ h+='<div class="item"><button class="radio" data-act="sound" data-id="'+id+'" aria-pressed="'+(s.sound===id)+'" aria-label="'+esc(sname(id))+'">'+(s.sound===id?IC.on:IC.off)+'</button><span class="title grow">'+esc(sname(id))+'</span>'+(id==='stil'?'':'<button class="play" data-act="play" data-id="'+id+'" aria-label="'+esc(t('sPlay',{s:sname(id)}))+'">'+IC.play+'</button>')+'</div>'; });
  h+='<div class="item"><button class="radio" data-act="sound" data-id="eigen" aria-pressed="'+(s.sound==='eigen')+'" aria-label="'+esc(t('sEigen'))+'"'+(customUrl?'':' disabled')+'>'+(s.sound==='eigen'?IC.on:IC.off)+'</button><div class="col grow"><label for="file" style="font-size:15px;color:#14201D">'+esc(t('sEigen'))+'</label><input id="file" type="file" accept="audio/*" style="border:none;padding:4px 0;min-height:0;font-size:12px"></div>'+(customUrl?'<button class="play" data-act="play" data-id="eigen" aria-label="'+esc(t('sPlay',{s:t('sEigen')}))+'">'+IC.play+'</button>':'')+'</div></section><div class="note">'+esc(t('sNote'))+'</div>';
  return h; }
function citySelect(){ var idx=CITIES.map(function(c,i){ return i; }).sort(function(a,b){ return CITIES[a][0].localeCompare(CITIES[b][0],'nl'); });
  var h='<select id="city">'; idx.forEach(function(i){ h+='<option value="'+i+'"'+(i===S.city?' selected':'')+'>'+esc(CITIES[i][0])+'</option>'; }); return h+'</select>'; }
function nextDayLine(c){ var up=DAYS.filter(function(d){ return d.d>=c.today; }); if(!up.length) return ''; var n=dayDiff(c.today,up[0].d);
  return t('dNext')+': '+up[0].n[S.lang]+', '+(n===0?t('dIn0'):n===1?t('dIn1'):t('dIn',{n:n})); }

/* ---------- geluid ---------- */
var AC=null, customUrl=null, customAudio=null;
function ac(){ if(!AC){ try{ var C=window.AudioContext||window.webkitAudioContext; if(C) AC=new C(); }catch(e){ AC=null; } }
  if(AC && AC.state==='suspended'){ try{ AC.resume(); }catch(e){} } return AC; }
function tone(a,type,f,at,dur,vol,f2,attack){ var o=a.createOscillator(), g=a.createGain(), t0=a.currentTime+at;
  o.type=type; o.frequency.setValueAtTime(f,t0); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t0+dur*0.6);
  g.gain.setValueAtTime(0.0001,t0); g.gain.exponentialRampToValueAtTime(vol,t0+(attack||0.02)); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g); g.connect(a.destination); o.start(t0); o.stop(t0+dur+0.05); }
function play(kind,fromClick){ try{
  if(kind==='stil') return;
  if(kind==='eigen'){ if(customUrl){ if(!customAudio) customAudio=new Audio(customUrl); customAudio.currentTime=0; var pr=customAudio.play(); if(pr && pr.catch) pr.catch(function(){}); } return; }
  var a= fromClick ? ac() : AC; if(!a) return;
  if(kind==='bel'){ [0,1.1].forEach(function(d){ tone(a,'sine',880,d,1.6,0.25); tone(a,'sine',1320,d,1.2,0.10); tone(a,'sine',2640,d,0.5,0.04); }); }
  else if(kind==='druppel'){ [0,0.45,0.9].forEach(function(d,i){ tone(a,'sine',1300-i*120,d,0.35,0.3,480); }); }
  else if(kind==='ney'){ [[293.7,0,1.3],[349.2,1.1,1.1],[392,2.0,1.1],[440,2.9,1.9]].forEach(function(n){ tone(a,'triangle',n[0],n[1],n[2],0.22,0,0.25); tone(a,'sine',n[0]*2,n[1],n[2],0.05,0,0.3); }); }
  else if(kind==='akkoord'){ [220,277.2,329.6,440].forEach(function(f,i){ tone(a,'sine',f,i*0.12,3.2,0.14,0,0.4); }); }
  }catch(e){} }

/* ---------- meldingen op de pagina ---------- */
var fired={};
function toast(title,sub,key){ var box=document.getElementById('toast-box');
  box.innerHTML='<strong style="font-size:16px">'+esc(title)+'</strong>'+(sub?'<span style="font-size:14px;color:#E3E9E7">'+esc(sub)+'</span>':'')+
    '<div class="row" style="gap:8px">'+(key?'<button class="btn gold grow" data-act="pray" data-key="'+key+'" data-toast="1">'+esc(t('iPrayed'))+'</button>':'')+'<button class="btn grow" style="background:#35504A" data-act="closetoast">'+esc(t('close'))+'</button></div>';
  document.getElementById('toast').hidden=false; }
function alerts(c){ var s=S.set, now=c.now, K=s.kerahatMin*60000;
  function once(id,fn){ if(!fired[id]){ fired[id]=1; fn(); } }
  if(c.cur){ var p=c.cur, nm=pname(p.id);
    if(s.start && now-p.start<60000) once('s'+p.key,function(){ toast(t('tStart',{p:nm}),t('tStartSub',{t:hm(p.end)}),p.key); play(s.sound); });
    if(s.remind && !prayed(p.key)){ var dl=(p.id==='ikindi' && s.ikindi)?p.end-K:p.end, left=dl-now;
      if(left>0 && left<=s.remindMin*60000) once('r'+p.key,function(){ toast(t('tRemind',{n:Math.ceil(left/60000),p:nm}),t('tRemindSub',{p:nm}),p.key); play(s.sound); }); } }
  if(s.kerahat && c.ker && now-c.ker.start<60000) once('k'+c.ker.start,function(){ toast(t('tKerahat'),t('tKerahatSub',{t:hm(c.ker.end)})); play(s.sound); });
  if(s.cuma && c.wd==='Fri'){ var d=c.day.t.noon-now; if(d>0 && d<=3600000 && d>3540000) once('c'+c.today,function(){ toast(t('tCuma'),t('cumaAt',{t:hm(c.day.t.noon)})); play(s.sound); }); } }

/* ---------- weergave ---------- */
var ROUTES={vandaag:viewToday,vensters:viewWindows,kible:viewQibla,gids:viewGuide,meer:viewMore,dagen:viewDays,ramadan:viewRamadan};
var NAV=[['vandaag','navToday'],['vensters','navWin'],['kible','navQibla'],['gids','navGuide'],['meer','navMore']];
function route(){ var h=(window.location.hash||'').replace('#',''); return ROUTES[h]?h:'vandaag'; }
var lastSig='';
function sig(c){ return [route(),c.today,c.cur?c.cur.key:'-',c.next?c.next.key:'-',c.ker?c.ker.id:'-',inRamadan(c.today)?(c.now<c.day.t.fajr?0:c.now<c.day.t.set?1:2):'-'].join('|'); }
function render(){ var c=ctx(), r=route(); lastSig=sig(c);
  document.documentElement.lang=S.lang;
  document.getElementById('app').innerHTML=ROUTES[r](c);
  var navId=(r==='dagen'||r==='ramadan')?'meer':r, n='';
  NAV.forEach(function(x){ n+='<a href="#'+x[0]+'"'+(x[0]===navId?' aria-current="page"':'')+'><svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC.nav[x[0]]+'</svg>'+esc(t(x[1]))+'</a>'; });
  document.getElementById('nav').innerHTML=n; }
function tick(){ var c=ctx(), now=c.now;
  var ae=document.activeElement, typing=ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);
  if(sig(c)!==lastSig && !typing){ render(); }
  else { var i, els=document.querySelectorAll('[data-cd]'); for(i=0;i<els.length;i++) els[i].textContent=cd(+els[i].getAttribute('data-cd')-now);
    els=document.querySelectorAll('[data-pg]'); for(i=0;i<els.length;i++){ var q=els[i].getAttribute('data-pg').split(','); els[i].style.width=Math.max(0,Math.min(100,(now-q[0])/(q[1]-q[0])*100)).toFixed(1)+'%'; } }
  alerts(c); }

document.addEventListener('click',function(e){ var el=e.target.closest ? e.target.closest('[data-act]') : null; if(!el) return;
  var act=el.getAttribute('data-act'), id=el.getAttribute('data-id');
  if(act==='pray'){ var k=el.getAttribute('data-key'); if(el.getAttribute('data-toast')){ S.prayed[k]=1; document.getElementById('toast').hidden=true; } else { if(S.prayed[k]) delete S.prayed[k]; else S.prayed[k]=1; } prune(); }
  else if(act==='fast'){ var fk=el.getAttribute('data-key'); if(S.fasted[fk]) delete S.fasted[fk]; else S.fasted[fk]=1; }
  else if(act==='closetoast'){ document.getElementById('toast').hidden=true; return; }
  else if(act==='toggle'){ S.set[id]=!S.set[id]; }
  else if(act==='step'){ var v=S.set[id]+(+el.getAttribute('data-d')); v=Math.max(+el.getAttribute('data-min'),Math.min(+el.getAttribute('data-max'),v)); S.set[id]=v; }
  else if(act==='guide'){ S.guide=id; }
  else if(act==='lang'){ S.lang=id; }
  else if(act==='sound'){ S.set.sound=id; play(id,true); }
  else if(act==='play'){ play(id,true); return; }
  save(); render(); });
document.addEventListener('change',function(e){ var el=e.target;
  if(el.id==='city'){ S.city=+el.value; S.cityChosen=true; clearTimes(); save(); render(); }
  else if(el.id==='file' && el.files && el.files[0]){ try{ if(customUrl) URL.revokeObjectURL(customUrl); customUrl=URL.createObjectURL(el.files[0]); customAudio=null; S.set.sound='eigen'; save(); render(); }catch(err){} } });
function prune(){ var lim=addDays(ctx().today,-40); for(var k in S.prayed){ if(k.slice(0,10)<lim) delete S.prayed[k]; } }
window.addEventListener('hashchange',function(){ render(); window.scrollTo(0,0); });

render();
window.setInterval(tick,1000);
})();


const select = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const assetBase = select<HTMLMetaElement>('meta[name="asset-base"]').content.endsWith('/') ? select<HTMLMetaElement>('meta[name="asset-base"]').content : select<HTMLMetaElement>('meta[name="asset-base"]').content + '/';

const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
const photos = [...document.querySelectorAll<HTMLButtonElement>('.gallery-item')];
const empty = select<HTMLElement>('.gallery-empty');
filters.forEach(button => button.addEventListener('click', () => {
 const category = button.dataset.filter;
 filters.forEach(item => {const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));});
 photos.forEach(photo => {photo.hidden = category !== 'all' && photo.dataset.category !== category;});
 const count = photos.filter(photo => !photo.hidden).length;
 empty.hidden = count > 0;
 select('#gallery-status').textContent = count ? 'Showing '+count+' '+(category==='all'?'':category+' ')+'photograph'+(count===1?'':'s') : 'Ask us for our corporate photography collection.';
}));

const lightbox = select<HTMLDialogElement>('#lightbox');
const lightboxImage = select<HTMLImageElement>('#lightbox-image');
let currentPhoto = 0;
let photoTrigger: HTMLButtonElement | null = null;
let visiblePhotos = photos;
function displayPhoto(index: number) {
 currentPhoto = (index + visiblePhotos.length) % visiblePhotos.length;
 const photo = visiblePhotos[currentPhoto];
 lightboxImage.src = assetBase + 'images/' + photo.dataset.image;
 lightboxImage.alt = photo.querySelector('img')?.alt || '';
 select('#lightbox-title').textContent = photo.dataset.caption || '';
 select('#lightbox-count').textContent = (currentPhoto+1)+' / '+visiblePhotos.length;
}
photos.forEach(photo => photo.addEventListener('click', () => {
 visiblePhotos = photos.filter(item => !item.hidden); photoTrigger = photo;
 displayPhoto(visiblePhotos.indexOf(photo)); lightbox.showModal(); document.body.classList.add('modal-open');
}));
select('.lightbox-close').addEventListener('click', () => lightbox.close());
select('#lightbox-prev').addEventListener('click', () => displayPhoto(currentPhoto-1));
select('#lightbox-next').addEventListener('click', () => displayPhoto(currentPhoto+1));
lightbox.addEventListener('keydown', event => { if(event.key === 'ArrowLeft') {event.preventDefault(); displayPhoto(currentPhoto-1);} if(event.key==='ArrowRight'){event.preventDefault();displayPhoto(currentPhoto+1);} });
lightbox.addEventListener('click',event=>{if(event.target===lightbox) lightbox.close();});
lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');photoTrigger?.focus();});

const reviewSlides = [...document.querySelectorAll<HTMLElement>('.review-slide')];
const reviewDots = [...document.querySelectorAll<HTMLButtonElement>('[data-review]')];
let activeReview = 0;
function showReview(index:number) {
 activeReview = (index + reviewSlides.length) % reviewSlides.length;
 reviewSlides.forEach((slide,i)=>{slide.hidden=i!==activeReview;});
 reviewDots.forEach((dot,i)=>{dot.classList.toggle('active',i===activeReview);dot.setAttribute('aria-pressed',String(i===activeReview));});
}
reviewDots.forEach((dot,i)=>dot.addEventListener('click',()=>showReview(i)));
select('#review-prev').addEventListener('click',()=>showReview(activeReview-1));
select('#review-next').addEventListener('click',()=>showReview(activeReview+1));

const occasion = select<HTMLSelectElement>('#occasion');
document.querySelectorAll<HTMLAnchorElement>('[data-service]').forEach(link=>link.addEventListener('click',()=>{occasion.value=link.dataset.service || '';}));
const date = select<HTMLInputElement>('#date');
const today = new Date();
date.min = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');

const campaignKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;
const campaign:Record<string,string> = {};
try {
 const existing = JSON.parse(sessionStorage.getItem('bharani-campaign') || '{}');
 const params = new URLSearchParams(location.search);
 campaignKeys.forEach(key=>{const value=params.get(key) || existing[key]; if(typeof value==='string' && value) campaign[key]=value.slice(0,120);});
 sessionStorage.setItem('bharani-campaign',JSON.stringify(campaign));
} catch { /* The enquiry still works if browser storage is unavailable. */ }

type TrackingWindow = Window & {dataLayer?:Record<string,unknown>[]};
function trackEnquiry(channel:string,shootType?:string) {
 const detail = {event:'bharani_enquiry_intent',channel,shoot_type:shootType || 'unspecified',...campaign};
 window.dispatchEvent(new CustomEvent('bharani:enquiry',{detail}));
 const trackingWindow=window as TrackingWindow;
 trackingWindow.dataLayer=trackingWindow.dataLayer || [];
 trackingWindow.dataLayer.push(detail);
}
document.querySelectorAll<HTMLAnchorElement>('[data-enquiry]').forEach(link=>link.addEventListener('click',()=>trackEnquiry(link.dataset.enquiry || 'link')));
const form = select<HTMLFormElement>('#enquiry-form');
const phone = select<HTMLInputElement>('#phone');
phone.addEventListener('input',()=>phone.setCustomValidity(''));
form.addEventListener('submit',event=>{
 event.preventDefault();
 const data=new FormData(form);
 const phoneValue=String(data.get('phone') || '').trim();
 const phoneDigits=phoneValue.replace(/\D/g,'');
 if(phoneDigits.length<7 || phoneDigits.length>15) {phone.setCustomValidity('Please enter a phone number with 7 to 15 digits.');phone.reportValidity();return;}
 if(!form.reportValidity()) return;
 const name=String(data.get('name') || '').trim();
 if(!name){select<HTMLInputElement>('#name').focus();return;}
 const shootType=String(data.get('occasion'));
 const lines=['Hi Bharani Studio!','',"I'm "+name+" and I'd love to enquire about a shoot.",'Occasion: '+shootType,'Phone: '+phoneValue];
 const dateValue=String(data.get('date') || '');
 if(dateValue) lines.push('Preferred date: '+dateValue);
 const message=String(data.get('message') || '').trim();
 if(message) lines.push('',message);
 if(campaign.utm_source) lines.push('','Found you through: '+campaign.utm_source+(campaign.utm_campaign?' / '+campaign.utm_campaign:''));
 const url='https://wa.me/919908996227?text='+encodeURIComponent(lines.join('\n'));
 trackEnquiry('whatsapp-form',shootType);
 window.open(url,'_blank','noopener,noreferrer');
 const status=select<HTMLElement>('#form-status');
 status.replaceChildren(document.createTextNode('Your message is ready. '));
 const fallback=document.createElement('a');fallback.href=url;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent='Open WhatsApp to review and send';
 status.append(fallback);
});

const privacy = select<HTMLDialogElement>('#privacy');
select('.privacy-trigger').addEventListener('click',()=>{privacy.showModal();document.body.classList.add('modal-open');});
select('.privacy-close').addEventListener('click',()=>privacy.close());
privacy.addEventListener('close',()=>document.body.classList.remove('modal-open'));
privacy.addEventListener('click',event=>{if(event.target===privacy){const rect=privacy.getBoundingClientRect();if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) privacy.close();}});

import express from 'express';
import rateLimit from 'express-rate-limit';
import {randomUUID,randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {validatePage} from '../shared/page.js';
const scrypt=promisify(scryptCallback);
const digest=s=>createHash('sha256').update(s).digest('hex');
const publicUser=u=>({id:u.id,email:u.email});
export function createApp(store) {
 const app=express();app.disable('x-powered-by');
 app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');next();});
 app.use('/api',(req,res,next)=>{
  res.setHeader('Cache-Control','no-store');
  if(['POST','PUT','DELETE'].includes(req.method)){
   const origin=req.headers.origin;const expected=process.env.APP_ORIGIN||`${req.protocol}://${req.get('host')}`;
   if(origin&&origin!==expected)return res.status(403).json({error:'Request origin is not allowed.'});
   if(req.headers['sec-fetch-site']==='cross-site')return res.status(403).json({error:'Cross-site request rejected.'});
   if(req.method!=='DELETE'&&!req.is('application/json'))return res.status(415).json({error:'JSON required.'});
  }next();
 });
 app.use(express.json({limit:'512kb'}));
 app.get('/api/health',(_,res)=>res.json({ok:true,storage:store.mode}));
 app.use('/api',async(req,res,next)=>{
  const token=req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('forme_session='))?.slice(14);
  if(token){const session=await store.get('sessions',digest(token));if(session&&new Date(session.expiresAt)>new Date()){req.user=await store.get('users',session.userId);req.session=session;}else if(session)await store.remove('sessions',session.id);}
  next();
 });
 const authLimit=rateLimit({windowMs:15*60*1000,limit:40,standardHeaders:'draft-8',legacyHeaders:false,message:{error:'Too many attempts. Please try again in 15 minutes.'}});
 const required=(req,res,next)=>req.user?next():res.status(401).json({error:'Please sign in to save your projects.'});
 const cookieOptions={httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:7*86400000};
 async function sessionFor(res,user){const token=randomBytes(32).toString('hex');await store.put('sessions',{id:digest(token),userId:user.id,expiresAt:new Date(Date.now()+7*86400000)});res.cookie('forme_session',token,cookieOptions);res.json({user:publicUser(user)});}
 app.get('/api/auth/me',(req,res)=>res.json({user:req.user?publicUser(req.user):null,storage:store.mode}));
 app.post('/api/auth/:action',authLimit,async(req,res)=>{
  const action=req.params.action;
  if(action==='logout'){if(req.session)await store.remove('sessions',req.session.id);res.clearCookie('forme_session',{...cookieOptions,maxAge:undefined});return res.json({ok:true});}
  if(!['login','signup'].includes(action))return res.status(404).json({error:'Unknown action.'});
  const email=typeof req.body?.email==='string'?req.body.email.trim().toLowerCase():'';const password=req.body?.password;
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||typeof password!=='string'||password.length<8||password.length>128)return res.status(400).json({error:'Enter a valid email and a password of 8–128 characters.'});
  const id=digest(email);const existing=await store.get('users',id);
  if(action==='signup'){
   if(existing)return res.status(409).json({error:'An account with this email already exists.'});
   const salt=randomBytes(16).toString('hex');const hash=(await scrypt(password,salt,64)).toString('hex');
   // Recheck after the asynchronous hash to prevent concurrent local registrations.
   if(await store.get('users',id))return res.status(409).json({error:'An account with this email already exists.'});
   const user={id,email,salt,hash,createdAt:new Date().toISOString()};await store.put('users',user);return sessionFor(res,user);
  }
  const hash=await scrypt(password,existing?.salt||'invalid-account-salt',64);
  if(!existing||!timingSafeEqual(hash,Buffer.from(existing.hash,'hex')))return res.status(401).json({error:'Email or password is incorrect.'});
  return sessionFor(res,existing);
 });
 app.use('/api/projects',required);
 app.get('/api/projects',async(req,res)=>{const projects=await store.find('projects',{ownerId:req.user.id});res.json({projects:projects.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map(({id,name,updatedAt,page})=>({id,name,updatedAt,sections:page.sections.length}))});});
 function payload(body){return body&&typeof body.name==='string'&&body.name.trim().length>0&&body.name.trim().length<=80&&validatePage(body.page);}
 app.post('/api/projects',async(req,res)=>{if(!payload(req.body))return res.status(400).json({error:'Invalid project. Check the name and section settings.'});const project={id:randomUUID(),ownerId:req.user.id,name:req.body.name.trim(),page:req.body.page,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};await store.put('projects',project);res.status(201).json({project});});
 app.use('/api/projects/:id',async(req,res,next)=>{const p=await store.get('projects',req.params.id);if(!p||p.ownerId!==req.user.id)return res.status(404).json({error:'Project not found.'});req.project=p;next();});
 app.get('/api/projects/:id',(req,res)=>res.json({project:req.project}));
 app.put('/api/projects/:id',async(req,res)=>{if(!payload(req.body))return res.status(400).json({error:'Invalid project. Check the name and section settings.'});const project={...req.project,name:req.body.name.trim(),page:req.body.page,updatedAt:new Date().toISOString()};await store.put('projects',project);res.json({project});});
 app.delete('/api/projects/:id',async(req,res)=>{await store.remove('projects',req.project.id);res.json({ok:true});});
 app.use('/api',(_,res)=>res.status(404).json({error:'API route not found.'}));
 app.use((err,req,res,next)=>{if(!req.path.startsWith('/api'))return next(err);console.error(err.message);res.status(err.status||500).json({error:err.status===413?'Project exceeds the size limit.':err.status===400?'Invalid JSON.':'Something went wrong. Please try again.'});});
 return app;
}

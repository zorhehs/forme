import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../server/app.js';
import {createStore} from '../server/store.js';
import {template} from '../shared/page.js';
import {request} from './request.js';
test('account lifecycle, persistence, validation, and project ownership',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'forme-test-'));const store=await createStore({dir,uri:''});const app=createApp(store);
 const req=(url,options)=>request(app,url,options);
 try{
  assert.equal((await req('/projects')).status,401);
  assert.equal((await req('/auth/signup',{method:'POST',body:{email:'bad',password:'short'}})).status,400);
  const a=await req('/auth/signup',{method:'POST',body:{email:'one@example.com',password:'test-password-123'}});assert.equal(a.status,200);assert.ok(a.cookie);const cookie=a.cookie;
  assert.equal((await req('/auth/me',{cookie})).data.user.email,'one@example.com');
  assert.equal((await req('/auth/signup',{method:'POST',body:{email:'one@example.com',password:'different-password'}})).status,409);
  assert.equal((await req('/auth/login',{method:'POST',body:{email:'one@example.com',password:'wrong-password'}})).status,401);
  const payload={name:'Test project',page:template()};const created=await req('/projects',{method:'POST',cookie,body:payload});assert.equal(created.status,201);const id=created.data.project.id;
  assert.equal((await req('/projects',{cookie})).data.projects.length,1);
  const b=await req('/auth/signup',{method:'POST',body:{email:'two@example.com',password:'test-password-123'}});
  for(const method of ['GET','PUT','DELETE'])assert.equal((await req('/projects/'+id,{method,cookie:b.cookie,body:method==='PUT'?payload:undefined})).status,404);
  assert.equal((await req('/projects/'+id,{method:'PUT',cookie,body:{...payload,name:''}})).status,400);
  assert.equal((await req('/projects/'+id,{method:'PUT',cookie,body:{...payload,name:'Renamed'}})).status,200);
  assert.equal((await req('/projects/'+id,{cookie})).data.project.name,'Renamed');
  const reopened=await createStore({dir,uri:''});assert.equal((await reopened.get('projects',id)).name,'Renamed');await reopened.close();
  assert.equal((await req('/projects',{method:'POST',cookie,origin:'https://evil.example',body:payload})).status,403);
  assert.equal((await req('/projects/'+id,{method:'DELETE',cookie})).status,200);
  await req('/auth/logout',{method:'POST',cookie,body:{}});assert.equal((await req('/projects',{cookie})).status,401);
  const login=await req('/auth/login',{method:'POST',body:{email:'one@example.com',password:'test-password-123'}});assert.equal(login.status,200);
 }finally{await store.close();await rm(dir,{recursive:true,force:true});}
});

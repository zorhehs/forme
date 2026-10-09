import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
export async function createStore({uri=process.env.MONGODB_URI,dir=process.env.DATA_DIR||'data'}={}) {
 if(uri){
  const {MongoClient}=await import('mongodb').catch(()=>{throw new Error('MongoDB driver missing. Run npm run db:setup first.');});
  const client=new MongoClient(uri,{serverSelectionTimeoutMS:5000});await client.connect();
  const db=client.db(process.env.MONGODB_DB||'forme');
  await db.collection('users').createIndex({email:1},{unique:true});
  await db.collection('projects').createIndex({ownerId:1});
  await db.collection('sessions').createIndex({expiresAt:1},{expireAfterSeconds:0});
  return {mode:'mongodb',get:(c,id)=>db.collection(c).findOne({_id:id}),find:(c,q)=>db.collection(c).find(q).toArray(),put:async(c,v)=>{await db.collection(c).replaceOne({_id:v.id},{...v,_id:v.id},{upsert:true});return v;},remove:async(c,id)=>{await db.collection(c).deleteOne({_id:id});},close:()=>client.close()};
 }
 await mkdir(dir,{recursive:true});const file=path.join(dir,'forme.json');let data={users:{},projects:{},sessions:{}};
 try{data=JSON.parse(await readFile(file,'utf8'));}catch(err){if(err.code!=='ENOENT')throw err;}
 let queue=Promise.resolve();
 function persist(){const json=JSON.stringify(data,null,2);queue=queue.then(async()=>{await writeFile(file+'.tmp',json,{mode:0o600});await rename(file+'.tmp',file);});return queue;}
 return {mode:'local',get:async(c,id)=>structuredClone(data[c][id]||null),find:async(c,q)=>Object.values(data[c]).filter(v=>Object.entries(q).every(([k,val])=>v[k]===val)).map(v=>structuredClone(v)),put:async(c,v)=>{data[c][v.id]=structuredClone(v);await persist();return v;},remove:async(c,id)=>{delete data[c][id];await persist();},close:async()=>{await queue;}};
}

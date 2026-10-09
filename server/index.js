try { process.loadEnvFile(); } catch (error) { if (error.code !== 'ENOENT') throw error; }
import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createStore} from './store.js';
import {createApp} from './app.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const store=await createStore();
const app=createApp(store);
if(process.env.NODE_ENV==='production'){
 app.use(express.static(path.join(root,'dist')));
 app.get('/{*path}',(_,res)=>res.sendFile(path.join(root,'dist/index.html')));
}else{
 const {createServer}=await import('vite');const vite=await createServer({root,server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);
}
const port=Number(process.env.PORT||5173);const host=process.env.HOST||'127.0.0.1';
app.listen(port,host,()=>console.log(`Forme ready at http://${host}:${port} — ${store.mode} storage`));

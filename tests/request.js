// Exercise the actual Express middleware stack without opening a network socket.
import {Socket} from 'node:net';
import {ServerResponse,IncomingMessage} from 'node:http';
export function request(app,url,{method='GET',body,cookie,origin}={}) {
 return new Promise((resolve,reject)=>{
  const payload=body?JSON.stringify(body):'';
  const socket=new Socket();Object.defineProperty(socket,'remoteAddress',{value:'127.0.0.1'});const req=new IncomingMessage(socket);req.url='/api'+url;req.method=method;req.httpVersionMajor=1;req.httpVersionMinor=1;req.httpVersion='1.1';
  req.headers={host:'localhost','content-type':'application/json','content-length':String(Buffer.byteLength(payload)),...(cookie?{cookie}:{}),...(origin?{origin}:{})};
  
  const res=new ServerResponse(req);let text='';
  const timeout=setTimeout(()=>reject(new Error('Request timed out: '+url)),5000);
  res.write=chunk=>{text+=chunk;return true;};
  res.end=chunk=>{if(chunk)text+=chunk;clearTimeout(timeout);try{const header=res.getHeader('set-cookie');resolve({status:res.statusCode,data:JSON.parse(text),cookie:(Array.isArray(header)?header[0]:header)?.split(';')[0]});}catch(error){reject(error);}return res;};
  app.handle(req,res,error=>{clearTimeout(timeout);reject(error||new Error('Unhandled request'));});
  if(payload)req.push(Buffer.from(payload));req.push(null);
 });
}

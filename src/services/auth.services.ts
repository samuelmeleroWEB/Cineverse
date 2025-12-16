export  async function  registrarUsuarios(email:string,password:string){
const res = await fetch(`http://localhost:4000/auth/register`,{
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
});
  if (!res.ok) throw new Error('Error al registrar usuario');
  return res.json(); 
}
export  async function  loginUsuarios(email:string,password:string){
const res = await fetch(`http://localhost:4000/auth/login`,{
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({email,password})
});
  if (!res.ok) throw new Error('Error al iniciar sesion');
  return res.json(); 
}

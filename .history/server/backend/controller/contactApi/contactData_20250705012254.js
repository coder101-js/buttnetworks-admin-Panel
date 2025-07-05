export const getData = async(req,res)=>{
  try {
    // const {token} = req.cookies
    // if(!token){
    //   return res.status(403).send({msg:'Invalid request'})
    // }
    const body = {
      type:'admin/contact'
    }
    const option = {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(body)
    }
    const api =await fetch('https://api.buttnetworks.com/gateway',option)
    const response  =  await api.json()
    const data = response
    return res.send(data)
  } catch (err) {
    console.log(err)
    console.error('❌ Error:', err.message);
    
  }
}
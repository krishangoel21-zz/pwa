if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then((reg)=>{console.log("Sw is registered")})
    .catch((err)=>{console.log("Sw is  not registered", err)})
}
else{
    console.log("Sw is  not supported");
}

// enable data offline
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

//real time listener
db.collection('foodapp').onSnapshot((snapshot)=>{
    snapshot.docChanges().forEach(item => {
        if(item.type === "added"){
        setTimeout(() => {
        storageRef.child(`${item.doc.data().image}`).getDownloadURL()
        .then((imageUrl)=>{
          if(imageUrl.length != 0){
            renderData(item.doc.data(), item.doc.id, imageUrl)
          }
        }).catch((err)=>{
           console.log("Not found", err)
        })
        }, 2000);
       }
        if(item.type === "removed"){
        renderDeletedData(item.doc.id)
        }
    });
 })

 const form = document.querySelector('form');

 const fileButton = document.getElementById("cameraInput");
 let file;
  fileButton.addEventListener('change', function(e){
     file = e.target.files[0];
 });

 form.addEventListener('submit', evt =>{
    evt.preventDefault();
    const dataSend = {
        time: Date.now(),
        title: form.title.value,
        ingredients: form.ingredients.value,
        image:form.filename.value
    }
    if(form.title.value != "" && form.ingredients.value != "" && form.filename.value != ""){
      const storageRef = firebase.storage().ref(form.filename.value);
      storageRef.put(file);
      db.collection('foodapp').add(dataSend)
      .then(()=>{
        const Modalelem = document.querySelector('.modal');
        M.Modal.init(Modalelem, {dismissible: true}).open();
        document.querySelector('.msg').innerHTML = "Your record has been added.";
        const forms = document.querySelectorAll('.side-form');
         M.Sidenav.init(forms).close();
      })
      .catch((err)=>console.log(err));
      form.title.value = '';
      form.ingredients.value = '';
      form.filename.value = ''
    }
    else{
       const Modalelem = document.querySelector('.modal');
       M.Modal.init(Modalelem, {dismissible: true}).open();
       document.querySelector('.msg').innerHTML = "Please fill the form";
    }
 });



 const removeData = document.querySelector('.dataContainer');
  removeData.addEventListener('click', evt =>{
     if(evt.target.tagName === "I"){
     const id = evt.target.getAttribute('data-id');
     const getimageUrl = evt.target.getAttribute('data-image-url');
     db.collection('foodapp').doc(id).delete()
     const desertRef = storageRef.child(getimageUrl);
     desertRef.delete()
     }
 })



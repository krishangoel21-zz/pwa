const appendData = document.querySelector('.dataContainer');

document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'right'});
    // add recipe form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, {edge: 'left'});
  });


// render Data

 const renderData = (data,id, imageUrl) =>{
    const html = `
    <div class="card-panel recipe white row" data-id="${id}">
    <img src="${imageUrl}" alt="recipe thumb" class="thumbnail col s4">
    <div class="recipe-details col s8">
      <div class="recipe-title left-align"><b>Recipe Name:</b> ${data.title}</div>
      <div class="recipe-ingredients left-align"><b>Recipe Ingredients:</b> ${data.ingredients}</div>
      <div class="left-align"><b>Added on:</b> ${ moment(data.time).format('MMMM Do YYYY, h:mm a')}</div>
    </div>
    <div class="recipe-delete right-align">
      <i class="material-icons" data-id="${id}" data-image-url="${data.image}">delete_outline</i>
    </div>
  </div>`
    appendData.innerHTML += html;
   }

  const renderDeletedData = (id) =>{
    const searchData = document.querySelector(`.recipe[data-id=${id}]`);
    searchData.remove();
  }
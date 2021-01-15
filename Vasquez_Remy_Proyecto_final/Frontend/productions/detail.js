function logout() {
    sessionStorage.setItem("jwt", "");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("userRoles", "");
    window.location.href = "../index.html";
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var productionId= getParameterByName("productionId");

const baseUrl = 'http://localhost:44319/api';
const url = `${baseUrl}/productions/${productionId}`;

function toEdit(productionId){
    window.location.href = `/productions/edit.html?productionId=${productionId}`;
}
function toMovies(productionId){
    window.location.href = `/movies/list.html?productionId=${productionId}`;
}
function toCreateMovie(){
    window.location.href = `/movies/create.html?productionId=${productionId}`;
}

/*, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
      'phraseToSearch': phrase_to_search
    }
  }*/
function fetchdeleteProduction() {
    fetch(url, {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}` 
        }
        
        //body: JSON.stringify(data)
    }).then((response) => {
        if (response.status === 200) {
            console.log("production Delete successfuly");
            window.location.href = "/productions/list.html"
        } else {
            response.text().then((data) => {

                console.log(data);
            });
        }
    }).catch((response) => {

        console.log(data);
    });
    
}

window.addEventListener('load', (event) => {
    function none(){
        throw new error("Clasification don't exist")
    }
    async function fetchGetProduction() {

        var page_title='MovieDB';
        let response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
            }
          });

        try {
            if (response.status === 200) {
                let data = await response.json();

                document.getElementById("delete-production-confirmed").setAttribute("onclick", `fetchdeleteProduction()`);
                page_title=`${page_title} | ${data.name}`;
                var productionToString=`
                <div class="container" >
                    <div class="row">
                        <div class="col-xl-9 col-lg-6 col-lg-4">
                            <div id="view-movie" style="-webkit-text-stroke: 0.7px black; font-size:42px; color:white;"><b>${data.name}</b></div>
                        </div>
                        <button id="add-movie-btn" data-placement="top" title="Añadir Pelicula" onclick="toCreateMovie(${data.id})" type="button" class="btn float-right" data-toggle="modal tooltip">
                            <img src="../src/plus_icon_neg.png" height="30" alt="edit_icon"> 
                        </button>

                        <button id="edit-movie-btn" data-placement="top" title="Editar" onclick="toEdit(${data.id})" type="button" class="btn float-right" data-toggle="modal tooltip">
                            <img src="../src/pencil_icon_neg.png" height="30" alt="edit_icon"> 
                        </button> 
                        
                        <button id="delete-movie-btn" data-placement="top" title="Eliminar" type="button" class="btn float-right" data-toggle="modal" data-target="#confirm-delete-modal">
                            <img src="../src/trash_icon_neg.png" height="30" alt="delete_icon"> 
                        </button> 
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xl-11 col-lg-11 col-lg-6">
                            <img src="${data.pictureLink}" style="border:0.2em solid gold;" alt="${data.name}"><br>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-xl-11 col-lg-11">

                            <br>
                            <div class="text-justify text-white container p-3" id="description-movie" style="font-size:20px">
                                ${data.description}
                            </div><br>
                            
                        </div>  
                    </div>
                    <div class="row">
                        <div class="col-xl-11 col-lg-11">
                            
                            <h1><button id="view-movie-btn" onclick="toMovies(${data.id})" type="button" class="btn p-1">
                                Ver Peliculas
                            </button></h1>
                            
                        </div>  
                    </div>

                </div>
                `
                //${data.picturelink}
                document.getElementById("production-info").innerHTML = productionToString;
                        
            } else {
                console.log();
                throw new error(await response.text())
            }
        } catch (error) {
            console.error(error);
        }   
    document.querySelector("head title").innerHTML = page_title;

    if(!Boolean(sessionStorage.getItem("jwt"))){
        window.location.href = "../index.html";
    }else{
        if(sessionStorage.getItem("userRoles") !== "Admin"){
            document.getElementById("add-movie-btn").style.display = "none";
            document.getElementById("edit-movie-btn").style.display = "none";
            document.getElementById("delete-movie-btn").style.display = "none";
        }
    }
    }
    fetchGetProduction();

    var rolesString = '';
    var info = sessionStorage.getItem("userRoles");
    if(info === 'Admin' ){
        rolesString = '<span style="font-weight: bold;"> | Admin</span>';
    }
    //<span style="font-weight: bold;">Admin</span>
    /*
    sessionStorage.getItem("userRoles").forEach( element => {
        if(element === 'admin' ){
            rolesString = 'Admin';
        }
    });*/
    document.getElementById("sayHi-id").innerHTML = `Hola, ${sessionStorage.getItem("userName")} ${rolesString}`;
});
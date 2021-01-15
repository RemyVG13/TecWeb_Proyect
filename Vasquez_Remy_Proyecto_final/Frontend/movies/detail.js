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
function backToMovies(){
    window.location.href = `/movies/list.html`
}
var movieId= getParameterByName("movieId");
var productionId= getParameterByName("productionId");

const baseUrl = 'http://localhost:44319/api';
const url = `${baseUrl}/productions/${productionId}/movies/${movieId}`;

function toEdit(movieId,productionId){
    window.location.href = `/movies/edit.html?movieId=${movieId}&productionId=${productionId}`;
}
/*
{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
      'phraseToSearch': phrase_to_search
    }
  }*/


function fetchdeleteMovie() {
    fetch(url, {
        method: 'DELETE',
        headers: { 
            "Content-Type": "application/json; charset=utf-8", 
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
        }
        
        //body: JSON.stringify(data)
    }).then((response) => {
        if (response.status === 201) {
            console.log("movie Delete successfuly");

        } else {
            response.text().then((data) => {

                console.log(data);
            });
        }
    }).catch((response) => {

        console.log(data);
    });
    window.location.href = "/movies/list.html"
}

window.addEventListener('load', (event) => {
    
    function none(){
        throw new error("Clasification don't exist")
    }
    var page_title='MovieDB';
    async function fetchGetMovie() {

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
                
                switch(data.clasification) {
                    case "A":
                        var backgroundClasification="green";
                      break;
                    case "13":
                        var backgroundClasification="yellow";
                      break;
                    case "16":
                        var backgroundClasification="orange"; 
                      break;
                    case "18":
                        var backgroundClasification="red";
                      break;
                        
                    default:
                        none();
                }
                //style="-webkit-text-stroke: 0.7px black;  font-family: sans;"
                document.getElementById("delete-movie-confirmed").setAttribute("onclick", `fetchdeleteMovie()`);
                page_title = `${page_title} | ${data.title}`;
                var movieToString=`
                <div class="container" >
                    <div class="row">
                        <div class="col-xl-4 col-lg-5">
                            <div>
                                <img id="movie-picture" src="${data.pictureLink}" style="border:0.2em solid gold; width:100%" alt="Movie_Image">
                            </div>
                        </div>
                        <div class="col-xl-8 col-lg-7">
                            <div id="view-movie" style="-webkit-text-stroke: 0.7px black; font-size:42px;"><b>${data.title}</b>&nbsp(${data.year})</div>
                            <button id="exit-edit-btn" data-placement="top" title="Salir" onclick="backToMovies()" type="button" class="btn float-right hover-blue" data-toggle="tooltip">
                                    <img src="../src/left_arrow_icon_neg.png" height="30" alt="edit_icon"> 
                            </button> 
                            
                            <button id="edit-movie-btn" data-placement="top" title="Editar" onclick="toEdit(${data.id},${data.productionId})" type="button" class="btn float-right" data-toggle="modal tooltip">
                                <img src="../src/pencil_icon_neg.png" height="30" alt="edit_icon"> 
                            </button> 
                            <button id="delete-movie-btn" data-placement="top" title="Eliminar" type="button" class="btn float-right" data-toggle="modal" data-target="#confirm-delete-modal">
                                <img src="../src/trash_icon_neg.png" height="30" alt="delete_icon"> 
                            </button> 


                            <br> <br>
                            <div style="font-size:32px">
                                <span style="border:0.1em solid #FFFFFF; background-color:${backgroundClasification}; -webkit-text-stroke: 0.5px black;"><b>&nbsp ${data.clasification} &nbsp</b></span>
                                <span ><b>&nbsp${data.genre}</b></span>
                            </div>
                            <br>
                            <div style="font-size:42px">
                                <span style="border:0.1em solid #FFFFFF; background-color: gray; border-radius: 30px 10px 30px 10px;">
                                    <b>&nbsp${data.rating}</b>
                                </span>
                                <span style="font-size:52px;">
                                    <b>&nbsp★</b>
                                </span>
                            </div>
                            <br>
                            <div style="font-size:36px">
                                <img id="duration-icon"src="../src/sandclock_icon_neg.png" height="45" alt="edit_icon">
                                <label for="duration-icon"><b>&nbsp${data.minDuration} minutos</b> </label>
                            </div>
                            <br>
                            <div class="text-justify container p-3" id="description-movie" style="font-size:20px">
                                ${data.description}
                            </div><br>
                            
                        </div>  
                    </div>
                </div>
                `
                //${data.picturelink}
                document.getElementById("movie-info").innerHTML = movieToString;
                if(!Boolean(sessionStorage.getItem("jwt"))){
                    window.location.href = "../index.html";
                }else{
                    if(sessionStorage.getItem("userRoles") !== "Admin"){
                        document.getElementById("edit-movie-btn").style.display = "none";
                        document.getElementById("delete-movie-btn").style.display = "none";
                    }
                }
            } else {
                console.log();
                throw new error(await response.text())
            }
        } catch (error) {
            console.error(error);
        }   
        var test =document.querySelector("head title");
        document.querySelector("head title").innerHTML = page_title;
    }
    fetchGetMovie();
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
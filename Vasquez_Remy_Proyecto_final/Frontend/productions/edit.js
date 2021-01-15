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

if(!Boolean(sessionStorage.getItem("jwt"))){
    window.location.href = "../index.html";
}else{
    if(sessionStorage.getItem("userRoles") !== "Admin"){
        window.location.href = "./list.html";
    }
}
var productionId= getParameterByName("productionId");

const baseUrl = 'http://localhost:44319/api';
const url = `${baseUrl}/productions/${productionId}`;

function backToProduction(productionId){
    window.location.href = `/productions/detail.html?productionId=${productionId}`;
}
function toEdit(productionId){
    window.location.href = `/productions/edit.html?productionId=${productionId}`;
}
function toCreateMovie(){
    window.location.href = `/movies/create.html?productionId=${productionId}`;
}

function fetchdeleteProduction() {
    fetch(url, {
        headers: { 
            "Content-Type": "application/json; charset=utf-8", 
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`
        },
        method: 'DELETE',
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
function fetchUpdateProduction(event) {

    event.preventDefault();
    //var movieId = parseInt(event.currentTarget.id.value);
    
    var info = event.currentTarget;
    
    var data = {
        name: info.name.value,
        pictureLink: info.pictureLink.value,
        description: info.description.value
    };


    fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}` 
        }
    }).then((response) => {
        if (response.status === 200) {
            console.log("production Update successfuly");
            document.getElementById("update-production-message").style.display = "block";
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

        
        let response = await fetch(url, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}` 
            }
        });
        var page_title = "MovieDB";
        try {
            if (response.status === 200) {
                let data = await response.json();
                page_title = `${page_title} | Editar | ${data.name}`;
                document.getElementById("delete-production-confirmed").setAttribute("onclick", `fetchdeleteProduction()`);
                var productionToString=`
                <div class="container" >
                    <form name="newMovie-frm" id ="updateMovie-frm">
                        <div class="row">
                            <div class="col-xl-9 col-lg-6 col-lg-4">

                                <input autocomplete="off" type="text" class="movie-to-update-title text-input-edit-movie" name="name"  style="-webkit-text-stroke: 0.7px black; font-size:42px; display: inline;" value="${data.name}">
                            </div>
                            <button id="exit-edit-btn" data-placement="top" title="Salir" onclick="backToProduction(${data.id})" type="button" class="btn float-right hover-blue" data-toggle="tooltip">
                                <img src="../src/left_arrow_icon_neg.png" height="30" alt="edit_icon"> 
                            </button> 

                            <button id="edit-movie-btn" data-placement="top" title="Añadir Pelicula" onclick="toCreateMovie(${data.id})" type="button" class="btn float-right" data-toggle="modal tooltip">
                                <img src="../src/plus_icon_neg.png" height="30" alt="edit_icon"> 
                            </button>
                            
                            <button id="delete-movie-btn" data-placement="top" title="Eliminar" type="button" class="btn float-right" data-toggle="modal" data-target="#confirm-delete-modal">
                                <img src="../src/trash_icon_neg.png" height="30" alt="delete_icon"> 
                            </button> 
                        </div>
                        <div class="row">
                            <div class="col-xl-11 col-lg-11 col-lg-6">
                                <img id="movie-picture" src="${data.pictureLink}" style="border:0.2em solid gold;" alt="${data.name}"><br>
                                <br><br>
                                <input id="movie-picture-text-input" autocomplete="off"  type="text" class="movie-to-update-title text-input-edit-movie" name="pictureLink"  value="${data.pictureLink}">
                            </div>
                        </div>
                        <br>

                        <div class="row">
                            <div class="col-xl-11 col-lg-11 ">
                                
                               <textarea autocomplete="off" rows="12" cols="60" name="description" class="text-input-edit-movie p-3" style="font-size:20px; background-color:rgba(128, 128, 128, 0.5);">${data.description}</textarea><br>
                                
                            </div>  
                        </div>
                        <br><br>
                        <div class="row">
                            <div class="col-xl-11 col-lg-11 ">
                                
                                <input id="Update-btn" class="movie-to-update-submit" type="submit" value="Guardar Cambios" style="border:0.1em solid gold; font-size:36px; border-radius:8px; color:white; background-color:gray;">
                            </div>  
                        </div>
                    </form>
                </div>
                `


                //${data.picturelink}
                document.getElementById("production-info").innerHTML = productionToString;
                document.getElementById("update-production-message").style.display = "none";
                
            } else {
                console.log();
                throw new error(await response.text())
            }
        } catch (error) {
            console.error(error);
        }  
        document.querySelector("head title").innerHTML = page_title;
        document.getElementById("updateMovie-frm").addEventListener("submit", fetchUpdateProduction);
        document.getElementById("movie-picture-text-input").addEventListener("change", updateImage);
    }
    fetchGetProduction();

    function updateImage(event) {
        event.preventDefault();

        var link = event.currentTarget.value;
        document.getElementById("movie-picture").setAttribute("src", link);
    }

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

    
    
    
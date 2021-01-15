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
const url = `${baseUrl}/productions/`;

function backToProduction(){
    window.location.href = `/productions/list.html`;
}


function fetchCreateProduction(event) {

    event.preventDefault();
    //var movieId = parseInt(event.currentTarget.id.value);
    
    var info = event.currentTarget;
    
    var data = {
        name: info.name.value,
        pictureLink: info.pictureLink.value,
        description: info.description.value
    };

    /*, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
      'phraseToSearch': phrase_to_search
    }
    }*/
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`

        }
    }).then((response) => {
        if (response.status === 201) {
            console.log("production created successfuly");
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
    async function LoadInterface() {

        
        var page_title = "MovieDB";

        page_title = `${page_title} | Crear Casa Productora`;
        document.getElementById("delete-production-confirmed").setAttribute("onclick", `fetchdeleteProduction()`);
        var productionToString=`
        <div class="container" >
            <form name="newMovie-frm" id ="updateMovie-frm">
                <div class="row">
                    <div class="col-xl-11 col-lg-8 col-lg-6">

                        <input required autocomplete="off" type="text" class="movie-to-update-title text-input-edit-movie" name="name"  style="-webkit-text-stroke: 0.7px black; font-size:42px; display: inline;" placeholder="Nombre">
                    </div>
                    <button id="exit-edit-btn" data-placement="top" title="Salir" onclick="backToProduction()" type="button" class="btn float-right hover-blue" data-toggle="tooltip">
                        <img src="../src/left_arrow_icon_neg.png" height="30" alt="edit_icon"> 
                    </button> 

                </div>
                <br>
                <div class="row">
                    <div class="col-xl-11 col-lg-11 col-lg-6">
                        <img id="movie-picture" src="https://static01.nyt.com/images/2018/10/30/science/out-there-black-hole-still/out-there-black-hole-still-jumbo.png" style="border:0.2em solid gold;" alt="production_image"><br>
                        <br><br>
                        <input  required id="movie-picture-text-input" autocomplete="off"  type="text" class="movie-to-update-title text-input-edit-movie" name="pictureLink"  placeholder="Link de la imagen">
                    </div>
                </div>
                <br>

                <div class="row">
                    <div class="col-xl-11 col-lg-11 ">
                        
                        <textarea required autocomplete="off" rows="12" cols="60" name="description" class="text-input-edit-movie p-3" style="font-size:20px; background-color:rgba(128, 128, 128, 0.5);" placeholder="Descripcion"></textarea><br>
                        
                    </div>  
                </div>
                <br><br>
                <div class="row">
                    <div class="col-xl-11 col-lg-11 ">
                        
                        <input required id="Update-btn" class="movie-to-update-submit" type="submit" value="Crear Productora" style="border:0.1em solid gold; font-size:36px; border-radius:8px; color:white; background-color:gray;">
                    </div>  
                </div>
            </form>
        </div>
        `


        //${data.picturelink}
        document.getElementById("production-info").innerHTML = productionToString;
        document.getElementById("update-production-message").style.display = "none";
                
        document.querySelector("head title").innerHTML = page_title;
        document.getElementById("updateMovie-frm").addEventListener("submit", fetchCreateProduction);
        document.getElementById("movie-picture-text-input").addEventListener("change", updateImage);
    }
    LoadInterface();

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

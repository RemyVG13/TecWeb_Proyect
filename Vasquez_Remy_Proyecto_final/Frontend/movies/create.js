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
const url = `${baseUrl}/productions/${productionId}/movies`;

function backToProduction(productionId){
    window.location.href = `/productions/detail.html?productionId=${productionId}`;
}
if(!Boolean(sessionStorage.getItem("jwt"))){
    window.location.href = "../index.html";
}else{
    if(sessionStorage.getItem("userRoles") !== "Admin"){
        window.location.href = "./list.html";
    }
}

function fetchCreateMovie(event) {

    event.preventDefault();
    //var movieId = parseInt(event.currentTarget.id.value);
    
    var info = event.currentTarget;
    
    var data = {
        title: info.title.value,
        minDuration: info.minDuration.valueAsNumber,
        clasification: info.clasification.value,
        genre: info.genre.value,
        year: info.year.valueAsNumber,
        rating: info.rating.valueAsNumber,
        pictureLink: info.pictureLink.value,
        description: info.description.value
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${sessionStorage.getItem("jwt")}` }
    }).then((response) => {
        if (response.status === 201) {
            console.log("movie created successfuly");
            document.getElementById("create-movie-message").style.display = "block";

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
        var fictionValue="value=\"Ciencia Ficcion\"";
        var comedyValue="value=\"Comedia\"";
        var dramaValue="value=\"Drama\"";
        var fantasyValue="value=\"Fantasia\"";
        var musicalValue="value=\"Musical\"";
        var terrorValue="value=\"Terror\"";
        var actionValue="value=\"Accion\"";
        var clasificationValueA="value=\"A\"";
        var clasificationValue13="value=\"13\"";
        var clasificationValue16="value=\"16\"";
        var clasificationValue18="value=\"18\"";

        var interface=`
        <div class="container" >
            <form name="newMovie-frm" id ="create-movie-frm">
                <div class="row">
                    
                    <div class="col-xl-4 col-lg-5">
                        <br>
                        <div>
                        <img id="movie-picture" src="https://ambercottee.files.wordpress.com/2016/03/img_43111.jpg?w=342&h=513" style="border:0.2em solid gold; width:100%;" alt="Movie_Image">
                        </div>
                        
                        <br><br>
                        <input required id="movie-picture-text-input" autocomplete="off"  type="text" class="movie-to-update-title text-input-edit-movie" name="pictureLink"  placeholder="Link de la imagen">
                        <br>
                        <br>
                        <br>
                        <input required id="Update-btn" class="movie-to-update-submit" type="submit" value="Crear Pelicula" style="border:0.1em solid gold; font-size:36px; border-radius:8px; color:white; background-color:gray;">
                    </div>
                    <div class="col-xl-8 col-lg-7">
                        <button id="exit-edit-btn" data-placement="top" title="Salir" onclick="backToProduction(${productionId})" type="button" class="btn float-right hover-blue" data-toggle="tooltip">
                            <img src="../src/left_arrow_icon_neg.png" height="30" alt="edit_icon"> 
                        </button> 
                        
                        <input required autocomplete="off" type="text" class="movie-to-update-title text-input-edit-movie" name="title"  style="-webkit-text-stroke: 0.7px black; font-size:42px; display: inline;" placeholder="Titulo">
                        <br>

                        <span style="-webkit-text-stroke: 0.7px black; font-size:42px;">(</span>
                            <input required autocomplete="off" type="number" class="movie-to-update-year text-input-edit-movie" name="year"  style="-webkit-text-stroke: 0.7px black; font-size:42px; width:115px;" placeholder="Año">
                        <span style="-webkit-text-stroke: 0.7px black; font-size:42px;">)</span>
                        <br>
                        <br>
                        
                        <select name="clasification" class="movie-to-update-clasification text-input-edit-movie text-center" id="clasification" style=" font-size:32px; display: inline; background-color:gray; width:90px;" >
                            <option ${clasificationValueA}>A </option><br>
                            <option ${clasificationValue13}>13 </option><br>
                            <option ${clasificationValue16}>16 </option><br>
                            <option ${clasificationValue18}>18 </option><br>
                        </select>

                        <select name="genre" class="movie-to-update-genre text-input-edit-movie" id="genre" style=" font-size:32px; display: inline;  background-color:gray; width:300px;">
                            <option ${actionValue}>Accion</option><br>
                            <option ${fictionValue}>Ciencia Ficcion</option><br>
                            <option ${comedyValue}>Comedia</option><br>
                            <option ${dramaValue}>Drama</option><br>
                            <option ${fantasyValue}>Fantasia</option><br>
                            <option ${musicalValue}>Musical</option><br>
                            <option ${terrorValue}>Terror</option><br>
                        </select>


                        <br> <br>
                        <input required type="number" autocomplete="off"  min="0" max="5" step="0.1"class="movie-to-update-year text-input-edit-movie" name="rating"  style="border:0.1em solid #FFFFFF; background-color: gray; border-radius: 30px 10px 30px 10px; display: inline; width:95px; font-size:42px;" placeholder="0">
                        <span style="font-size:52px;">
                                <b>&nbsp★</b>
                            </span>
                        <br>
                        <br>
                        
                        <img id="duration-icon"src="../src/sandclock_icon_neg.png" height="45" alt="edit_icon">
                        <span style="font-size:36px;">
                            <b>&nbsp </b>
                        </span>
                        <input required type="number" autocomplete="off" min="0" max="600" class="text-center movie-to-update-year text-input-edit-movie" name="minDuration"  style="display: inline; width:100px; font-size:36px;" autocomplete="off" >
                        <span style="font-size:36px;">
                            <b>&nbsp minutos</b>
                        </span>
                        <br>
                        <br>
                        <textarea required autocomplete="off" rows="7" cols="60" name="description" class="text-input-edit-movie p-3" style="font-size:20px; background-color:rgba(128, 128, 128, 0.5);" placeholder="Descripcion"></textarea><br>   
                        
                    </div>  
                </div>
                
            </form>
        </div>`
        document.getElementById("movie-info").innerHTML = interface;
        document.getElementById("create-movie-message").style.display = "none";
        document.getElementById("create-movie-frm").addEventListener("submit", fetchCreateMovie);
        document.getElementById("movie-picture-text-input").addEventListener("change", updateImage);
        document.querySelector("head title").innerHTML = "MovieDB | Crear Pelicula";
    }
    LoadInterface();

    function updateImage(event) {
        event.preventDefault();
        var link =event.currentTarget.value;
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

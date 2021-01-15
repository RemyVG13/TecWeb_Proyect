function logout() {
    sessionStorage.setItem("jwt", "");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("userRoles", "");
    window.location.href = "../index.html";
}
if(!Boolean(sessionStorage.getItem("jwt"))){
    window.location.href = "../index.html";
}
function toEdit(movieId,productionId){
    window.location.href = `/movies/edit.html?movieId=${movieId}&productionId=${productionId}`;
}
function toDetail(movieId,productionId){
    window.location.href = `/movies/detail.html?movieId=${movieId}&productionId=${productionId}`;
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
var productionId=getParameterByName("productionId")
var currentId = 0

window.addEventListener('load', (event) => {

    
    const baseUrl = 'http://localhost:44319/api';
    function none(){

    }
    async function fetchGetMovies(event) {
        var phrase_to_search = '';
        //event.preventDefault();
        if((event !== "input") && (event.currentTarget.movie_phrase_to_search !== undefined)){
            event.preventDefault();
            phrase_to_search = event.currentTarget.movie_phrase_to_search.value;
            document.getElementById("all-rdb").checked=true;
            /*
            if(x !== undefined){
                phrase_to_search = event.currentTarget.movie_phrase_to_search.value;
            }*/
            
        }

        var control = false;
        let url = `${baseUrl}/movieslist`;
        if (productionId != null){
            url = `${baseUrl}/productions/${productionId}/movies`;
            //control =true;
        }
        
        var radiovalue=document.filterfrm.filter.value;
        //var radiovalue = document.getElementById("filterfrmid").value;
        let dropdownInfo = document.getElementById("orderByid").value;
        switch(dropdownInfo) {
            case "title":
                if(control){
                    url = `${url}&orderBy=title`;
                }
                else{
                    url = `${url}?orderBy=title`;
                }
            
              break;
            case "rating":
                if(control){
                    url = `${url}&orderBy=rating`;
                }
                else{
                    url = `${url}?orderBy=rating`;
                }
                
              break;
            case "Year":
                if(control){
                    url = `${url}&orderBy=year`;
                }
                else{
                    url = `${url}?orderBy=year`;
                }
                
              break;
                
            default:
                none();
        }/*
        {
            headers: { 
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`  
            },
            method: 'GET'
        }*/
        let response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": `Bearer ${sessionStorage.getItem("jwt")}`,
              'phraseToSearch': phrase_to_search
            }
          });
        //let response = await fetch(url);

        try {
            if (response.status === 200) {
                
                let data = await response.json();
                switch(radiovalue) {
                    case "Accion":
                        data = data.filter(f => f.genre == "Accion");
                      break;
                    case "Ciencia Ficcion":
                        data = data.filter(f => f.genre == "Ciencia Ficcion");
                      break;
                    case "Comedia":
                        data = data.filter(f => f.genre == "Comedia");
                      break;
                    case "Drama":
                        data = data.filter(f => f.genre == "Drama");
                      break;
                    case "Fantasia":
                        data = data.filter(f => f.genre == "Fantasia");
                      break;
                    case "Musical":
                        data = data.filter(f => f.genre == "Musical");
                      break;
                      case "Terror":
                        data = data.filter(f => f.genre == "Terror");
                      break;

                    default:
                        none();
                }
                var moviesToString=data.map(p => `
                <br>
                <div style="background-color: #26272b; border-radius:15px;"class="movie-preview m-3 p-2 col-xl-3 col-lg-4 col-sm-12 text-white text-center">
                    <h1><button id="view-movie-btn" onclick="toDetail(${p.id},${p.productionId})" type="button" class="btn p-1">
                        ${p.title} 
                    </button></h1>
                    <button id="view-movie-picture-btn" onclick="toDetail(${p.id},${p.productionId})" type="button" class="btn">
                        <img src="${p.pictureLink}" class="movie-image"  alt="${p.title} image"> 
                    </button>
                    <div style="font-size: 20px" >
                        <b>Calificacion: ${p.rating} ★</b> 
                    </div> 
                </div>`);
                var moviesToString2=""
                moviesToString.forEach(element => {
                    moviesToString2=`${moviesToString2}${element}`
                });
                document.getElementById("movies-list").innerHTML = moviesToString2;
                
            } else {
                console.log();
                throw new error(await response.text())
            }
        } catch (error) {
            console.error(error);
        }
  
    }
    document.getElementById("all-rdb").checked=true;
    fetchGetMovies("input");
    document.getElementById("filterfrmid").addEventListener("input", fetchGetMovies);
    document.getElementById("orderByid").addEventListener("input", fetchGetMovies);
    

    document.getElementById("search-movie-frm").addEventListener("submit", fetchGetMovies);
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

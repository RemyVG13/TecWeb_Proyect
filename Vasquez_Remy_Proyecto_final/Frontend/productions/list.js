function logout() {
    sessionStorage.setItem("jwt", "");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("userRoles", "");
    window.location.href = "../index.html";
}

//create-production-house-btn
function toEdit(productionId){
    window.location.href = `/productions/edit.html?productionId=${productionId}`;
}
function toDetail(productionId){
    window.location.href = `/productions/detail.html?productionId=${productionId}`;
}
function toCreate() {
    window.location.href = `/productions/create.html`;
}
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.addEventListener('load', (event) => {

    const baseUrl = 'http://localhost:44319/api';
    function none(){

    }
    async function fetchGetProductions() {
        let url = `${baseUrl}/productions`;
    
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
                var productionsToString=data.map(p => `
                <br>
                <div class="movie-preview m-3 p-2 col-xl-11 col-lg-11 col-sm-11 bg-dark text-white text-center">
                    <h1><button id="view-movie-btn" onclick="toDetail(${p.id})" type="button" class="btn p-1">
                        ${p.name} 
                    </button></h1>
                    <button id="view-movie-picture-btn" onclick="toDetail(${p.id})" type="button" class="btn">
                        <img src="${p.pictureLink}" class="movie-image"  alt="${p.name} image"> 
                    </button>

                </div>`);
                var productionsToString2=""
                productionsToString.forEach(element => {
                    productionsToString2=`${productionsToString2}${element}`
                });
               document.getElementById("productions-list").innerHTML = productionsToString2;
                
            } else {
                console.log();
                throw new error(await response.text())
            }
        } catch (error) {
            console.error(error);
        }
      
    }
    if(!Boolean(sessionStorage.getItem("jwt"))){
        window.location.href = "../index.html";
    }else{
        if(sessionStorage.getItem("userRoles") !== "Admin"){
            document.getElementById("create-production-house-btn").style.display = "none";
        }
    }
    fetchGetProductions();
    document.getElementById("create-production-house-btn").addEventListener("click",toCreate)

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

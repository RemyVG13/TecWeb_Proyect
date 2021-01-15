function none(){
    
}
function showPassword(){
    var x = document.getElementById("password-frm-id");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
  }
}
window.addEventListener('load', (event) => {

    const baseUrl = 'http://localhost:44319/api';
    
    function login(event) {
        //debugger;
        console.log(event.currentTarget);
        event.preventDefault();
        const url = `${baseUrl}/auth/Login`;

        if(!Boolean(event.currentTarget.email.value)){
            var usernameErrorElement = document.getElementById("login-errors");
            usernameErrorElement.textContent= "username is requered"
            usernameErrorElement.style.display = "block";
            return;
        }    


        var data = {
            Email: event.currentTarget.email.value,
            Password: event.currentTarget.password.value
        }

        fetch(url, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
            method: 'POST',
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status === 200) {
                
                response.json().then((data)=>{

                    sessionStorage.setItem("jwt", data.message);
                    sessionStorage.setItem("userName", data.userName.replaceAll("_"," "));
                    sessionStorage.setItem("userRoles", data.userRoles);
                    window.location.href = "./movies/list.html";
                    
                });
            } else {
                /*
                data

email no registrado. "{"message":"There is no user with that Email address","userName":null,"userRoles":null,"isSuccess":false,"errors":null,"expireDate":null}"

contraseña no matchea. "{"message":"Invalid password","userName":null,"userRoles":null,"isSuccess":false,"errors":null,"expireDate":null}"

email invalido. "{"type":"https://tools.ietf.org/html/rfc7231#section-6.5.1","title":"One or more validation errors occurred.","status":400,"traceId":"|120a4954-43a14f83beb08dce.","errors":{"Email":["The Email field is not a valid e-mail address."]}}"

contraseña invalida. "{"type":"https://tools.ietf.org/html/rfc7231#section-6.5.1","title":"One or more validation errors occurred.","status":400,"traceId":"|120a4956-43a14f83beb08dce.","errors":{"Password":["The field Password must be a string with a minimum length of 5 and a maximum length of 50."]}}"

email y contraseña invalidos. "{"type":"https://tools.ietf.org/html/rfc7231#section-6.5.1","title":"One or more validation errors occurred.","status":400,"traceId":"|120a4958-43a14f83beb08dce.","errors":{"Email":["The Email field is not a valid e-mail address."],"Password":["The field Password must be a string with a minimum length of 5 and a maximum length of 50."]}}"
                */
                response.json().then((data) => {
                    //debugger;
                    var emailError='*';
                    var passwordError='*';
                    var info=data.message;
                    switch(data.message) {
                        case "There is no user with that Email address":
                            emailError=`${emailError}Este correo no esta registrado`;
                            document.getElementById("login-email-error").innerHTML = emailError;
                            document.getElementById("login-email-error").style.display = "block";
                            document.getElementById("login-password-error").style.display = "none";
                            break;
                        case "Invalid password":
                            passwordError=`${passwordError}Contraseña incorrecta`;
                            document.getElementById("login-password-error").innerHTML = passwordError;
                            document.getElementById("login-password-error").style.display = "block";
                            document.getElementById("login-email-error").style.display = "none";
                            break;
                            
                        default:
                            none();
                    }
                    
                    
                
                    

                    console.log(data);
                });
            }
        }).catch((response) => {

            //debugger;
            console.log(data);
        });

    }

    document.getElementById("login-frm-id").addEventListener("submit", login);

});

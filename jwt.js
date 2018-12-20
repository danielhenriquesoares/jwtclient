(function() {
    $("#jwt").on("click", (ev) => {
        let response = {};
        $.getJSON("http://127.0.0.1:8084/RESTfullWS/jwtmanager/jwt", (data) => {
            response = data;
        })
        .fail(() => {
            console.log("fail");
        })
        .done(() => {
            let jwt = response.result;
            if (KJUR.jws.JWS.verify(jwt, {utf8: "secret"}, ["HS256"])) {
                let headerObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(jwt.split(".")[0])),
                    payloadObj = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(jwt.split(".")[1]));


                    let payloadContainer = $("#payload-container");
                    for (let prop in payloadObj) {
                        if (payloadObj.hasOwnProperty(prop)) {
                            let elem = $("<div></div>"),
                                value = (prop === "exp") ? new Date(payloadObj.exp * 1000) : payloadObj[prop];

                            elem.append("<p>" + prop + ": <span>" + value + "</span></p>");

                            payloadContainer.append(elem);
                        }
                    }
                

                $("#validation-date").text(new Date(payloadObj.exp * 1000));
            }
        });
    });

    $("#post-jwt").on("click", (ev) => {
        let jwt = buildJwt();
        $.ajax({
            url: 'http://127.0.0.1:8084/RESTfullWS/jwtmanager/jwt',
            type: 'post',
            data: JSON.stringify({"jwt": jwt}),
            //headers: {'Content-Type': 'application/json'},
            dataType: 'json',
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", 'Bearer ' + jwt);
                xhr.setRequestHeader("Content-Type", 'application/json');
            },
            success: (data) => {
                console.info("sucess",data);
            }
        });
    });


    function buildJwt() {
        // Header
        let oHeader = {alg: 'HS256', typ: 'JWT'};
        // Payload
        let oPayload = {};
        //var tNow = KJUR.jws.IntDate.get('now');
        let tEnd = KJUR.jws.IntDate.get('now + 1day');
        oPayload.sub = "/testfromfront";
        oPayload.name = "Daniel Soares from front";
        oPayload.scope = "from front";
        /* oPayload.nbf = tNow;
        oPayload.iat = tNow; */
        oPayload.exp = tEnd;
        
        // Sign JWT, password=616161
        let sHeader = JSON.stringify(oHeader),
            sPayload = JSON.stringify(oPayload),
            sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, {utf8: "s3cr3t"});

        return sJWT;
    }
}).call();

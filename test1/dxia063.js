const selectTab = (elementID) => {
    for (element of document.getElementsByClassName('tab')) {
        element.style.backgroundColor = "transparent";
    }

    for (element of document.getElementsByClassName('content')) {
        element.style.display = "none";
    }
    document.getElementById(elementID + "Content").style.display = "block";
    document.getElementById(elementID).style.backgroundColor = "grey";
}


const getStaff = () => {
    const fetchPromise1 = fetch("https://dividni.com/cors/CorsProxyService.svc/proxy?url="+encodeURI("https://unidirectory.auckland.ac.nz/rest/search?orgFilter=MATHS"),
        {
            headers: {
                "Accept": "application/json",
            },
        }
    );

    const streamPromise1 = fetchPromise1.then((response) => response.json());
    streamPromise1.then((data) => {
       
        data.list.forEach( async (staff) => {
            let StaffContents = "";

            if (staff.imageId != null) {
                StaffContents += "<img class=\"thumbnail\" src=\"https://unidirectory.auckland.ac.nz/people/imageraw/" + staff.profileUrl[1] + "/" + staff.imageId + "/biggest\">"
            }else{
                StaffContents += "<img class=\"thumbnail\" src=\"dxia063.svg\"/>";
            }
            StaffContents += "<p>Title: " + staff.title
            StaffContents += "<p>First Name: " + staff.firstname
            if (staff.middlename != null) {
                StaffContents += "</p><p> Middle Name: " + staff.middlename
            }
            StaffContents += "</p><p>Last Name: " + staff.lastname + "</p><p>Job Title: " + staff.jobtitles + "</p>"
            StaffContents += "</p><a href=\"mailto: " + staff.emailAddresses + "\">email: " + staff.emailAddresses + "</a><br>"

            let v = await getVCard(staff.profileUrl[1]);

            StaffContents += v;
            if(v==null){
                StaffContents += "<a href=\"https://unidirectory.auckland.ac.nz/people/vcard/" + staff.profileUrl[1] + "\"> Add to contacts</a><hr>"
            }
        
            document.getElementById("StaffContent").innerHTML += StaffContents;z
        })

    });
}


async function getVCard(Url) {
    let output = "hello";
    await fetch("https://dividni.com/cors/CorsProxyService.svc/proxy?url="+encodeURI("https://unidirectory.auckland.ac.nz/people/vcard/"+ Url) )
    .then((response) => response.text())
    .then((data) => {
        let array = data.split("\n");
        let tel;
        array.forEach(element => {
            if (element.substring(0, 3) == "TEL") {
                tel = element.split(":")[1];
            }
        })
        output = "<a href=\"tel:" + tel + "\">phone: " + tel
        + "<br><a href=\"https://unidirectory.auckland.ac.nz/people/vcard/" + Url + "\"> Add to contacts</a><hr>";
    });
    return output;
}


selectTab('Home');
getStaff();
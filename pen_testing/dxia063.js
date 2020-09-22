

let user = "";
let passwd = "";

const signUp = () => {

    var newUser = new Object();
    newUser.Address = document.getElementById("email2").value;
    newUser.Name = document.getElementById("username2").value;
    newUser.Password = document.getElementById("password2").value;

    if (newUser.Password == ""|| newUser.Name == "") {
        document.getElementById("purchaseMessage").innerHTML = "Sign Up failed, please enter username and password";
        document.getElementById("purchaseStatus").style.display = "block";
        return;
    }

    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/register", {

        headers: {
            "Content-Type": "application/json",
        },

        method: "POST",
        body: JSON.stringify(newUser)

    });

    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {

        console.log(data)

        if (data.split(" ")[2]=="registered") {
            user = newUser.Name
            passwd = newUser.Password
            checkLoginStatus();
            document.getElementById("purchaseMessage").innerHTML = data;
            document.getElementById("purchaseStatus").style.display = "block";
        } else {
            document.getElementById("purchaseMessage").innerHTML = data;
            document.getElementById("purchaseStatus").style.display = "block";
        }
    });
}

const login = () => {
    let username = document.getElementById("username1").value;
    let password = document.getElementById("password1").value;
    document.getElementById("username1").value = "";
    document.getElementById("password1").value = "";

    let xhr = new XMLHttpRequest();
    let uri = "http://localhost:8189/Service.svc/id"

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == "200") {
                user = username;
                passwd = password;
                checkLoginStatus();
            } else {
                document.getElementById("purchaseMessage").innerHTML = "login failed";
                document.getElementById("purchaseStatus").style.display = "block";
            }
        }
    }
    xhr.open("GET", uri, true, username, password);
    xhr.withCredentials = true;
    xhr.send()
}

const checkLoginStatus = () => {
    if (user == "" || passwd == "") {
        document.getElementById("loginOrSignUp").style.display = "block";
        document.getElementById("loginStatus1").innerText = "";
        document.getElementById("loginStatus2").innerText = "";
        document.getElementById("logOutButton").style.display = "none";
        return false;
    }

    document.getElementById("loginOrSignUp").style.display = "none";
    document.getElementById("loginStatus1").innerText = "Logged in as " + user;
    document.getElementById("loginStatus2").innerText = "Logged in as " + user;
    document.getElementById("logOutButton").style.display = "inline";
    return true;
}

const logOut = () => {
    user = ""
    passwd = ""
    checkLoginStatus();

    document.getElementById("email2").value = "";
    document.getElementById("username2").value = "";
    document.getElementById("password2").value = "";
}



const buyItem = (itemId) => {

    if (user == "" || passwd == "") {
        selectTab("DDuser");
        return;
    }

    let xhr = new XMLHttpRequest();
    let uri = "http://localhost:8189/Service.svc/buy?id="+itemId
    xhr.open("GET", uri, true, user, passwd);
    xhr.withCredentials = true;
    xhr.onload = () => {
        document.getElementById("purchaseMessage").innerHTML = xhr.response.split("(none)").join(document.getElementById(itemId).innerText);
        document.getElementById("purchaseStatus").style.display = "block";
    }
    xhr.send(null)
}


const selectTab = (elementID) => {
    for (element of document.getElementsByClassName('tab')) {
        element.style.backgroundColor = "transparent";
    }

    for (element of document.getElementsByClassName('content')) {
        element.style.display = "none";
    }
    document.getElementById(elementID + "content").style.display = "block";
    document.getElementById(elementID).style.backgroundColor = "grey";

}


const getAddress = () => {
    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/vcard");

    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
        let array = data.split("\n");
        let tel;
        let email;
        let addr;

        array.forEach(element => {
            if (element.substring(0, 3) == "TEL") {
                tel = element.split(":")[1];
            } else if (element.substring(0, 3) == "ADR") {
                addr = element.split(":")[1];
            } else if (element.substring(0, 5) == "EMAIL") {
                email = element.split(":")[1];
            }
        })

        document.getElementById("vcard").innerHTML = "<a href=\"tel:" + tel + "\">phone: " + tel
            + "</a><p> address: " + addr.split(";").join("")
            + "</p><a href=\"mailto:" + email + "\"> email: " + email
            + "<br><br><a href=\"http://localhost:8188/DairyService.svc/vcard\"> Add to contacts</a>";

    });

}
getAddress();

const getNews = () => {
    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/news",
        {
            headers: {
                "Accept": "application/json",
            },
        }
    );


    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {
        let newsContents = "";

        data.forEach((news) => {
            newsContents += "<img class=\"productImg\" src=\"" + news.enclosureField.urlField + "\"> <p>" + news.titleField + "</p><p>" + news.descriptionField + "</p><p>" + news.pubDateField + "</p><hr>"
        })
        document.getElementById("newscontentarea").innerHTML = newsContents;
    });
}

const getProducts = (searchKey) => {
    var fetchPromise;
    if (searchKey) {
        fetchPromise = fetch("http://localhost:8188/DairyService.svc/search?term="
            + document.getElementById("DDproductsearch").value,
            {
                headers: {
                    "Accept": "application/json",
                },
            }
        );
    } else {
        fetchPromise = fetch("http://localhost:8188/DairyService.svc/items",
            {
                headers: {
                    "Accept": "application/json",
                },
            }
        );
    }

    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {
        let itemContents = "";

        data.forEach((item) => {
            itemContents += "<img class=\"productImg\"src=\"http://localhost:8188/DairyService.svc/itemimg?id=" + item.ItemId + "\"> <p id=\"" + item.ItemId + "\">" + item.Title + "</p> <p>" + item.Price + "</p><p>" + item.Origin + "</p>"
            itemContents += "<button onclick=\'buyItem(\"" + item.ItemId + "\")\'>Buy Now</button> <hr>"
        })
        document.getElementById("DDproductscontentarea").innerHTML = itemContents;
    });

}

const getComments = () => {
    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/htmlcomments");


    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
        document.getElementById("guestbook").innerHTML = data;
    });
}

const addComments = () => {

    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/comment?name=" + document.getElementById("commentname").value, {

        headers: {
            "Content-Type": "application/json",
        },

        method: "POST",
        body: JSON.stringify(document.getElementById("commenttextarea").value)

    });


    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
        getComments();
        document.getElementById("commentname").value = "";
        document.getElementById("commenttextarea").value = "";
    });
}

getProducts();
getNews();
getComments();


// function readTextFile(file)
// {
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 tama(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }

// const tama = (text) =>{
    
//     var textByLine = text.split("\r\n");
//     var username = "tama";
//     let url = "http://localhost:8189/Service.svc/user";
//     console.log(textByLine)
//     console.log(textByLine.length)
//     textByLine.forEach((password) => {
//       const xhr = new XMLHttpRequest();
//       xhr.open("GET", url, false, username, password);
//       xhr.withCredentials = true;
//       xhr.onload = () => {
//         if (xhr.status == 200) {
//           console.log(password);
//           return;
//         } else {
//         }
//       };
//       xhr.send(null);
//     });

// }

// readTextFile('test.txt');

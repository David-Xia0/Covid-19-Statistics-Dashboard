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
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard");

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
            + "<br><br><a href=\"http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard\"> Add to contacts</a>";

    });

}
getAddress();

const getNews = () => {
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news",
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
        fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term="
            + document.getElementById("DDproductsearch").value,
            {
                headers: {
                    "Accept": "application/json",
                },
            }
        );
    } else {
        fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items",
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
            itemContents += "<img class=\"productImg\"src=\"http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=" + item.ItemId + "\"> <p>" + item.Title + "</p> <p>" + item.Price + "</p><p>" + item.Origin + "</p><hr>"
        })
        document.getElementById("DDproductscontentarea").innerHTML = itemContents;
    });

}

const getComments = () => {
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments");


    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
        document.getElementById("guestbook").innerHTML = data;
    });
}

const addComments = () => {
    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=" + document.getElementById("commentname").value, {

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
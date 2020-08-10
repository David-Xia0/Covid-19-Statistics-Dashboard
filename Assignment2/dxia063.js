const getGraph = () => {


    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/g",
    
    {
        headers: {
            "Accept": "application/json",
        },
    }

    );

    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {

        
        

        let array = data.split("\n").join("<br>");

        document.getElementById("sourceMatrix").innerText = data;
    });

}
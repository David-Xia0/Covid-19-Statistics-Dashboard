const getGraph = () => {


    const fetchPromise = fetch("http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/g",

        {
            headers: {
                "Accept": "application/json",
            },
        }

    );

    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {


        console.log(JSON.stringify(data));

        let text = "<pre>[\n";

        data.forEach( function(element1, index1, array1) {
            text+="    [\n"

            element1.forEach( function(element2, index2, array2) {

                text+="        "+ element2;

                if(index2 === array2.length - 1){
                    text+="\n";
                }else{
                    text+=",\n";
                }

            })

            if(index1 === array1.length -1){
                text+="    ]\n";
            }else{
                text+="    ],\n";
            }
            
              
        })
        text+="]</pre>";
        document.getElementById("sourceMatrix").innerHTML = text;
    });

}
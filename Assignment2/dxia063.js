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
        let text = "<pre>[\n";
        constructGraph(data);
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

const testGraph = () => {

    let graph = new Array();

    graph[0] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[1] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[2] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[3] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[4] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    graph[5] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[6] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[7] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[8] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[9] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[10] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[11] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[12] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    graph[13] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    let graph2 = new Array();

    graph[0] = [0,0,0]
    graph[1] = [0,0,0]
    graph[2] = [0,0,0]

    let graph3 = new Array();

    graph3[0] = [0]

    
    constructGraph(graph3);
}

const constructGraph = (graph) => {
    let num = graph.length;
    let ang = Math.PI*2/num;
    let cumAng = 0;
    let radius = num*14;
    let containerSize = radius*2 + 50;
    let coords = new Array();
    let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 "+ containerSize +" "+ containerSize +"\">\n";
    for(i = 0 ; i < num ; i ++){
        let y = Math.sin(Math.PI/2 - cumAng) * radius
        let x = Math.cos(Math.PI/2 - cumAng) * radius
        if(x > radius){
            x=0;
        }
        if(y > radius){
            y=0;
        }
        cumAng+=ang;
        x+=containerSize/2;
        y+=containerSize/2;
        coords[i] = {y,x};
    }
    graph.forEach(function(row, rowIndex, g) {
        row.forEach( function(element, index, array){
            if(element==1){
                svg+="<line x1=\""+coords[rowIndex].x+"\" y1=\""+coords[rowIndex].y+"\" x2=\""+coords[index].x+"\" y2=\""+coords[index].y+"\" stroke=\"black\"/>";
            }
            
        })
    })
    let count = 0;
    coords.forEach(element => {
        svg+="<circle cx=\""+ element.x + "\" cy=\""+ element.y + "\" r=\"20\" fill=\"white\" stroke=\"black\"/>\n";
        svg+="<text x=\""+ (element.x-5) + "\" y=\""+ (element.y+5) + "\">"+count+"</text>";
        count++;
    });
    svg+="</svg>";
    console.log(svg);
    document.getElementById("graph").innerHTML = svg;
}
getGraph();
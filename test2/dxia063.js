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


const getCourses = () => {
    const fetchPromise1 = fetch("https://api.test.auckland.ac.nz/service/courses/v2/courses?subject=MATHS&year=2020&size=500",
        {
            headers: {
                "Accept": "application/json",
            },
        }
    );

    const streamPromise1 = fetchPromise1.then((response) => response.json());
    streamPromise1.then((data) => {

        data.data.forEach(async (course) => {
            let CourseContents = "";


            CourseContents += "<p>" + course.subject + "   " + course.catalogNbr + "</p>"
            CourseContents += "<p>" + course.title + "</p>"
            if (course.description == null) {
                CourseContents += "<p>No Description Avaliable</p>"
            } else {
                CourseContents += "<p>" + course.description + "</p>"
            }

            CourseContents += "<p>Points Offered: " + course.unitsAcadProg + "</p>"
            if (course.rqrmntDescr != null) {
                CourseContents += "<p>" + course.rqrmntDescr + "</p>"
            }

            CourseContents += '<button id="button' + course.catalogNbr + "\" onclick=\'getMoreInfo(\"" + course.catalogNbr + "\")\'> More Info </button>"
            CourseContents += '<div id="moreInfo' + course.catalogNbr + '"class="content"> </div><hr>'
            document.getElementById("CoursesContent").innerHTML += CourseContents;
        })

    });
}


async function getMoreInfo(Id) {

    if (document.getElementById("button" + Id).innerText == "Less Info") {
        document.getElementById("moreInfo" + Id).style.display = "none";
        document.getElementById("button" + Id).innerText = "More Info";
        return;
    }


    document.getElementById("button" + Id).innerText = "Less Info";
    await fetch("https://api.test.auckland.ac.nz/service/classes/v1/classes?year=2020&subject=MATHS&size=500&catalogNbr=" + Id)
        .then((response) => response.json())
        .then((res) => {
            let timetable = "<hr>";
            res.data.forEach((data) => {


console.log(data)
                timetable += "<pre>Class Number:" + data.classNbr + "    Class Section: " + data.classSection + "    Component: " + data.component +"    Campus: " + data.campus +"</pre>";
                let count = 0;
                data.meetingPatterns.forEach((meetings) => {
                    if (meetings.daysOfWeek != null && meetings.location != null && meetings.startTime != null) {
                        timetable += "<p>" + meetings.daysOfWeek + "  " + meetings.startTime + "  to  " + meetings.endTime + "  at  " + meetings.location + "</p>";
                        count++;
                    }
                })

                if (count == 0) {
                    timetable += "No schedule avaliable"
                }
                timetable += "<hr>"
            })
            if (timetable == "<hr>") {
                timetable += "No Info Avaliable"
            }
            document.getElementById("moreInfo" + Id).innerHTML = timetable;
            document.getElementById("moreInfo" + Id).style.display = "block";
        })
}

const logo =
    '<path stroke-linecap="round" d="M 55.8 283.25 A 166.6 166.6 0 1 1 344.19 283.25" stroke-width="40" stroke="black" fill="none"/>\n'
    + '<circle  cx="58.5" cy="58.5"  r="20" fill="black"/>\n'
    + '<circle  cx="341.5" cy="58.5"  r="20" fill="black"/>\n'
    + '<rect x="180" y="0" width="40" height="30" fill="black" transform="rotate(45,200,200)"/>\n'
    + '<rect x="180" y="0" width="40" height="30" fill="black" transform="rotate(315,200,200)"/>\n'
    + '<rect x="180" y="50" width="40" height="50" fill="black"/>'
    + '<circle cx="200" cy="200"  r="121" fill="black" mask="url(#whiteCircle)"/>\n'
    + '<mask id="whiteCircle">'
    + '<circle  cx="200" cy="200"  r="120.5" fill="white" stroke="black"/>\n'
    + '<circle  cx="200" cy="200"  r="79.5" fill="black" stroke="black"/>\n'
    + '</mask>'
    + '<circle  cx="200" cy="200"  r="19.5" fill="black" stroke="black"/>\n'
    + '<circle  cx="205" cy="195"  r="9" fill="white" stroke="black"/>\n';


const getInfo = () => {
    const fetchPromise1 = fetch("https://cws.auckland.ac.nz/qz20/Quiz2020ChartService.svc/g");
    const streamPromise1 = fetchPromise1.then((response) => response.json());

    streamPromise1.then((data) => {
        let containerSize = 200;
        let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 " + containerSize + " " + containerSize / 2 + "\">\n";
        let dayCount = 1;
        let x = 20;
        let y = 0;

        svg += "<symbol id=\"myLogo\" width=\"10\" height=\"10\" viewBox=\"0 0 400 334\">\n"
        svg += logo
        svg += '</symbol>\n'

        data.forEach((day) => {

            svg += '<text x="0" y="' + (y + 10) + '">' + dayCount + '</text>'

            let num = 0;
            for (let i = 0; i < day; i++) {
                num++;
                if (num == 10) {
                    svg += '<use xlink:href=\"#myLogo\" x=\"' + x + '\"  y=\"' + y + '\"/>\n'
                    x += 10;
                    num = 0
                }
            }

            if (num != 0) {
                svg += '<clipPath id="cutout' + dayCount + '">'
                    + '<rect x="' + x + '" y="' + y + '" width="' + num + '" height="10" fill="white" stroke="black"/>'
                    + '</clipPath>';

                svg += '<g clip-path="url(#cutout' + dayCount + ')">\n'
                svg += '<use xlink:href=\"#myLogo\" x=\"' + x + '\"  y=\"' + y + '\"/>\n'
                svg += '</g>\n'
            }
            y += 15;
            x = 20;
            dayCount++;
        })
        svg += "</svg>"
        svg += '<hr><p>DATA: </p><p>' + data + '</p>';

        document.getElementById("InfoContent").innerHTML += svg;
    });
}


selectTab('Courses');
getCourses();
getInfo();
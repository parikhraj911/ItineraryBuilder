

var root= "http://comp426.cs.unc.edu:3001/";
var instances=[];


//assuming a global array of selected flight instances and a button with id=submitButton
$(document).on('click', '#submitButton',()=>{
    $("body").empty();
    $("body").append('<h1>Flight Done</h1>');
    $("body").append("<div id='flightDataDiv></div>'");
    for(i=0;i<flights.length;i++){
        let newDiv="<div class='flightDataSub'></div>";
        let flight=-1;
        let arrivalAirport=-1;
        let departureAirport=-1;
        let airline=-1;
        let flightID=instances[i].flight_id;

        $.ajax(root+'/flights?filter[id]='+flightID,{
            type: "GET",
            xhrFields: {withCredentials: true},
            success: (response)=>{
                flight=response.data;
            }
        });

        $.ajax(root+'/airports?filter[id]='+flight.departure_id,{
            type: "GET",
            xhrFields: {withCredentials: true},
            success: (response)=>{
                departureAirport=response.data;
            }
        });

        $.ajax(root+'/airports?filter[id]='+flight.arrival_id,{
            type: "GET",
            xhrFields: {withCredentials: true},
            success: (response)=>{
                arrivalAirport=response.data;
            }
        });

        $.ajax(root+'/airlines?filter[id]='+flight.airline_id,{
            type: "GET",
            xhrFields: {withCredentials: true},
            success: (response)=>{
                airline=response.data;
            }
        });

        $(newDiv).append("<p> Departing from "+departureAirport.name+" at "+flight.departs_at+" on flight "+flight.number+"</p>");
        $(newDiv).append("<p> Arriving at "+arrivalAirport.name+" at "+flight.arrives_at+".</p>");
        $(newDiv).append("<p>Your airline for this flight is "+airline.name+"</p>");
        $("#flightDataDiv").append(newDiv);
        $("#flightDataDiv").append("<br>");
    }

});







//this might not be necessary
let convertCodeToID=function(code){
    output="";
    for(i=0;i<3;i++){
        output=output+code.charCodeAt(i);
    }
    return output;
}

//should get airports based on their city and return the time, in hours, it takes to travel between them
//assumes average speed of 835 km/h
let calculateAirTime=function(start,stop){
    let a;
    let b;
    $.ajax(root+"airports?filter[city]="+start,{
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response)=>{
            a=response.data;
        }
    });
    $.ajax(root+"airports?filter[city]="+stop,{
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response)=>{
            b=response.data;
        }
    });
    let distance = calculateDistance(a,b);
    let time=distance/835;
    return time;
}

//shortest distance between two points on a sphere.
//assumes you can stick in an airport resource and do airport.longitude to get the value
//from https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
let calculateDistance=function(location1,location2){
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(location2.latitude-location1.latitude);  // deg2rad below
    let dLon = deg2rad(location2.longitude-location1.longitude); 
    let a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}
function deg2rad(deg) {
    return deg * (Math.PI/180)
}
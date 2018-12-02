var root= "http://comp426.cs.unc.edu:3001/";

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
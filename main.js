$(document).ready(() => {
    var root= "http://comp426.cs.unc.edu:3001/";
    var instances=[];
    
    //makes sure the minimum data available is today
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
     if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
    
    today = yyyy+'-'+mm+'-'+dd;
    document.getElementById("date").setAttribute("min", today);


//assuming a global array of selected flight instances and a button with id=submitButton
$(document).on('click', '#submit',()=>{
    console.log('yo this shit clicking');
    $("body").empty();
    $("body").append('<h1>Flight Done</h1>');
    $("body").append("<div id='flightDataDiv'></div>");
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
    }
});



});
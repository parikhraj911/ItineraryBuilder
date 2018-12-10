$(document).ready(() => {
    
    
    
    var root= "http://comp426.cs.unc.edu:3001/";
    var instances=[];
    
    $.ajax(root+"/sessions",{
       type: "POST";
       xhrFields: {withCredentials: true},
       "user": {
        "username": "nick7",
        "password": "airplane"
          }
    });
    
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

$(document).on('click','#find',()=>{
    let _date=$('#date').val();
    let _departureAirport=$('#out').val();
    let _outID=-1;
    let _inID=-1;
    let _arrivalAirport=$('#in').val();
    let putativeFlights=[];
    let departureFilter=-1;
    let putativeInstances=[];
    let output=[];

    $.ajax(root+'/airports?filter[code]='+_departureAirport,{
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response)=>{
            _outID=response.data.id;
        }
    });
    $.ajax(root+'/airports?filter[code]='+_arrivalAirport,{
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response)=>{
            _inID=response.data.id;
        }
    });
     
    $.ajax(root+'/flights?filter[departure_id]='+_outID,{
        type: "GET",
        xhrFields: {withCredentials: true},
        success: (response)=>{
            departureFilter=response.data;
        }
    });

    for(i=0;i<departureFilter.length;i++){
        let putativeFlight=departureFilter.pop();
        if(putativeFlight.arrival_id==_inID){
            putativeFlights.push(putativeFlight);
        }
    }
    if(putativeFlights.length==0){
        alert("Did not find any flights between these two airports");
        return 0;
    }

    for(i=0;i<putativeFlights.length;i++){
        let currentID=putativeFlights[i].id;
        $.ajax(root+'/instances?filter[flight_id]='+currentID,{
            type: "GET",
            xhrFields: {withCredentials: true},
            success: (response)=>{
                putativeInstances.concat(response.data);
            }
        });
    }

    if(putativeInstances.length==0){
        alert("Did not find any planned flights between these two airports");
        return 0;
    }

    for(i=0;i<putativeInstances.length;i++){
        let currentInstance=putativeInstances.pop();
        if(currentInstance.date==_date){
            output.push(currentInstance);
        }
    }

    if(output.length==0){
        alert("no flights on the exact date. oops. gonna work on this later...");
        return 0;
    }

    for(i=0;i<output.length;i++){
        $("#options").append("<div id="+output[i].flight_id+">Flight: "+output[i].flight_id+"</div>");
    }

});
    
    
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

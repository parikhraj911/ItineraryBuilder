
$(document).ready(() => {
    var root= "http://comp426.cs.unc.edu:3001/";
    var instances=[];
    
    $.ajax(root+"sessions",{
        type: "POST",
        xhrFields: {withCredentials: true},
        data: {"user": {
         "username": "nick7",
         "password": "airplane"
           }}
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


//assuming a global array of selected flight instances and a button with id=submitButton
$(document).on('click', '#submit',()=>{
    $("body").empty();
    $("body").append("<div id='head2'></div>");
    $("#head2").append('<h1>Your Flight Information</h1>');
    $("body").append("<div id='flightDataDiv'></div>");
    for(i=0;i<instances.length;i++){
        console.log(instances[i]);
       // let newDiv="<div class='flightDataSub'></div>";
        let _instance;
        let flight;
        let arrivalAirport;
        let departureAirport;
        let airline=-1;
        $.ajax(root+"instances/"+instances[i],{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{_instance=response;}
        });

        $.ajax(root+'flights?filter[id]='+_instance.flight_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                flight=response;
            }
        });

        $.ajax(root+'airports?filter[id]='+flight.departure_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                departureAirport=response.name;
            }
        });

        $.ajax(root+'airports?filter[id]='+flight.arrival_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                arrivalAirport=response.name;
            }
        });

        let newDiv="<div id='"+instances[i]+"_info' class='tripDiv'> Flight number "+flight.number+" departs "+departureAirport+" at "+flight.departs_at+" and will arrive at "+arrivalAirport+" at "+flight.arrives_at+".</div>";
        $("#flightDataDiv").append(newDiv);

        }
});


$(document).on("click", "button.option",function(){
    console.log(this.id);
    instances.push(this.id);
    $(this).text("Added!");
    $(this).prop("disabled",true);
});


$(document).on('click','#find',()=>{
    $("#airline").prop("disabled",false);
	let _date=$('#date').val();
	let _departureAirport=$('#out').val();
	let _outID=-1;
	let _inID=-1;
	let _arrivalAirport=$('#in').val();
	let putativeFlights=[];
	let departureFilter=-1;
	let putativeInstances=[];
	let output=[];
	
	$.ajax(root+'airports?filter[code]='+_departureAirport+'',{
    type: "GET",
    async:false,
	xhrFields: {withCredentials: true},
	success: (response)=>{
    _outID=response[0].id;
    console.log(_outID);
        j=0;

        $.ajax(root+'airports?filter[code]='+_arrivalAirport+'',{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
            _inID=response[0].id;
           // console.log(_inID);
            }
            });
    
        $.ajax(root+'flights?filter[departure_id]='+_outID+'',{
        type: "GET",
        async:false,
        xhrFields: {withCredentials: true},
        success: (response)=>{
        for(i=0;i<response.length;i++){
            console.log(response[i].arrival_id);
            if (response[i].arrival_id===_inID){
                console.log("hit");
                putativeFlights[j]=response[i];
                j++;
            }
        }
        }
        });
	}
    });

	
	for(i=0;i<putativeFlights.length;i++){
        console.log(putativeFlights[i].id);
	    let currentID=putativeFlights[i].id;
	    $.ajax(root+'instances?filter[flight_id]='+putativeFlights[i].id+"",{
        type: "GET",
        async:false,
	    xhrFields: {withCredentials: true},
	    success: (response)=>{
            console.log(response);
            $.merge(putativeInstances, response);
	}
	});
    }
    console.log("putative instances length= "+putativeInstances.length);

	
	for(i=0;i<putativeInstances.length;i++){
        let currentInstance=putativeInstances[i];
        console.log("compare "+currentInstance.date+" with "+ _date);
	    if(currentInstance.date==_date){
	    output.push(currentInstance);
	}
	}
	$("#interactive").empty();
	if(output.length==0){
	alert("no flights on the exact date. oops. gonna work on this later...");
	return 0;
	}
    let flight;
	for(i=0;i<output.length;i++){
       
        let arrive;
        let depart;
        let time;
        $.ajax(root+"flights/"+output[i].flight_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
            flight=response;
            }
        });
let s;
        $.ajax(root+'airlines?filter[id]='+flight.airline_id,{
            type: 'GET',
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                console.log(response[0].name);
                s=response[0].name;
            }
            });

    var newDiv=("<button class='option' id='"+output[i].id+"'>Flight number "+flight.number+": "+_departureAirport+" to "+_arrivalAirport+"</div>");
    $(newDiv).attr("instanceNo",output[i].id);
	
	
    $(newDiv).attr("airline",s);

	$("#interactive").append(newDiv);
	}
	
	});
	
	$("#airline").keyup(function(){
	let filterVal=$(this).val();
	let airlineNames=[]
	for(i=0;i<instances.length;i++){
	let c= $("body").find($("#"+instances[i]));
	if(!c.attr("airline").toLowerCase().includes(filterVal.toLowerCase())){
	$("body").find($("#"+instances[i].flight_id)).hide();
	}else{
	$("body").find($("#"+instances[i].flight_id)).show();
	}
	}
	
    });
    

});
$(document).ready(() => {
    var root= "http://comp426.cs.unc.edu:3001/";
    var instances=[];
    var instancesToSend=[];
    var keeper;

    $.ajax(root+"sessions",{
        type: "POST",
        xhrFields: {withCredentials: true},
        data: {"user": {
         "username": "nick7",
         "password": "airplane"
           }}
     });
    //actual function to create google maps

     //create google maps thing in #visual
	//initAutocomplete();
    function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 35.8801, lng: -78.7880},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
      
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      
        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });
      
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
      
          if (places.length == 0) {
            return;
          }
      
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];
      
          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };
      
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));
      
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }

    
 
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
    
    $(document).on('click', 'button.returnHome',()=>{
    $("body").empty();
    $("body").append(keep);
    });

    $(document).on('click', '#rent',()=>{
        keep=$("#bigBox").detach();

        $("body").append("<div id='head3'></div>");
        $("#head3").append('<h1>Build Your Own Flight Below</h1>');
        $("body").append("<button type='button' class='returnHome'>Go Back</button><br>");
        $("body").append("<div id='airlineBuilderDiv'></div>");
        $("body").append("<div id='flightBuilderDiv></div>");
        $("#airlineBuilderDiv").append('<input class="checkable" type = "text" id = "airlineName" placeholder = "Name your airline" ><p></p>');
        $("#airlineBuilderDiv").append('<input class="checkable" type = "text" id = "departureAirport_b" placeholder = "Departure Airport Code" ><p></p>');
        $("#airlineBuilderDiv").append('<input class="checkable" type = "time" id = "departureTime_b" value="00:00" ><p></p>');
        $("#airlineBuilderDiv").append('<input class="checkable" type = "text" id = "arrivalAirport_b" placeholder = "Arrival Airport Code" ><p></p>');
        $("#airlineBuilderDiv").append('<input class="checkable" type = "time" id = "arrivalTime_b" value="00:00" ><p></p>');
        $("#airlineBuilderDiv").append('<input class="checkable" type = "text" id = "number_b" placeholder = "flightNumber" ><p></p>');
        $("#airlineBuilderDiv").append("<input class='checkable' type = 'date' id = 'date_b'  min='2018-10-12' placeholder = 'Date' > <span class='validity'></span> <p></p>");
        
        

        $("body").append("<button type='button' class='commit'>Create Flight</button><br>");


    });

    $(document).on('click','button.commit',()=>{
        if($("input.checkable").val().length==0){
            alert("You must fill out all entry forms");
            return 0;
        }
        $.ajax(root+"airlines",{
            type:"POST",
            async:false,
            xhrFields: {withCredentials: true},
            data: {"airline": {
                "name":   $("#airlineName").val()
              }}
        });

        let airportA;
        let airportB;
        let flightObj;
        let airlineObj;

        $.ajax(root+"airlines?filter[name]="+$("#airlineName").val(),{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                airlineObj=response[0];
            }
        })

        $.ajax(root+"airports?filter[code]="+$("#arrivalAirport_b").val(),{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                airportB=response[0];
            }
        });

        $.ajax(root+"airports?filter[code]="+$("#departureAirport_b").val(),{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                airportA=response[0];
            }
        });

        $.ajax(root+"flights",{
            type: "POST",
            async:false,
            xhrFields: {withCredentials: true},
            data:{"flight": {
                "departs_at":   $("#departureTime_b").val(),
                "arrives_at":   $("#arrivalTime_b").val(),
                "number":       $("#airlineName").val()+"3141"+$("#number_b").val(),
                "departure_id": airportA.id,
                "arrival_id":   airportB.id,
                "airline_id": airlineObj.id
              }
            }
        });

        $.ajax(root+"flights?filter[number]="+$("#airlineName").val()+"3141"+$("#number_b").val(),{
            type:"GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                flightObj=response[0];
            }
        });

        $.ajax(root+"instances",{
            type:"POST",
            async:false,
            xhrFields: {withCredentials: true},
            data:{"instance": {
                "flight_id": flightObj.id,
                "date":      $("#date_b").val()
              }
            }
        });
        alert("Your flight has been added. Price is $8500 per hour of flight time.");

    });


 //assuming a global array of selected flight instances and a button with id=submitButton

 //airline info, names, age, 3 buttons to send ajax to change names and age on the ticket.
$(document).on('click', '#submit',()=>{
    if($("#first").val().length==0){
        alert("Please enter your first name");
        return 0;
    }
    if($("#last").val().length==0){
        alert("Please enter your last name");
        return 0;
    }
    if($("#age").val().length==0){
        alert("Please enter your age");
        return 0;
    }
    if($("#gender").val().length==0){
        alert("Please enter your gender");
        return 0;
    }
    for(i=0;i<instancesToSend.length;i++){
        console.log("generating ticket: "+i)
    $.ajax(root+"tickets",{
        type: "POST",
        async:false,
        xhrFields: {withCredentials: true},
        data: {"ticket": {
            "first_name":   $("#first").val(),
            "last_name":    $("#last").val(),
            "age":          Number.parseInt($("#age").val()),
            "gender":       $("#gender").val(),
            "is_purchased": false,
            "instance_id":  Number.parseInt(instancesToSend[i])
          }}

    });
    }

    keep=$("#bigBox").detach();

    $("body").append("<div id='head2'></div>");
    $("#head2").append('<h1>Your Flight Information</h1>');
    $("body").append("<button type='button' class='returnHome'>Go Back</button>");
    //$("body").append("<button type='button' id=''>Go Back</button>");

    $("body").append("<div id='flightDataDiv'></div>");
    $("body").append("<div id='ticketBox'></div>");

    for(i=0;i<instancesToSend.length;i++){
       // console.log("instancesToSend[i].id="+instancesToSend[i]);
        let _id=instancesToSend[i];
       // console.log("_id: "+_id);
       let no=i+1;
        let newTicket=("<div data-number='"+i+"' id='ticket-"+_id+"' class='ticket'><p class='ticketNumber'>Ticket #"+no+"</p></div>");
        //console.log(instances[i]);
       // let newDiv="<div class='flightDataSub'></div>";
       let ticket; 
       let instance;
        let flight;
        let arrivalAirport;
        let departureAirport;
        let airline;

        loadTicket=function(){
        //get ticket based on instanceID
        $.ajax(root+"tickets?filter[instance_id]="+_id,{
            type:"GET",
            async: false,
            xhrFields: {withCredentials: true},
            success: (response)=>{ticket=response[0];}
        });
        
        //get instance by instanceID
        $.ajax(root+"instances/"+_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{instance=response;}
        });
       // console.log("instance: "+instance);
       // console.log("instance.flight_id: "+instance.flight_id);
        
        //get flight from instance.flight_id
       // console.log("flight id: "+instance.flight_id);
        $.ajax(root+'flights/'+instance.flight_id+"",{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                flight=response;
            }
        });

        //get airport of departure from flight.departure_id
      //  console.log("departure id: "+flight.departure_id);
        $.ajax(root+'airports/'+flight.departure_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                console.log(response);
                departureAirport=response;
            }
        });

        //get airport of arrival from flight.arrival_id
        $.ajax(root+'airports/'+flight.arrival_id+"",{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success:(response)=>{
                console.log(response);
                arrivalAirport=response;
                console.log(arrivalAirport.name);
                
            }
        });

        //get airline from flight.airline_id
        $.ajax(root+'airlines/'+flight.airline_id,{
            type: "GET",
            async:false,
            xhrFields: {withCredentials: true},
            success: (response)=>{
                airline=response;
            }
        });
        }
        
        loadTicket();
        $("#ticketBox").append(newTicket);
        $("#ticket-"+_id).append("<p class='ticketDeparture'>Departure: "+departureAirport.name+", "+departureAirport.code+"</p>");
        $("#ticket-"+_id).append("<p class='ticketArrival'>Arrival: "+arrivalAirport.name+", "+arrivalAirport.code+"</p>");
        $("#ticket-"+_id).append("<p class='ticketAirline'>Airline: "+airline.name+"</p>");
        $("#ticket-"+_id).append("<p class='ticketOwner'>Ticket Holder</p>");
        $("#ticket-"+_id).append("<p class='ticketOwner Name First'>"+ticket.first_name+"</p>");
        $("#ticket-"+_id).append("<p class='ticketOwner Name Last'>"+ticket.last_name+"</p>");
        $("#ticket-"+_id).append("<p class='ticketOwner Age'>Age "+ticket.age+"</p>");
        $("#ticket-"+_id).append("<p class='ticketOwner Gender'>"+ticket.gender+"</p>");
        
        $("#ticketBox").append("<br>");

        }
});

 $(document).on("click", "li.option",function(){
    console.log(this.id);
    instancesToSend.push(this.id);
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
        console.log(typeof currentInstance.date +" and "+typeof _date);
	    if(currentInstance.date==_date){
	    output.push(currentInstance);
	}
	}
    $("#interactive").empty();
    $("#interactive").append("<ul id='listOfFlightInstances'></ul>");
    instances.length=0;
    let expand;
	if(output.length==0){
        function getConfirmation(){
            var retVal = confirm("We couldn't find any flights on that date. Would you like to try another day?");
            if( retVal == true ){
               return true;
            }
            else{
               return false;
            }
         }
         let confirmed=getConfirmation();
         if(confirmed){
            function getValue(){
                var retVal = prompt("Expand search by how many days?", "Enter whole numbers only");
                retVal=Number.parseInt(retVal);
                if(!Number.isInteger(retVal)){
                    getValue();
                }else{return retVal;}
             }
            //expand=getValue();
            return 0;
         }else{
             return 0;
         }
         let possibleDates=[];
         console.log(expand);
    for(i=0;i<putativeInstances.length;i++){
        let currentInstance=putativeInstances[i];
        var partsA =currentInstance.date.split('-');
        // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
        // January - 0, February - 1, etc.
        let flightDate = new Date(partsA[0], partsA[1] - 1, partsA[2]);

        var partsB =_date.split('-');
        // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
        // January - 0, February - 1, etc.
        let targetDate = new Date(partsB[0], partsB[1] - 1, partsB[2]);

        //console.log("flight: "+flightDate+". Target: "+ targetDate);
        //console.log(typeof flightDate +" and "+typeof targetDate);
     
       possibleDates.push(targetDate);

       //
       for(j=1;j<=expand;j++){
           let dayPlus=targetDate;
           dayPlus.setDate(dayPlus.getDate()+j);
           possibleDates.push(dayPlus);
           let dayMinus=targetDate;
           dayMinus.setDate(dayMinus.getDate()-j);
           possibleDates.push(dayMinus);
       }
       for(j=0;j<possibleDates.length;j++){
           console.log("comparing");
           if(flightDate==possibleDates[j]){
               console.log("pushed");
            output.push(currentInstance);
           }
       }
	}

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
    instances.push(output[i]);
     var newItem=("<li class='option' data-airline='"+s+"' data-instance='"+output[i]+"' id='"+output[i].id+"'>Flight number "+flight.number+": "+_departureAirport+" to "+_arrivalAirport+"</div>");
    $(newItem).attr("instanceNo",output[i].id);
    $(newItem).attr("airline",s);
 	$("#listOfFlightInstances").append(newItem);
	}
	
	});
	
	$("#airlines").keyup(function(){
        console.log($(this).val());
	let filterVal=$(this).val();
	let airlineNames=[];
	for(i=0;i<instances.length;i++){
    let c= $("body").find($("#"+instances[i].id));
    console.log("comparing: "+$(c).attr("data-airline")+" and "+filterVal);
	if(!$(c).attr("data-airline").toLowerCase().includes(filterVal.toLowerCase())){
	$("body").find($("#"+instances[i].id)).hide("slow");
	}else{
	$("body").find($("#"+instances[i].id)).show("slow");
	}
	}
	
    });
    
 }); 

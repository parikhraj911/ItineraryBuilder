$(document).ready(() => {
    var root= "http://comp426.cs.unc.edu:3001/";
    var instances=[];
    //create google maps thing in #visual
	initAutocomplete();

    $.ajax(root+"/sessions",{
        type: "POST",
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



//assuming a global array of selected flight instances and a button with id=submitButton
$(document).on('click', '#submit',()=>{
    $("body").empty();
    $("body").append("<div id='head2'></div>");
    $("#head2").append('<h1>Your Flight Information</h1>');
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
                flight=response;
            }
});
    }
});

$(document).on('click','#find',()=>{
	let arrive = document.getElementById('in').value;
	
	let _date=$('#date').val();
	let _departureAirport=$('#out').val();
	let _outID=-1;
	let _inID=-1;
	let _arrivalAirport=$('#in').val();
	let putativeFlights=[];
	let departureFilter=-1;
	let putativeInstances=[];
	let output=[];
	
	$.ajax(root+'/airports?filter[code]='+_departureAirport+'',{
	type: "GET",
	xhrFields: {withCredentials: true},
	success: (response)=>{
    _outID=response[0].id;
    console.log(_outID);
	}
	});
	$.ajax(root+'/airports?filter[code]='+_arrivalAirport+'',{
	type: "GET",
	xhrFields: {withCredentials: true},
	success: (response)=>{
    _inID=response[0].id;
    console.log(_inID);
	}
	});
	
	$.ajax(root+'/flights?filter[departure_id]='+_outID+'',{
	type: "GET",
	xhrFields: {withCredentials: true},
	success: (response)=>{
    departureFilter=response;
	}
	});
	
	for(i=0;i<departureFilter.length;i++){
	let putativeFlight=departureFilter[i];
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
	putativeInstances.concat(response);
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
	let newDiv=("<div id="+output[i].flight_id+">Flight: "+output[i].flight_id+"</div>");
	for(i=0;i<output.length;i++){
	$.ajax(root+'/flights?filter[id]='+output[i].flight_id,{
	type: 'GET',
	xhrFields: {withCredentials: true},
	success: (response)=>{
	$.ajax(root+'/airlines?filter[id]='+response.airline_id,{
	type: 'GET',
	xhrFields: {withCredentials: true},
	success: (response)=>{
	$(newDiv).attr("airline",response.name);
	}
	});
	}
	});
	}
	}
	
	}); //end of find click function

	//actual function to create google maps
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
	
	$("#airline").keyup(function(){
	let filterVal=$(this).val();
	let airlineNames=[]
	for(i=0;i<instances.length;i++){
	let cDiv= $("body").find($("#"+instances[i].flight_id));
	if(!cDiv.attr("airline").toLowerCase().includes(filterVal.toLowerCase())){
	$("body").find($("#"+instances[i].flight_id)).hide();
	}else{
	$("body").find($("#"+instances[i].flight_id)).show();
	}
	}
	
	});


});

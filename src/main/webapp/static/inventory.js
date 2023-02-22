
function getInventoryUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/inventory";
}


//BUTTON ACTIONS
function addInventory(event){
	//Set the values to update
	var $form = $("#inventory-form");
	var json = "["+toJson($form)+"]";
	var url = getInventoryUrl();

	$.ajax({
	   url: url, 
	   type: 'POST', 
	   data: json, 
	   headers: {
       	'Content-Type': 'application/json'
       }, 
	   success: function(response) {
	        $("#inventory-form-modal").hide();
	   		console.log("Inventory created");
	   		getInventoryList(false);
	   }, 
	   error: function(error){
	        console.log(error);
	        alert(error.responseJSON.message);
	   }
	});

	return false;
}

function updateInventory(event){
	$('#edit-inventory-modal').modal('toggle');
	//Get the ID
	var id = $("#inventory-edit-form input[name=id]").val();	
	var url = getInventoryUrl();

	//Set the values to update
	var $form = $("#inventory-edit-form");
	var json = toJson($form);

	$.ajax({
	   url: url, 
	   type: 'PUT', 
	   data: json, 
	   headers: {
       	'Content-Type': 'application/json'
       }, 	   
	   success: function(response) {
	   		console.log("Inventory update");	
	   		getInventoryList(false);     //...
	   }, 
	   error: function(){
	   	        alert(error.responseJSON.message);

	   }
	});

	return false;
}

function getInventoryList(searchByBarcode){
    barcode = "";
    if(searchByBarcode){

        barcode = $("#input-barcode").val();
    }
    console.log("barcode"+barcode)
	var url = getInventoryUrl()+"/search/"+barcode;
	$.ajax({
	   url: url, 
	   type: 'GET', 
	   success: function(data) {
	   		console.log("Inventory data fetched");
	   		console.log(data);	
	   		displayInventoryList(data);     //...
	   }, 
	   error: function(){

	   }
	});
}

// FILE UPLOAD METHODS
var fileData = [];
var errorData = "";
var processCount = 0;


function processData(){
	var file = $('#inventoryFile')[0].files[0];
	readFileData(file, readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	var json = JSON.stringify(fileData);
	var url = getInventoryUrl();

	//Make ajax call
	$.ajax({
	   url: url, 
	   type: 'POST', 
	   data: json, 
	   headers: {
       	'Content-Type': 'application/json'
       }, 	   
	   success: function(response) {
	        $('#upload-inventory-modal').modal('toggle');
	   		makeToast(true, "", null);
            getInventoryList(false);

	   }, 
	   error: function(error){
	        var message =  error.responseJSON.message;
	        errorData = message;
	        var pos = message.indexOf(",");
            message = message.slice(0, pos);
            message += "...."
	   		makeToast(false, message, downloadErrors);
	   }
	});
}

function downloadErrors(){
	writeFileData(errorData);
}
//UI DISPLAY METHODS

function displayInventoryList(data){
	console.log('Printing inventory data');
	var $tbody = $('#inventory-table').find('tbody');
	$tbody.empty();
	for(var i in data){
		var e = data[i];
	    console.log(e)
        var buttonHtml = '';
        if(userRole === 'supervisor'){
            var buttonHtml ='<td><button class="btn"  onclick="displayEditInventory(' + e.productId + ')"><i class="fa fa-edit"></i> edit</button></td>'
        }
		var row = '<tr>'
		+ '<td>' + e.productName + '</td>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>'  + e.quantity + '</td>'
        + buttonHtml +
		+ '</tr>';
        $tbody.append(row);
	}
}

function displayEditInventory(id){
	var url = getInventoryUrl() + "/" + id;
	$.ajax({
	   url: url, 
	   type: 'GET', 
	   success: function(data) {
	   		console.log("Inventory data fetched");
	   		console.log(data);	
	   		displayInventory(data);     //...
	   }, 
	   error: function(){
	   		alert("An error has occurred");
	   }
	});	
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#inventoryFile');
	$file.val('');
	$('#inventoryFileName').html("Choose File");
	//Reset various counts
	processCount = 0;
	fileData = [];
	errorData = "";
	//Update counts	
	getInventoryList(false);
}

function updateFileName(){
	var $file = $('#inventoryFile');
	var fileName = $file.val();
	$('#inventoryFileName').html(fileName);
}

function displayUploadData(){
 	resetUploadDialog(); 	
	$('#upload-inventory-modal').modal('toggle');
}
function displayAddDialog(){
    $('#inventory-form-modal').modal('toggle');
}

function displayInventory(data){
	$("#inventory-edit-form input[name=barcode]").val(data.barcode);
	$("#inventory-edit-form input[name=quantity]").val(data.quantity);
	$("#inventory-edit-form input[name=productId]").val(data.productID);
	$('#edit-inventory-modal').modal('toggle');
}

//HELPER METHOD
function toJson($form){
    var serialized = $form.serializeArray();
    console.log(serialized);
    var s = '';
    var data = {};
    for(s in serialized){
        data[serialized[s]['name']] = serialized[s]['value']
    }
    var json = JSON.stringify(data);
    console.log(json);
    return json;
}

function setSelectOptions(form, options, initialValue){
    form.empty();
    for(var value in options){
        selectValues[value] = value;
    }
    $.each(selectValues, function(key, value) {
         form.append($("<option></option>")
                        .attr("value", key)
                        .text(value));
    });
    form.val(initialValue);
}


//INITIALIZATION CODE
function init(){
	$('#add-inventory').click(addInventory);
	$('#update-inventory').click(updateInventory);
	$('#upload-data').click(displayUploadData);
    $('#process-data').click(processData);
    $('#inventoryFile').on('change', updateFileName)
    $("#open-add-dialog").click(displayAddDialog)
    $('#download-errors').click(downloadErrors);
}
function downloadInventory(){
tableToCSV(document, "inventory-table", 3);
}


$(document).ready(init);
$(document).ready(getInventoryList(false));



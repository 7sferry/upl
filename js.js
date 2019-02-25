/************************
 * Made by [MR Ferry™]  *
 *  on February 2019    *
 ************************/

let ajax;
let idx = 1;
let completed;

function _(el){
	return document.getElementById(el);
}

function abort(event){
	console.log("hi");
	event.preventDefault();
	_("file1").value = "";
	if(ajax !== undefined) ajax.abort();
}

function uploadFile(){
	completed = 0;
	document.getElementById("file1").setAttribute("disabled", "disabled");
	if(document.querySelectorAll(".status") !== null && idx === 1){
		let x = document.querySelectorAll(".status");
		for(let i = 0; i < x.length; i++){
			x[i].remove();
		}
	}
	startUpload(_("file1").files[0]);
}

function startUpload(file){
	_("total").innerHTML = "uploaded " + completed + '/' + _("file1").files.length;
	_("progressBar").value = 0;
	const formdata = new FormData();
	formdata.append("file1", file);
	ajax = new XMLHttpRequest();
	ajax.upload.addEventListener("progress", progressHandler, false);
	ajax.addEventListener("load", completeHandler, false);
	ajax.addEventListener("error", errorHandler, false);
	ajax.addEventListener("abort", abortHandler, false);
	ajax.open("POST", "upload.jsp");
	ajax.send(formdata);
}

function progressHandler(event){
	_("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
	const percent = (event.loaded / event.total) * 100;
	_("progressBar").value = percent;
	_("status").innerHTML = Math.round(percent) + "% uploaded... Please Wait";
}

function completeHandler(event){
	_("total").innerHTML = "uploaded " + ++completed + '/' + _("file1").files.length;
	const newstat = document.createElement('h3');
	newstat.setAttribute("id", "status" + idx);
	newstat.setAttribute("class", "status");
	document.getElementById("upload_form").appendChild(newstat);
	_("status" + idx).innerHTML = "Success uploaded " + event.target.responseText + "<br>";
	if(idx < _("file1").files.length){
		startUpload(_("file1").files[idx++]);
	} else{
		_("status").innerHTML = "&nbsp;";
		_("loaded_n_total").innerHTML = "&nbsp";
		document.getElementById("file1").removeAttribute("disabled");
		idx = 1;
		_("file1").value = "";
	}
}

function errorHandler(){
	_("status").innerHTML = "Upload Failed";
}

function abortHandler(){
	_("status").innerHTML = "Upload Aborted";
}

/************************
 * Created by MR Ferry™ *
 *  February 2019       *
 ************************/



let ajax;
let idx = 0;

function _(el) {
	return document.getElementById(el);
}

function abort(event){
	console.log("hi");
	event.preventDefault();
	_("file1").value = "";
	if(ajax!==undefined) ajax.abort();
}

function uploadFile() {
	document.getElementById("file1").setAttribute("disabled","disabled");
	if(document.querySelectorAll(".status")!==null && idx===0) {
		let x = document.querySelectorAll(".status");
		for (let i = 0; i < x.length; i++) {
			x[i].innerHTML = "";
		}
	}
	startUpload(_("file1").files[idx]);
}

function startUpload(file){
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

function progressHandler(event) {
	_("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
	const percent = (event.loaded / event.total) * 100;
	_("progressBar").value = percent;
	_("status").innerHTML = Math.round(percent) + "% uploaded... Please Wait";
}

function completeHandler(event) {
	const newstat = document.createElement('h3');
	newstat.setAttribute("id","status"+idx);
	newstat.setAttribute("class","status");
	document.getElementById("upload_form").appendChild(newstat);
	_("status"+idx).innerHTML = "Success uploaded "+event.target.responseText+"<br>";
	_("status").innerHTML = "";
	idx++;
	if((idx+1)<=_("file1").files.length){
		startUpload(_("file1").files[idx]);
	} else{
		_("loaded_n_total").innerHTML = "";
		document.getElementById("file1").removeAttribute("disabled");
		idx=0;
		_("file1").value = "";
	}
}

function errorHandler() {
	_("status").innerHTML = "Upload Failed";
}

function abortHandler() {
	_("status").innerHTML = "Upload Aborted";
}

// list opened tabs on page load
document.addEventListener("DOMContentLoaded", function(event) {
	// list current tabs
	getSession();
	
	// get old saved sessions
	getSavedSessions();
});

// event handlers
document.getElementById("getSession").addEventListener("click", getSession);
document.getElementById("saveSession").addEventListener("click", saveSession);
document.getElementById("getSavedSessions").addEventListener("click", getSavedSessions);

// array of objects representing a tab for the current session
var current_session_data = [];

// array of objects storing saved sessions
var saved_sessions_data = [];

var current_session_table = document.getElementById("current-session-table").getElementsByTagName('tbody')[0];;
var saved_sessions_table = document.getElementById("saved-sessions-table").getElementsByTagName('tbody')[0];;

function getSession(){
	// clear table content
	current_session_table.innerHTML = "";
		
	chrome.tabs.query({}, function(tabs){
		// process all tabs
		tabs.forEach((tab) => {
			var item = {"title": tab.title, "link": tab.url};
			current_session_data.push(item);
			
			insertInCurrentSessionTable(current_session_table, tab.title, tab.url);
		});
		
		// make content downloadable
		makeSessionExportable(current_session_data);
	});
}

function insertInCurrentSessionTable(target_table, title, url){
	var row = target_table.insertRow(-1);
	var titleCell = row.insertCell(0);
	var urlCell = row.insertCell(1);
	
	titleCell.innerHTML = title;
	
	urlCell.innerHTML = url;
}

function insertInSavedSessionTable(target_table, name, date){
	var row = target_table.insertRow(-1);
	var titleCell = row.insertCell(0);
	var urlCell = row.insertCell(1);

	titleCell.innerHTML = name;
	urlCell.innerHTML = date;
}

function saveSession(){
	var name = document.getElementById("session-name-form").value;
	
	var now = Date.now();
	var session = {"ts": now, "data": current_session_data};
	
	console.log(session);
	
	localStorage[name] = session; 
	
	chrome.storage.local.set({[name]: session}, function() {
		 if (chrome.extension.lastError) {
            alert('An error occurred: ' + chrome.extension.lastError.message);
        } else {
          console.log('Session has been saved.');
		}
    });

}

function exportSession(){
}

function getSavedSessions(){
	console.log("getting saved sessions");
	chrome.storage.local.get(null, function(items) {
		// process all sessions
		Object.entries(items).forEach(([k, v]) => {
			var item = {"name": k, "details": v};
			
			saved_sessions_data.push(item);
			
			console.log(v.ts);
			
			var d = new Date(v.ts);
			
			insertInSavedSessionTable(saved_sessions_table, k, d.toLocaleString());
		});

		
		console.log(saved_sessions_data);
	});
	
	
	
	
}

function makeSessionExportable(data){
	var properties = {type: 'application/json'};
	
	try {
	  // Specify the filename using the File constructor, but ...
	  file = new File(JSON.stringify(data), "file.json", properties);
	} catch (e) {
	  // ... fall back to the Blob constructor if that isn't supported.
	  file = new Blob([JSON.stringify(data)], properties);
	}
	
	var url = URL.createObjectURL(file);
	document.getElementById('current-session-download').href = url;
}
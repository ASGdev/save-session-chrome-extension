// event handlers
document.getElementById("manage").addEventListener("click", manage);
document.getElementById("getList").addEventListener("click", getList);


function manage(){
	chrome.runtime.openOptionsPage();
}

function getList(){
	chrome.tabs.query({}, function(tabs){
		tabs.forEach((tab) => {
			console.log(tab.title);
		});
	});
}
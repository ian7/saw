/**
 * @author masiar
 */

 //Method to limit the number of results in the tag search
function searchControl(){
	var items = document.getElementById('searchResults').getElementsByTagName('li');
	if(items.length > 5){
		var subitems = [];
		for(var i = 0; i < 5; i++){
			subitems[i] = items[i];
		}
		var innerHTML = '<ul>';
		for(var i = 0; i < subitems.length; i++){
			innerHTML += '<li>' + subitems[i].innerHTML + '</li>';
		}
		innerHTML += '</ul>';
		document.getElementById('searchResults').innerHTML = innerHTML;
	}
	if(items.length == 0){
		document.getElementById('searchResults').style.display = 'none';
	}
}

function findPos(obj) {
		var curleft = curtop = 0;
		if (obj.offsetParent) {
			do {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
			while (obj = obj.offsetParent);
		}
	return [curleft,curtop];
} 
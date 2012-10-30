// fist let's read it out
var url = localStorage.getItem('SAWurl');
// then remove it 
localStorage.removeItem('SAWurl');
// and finally - navigate there!
window.location.href = url;
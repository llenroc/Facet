function addUser2(name, email)
{
	var list = document.getElementById('participantList');
	var newLi = document.createElement("LI");
	newLi.innerHTML = "<a href=mailto:" + email + ">" + name + "</a>";
	newLi.className = "user";
	list.appendChild(newLi);
}

function addUser() 
{
	var name = document.getElementById("name").value;
	var email = document.getElementById("email").value;
	
	addUser2(name,email);
}
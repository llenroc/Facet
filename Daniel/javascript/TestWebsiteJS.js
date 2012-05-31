function hide(idString)
{
	var target = document.getElementById(idString);
	if(target .style.display == "none")
		target .style.display = "block";
	else
		target .style.display = "none";

	return;
}

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

function addSubMenu(list)
{
	var ul = document.getElementById(list);
	var newUl = document.createElement("UL");
	newUl.className = "apple";
	newUl.innerHTML = "<li class='group'>Edit Group</li><li class='delete'>Delete</li><li class='share'>Share</li><li class='email'>Email</li>";
	ul.appendChild(newUl);
}


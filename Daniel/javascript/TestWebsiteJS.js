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

/*
function addGroup()
{
	var groupList = document.getElementById('groupList');
	var newGroup = document.createElement('LI');
	var newInnerGroup = document.createElement("UL");
	newInnerGroup.className = "apple";
	newGroup.className = "icon group connectedSortable";
	
	newGroup.appendChild(newInnerGroup);	
	groupList.appendChild(newGroup);
	

}*/
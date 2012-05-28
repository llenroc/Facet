/* This code is taken from facet-prototyping/TestWebsiteJS.js , but modified so that you can specify the element to show/hide on click */

function hide(idString)
{
	var target = document.getElementById(idString);
	if(target .style.display == "none")
		target .style.display = "block";
	else
		target .style.display = "none";

	return;
}

function hideAll()
{
	hide('list1');
	hide('list2');

}
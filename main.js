var button = document.querySelector('button');

button.onclick = function () {
	var div = document.createElement('div');
	div.classList.add('flow-box');
	div.draggable = true;
	document.body.appendChild(div);
};

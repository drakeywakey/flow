var arrows = 0;
var boxes = 0;
var boxesInContainer = {};
// This will only be true if there isn't already a box waiting to be put in the flow chart
var canCreateNewFlowBox = true;

var arrowButton = document.getElementById('arrow-button');
var flowBoxButton = document.getElementById('flow-box-button');
var flowContainer = document.getElementById('flow-container');

/*
	Starting with no option to reposition the box once it's in the chart. Will change this when possible.
*/

//the height in px between the topmost edge of the screen and a new flow-box
var heightFromEdge = 28;
//the width in px between the leftmost edge of the screen and a new flow-box
var widthFromEdge = 8;
//using these, I can find out where exactly in the flow-box the user started dragging
var dragStartX = 0;
var dragStartY = 0;

var padding = 5;
var widthToContainer = 202;

flowContainer.ondragover = function (event) {
	//make the flowContainer allow the drop
	event.preventDefault();
};

flowContainer.ondrop = function (event) {
	event.preventDefault();

	//find the box to drop inside the container
	var data = event.dataTransfer.getData('text');
	var item = document.getElementById(data);
	var isBox = item.classList.contains('flow-box');

	var left = event.clientX - dragStartX + padding;
	var top = event.clientY - dragStartY + padding;

	//refactor soon -- most of this works for dropping in the arrows as well

	if (isBox) {
		var textarea = document.createElement('textarea');
		textarea.maxLength = 120;
		item.appendChild(textarea);
	}
	//ok. I may have definitely done this the wrong way. If a box is already inside the container, I need to consider not only where
	//inside the box the user started dragging, but also where the box already was inside the container. Maybe I should have that map keep
	//track of the top left corner of each box??? idk. For now, back to no repositioning boxes inside the container :(

	//don't allow the box to be moved once it's in the chart
	item.draggable = false;
	item.ondragstart = null;

	flowContainer.appendChild(item);

	//TODO: position the child node at where it was dropped in the container
	console.log('drop',event);
	//we need to consider where the box already was, along with where inside the box the user started dragging

	//and if the box was outside the container, we need to subtract off the width to the container, otherwise it gets positioned too far left
	//(remember, this left position is supposed to be relative to the left edge of the container)
	left -= boxesInContainer[data] ? 0 : widthToContainer;
	//and finally, let's make sure the box gets dropped inside the container
	item.style.left = (left >= 0 ? left : 0) + 'px';

	//same with the top, although we don't need to worry about a heightToContainer, since the container isn't offset on the top

	item.style.top = (top >= 0 ? top : 0) + 'px';
	//box.style.top = (event.clientY - dragStartY + 5) + 'px';

	//and now that the box has been added to the chart, we can add a new box
	canCreateNewFlowBox = true;

	//and indicate that the box is now inside the container
	boxesInContainer[data] = true;

	if (!isBox) {
		var arrowText = document.createElement('input');
		flowContainer.appendChild(arrowText);
		arrowText.style.left = item.style.left;
		arrowText.style.top = (parseInt(item.style.top) - 10) + 'px';
	}
};

flowBoxButton.onclick = function () {
	if (canCreateNewFlowBox) {
		//create a new box to add to the flowchart
		var flowBox = document.createElement('div');

		//give the box a unique id (used for drag and drop) and increment number of boxes
		flowBox.id = 'flow-box-' + boxes++;

		flowBox.classList.add('flow-box');

		//set drag properties for the box
		flowBox.draggable = true;
		flowBox.ondragstart = dragFlowBoxIntoChart;

		document.body.appendChild(flowBox);

		//can't add a new box until this box is put into the chart
		canCreateNewFlowBox = false;
	}
};

arrowButton.onclick = function () {
	//create an arrow to add to the chart
	var arrow = document.createElement('img');

	//set drag properties for the arrow
	arrow.draggable = true;
	arrow.ondragstart = dragArrowIntoChart;

	arrow.classList.add('arrow');
	arrow.id = 'arrow-' + arrows++;

	arrow.setAttribute('data-direction', 'right');
	arrow.ondblclick = changeArrowDirection;

	arrow.src = './download.png';
	document.body.appendChild(arrow);
};

function changeArrowDirection(event) {
	var arrow = event.target;
	var direction = arrow.dataset.direction;
	switch (direction) {
		case 'right':
			arrow.setAttribute('data-direction', 'down');
			break;
		case 'down':
			arrow.setAttribute('data-direction', 'left');
			break;
		case 'left':
			arrow.setAttribute('data-direction', 'up');
			break;
		case 'up':
			arrow.setAttribute('data-direction', 'right');
			break;
		default:
			break;
	}
}

function dragArrowIntoChart(event) {
	dragStartX = event.pageX -= widthFromEdge;
	dragStartY = event.pageY -= heightFromEdge;

	event.dataTransfer.setData('text', event.target.id);
}

function dragFlowBoxIntoChart(event) {
	//would love to put these in the dataTransfer, but can i transfer multiple things with it? unclear.
	dragStartX = event.pageX -= widthFromEdge;
	dragStartY = event.pageY -= heightFromEdge;

	console.log('user started dragging at (', dragStartX, ',', dragStartY, ')');

	//not sure if this is the proper way to drag a node, but it's how w3 does it so whatevs
	event.dataTransfer.setData('text', event.target.id);
}

function startBoxEdit(event) {
	var box = event.target;

}

var boxes = 0;
var boxesInContainer = {};
// This will only be true if there isn't already a box waiting to be put in the flow chart
var canCreateNewFlowBox = true;
var flowBoxButton = document.getElementById('flow-box-button');
var flowContainer = document.getElementById('flow-container');

/*
	WARNING: SHITTY SOLUTION START HERE
	Dragging and dropping exactly where the user drops is apparently a bit more
	complex than I realized. That's ok I guess. I could bust out a library here
	like JQuery or something, but I think I'm gonna soldier through here and reinvent
	the wheel. I think it'll be a good challenge. However, this will require a lot
	of grossness, I think. Ah well. Maybe I'll compare it with a better solution later.

	In fact, maybe I should pull this out into a separate file. Will consider.
*/

//the height in px between the topmost edge of the screen and a new flow-box
var heightFromEdge = 28;
//the width in px between the leftmost edge of the screen and a new flow-box
var widthFromEdge = 8;
//using these, I can find out where exactly in the flow-box the user started dragging
var dragStartX = 0;
var dragStartY = 0;

var padding = 5;
var widthToContainer = 102;

flowContainer.ondragover = function (event) {
	//make the flowContainer allow the drop
	event.preventDefault();
};

flowContainer.ondrop = function (event) {
	event.preventDefault();

	//find the box to drop inside the container
	var data = event.dataTransfer.getData('text');
	var box = document.getElementById(data);

	//ok. I may have definitely done this the wrong way. If a box is already inside the container, I need to consider not only where
	//inside the box the user started dragging, but also where the box already was inside the container. Maybe I should have that map keep
	//track of the top left corner of each box??? idk. For now, back to no repositioning boxes inside the container :(

	////ehhhhhhhhhhhhh this is no good. But I'm gonna do it for now -- don't allow the box to be moved once it's in the chart :(
	box.draggable = false;

	flowContainer.appendChild(box);

	//TODO: position the child node at where it was dropped in the container
	console.log('drop',event);
	//we need to consider where the box already was, along with where inside the box the user started dragging
	var left = event.clientX - dragStartX + padding;
	//and if the box was outside the container, we need to subtract off the width to the container, otherwise it gets positioned too far left
	//(remember, this left position is supposed to be relative to the left edge of the container)
	left -= boxesInContainer[data] ? 0 : widthToContainer;
	//and finally, let's make sure the box gets dropped inside the container
	box.style.left = (left >= 0 ? left : 0) + 'px';

	//same with the top, although we don't need to worry about a heightToContainer, since the container isn't offset on the top
	var top = event.clientY - dragStartY + padding;
	box.style.top = (top >= 0 ? top : 0) + 'px';
	//box.style.top = (event.clientY - dragStartY + 5) + 'px';

	//and now that the box has been added to the chart, we can add a new box
	canCreateNewFlowBox = true;

	//and indicate that the box is now inside the container
	boxesInContainer[data] = true;
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
		flowBox.ondragstart = dragFlowBox;

		document.body.appendChild(flowBox);

		//can't add a new box until this box is put into the chart
		canCreateNewFlowBox = false;
	}
};

function dragFlowBox(event) {
	//would love to put these in the dataTransfer, but can i transfer multiple things with it? unclear.
	//also, need to consider if the box was inside or outside the container when we started dragging
	dragStartX = event.pageX;
	dragStartY = event.pageY;

	if (!boxesInContainer[event.target.id]) {
		dragStartX -= widthFromEdge;
		dragStartY -= heightFromEdge;
	}

	console.log('user started dragging at (', dragStartX, ',', dragStartY, ')');

	//not sure if this is the proper way to drag a node, but it's how w3 does it so whatevs
	event.dataTransfer.setData('text', event.target.id);
}

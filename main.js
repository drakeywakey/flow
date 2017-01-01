var boxes = 0;
// This will only be true if there isn't already a box waiting to be put in the flow chart
var canCreateNewFlowBox = true;
var flowBoxButton = document.getElementById('flow-box-button');
var flowContainer = document.getElementById('flow-container');

flowContainer.ondragover = function (event) {
	//make the flowContainer allow the drop
	event.preventDefault();
};

flowContainer.ondrop = function (event) {
	event.preventDefault();
	var data = event.dataTransfer.getData('text');
	var box = document.getElementById(data);

	flowContainer.appendChild(box);

	//TODO: position the child node at where it was dropped in the container

	//and now that the box has been added to the chart, we can add a new box
	canCreateNewFlowBox = true;
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
	//not sure if this is the proper way to drag a node, but it's how w3 does it so whatevs
	event.dataTransfer.setData('text', event.target.id);
}

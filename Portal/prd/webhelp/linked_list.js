// Constructor for list nodes
// DLListNode(elem) - constructor. Creates unlinked node with elem as data
// Interface:
// extract() - unlinks node, linking its predecessor and successor.
// insertAfter(node) - insert node after this node, updating links.

function DLListNode(elem)
{
	this.elem = elem;
	this.prev = this.next = null;
}

DLListNode.prototype.extract = function(){
	if (this.prev)
	{
		this.prev.next = this.next;
	}
	if (this.next)
	{
		this.next.prev = this.prev;
	}
	this.prev = this.next = null;
}

DLListNode.prototype.insertAfter = function(newNode){
	if (this == newNode)
	{
		 // don't be daft!
		return; 
	}
	newNode.extract();
	newNode.prev = this;
	if (this.next)
	{
		newNode.next = this.next;
		this.next.prev = newNode;
	}
	this.next = newNode;
}

// The list itself
// Interface:
// getFirst() - returns first node, or null if none
// getLast() - returns last node, or null if none
// add(elem[,afterNode]) - creates new node with elem as data and inserts it at end of list, or optionally after afterNode
// foreach(func) - calls func on all elements stored in list
// find(func[,afterNode]) - finds first node in list (optionally after afterNode) where func returns true when called on the element.
function DLList()
{
	this.prev = this.next = this;
}

DLList.prototype.insertAfter = DLListNode.prototype.insertAfter;

DLList.prototype.getFirst = function(){
	return ( this.next == this ? null : this.next );
};

DLList.prototype.getLast = function(){
	return ( this.prev == this ? null : this.prev );
};

DLList.prototype.add = function(elem,afterNode){
	var newNode = new DLListNode(elem);
	if (!afterNode)
	{
		if (this.prev)
		{
			afterNode = this.prev;
		} 
		else 
		{
			afterNode = this;
		}
	}
	afterNode.insertAfter(newNode);
	return newNode;
};

DLList.prototype.foreach = function(func){
	for (var node = this.next; node != this; node = node.next) 
	{
		func(node.elem);
	}
};

DLList.prototype.find = function(func, startNode){
	if (!startNode) 
	{ 
		startNode = this; 
	}
	for (var node = startNode.next; node != this; node = node.next)
	{
		if ( func(node.elem) )
		{
			return node;
		}
	}
	return null;
};

DLList.prototype.count = function(){
	cnt = 0;
	for (var node = this.next; node != this; node = node.next) 
	{
		cnt++;
	}
	return cnt;
};

DLList.prototype.getItem = function(val){
	node = this.find( function(x){ return x == val;}, null );
	return node;
};
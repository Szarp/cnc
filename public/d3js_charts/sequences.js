// Dimensions of sunburst.
var width = 750;
var height = 600;
var radius = Math.min(width, height) / 2;
var x ={childrens:[
    {sequence:"bot",size:3495},
    {sequence:"guys-tomorrow",size:822},
    {sequence:"guys-today",size:177},
    {sequence:"guys-admins",size:62},
    {sequence:"guys-other",size:740}
],
 labels:[
     {name:"root",text:"all messages"},
     {name:"bot",text:"responses from bot"},
     {name:"guys",text:"request from users"},
     {name:"today",text:"requests for today’s changes"},
     {name:"tomorrow",text:"requests for tomorrow’s changes"},
     {name:"admins",text:"requests to admins"}
 ]
 
}
var elems=[];
var elems2=[];

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
  w: 75, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.
var colors = {
  "home": "#5687d1",
  "admins": "#7b615c",
  "bot": "#de783b",
  "today": "#6ab975",
  "guys": "#a173d1",
  "tomorrow": "#bbbbbb",
    "other":"#fff"
};

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });
var arc2 = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y)+10; })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy)+10; });
// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("visit-sequences.json",function(err,json2) {
    //var x=JSON.stringify(json2);
    //x=x.replace("\n",'');
    //json2=JSON.parse(json2);
    //console.log(json2,x);
  //var csv = d3.csv.parseRows(text);
  var json = buildHierarchy(x['childrens']);
  createVisualization(json);
});

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {
console.log(json);
  // Basic setup of page elements.
  //initializeBreadcrumbTrail();
  //drawLegend();
  //d3.select("#togglelegend").on("click", toggleLegend);

  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });
    //console.log('nodes',nodes);

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:g");
  
  path.append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("tx",function(d){pushToArray(d); return 1;}) //my field
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.name]; })
      .style("opacity", 1);
    
      //.data(nodes)
    path.append("text")
      .attr("class", "arc")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("transform", function(d) { return "translate(" + arc2.centroid(d) + ")"; })
      .attr("dx",function(d){return d.x})
      .attr("dy", "0.35em")
      .text(function(d) { return d.value; });
    
      //.on("mouseover", mouseover);
    //console.log();

  // Add the mouseleave handler to the bounding circle.
//  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.node().__data__.value;
  
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function pushToArray(d){
    if(elems.indexOf(d) == -1)
    elems.push(d);
    elems2.push(d);
    //console.log(elems);
}
var time;
setTimeout(function(){
    elems2=x.labels.reverse();
    time=setInterval(function(){
        
        var z;
        z= elems2.pop();
        animate(z);
        setTimeout(function(){
            mouseleave(z)
        },4000)
        //console.log(i);
        //i++;
        console.log('elem',elems2.length);
        if(elems2.length==0)
            clearInterval(time);
        
    },5500);
},800)
function displayD(d){
        
//    if(k == undefined)
//        return;

  

  
    
}
function animate(label) {
    var dur=1000;
    var x;
    var i;
    var k;
    var j=true;
    //console.log('len',label)
    for(i=0;i<elems.length;i++){
        if(elems[i].name == label.name){
            break;
        }
    }
    var d=elems[i];
    d3.select("#percentage")
      .text(d.value);
    d3.select("#lab")
      .text(label.text);
    //cant animate visibility
    setTimeout(function(){
        d3.select("#explanation")
        .style("visibility", "visible");
    },dur);
    var sequenceArray = getAncestors(d);
  //updateBreadcrumbs(sequenceArray, percentageString);

  // Fade all the segments.
  d3.selectAll("path")
    .transition()
    .duration(dur)
    .style("opacity", 0.1);

  // Then highlight only those that are an ancestor of the current segment.
  vis.selectAll("path")
      .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
              })
    .transition()
      .duration(dur)
      .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {
    var dur=1000;
console.log('b');
  // Hide the breadcrumb trail
  d3.select("#trail")
    .transition()
    .duration(dur)
    .style("visibility", "hidden");

  // Deactivate all segments during transition.
  //d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(dur)
      .style("opacity", 1);

  d3.select("#explanation")
    .transition()
    .duration(dur)
    .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.name]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
    console.log(csv);
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i]["sequence"];
    var size = +csv[i]["size"];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
    console.log(root);
  return root;
};


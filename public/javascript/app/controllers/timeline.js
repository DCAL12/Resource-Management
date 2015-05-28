var canvas = function() {
	
    window.addEventListener("load", update);
    console.log('canvas:');
    console.log(canvas);
    
    //create the canvas
    var canvas = new fabric.Canvas('b', { selection: false });
    console.log('canvas:');
    console.log(canvas);
    //add the grid to the canvas
    var grid = 30;
    for (var i = 0; i < (600 / grid); i++) {
        canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#ccc', selectable: false }));
        canvas.add(new fabric.Line([ 0, i * grid, 600, i * grid], { stroke: '#ccc', selectable: false }));
    }

    // add objects
    canvas.add(new fabric.Rect({
        left: 100,
        top: 100,
        width: 50,
        height: 50,
        fill: '#faa',
        originX: 'left',
        originY: 'top',
        centeredRotation: true,
        lockRotation: true,
        hasRotatingPoint: false
    }));


    // snap to grid
    canvas.on('object:moving', function(options) {
        options.target.set({
            left: Math.round(options.target.left / grid) * grid,
            top: Math.round(options.target.top / grid) * grid
        });
    });
    function update() {
        var canvas = new fabric.Canvas('c', { selection: false });
        //add the grid to the canvas
        var grid = 30;
        for (var i = 0; i < (600 / grid); i++) {
            canvas.add(new fabric.Line([ i * grid, 0, i * grid, 600], { stroke: '#ccc', selectable: false }));
            canvas.add(new fabric.Line([ 0, i * grid, 600, i * grid], { stroke: '#ccc', selectable: false }));
        }
//        data.forEach(function(item){
//            var resourceName = _resourceType;
//            var start = startTime;
//            var end = endTime;
//
//            //create the rectangle
//
//            var rect = new fabric.Rect({
//                left: 100,
//                top: 100,
//                width: 50,
//                height: 50,
//                fill: '#faa',
//                originX: 'left',
//                originY: 'top',
//                centeredRotation: true,
//                lockRotation: true,
//                hasRotatingPoint: false
//            });
//
//            //create the resource name
//            var name = new fabric.IText(resourceName, {
//                backgroundColor: '#FFFFFF',
//                fill: '#000000',
//                fontSize: 12,
//                top : 3
//            });
//
//            //combine the rect and name into a group
//            var group = new fabric.Group([ rect, name ], {
//                left: 100,
//                top: 100,
//                lockScalingX: true,
//                lockScalingY: true,
//                hasRotatingPoint: false,
//                transparentCorners: false,
//                cornerSize: 7
//        });
//
//
//
//    });
        var r = new fabric.Rect({
            left: 100,
            top: 100,
            width: 50,
            height: 50,
            fill: '#faa',
            originX: 'left',
            originY: 'top',
            centeredRotation: true,
            lockRotation: true,
            hasRotatingPoint: false
        });

// create a rectangle object
        var t = new fabric.IText("Hello world !", {
            backgroundColor: '#FFFFFF',
            fill: '#000000',
            fontSize: 12,
            top : 3
        });

        var gp = new fabric.Group([ r, t ], {
            left: 100,
            top: 100,
            lockScalingX: true,
            lockScalingY: true,
            hasRotatingPoint: false,
            transparentCorners: false,
            cornerSize: 7
        });
        
        var square = new fabric.Rect(0,0,50,50);

        canvas.on('object:moving', function(options) {
            options.target.set({
                left: Math.round(options.target.left / grid) * grid,
                top: Math.round(options.target.top / grid) * grid
            });
        });

        canvas.add(gp);

    return update;
}}();
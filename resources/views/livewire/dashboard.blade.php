<div>
    <div class="row">
        <div class="col-9">
            <div id="canvass"></div>
        </div>
        <div class="col-3 px-4 pt-4">
            @if (!$mode)

                <div class="h2 mb-3">Add Point</div>

                <form>
                    <div class="mb-3">
                        <label for="name" class="form-label"> Name</label>
                        <input wire:model='name' type="text" class="form-control @error('name') is-invalid @enderror"
                            id="name">
                        @error('name')
                            <span class="invalid-feedback">
                                {{ $message }}
                            </span>
                        @enderror
                    </div>
                    <div class="mb-3">
                        <label for="type" class="form-label"> Type</label>
                        <select wire:model='type' class="form-control @error('type') is-invalid @enderror"
                            id="type">
                            <option selected disabled>Select Type</option>
                            <option value="start">Start Point</option>
                            <option value="store">Store Point</option>
                        </select>
                        @error('type')
                            <span class="invalid-feedback">
                                {{ $message }}
                            </span>
                        @enderror
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="x" class="form-label"> Coordinate X</label>
                            <input wire:model='x' type="text" class="form-control @error('x') is-invalid @enderror"
                                id="x">
                            @error('x')
                                <span class="invalid-feedback">
                                    {{ $message }}
                                </span>
                            @enderror
                        </div>
                        <div class="col-md-6">
                            <label for="y" class="form-label"> Coordinate Y</label>
                            <input wire:model='y' type="text" class="form-control @error('y') is-invalid @enderror"
                                id="y">
                            @error('y')
                                <span class="invalid-feedback">
                                    {{ $message }}
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="row px-2 gy-2">
                        <button type="button" class="btn btn-primary col-12" wire:click.prevent='savePoint'>Save
                            Point</button>
                        <button type="button" class="btn btn-danger col-12" wire:click='changeMode'>Cancel</button>
                    </div>

                </form>
            @else
                <div class="row justify-content-between">
                    <div class="col-10">
                        <div class="h2">Select your store</div>
                    </div>
                    <div class="col-2">
                        <button class="btn btn-primary" wire:click='changeMode'>Add</button>
                    </div>
                </div>
                <form>
                    <div class="mb-3">
                        <label for="end" class="form-label">Name Store</label>
                        <select wire:model='end_id' class="form-control @error('end') is-invalid @enderror"
                            id="end">
                            <option value="" selected>Select Store</option>
                            @foreach ($marks as $item)
                                @if ($item['type'] != 'start')
                                    <option value="{{ $item->id }}">{{ $item->name }}</option>
                                @endif
                            @endforeach
                        </select>
                        @error('end')
                            <span class="invalid-feedback">
                                {{ $message }}
                            </span>
                        @enderror
                    </div>
                    <div class="row px-2 gy-2">
                        <button type="button" class="btn btn-primary col-12" wire:click.prevent='findStore'>Find
                            Store</button>
                    </div>
                </form>

            @endif
        </div>
        <p>{{ $x ?? 'null' }}</p>
    </div>

    <script>
        ['livewire:load', 'contentChanged'].forEach(e =>
            window.addEventListener(e, function() {
                console.log('reload');
                let width = (window.innerWidth / 12) * 9;
                let height = window.innerHeight;
                let x = @this.x;
                let y = @this.y;
                let marks = JSON.parse(@this.mark);
                let start = JSON.parse(@this.start);
                let end = JSON.parse(@this.end);
                console.log(start);


                let stage = new Konva.Stage({
                    container: 'canvass', // id of container <div>
                    width: width,
                    height: height
                });

                // then create layer
                let backgroundLayer = new Konva.Layer();
                stage.add(backgroundLayer);

                let background = new Image();
                background.onload = function() {
                    let map = new Konva.Image({
                        x: 0,
                        y: 0,
                        image: background,
                        width: width,
                        height: height,
                    });

                    // add the shape to the layer
                    backgroundLayer.add(map);
                };
                background.src = '/img/GF.jpeg';

                backgroundLayer.draw();


                let layer = new Konva.Layer();
                stage.add(layer);

                if (y && x) {
                    let circle = new Konva.Circle({
                        x: x,
                        y: y,
                        radius: 5,
                        // fill: 'red',
                        stroke: 'red',
                        strokeWidth: 2,
                    });
                    layer.add(circle);
                }

                if (marks) {
                    marks.forEach(e => {
                        let circle = new Konva.Circle({
                            id: e.name,
                            x: e.x,
                            y: e.y,
                            radius: 5,
                            fill: 'green',
                            // stroke: 'red',
                            strokeWidth: 2,
                        });
                        layer.add(circle);
                    });
                }


                if (start && end) {
                    let startM;
                    let endM;

                    let marker = new Image();
                    marker.onload = function() {
                        startM = new Konva.Image({
                            x: start.x - ((marker.width / 10) / 2),
                            y: start.y - (marker.height / 10),
                            image: marker,
                            width: marker.width / 10,
                            height: marker.height / 10,
                        });
                        endM = new Konva.Image({
                            x: end.x - ((marker.width / 10) / 2),
                            y: end.y - (marker.height / 10),
                            image: marker,
                            width: marker.width / 10,
                            height: marker.height / 10,
                        });

                        layer.add(startM);
                        layer.add(endM);

                        var amplitude = 10;
                        var period = 2000;
                        // in ms
                        var startY = start.y - (marker.height / 10) - 10 ;
                        var endY = end.y - (marker.height / 10) - 10 ;
                        var anim = new Konva.Animation(function(frame) {
                            startM.y(
                                amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + startY
                            );
                            endM.y(
                                amplitude * Math.sin((frame.time * 2 * Math.PI) / period) + endY
                            );

                        }, layer);

                        anim.start();
                    };

                    marker.src = '/img/m-red.png';
                    layer.draw();

                    // [start, end].forEach(e => {
                    //     console.log('s');
                    //     let marker = new Image();
                    //     marker.onload = function() {
                    //         map = new Konva.Image({
                    //             x: e.x - ((marker.width / 10) / 2),
                    //             y: e.y - (marker.height / 10),
                    //             image: marker,
                    //             width: marker.width / 10,
                    //             height: marker.height / 10,
                    //         });

                    //         // add the shape to the layer
                    //         layer.add(map);
                    //     };

                    //     marker.src = '/img/m-red.png';
                    //     layer.draw();
                    // });


                }

                document.addEventListener('click', function(params) {
                    if (width > params.clientX) {

                        @this.set('x', params.clientX)
                        @this.set('y', params.clientY)

                    }
                })
            })
        );
    </script>

</div>

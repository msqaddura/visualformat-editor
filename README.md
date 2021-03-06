[![Screenshot](screenshot.png)](https://rawgit.com/IjzerenHein/visualformat-editor/master/dist/index.html)

*Click on the image above to start Visual Formatting :D*

The Visual Format Editor allows you to parse and preview Apple's Visual Format Language. It is built using [Cassowary.js](https://github.com/slightlyoff/cassowary.js), [AutoLayout.js](https://github.com/IjzerenHein/autolayout.js), [famo.us](http://famous.org) and [famous-flex](https://github.com/IjzerenHein/famous-flex).


## Query arguments

The Visual Format Editor can be customized by specifying query-arguments:

|Argument|Type|Description
|---|---|---|
|`vfl`|`string`|The vfl definition to display.|
|`extended`|`0` / `1`|Enables or disables extended vfl mode (default: enabled).|
|`spacing`|`array`,`number`|Spacing to use (default: 8).|
|`mode`|`string`|Appearence mode: `default`, `compact`, `nolog`, `preview`.|
|`settings`|`0` / `1`|Shows or hides the settings pane (default: 1).|

Example:

    visualformat-editor/.../index.html?spacing=[20,10]&extended=0


## Visual format meta info

Additional meta-info can be added in the form of comments. Using this meta-info, you can instruct the viewer to for instance use a specific aspect ratio or a specific color for a sub-view:

```vfl
//viewport aspect-ratio:3/1 max-height:300
//colors red:#FF0000 green:#00FF00 blue:#0000FF
//shapes red:circle green:circle blue:circle
H:|-[row:[red(green,blue)]-[green]-[blue]]-|
V:|[row]|
```
[View this example online](https://rawgit.com/IjzerenHein/visualformat-editor/master/dist/index.html?vfl=rgb)

Meta-info is also processed by renderers. If you want to set the meta-info only for previewing purposes, then prefix it with a `-`. The following example sets the `max-width` and `max-height` for previewing a mobile layout. The actual layout renderer will ignore this meta-info.

```vfl
//-viewport max-width:320 max-height:500
//heights header:44 footer:44
V:|[col:[header][content][footer]]|
H:|[col]|
```

|Category|Property|Example|
|--------|--------|-------|
|`viewport`|`aspect-ratio:{width}/{height}`|`//viewport aspect-ratio:16/9`|
||`width:[{number}/intrinsic]`|`//viewport width:10`|
||`height:[{number}/intrinsic]`|`//viewport height:intrinsic`|
||`min-width:{number}`|
||`max-width:{number}`|
||`min-height:{number}`|
||`max-height:{number}`|
|`spacing`|`[{number}/array]`|`//spacing:8` or `//spacing:[10, 20, 5]`|
|`widths`|`{view-name}:[{number}/intrinsic]`|`//widths subview1:100`|
|`heights`|`{view-name}:[{number}/intrinsic]`|`//heights subview1:intrinsic`|
|`colors`|`{view-name}:{color}`|`//colors redview:#FF0000 blueview:#00FF00`|
|`shapes`|`{view-name}:[circle/square]`|`//shapes avatar:circle`|


## Contribute

If you like this project and want to support it, show some love
and give it a star.


## Contact
-   @IjzerenHein
-   hrutjes@gmail.com

© 2015 Hein Rutjes

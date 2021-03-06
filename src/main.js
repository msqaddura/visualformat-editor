/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */

//<webpack>
require('famous-polyfills');
require('famous/core/famous.css');
require('famous-flex/widgets/styles.css');
require('./styles.css');
require('./index.html');
require('codemirror/lib/codemirror.css');
require('./mode/vfl/vfl.css');
//</webpack>

function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Fast-click
var FastClick = require('fastclick/lib/fastclick');
FastClick.attach(document.body);

// import dependencies
var Engine = require('famous/core/Engine');
var LayoutController = require('famous-flex/LayoutController');
var AutoLayout = require('autolayout');
var InputView = require('./views/InputView');
var OutputView = require('./views/OutputView');
var VisualOutputView = require('./views/VisualOutputView');
var vflToLayout = require('./vflToLayout');
var Surface = require('famous/core/Surface');

// create the main context and layout
var mainContext = Engine.createContext();
var layout;
switch (getParameterByName('mode')) {
    case 'preview':
        layout = vflToLayout(`
|-[visualOutput]-|
V:|-[visualOutput]-|
        `);
        break;
    case 'compact':
        layout = vflToLayout(`
V:|-[input(output)]-[output]-|
V:|-[visualOutput]-|
|-[input(output,visualOutput)]-[visualOutput]-|
|-[output]-[visualOutput]-|
        `, {spacing: [10, 10]});
        break;
    case 'nolog':
        layout = vflToLayout(`
V:|-[input]-|
V:|-[visualOutput]-|
|-[input(visualOutput)]-[visualOutput]-|
        `, {spacing: [10, 10]});
        break;
    default:
        layout = vflToLayout(`
//heights banner:intrinsic
|[banner]|
V:|[banner]-[input(output)]-[output]-|
V:[banner]-[visualOutput]-|
|-[input(output,visualOutput)]-[visualOutput]-|
|-[output]-[visualOutput]-|
        `, {spacing: [10, 10]});
}
var mainLC = new LayoutController({
    layout: layout
});
mainContext.add(mainLC);

// Create banner
var banner = new Surface({
    classes: ['banner'],
    content: '<div class="va">AUTOLAYOUT.JS<div class="subTitle">Visual Format Editor</div></div>' +
    (parseInt(getParameterByName('fork') || '1') ? '<a href="https://github.com/ijzerenhein/autolayout.js"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a>' : ''),
    size: [undefined, 124]
});
mainLC.insert('banner', banner);

// Create input view
var inputView = new InputView();
mainLC.insert('input', inputView);
inputView.editor.on('update', _update); //eslint-disable-line no-use-before-define
inputView.settings.on('update', _updateSettings); //eslint-disable-line no-use-before-define

// Create output view
var outputView = new OutputView();
mainLC.insert('output', outputView);

// Create visualoutput view
var visualOutputView = new VisualOutputView();
mainLC.insert('visualOutput', visualOutputView);

// Update handling
function _update() {
    var constraints = outputView.parse(inputView.editor.visualFormat, inputView.settings.getExtended());
    if (constraints) {
        var view = new AutoLayout.View();
        view.addConstraints(constraints);
        visualOutputView.view = view;
    }
    _updateSettings(); //eslint-disable-line no-use-before-define
    _updateMetaInfo(); //eslint-disable-line no-use-before-define
}
function _updateMetaInfo() {
    var metaInfo = AutoLayout.VisualFormat.parseMetaInfo(inputView.editor.visualFormat, {prefix: '-'});
    visualOutputView.viewPort = metaInfo.viewport;
    visualOutputView.spacing = metaInfo.spacing;
    visualOutputView.colors = metaInfo.colors;
    visualOutputView.shapes = metaInfo.shapes;
    visualOutputView.widths = metaInfo.widths;
    visualOutputView.heights = metaInfo.heights;
}
function _updateSettings(forceParse) {
    if (forceParse) {
        return _update.call(this);
    }
    var view = visualOutputView.view;
    if (view) {
        inputView.settings.updateAutoLayoutView(view);
        visualOutputView.view = view;
    }
}
_update();

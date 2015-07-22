import View from 'famous/core/View';
import Surface from 'famous/core/Surface';
import LayoutController from 'famous-flex/LayoutController';
import vflToLayout from '../vflToLayout';

class VisualOutputView extends View {
    constructor(options) {
        super(options);

        this.content = new LayoutController({
            flow: true,
            flowOptions: {
                reflowOnResize: false
            },
            layout: (context) => {
                if (this.alView) {
                    var subView;
                    this.alView.setSize(context.size[0], context.size[1]);
                    for (var key in this.alView.subViews) {
                        subView = this.alView.subViews[key];
                        if ((subView.type !== 'stack') && (key.indexOf('_') !== 0)) {
                            const node = context.get(subView.name);
                            context.set(node, {
                                size: [subView.width, subView.height],
                                translate: [subView.left, subView.top, subView.zIndex * 5]
                            });
                            var color = 204 - (subView.zIndex * 20);
                            node.renderNode.setProperties({
                                backgroundColor: `rgb(${color}, ${color}, ${color})`
                            });
                        }
                    }
                }
            }
        });
        this.layout = new LayoutController({
            layout: vflToLayout([
                '|[content]|',
                'V:|[content]|'
            ]),
            dataSource: {
                content: this.content
            }
        });
        this.add(this.layout);
    };

    setAutoLayoutView(alView) {
        this.alView = alView;
        this.contentRenderables = this.contentRenderables || {};
        this.contentPool = this.contentPool || {};
        for (var key in this.contentRenderables) {
            this.contentPool[key] = this.contentRenderables[key];
        }
        this.contentRenderables = {};
        if (this.alView) {
            for (var subView in this.alView.subViews) {
                if (subView.indexOf('_') !== 0) {
                    this.contentRenderables[subView] = this.contentPool[subView] || new Surface({
                        content: '<div class="va">' + subView + '</div>',
                        classes: ['subView']
                    });
                    if ((subView.indexOf('round') === 0) || (subView.indexOf('circle') >= 0)) {
                        this.contentRenderables[subView].addClass('round');
                    }
                }
            }
        }
        this.content.setDataSource(this.contentRenderables);
    }

    getAutoLayoutView() {
        return this.alView;
    }
}

export {VisualOutputView as default};

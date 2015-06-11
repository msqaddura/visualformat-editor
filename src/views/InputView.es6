import View from 'famous/core/View';
import LayoutController from 'famous-flex/LayoutController';
import vflToLayout from '../vflToLayout';
import TabBarController from 'famous-flex/widgets/TabBarController';
import EditorView from './EditorView.es6';
import SettingsView from './SettingsView.es6';

class InputView extends View {
    constructor(options) {
        super(options);

        this.tabBarController = new TabBarController({
            tabBarSize: 44,
            tabBarPosition: TabBarController.Position.TOP,
            tabBar: {
                createRenderables: {
                    selectedItemOverlay: true
                }
            }
        });

        this.editor = new EditorView();
        this.settings = new SettingsView();

        this.tabBarController.setItems([
            {tabItem: 'Visual Format', view: this.editor},
            {tabItem: 'Settings', view: this.settings}
        ]);

        this.layout = new LayoutController({
            layout: vflToLayout([
                '|[content]|',
                'V:|[content]|'
            ]),
            dataSource: {
                content: this.tabBarController
            }
        });
        this.add(this.layout);
    }
}

export {InputView as default};

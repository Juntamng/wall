import mn from "backbone.marionette";
import _ from "underscore";
import tpl from '../template/fill_in_the_blank.html';

var FillInTheBlankView = mn.View.extend({
    template:  _.template(tpl),
    ui: {
        a: ".js_blank_input"
    },
    getA: function() {
        return this.ui.a.html()
    }
});

export default FillInTheBlankView;
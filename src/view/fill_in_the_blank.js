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
    },
    onRender: function(){
        var me = this;

        me.onTrack();
    },
    onTrack: function() {
        var me = this;

        me.oRef = firebase.database().ref('cells/' + me.model("id") + '/txt');
        me.oRef.on('value', function(snapshot) {
            me.ui.a.html(snapshot.val());
        });
    },
    offTrack: function() {
        me.oRef.off();
    }
});

export default FillInTheBlankView;
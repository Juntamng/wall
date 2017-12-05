import mn from "backbone.marionette";
import _ from "underscore";
import tpl from '../template/fill_in_the_blank.html';

var FillInTheBlankView = mn.View.extend({
    template:  _.template(tpl),
    ui: {
        a: ".js_blank_input"
    },
    events: {
        "keyup @ui.a": _.debounce(function(){
            this.save();
        }, 1000)
    },
    onRender: function(){
        var me = this;

        me.onTrack();
    },
    save: function() {
        var me = this;

        firebase.database().ref('cells/' + me.model.get("id")).set({
            txt: me.ui.a.html()
        });
    },
    onTrack: function() {
        var me = this;

        me.oRef = firebase.database().ref('cells/' + me.model.get("id") + '/txt');
        me.oRef.on('value', function(snapshot) {
            me.ui.a.html(snapshot.val());
        });
    },
    offTrack: function() {
        me.oRef.off();
    }
});

export default FillInTheBlankView;
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

        me.startTrack();
    },
    save: function() {
        var me = this;

        firebase.database().ref('walldata/c0_0/' + me.model.get("id")).set({
            txt: me.ui.a.html()
        });
    },
    startTrack: function() {
        var me = this;

        me.oRef = firebase.database().ref('walldata/c0_0/' + me.model.get("id") + '/txt');
        me.oRef.on('value', function(snapshot) {
            me.ui.a.html(snapshot.val());
        });
    },
    endTrack: function() {
        var me = this;
        
        me.oRef.off();
    }
});

export default FillInTheBlankView;
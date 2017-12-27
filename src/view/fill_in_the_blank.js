import mn from "backbone.marionette";
import _ from "underscore";
import tpl from '../template/fill_in_the_blank.html';

var FillInTheBlankView = mn.View.extend({
    template:  _.template(tpl),
    ui: {
        q: ".js_sentence",
        a: ".js_input"
    },
    events: {
        "focus @ui.a": "onFocus",
        "blur @ui.a": "onBlur",
        "keyup @ui.a": _.debounce(function(){
            this.save();
        }, 1000)
    },
    onRender: function(){
        this.startTrack();
    },
    onDestroy: function() {
        this.endTrack();
    },
    onFocus: function(e) {
        this.endTrack();
    },
    onBlur: function(e) {
        this.startTrack();
    },
    save: function() {
        var me = this,
            ref = firebase.database().ref('walldata/' + me.model.get("wallId") + '/' + me.model.get("id"));

        if (me.ui.a.text().trim().length === 0) {
            ref.remove();
        }
        else {
            ref.set({
                txt: me.ui.a.html()
            });
        }
    },
    startTrack: function() {
        var me = this;

        me.oRef = firebase.database().ref('walldata/' + me.model.get("wallId")  + '/' + me.model.get("id") + '/txt');
        me.oRef.on('value', function(snapshot) {
            me.ui.a.html(snapshot.val());
        });
    },
    endTrack: function() {
        var me = this;
        
        if (me.oRef) {
            me.oRef.off();
        }
    }
});

export default FillInTheBlankView;
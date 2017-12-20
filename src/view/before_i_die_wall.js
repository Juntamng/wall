import _ from "underscore";
import Bb from "backbone";
import Mn from "backbone.marionette";
import "../css/before_i_die_wall.scss";
import tplWall from "../template/wall.html";

import fill_in_the_blank_wall from "./fill_in_the_blank_wall";
import before_i_die_item from "./before_i_die_wall_item";

const WallView = fill_in_the_blank_wall.extend({
    className: "wall before_i_die",
    template: _.template(tplWall),
    ui: {
        //"container": ".ecoscroll"
    },
    initialize: function(options) {
    },
    onRender: function() {
    },
    onBeforeDestroy: function() {
        this.$el.data("plugin_ecoScroll").destroy();
    },
    onAttach: function() {
        var me = this;

        this.$el.ecoScroll(
        {
            itemWidth: 500,
            itemHeight: 100,
            rangeX : [-100, 100],
            rangeY : [-100, 100],
            axis : "yx",
            snap : false,                     
            momentum : true,
            momentumSpeed : 10,
            onStart: function(oParam)
            {
                if (oParam.target.getAttribute("contenteditable") === "true") {
                    return false;
                }
                else {
                    return true;
                }
            },
            onShow: function(oParam) 
            {
                if (oParam.bNew) {
                    var oModel = new Bb.Model({
                            x: oParam.x,
                            y: oParam.y,
                            wallId: me.options.wallId,
                            id: "c" + oParam.x + "_" + oParam.y,
                            q: me.options.sentence
                    });
                    var oView = new before_i_die_item({model: oModel});
                    oParam.$e.data("view", oView);
                    oParam.$e.html(oView.render({
                        model: oModel
                    }).el);
                }
                else {
                    /*
                    if (me.options.wallId !== oParam.$e.data("view").model.get("wallId")) {

                        oParam.$e.data("view").update(me.options.wallId, me.options.sentence);
                    }
                    oParam.$e.data("view").startTrack();
                    */
                }
                oParam.$e.css({opacity: 1});    
            },
            onHide: function(oParam) 
            {
                oParam.$e.data("view").endTrack();
                oParam.$e.css({opacity: 0.3});
                oParam.$e.hide();    
            },
            onRemove: function(oParam)
            {
                if (oParam.eventType === "hideCell") {
                    ;

                }
                else if (oParam.eventType === "destroy") {
                    oParam.$e.data("view").destroy();
                }
                return true;    
            },
            onStop: function(oParam)
            {
                console.log("stop");
            },
            onResize: function(oParam)
            {
                console.log("resize");
            },
            onClick: function(oParam)
            {   
            }          
        });
    }
});

export default WallView;
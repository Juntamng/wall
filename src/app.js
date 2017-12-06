import $ from "jquery";
import _ from "underscore";
import es from "./js/jquery.eco-scroll";
import fb from "firebase";
import Bb from "backbone";
import Mn from "backbone.marionette";
import "./css/fill_in_the_blank.scss";
import fill_in_the_blank_view from "./view/fill_in_the_blank";

$(function()
{   
    const RootView = Mn.View.extend({
        template: _.template('<div class="divContainer"><div class="wrapper"></div></div>'),
        ui: {
            container: ".divContainer"
        },
        onAttach: function() {
            this.ui.container.ecoScroll(
            {
                itemWidth: 400,
                itemHeight: 150,
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
                                id: "c" + oParam.x + "_" + oParam.y,
                                q: "Before I die I want to"
                        });
                        var oView = new fill_in_the_blank_view({model: oModel});
                        oParam.$e.data("view", oView);
                        oParam.$e.html(oView.render({
                            model: oModel
                        }).el);
                    }
                    else {
                        oParam.$e.data("view").startTrack();
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

    const AppRouter = Mn.AppRouter.extend({
        routes: {
            "": "home",
            "a": function() { console.log("a") },
            "wall/:id": "wall"
        },
        initialize: function() {
        },
        home: function() {
            //this.mainRegion.show(new MainView({collection: colUser}));
            console.log("home");
        },
        wall: function(id) {
            //this.mainRegion.show(new AboutView({collection: colUser}));
            console.log(id);
        }
    });

    const App = Mn.Application.extend({
        region: "#main",
        onStart: function(app, options) {
            this.showView(new RootView());
            this.router = new AppRouter();
            Bb.history.start({pushState: true});
        }
    });

    const myApp = new App();
    myApp.start();
});
    
    
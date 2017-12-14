import $ from "jquery";
import _ from "underscore";
import es from "./js/jquery.eco-scroll";
import fb from "firebase";
import Bb from "backbone";
import Mn from "backbone.marionette";
import "./css/home_wall.scss";
import "./css/fill_in_the_blank.scss";
import fill_in_the_blank_view from "./view/fill_in_the_blank";
import tplMain from './template/main.html';
import tplList from './template/list.html';
import tplWall from './template/wall.html';

$(function()
{   
    const RootView = Mn.View.extend({
        template: _.template(tplMain),
        regions: {
            "list": "#list",
            "wall": "#wall"
        },
        onRender: function() {
            this.showChildView("list", new ListView());
            this.showChildView("wall", new WallView());
        }
    });

    const ListView = Mn.View.extend({
        className: "divList homewall",
        template: _.template(tplList),
        ui: {
            //"container": ".homewall"
        },
        onAttach: function() {
            this.$el.ecoScroll(
            {
                itemWidth: 400,
                itemHeight: 150,
                rangeX : [0, 4],
                axis : "x",
                snap : false,                     
                momentum : true,
                momentumSpeed : 10,
                onStart: function(oParam)
                {
                    return true;
                },
                onShow: function(oParam) 
                {
                    if (oParam.bNew) {
                        var me = this;
                        var sId = "c" + oParam.x + "_" + oParam.y;

                        firebase.database().ref('walls/'+ sId+ '/sentence')
                        .once('value', function(snapshot) {
                            var sValue = (snapshot.val() === null) ? "" : snapshot.val();
                            oParam.$e.html("<div>" + sValue + "</div>").data("id", sId);
                        });
                    }
            
                    oParam.$e.css({opacity: 1});    
                },
                onHide: function(oParam) 
                {
                    //oParam.$e.css({opacity: 0.3});
                    //oParam.$e.hide();    
                },
                onRemove: function(oParam)
                {
                    return true;    
                },
                onStop: function(oParam)
                {
                    //console.log("stop");
                },
                onResize: function(oParam)
                {
                    //console.log("resize");
                },
                onClick: function(oParam)
                {   
                    Bb.history.navigate('wall/' + oParam.$e.data("id"), {trigger: true});
                }          
            });
        }
    });

    const WallView = Mn.View.extend({
        className: "divWall ecoscroll",
        template: _.template(tplWall),
        ui: {
            //"container": ".ecoscroll"
        },
        initialize: function(options) {
            options.wallId = "";
        },
        onRender: function() {
        },
        onBeforeDestroy: function() {
            this.$el.data("plugin_ecoScroll").destroy();
        },
        changeId: function(sWallId) {
            var me = this;
            this.options.wallId = sWallId;

            firebase.database().ref('walls/'+ sWallId + '/sentence')
            .once('value', function(snapshot) {
                me.options.sentence =  snapshot.val();
                me.$el.data("plugin_ecoScroll").initData();
            });
        },
        onAttach: function() {
            var me = this;

            this.$el.ecoScroll(
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
                                wallId: me.options.wallId,
                                id: "c" + oParam.x + "_" + oParam.y,
                                q: me.options.sentence
                        });
                        var oView = new fill_in_the_blank_view({model: oModel});
                        oParam.$e.data("view", oView);
                        oParam.$e.html(oView.render({
                            model: oModel
                        }).el);
                    }
                    else {
                        if (me.options.wallId !== oParam.$e.data("view").model.get("wallId")) {

                            oParam.$e.data("view").update(me.options.wallId, me.options.sentence);
                        }
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

    const AppRouter = Mn.AppRouter.extend({
        routes: {
            "": "home",
            "wall/:id": "wall"
        },
        initialize: function() {
        },
        home: function() {
            //this.mainRegion.show(new MainView({collection: colUser}));
            //myApp.getView().getRegion("list").$el.css({top: "0"});
            myApp.getView().getRegion("wall").$el.hide();
            $('html, body').animate({ scrollTop: 0 }, 1200);
            
            console.log("home");
        },
        wall: function(id) {
            myApp.getView().getRegion("wall").$el.show();
            myApp.getView().getRegion("wall").currentView.changeId(id);
            $('html, body').animate({ scrollTop: $(document).height() }, 1200);
            //myApp.getView().getRegion("list").currentView.ui.container.data("plugin_ecoScroll").init();
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

    window.myApp = new App();
    myApp.start();
});
    
    
import _ from "underscore";
import fill_in_the_blank_item from "./fill_in_the_blank";
import "../css/my_name_wall.scss";
import tpl from '../template/my_name.html';

var ItemView = fill_in_the_blank_item.extend({
    template:  _.template(tpl),
});

export default ItemView;
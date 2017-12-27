import _ from "underscore";
import fill_in_the_blank_item from "./fill_in_the_blank";
import tpl from '../template/i_am.html';

var ItemView = fill_in_the_blank_item.extend({
    template:  _.template(tpl),
});

export default ItemView;
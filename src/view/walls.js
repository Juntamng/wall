import fill_in_the_blank_wall from "./fill_in_the_blank_wall";
import fill_in_the_blank from "./fill_in_the_blank";
import before_i_die_wall from "./before_i_die_wall";
import before_i_die_item from "./before_i_die_wall_item";
import my_name_wall from "./my_name_wall";
import my_name_item from "./my_name_wall_item";
import i_am_wall from "./i_am_wall";
import i_am_item from  "./i_am_wall_item";
import i_am_grateful_wall from "./i_am_grateful_wall";
import i_am_grateful_item from  "./i_am_grateful_wall_item";

const Walls = {
    FillInTheBlankWall: fill_in_the_blank_wall,
    FillInTheBlankWallItem: fill_in_the_blank,
    BeforeIDieWall: before_i_die_wall,
    BeforeIDieWallItem: before_i_die_item,
    MyNameWall: my_name_wall,
    MyNameWallItem: my_name_item,
    IAmWall: i_am_wall,
    IAmWallItem: i_am_item,
    IAmGratefulWall: i_am_grateful_wall,
    IAmGratefulWallItem: i_am_grateful_item
};

export default Walls;
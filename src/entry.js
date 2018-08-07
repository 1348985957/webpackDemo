import css from './css/index.css';
import less from './css/black.less';
import sass from './css/sass.scss';

{
    let helloString = "Hello World!!!";
    document.getElementById("title").innerHTML=helloString;
}
$('#title').html('Hello ycx');

var json = require("../config.json");
document.getElementById("json").innerHTML = json.name+":website:"+json.webSite;
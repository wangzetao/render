const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })

/*
数据格式:
[
    {
        name: "hello",
        score: 18446744073709551616
    },
    {
        name: "13A", 
        score: 2147483647,
    },
    {
        name: "AI",
        score: 1
    }
]
*/
if(!fs.existsSync("data.json")) fs.writeFileSync("data.json", "[]");

var data = JSON.parse(fs.readFileSync("data.json"));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

/*
比较函数，指定如何排序
如果a应在b前面，就返回一个负数。
如果a应该在b后面，就返回一个正数。
*/
function comp(a, b) {
    return b.score - a.score;
}

// function sort(data) {
//     var new_keys = Object.keys(dict).sort(comp);
//     var new_dict = {};
//     for (var k = 0; k < new_keys.length; k++) {
//         new_dict[new_keys[k]] = dict[new_keys[k]];
//     }
//     return new_dict;
// }

app.post('/get', function (req, res) {
    res.end(JSON.stringify(data));
});

function updateData(){
    data = data.sort(comp);
    fs.writeFile("data.json", JSON.stringify(data), (err) => { });
}

app.post('/set', urlencodedParser, function (req, res) {
    var name = req.body.name;
    var score = req.body.score;
    var index = -1;
    for(var i=0;i<data.length;i++){
        if(data[i].name == name) {
            index = i;
            break;
        }
    }
    if (index == -1){
        data.push({name: name, score: score});
        updateData();
    } else if (data[index].score < score){
        data[index].score = score;
        updateData();
    }
    res.end(JSON.stringify(data));
});

var server = app.listen(16384, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Server running at http://%s:%s", host, port)

});
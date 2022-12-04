const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({ extended: false })

/*
数据格式:
{
    "hello": 18446744073709551616
    "13A": 2147483647,
    "AI": 1,
}
*/
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
    return data[b] - data[a];
}

function sort(dict) {
    var new_keys = Object.keys(dict).sort(comp);
    var new_dict = {};
    for (var k = 0; k < new_keys.length; k++) {
        new_dict[new_keys[k]] = dict[new_keys[k]];
    }
    return new_dict;
}

app.post('/get', function (req, res) {
    res.end(JSON.stringify(data));
});

app.post('/set', urlencodedParser, function (req, res) {
    var name = req.body.name;
    var score = req.body.score;
    if (data[name] == undefined || data[name] < score) {
        data[name] = score;
        console.log(data);
        data = sort(data);
        fs.writeFile("data.json", JSON.stringify(data), (err) => { });
        console.log(data);
    }
    res.end(JSON.stringify(data));
});

var server = app.listen(16384, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Server running at http://%s:%s", host, port)

});
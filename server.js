const express = require('express');
const app = express();
const fs = require('fs');

/*
数据格式:
[
    {
        name: "AI",
        score: 1
    },
    {
        name: "13A",
        score: 2147483647
    },
    {
        name: "hello",
        score: 18446744073709551616
    }
]
*/
var data = JSON.parse(fs.readFileSync("data.json"));

app.get('/', function (req, res) {
    res.sendFile("index.html");
});

/*
比较函数，指定如何排序
如果a应在b前面，就返回一个负数。
如果a应该在b后面，就返回一个正数。
*/
function comp(a, b){
    return b.score - a.score;
}

app.get('/get', function (req, res){
    res.end(JSON.stringify(data));
});

app.post('/set', function (req, res) {
    data[req.query.name] = req.query.score;
    data = data.sort(comp);
    var s = JSON.stringify(data);
    fs.writeFile("data.json", s);
    res.end(s);
});

var server = app.listen(443, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Server running at http://%s:%s", host, port)

});
const express = require('express')
const fs = require('fs')
const app = express()

app.use(express.urlencoded({}))
app.use('/', (req, res, next) => {
  var json = ''
  if (JSON.stringify(req.query) == '{}') {
    json = req.body
  } else {
    json = req.query
  }
  var type = true
  for (i in json) {
    if (json[i] == '') {
      type = false
    }
  }
  if (type) {
    next()
  } else {
    res.send({
      type: 3,
      data: ''
    })
  }
})
app.post('/up', (req, res) => {
  var json = req.body // 前台
  var arr = eval(fs.readFileSync('./login.txt', 'utf8')) // 后台数据
  var user = arr[arr.length - 1].user
  user++
  json.user = user
  json.json = {}
  json.json.foodArr = []
  arr.push(json)
  fs.writeFileSync('./login.txt', JSON.stringify(arr), 'utf8')
  res.send({
    type: 0,
    data: {
      user: user
    }
  })
})

app.post('/in', (req, res) => {
  var json = req.body
  var arr = eval(fs.readFileSync('./login.txt', 'utf8'))
  var type = true
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].user == json.user && arr[i].pass == json.pass) {
      type = false
      arr[i].pass = ''
      res.send({
        type: 0,
        data: {
          user: arr[i]
        }
      })
    }
  }
  if (type) {
    res.send({
      type: 1,
      data: '’'
    })
  }
})

app.post('/text', (req, res) => {
  var json = req.body
  var arr = eval(fs.readFileSync('./login.txt', 'utf8'))
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].user == json.user) {
      for (a in json) {
        if (a != 'user') {
          arr[i].json[a] = json[a]
        }
      }
      fs.writeFileSync('./login.txt', JSON.stringify(arr), 'utf8')
      arr[i].pass = ''
      res.send({type: 0,data: arr[i]})
    }
  }
})

app.use(express.static('./public'))
app.listen(8001)

;(function () {
  'use strict'
  var Event = new Vue()
  Vue.component('task', {
    template: '#task-tpl',
    props: ['todo'],
    methods: {
      action: function (name, params) {
        Event.$emit(name, params)
      }
    }
  })
  var alertSound = document.getElementById('alert_sound')
  // alertSound.play()
  // alertSound.pause()
  var vm = new Vue({
    el: '#main',
    data: {
      list: [],
      current: {},
      maxId: 0
    },
    // 初始化执行
    mounted: function () {
      var me = this
      this.list = window.ms.get('list') || this.list
      this.maxId = window.ms.get('maxId') || this.maxId
      Event.$on('remove', function (params) {
        me.remove(params)
      })
      Event.$on('toggle_complete', function (params) {
        me.toggle_complete(params)
      })
      Event.$on('update', function (params) {
        me.update(params)
      })
      Event.$on('toggle_detail', function (params) {
        me.toggle_detail(params)
      })
      setInterval(function () {
        me.check_alerts()
      }, 1000)
    },
    methods: {
      check_alerts: function () {
        var me = this
        this.list.forEach(function (row, i) {
          if (!row.alert_at || row.alert_confirmed) {
            return
          }
          var alertAt = (new Date(row.alert_at)).getTime()
          var now = (new Date()).getTime()
          if (now >= alertAt) {
            alertSound.play()
            Vue.set(me.list[i], 'alert_confirmed', true)
            setTimeout(function () {
              window.confirm(row.title)
              alertSound.pause()
            }, 100)
          }
          // console.log(row.alert_at)
        })
      },
      merge: function () {
        var current = this.current
        if (!current.title && (current.title !== 0)) return
        if (current.id || current.id === 0) {
          var index = this.find_index(current.id)
          console.log('index', index)
          Vue.set(this.list, index, Object.assign({}, current))
        } else {
          console.log(2, current.id)
          var todo = Object.assign({}, current)
          todo.id = this.maxId++
          console.log(todo.id, this.maxId, todo)
          this.list.push(todo)
        }
        this.current = {}
        console.log(current, this.current)
      },
      remove: function (id) {
        var index = this.find_index(id)
        this.list.splice(index, 1)
        console.log(this.list)
      },
      update: function (todo) {
        this.current = Object.assign({}, todo)
      },
      find_index: function (id) {
        return this.list.findIndex(function (item) {
          return item.id === id
        })
      },
      toggle_complete: function (id) {
        var index = this.find_index(id)
        Vue.set(this.list[index], 'completed', !this.list[index].completed)
      },
      toggle_detail: function (id) {
        var index = this.find_index(id)
        Vue.set(this.list[index], 'show_detail', !this.list[index].show_detail)
      }
    },
    // 监控数据变化
    watch: {
      list: {
        deep: true,
        handler: function (n, o) {
          if (n) {
            window.ms.set('list', n)
          } else {
            window.ms.set('list', [])
          }
        }
      },
      maxId: {
        deep: true,
        handler: function (n, o) {
          window.ms.set('maxId', n)
        }
      }
    }
  })
  Vue.use(vm)
})()

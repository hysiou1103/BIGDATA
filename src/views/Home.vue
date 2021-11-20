<template>
  <div class="wrap">
    <div class="home">
      <loading :active.sync="isLoading"></loading>
      <div class="row preFadeIn">
        <div class="col-2">
          <router-link to="/" class="logo"></router-link>
          <h1>109年人口戶數及性別</h1>
        </div>
        <div class="col-8">
          <div class="selectGroup">
            <label for="city">地區</label>
            <select id="city" v-model="keyWord">
              <option value="default" selected disabled>請選擇欲查詢地區</option>
              <option :value="item" v-for="(item,key) in city" :key="key">{{ item }}</option>
            </select>
          </div>
          <div class="chartDiv" v-if="keyWord!=='default'">
            <small>※ 移動到圖表上，可以獲得更詳細的資訊哦！<i class="far fa-smile-beam"></i></small>
            <Chart :chart-data="chartdata" :option="options" />
          </div>
          <div class="empty" v-else>
            <p>
              <a href="#" @click.prevent="chosen"><i class="far fa-hand-point-up"></i></a>
               使用下拉選單，小幫手會協助您查詢資料哦！
              <a href="#" @click.prevent="chosen"><i class="far fa-hand-point-up"></i></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/Chart.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'Home',
  components: {
    Chart,
    Loading
  },
  data () {
    return {
      isLoading: false,
      houseHold: [],
      city: [],
      keyWord: 'default',
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'bottom'
        },
        layout: {
          padding: {
            top: 20
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 10,
              max: 90,
              min: 0,
              padding: 1
            }
          }]
        }
      }
    }
  },
  methods: {
    chosen () {
      document.querySelector('select').focus();
    }
  },
  computed: {
    chartdata () {
      const vm = this
      const filterData = vm.houseHold.filter((item) =>
        item.site_id.match(vm.keyWord)
      )
      function calcuFn (term) {
        return filterData.reduce((acc, current) => {
          return acc + parseInt(current[term])
        }, 0)
      }
      function calcuPercent (a, b) {
        return Math.round([a / (a + b)] * 100)
      }
      const dataObj = {
        ordinaryMen: calcuPercent(calcuFn('household_ordinary_m'), calcuFn('household_ordinary_f')),
        ordinaryWomen: calcuPercent(calcuFn('household_ordinary_f'), calcuFn('household_ordinary_m')),
        householdMen: calcuPercent(calcuFn('household_single_m'), calcuFn('household_single_f')),
        householdWomen: calcuPercent(calcuFn('household_single_f'), calcuFn('household_single_m'))
      }
      const chartdata = {
        labels: ['共同生活戶', '獨立生活戶'],
        datasets: [
          {
            label: '女',
            data: [dataObj.ordinaryWomen, dataObj.householdWomen],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255, 99, 132, 1)'
          },
          {
            label: '男',
            data: [dataObj.ordinaryMen, dataObj.householdMen],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(54, 162, 235, 1)'
          }
        ]
      }
      return chartdata
    }

  },
  created () {
    const vm = this
    vm.isLoading = true
    vm.$http
      .get(`/api/v1/datastore/ODRP019/109?COUNTY=臺北市`)
      .then((res) => {
        console.log(res)
        if (res.data.responseMessage === '處理完成') {
          vm.houseHold = res.data.responseData
          const city = vm.houseHold.map((item) => { return item.site_id })
            .filter((item, index, arr) => {
              if (arr.indexOf(item) === index) { return item }
            })
          city.forEach((item) => { vm.city.push(item.substr(3)) })
          vm.isLoading = false
          vm.$nextTick(() => { document.querySelector(".preFadeIn").classList.add("fadeIn") })
        }
      })
      .catch((err) => {
        console.log(err)
        vm.isLoading = false
      })
  }
}
</script>

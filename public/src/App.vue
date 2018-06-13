<template>
    <div class="wrapper" :class="{ articlaMode : $route.path == '/article' }">
        <header>
            <div class="container">
                <div class="logo" @click="$router.push('/')">
                    <p>HaveFun</p>
                </div>
                <div class="search" @click="setToListPage">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Explore your own activities" @keyup="filterAll" v-model="searchText">
                </div>
            </div>
        </header>
        <div class="container main">
            <aside>
                <div class="filterGroup locationGroup" @click="collapseFilter('location')" :class="collapseStyle('location')">
                    <div class="filterTitleGroup">
                        <p class="filterTitle">Location</p>
                        <div class="filterCollapse">
                            <i class="fas fa-plus"></i>
                            <i class="fas fa-minus"></i>
                        </div>
                    </div>
                    <div class="filterControl">
                        <select class="locationFilter" v-model="nowLocation" @change="filterAll">
                            <option v-for="location in locationArr">{{ location.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="filterGroup dateGroup" @click="collapseFilter('date')" :class="collapseStyle('date')">
                    <div class="filterTitleGroup">
                        <p class="filterTitle">Date</p>
                        <div class="filterCollapse">
                            <i class="fas fa-plus"></i>
                            <i class="fas fa-minus"></i>
                        </div>
                    </div>
                    <div class="filterControl">
                        <table>
                            <tr>
                                <th>from</th>
                                <td>
                                    <input type="date" @change="filterAll" v-model="startTime">
                                </td>
                            </tr>
                            <tr>
                                <th>to</th>
                                <td>
                                    <input type="date" @change="filterAll" v-model="endTime">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="filterGroup categoryGroup" @click="collapseFilter('category')" :class="collapseStyle('category')">
                    <div class="filterTitleGroup">
                        <p class="filterTitle">Categories</p>
                        <div class="filterCollapse">
                            <i class="fas fa-plus"></i>
                            <i class="fas fa-minus"></i>
                        </div>
                    </div>
                    <div class="filterControl">
                        <ul>
                            <li v-for="category in categoryArr">
                                <label class="checkbox" :class="chackBoxStyle(category)">
                                    <input type="checkbox" style="display:none" v-model="category.value" @click="filterAll(category)">
                                    <i class="fas fa-check"></i>
                                </label>
                                <p>{{ category.name }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            <article>
                <List
                    v-show="$route.path == '/'"
                    :now-show-page="nowShowPage"
                    :filter-list-amout="filterListAmout"
                    :total-page="totalPage"
                    :now-page="nowPage"
                    :all-kind-filter="allKindFilter"
                    @changePage="changePage"
                    @removeFilter="removeFilter"
                ></List>
                <Article
                    v-show="$route.path == '/article'"
                    :activity-list="activityList"
                ></Article>
            </article>
        </div>
    </div>
</template>

<script>
window._ = require('lodash');
import List from './List';
import Article from './Article';
export default {
  data () {
    return {
        activityList : [],
        filterActivityList : [],
        categoryArr : [],
        locationArr : [],
        nowLocation : 'All',
        onePageData : 3,
        dataAfterCut : [],
        nowShowPage : [],
        totalPage : 0,
        nowPage : 0,
        startTime: '',
        endTime: '',
        searchText : '',
        expandFilter : 'location',
        allKindFilter : {},
    }
  },
  components : {
      List , Article
  },
  computed: {
      filterListAmout() {
          return this.filterActivityList.length;
      },
  },
  created() {
      this.fetchData();
  },
  methods: {
      testFunction() {
        let obj = {
            activity1: {
                "category" : "technology",
                "content" : "Casper and Sharding are both the important proposals to solve the performance issue on the Ethereum. In this meetup, two researchers from Ethereum foundation, Hsiao-Wei and Chih-Cheng, will give us the latest information about these two protocols.",
                "endTime" : "2018/6/12",
                "location" : "Taipei",
                "orgnization" : "Taipei Ethereum Meetup",
                "picture" : "dist/picture/01.jpg",
                "startTime" : "2018/6/13",
                "title" : "Ethereum dev update & Token Model"
            }
        }
        let arr = [];
        for (const key in obj) {
            let activity = obj[key];
            activity.key = key;
            arr.push(activity);
        }
        this.activityList = arr;
        this.filterActivityList = arr;
        this.categoryArr = this.setFilterArr(this.activityList , 'category');
        this.locationArr = this.setFilterArr(this.activityList , 'location');
        this.cutPage();
        this.changePage(1);
      },
      fetchData() {
        axios.get('https://next.json-generator.com/api/json/get/41GBuXueS').then( rs => {
            let arr = rs.data;
            arr = arr.map(activity => {
                return {
                    ...activity,
                    endTime : moment(activity.startTime).add(activity.duringDay, 'days').format('YYYY/M/DD')
                }
            })
            this.activityList = arr;
            this.filterActivityList = arr;
            this.categoryArr = this.setFilterArr(this.activityList , 'category');
            this.categoryArr.forEach(category => category.disable = category.name != 'All');
            this.locationArr = this.setFilterArr(this.activityList , 'location');
            this.cutPage();
            this.changePage(1);
        } );
      },
      setFilterArr(list , filter) {
        let newArr = _.uniqBy(list , filter);
        let newFilterArr = [
            {
                name : 'All',
                value : true,
            }
        ]
        newArr.map( activity => {
            let obj = {
                name : activity[filter],
                value : false
            };
            newFilterArr.push(obj);
        });
        return newFilterArr;
      },
      chackBoxStyle(category) {
          if(category.disable) return 'disable';
          return category.value ? 'active' : undefined;
      },
      cutPage() {
          let mainArr = [];
          let smallArr = [];
          this.filterActivityList.map( (activity,i) => {
              if(i % this.onePageData != 0 || i == 0){
                  smallArr.push(activity);
              }else{
                  mainArr.push(smallArr);
                  smallArr = [activity];
              }
          } );
          if(this.filterActivityList.length <= this.onePageData) mainArr.push(smallArr);
          this.totalPage = mainArr.length;
          this.dataAfterCut = mainArr;
      },
      changePage(page) {
          if(page == 0) return;
          if(page > this.totalPage) return;
          this.nowPage = page;
          page -= 1;
          this.nowShowPage = this.dataAfterCut[page];
      },
      changeLocation() {
          if(this.nowLocation == 'All'){
                this.filterActivityList = this.activityList;
          }else{
                this.filterActivityList = this.activityList.filter(activity => activity.location == this.nowLocation);
          }
      },
      filterDate() {
        if(!this.startTime || !this.endTime){
            this.filterActivityList = this.filterActivityList;
        }else{
            this.filterActivityList = this.filterActivityList.filter(activity => {
                let start = moment(activity.startTime);
                let filterStart = moment(this.startTime);
                let end = moment(activity.endTime);
                let filterEnd = moment(this.endTime);
                return filterStart.isBefore(start) && filterEnd.isAfter(end);
            });
        }
      },
      filterCategory(fcategory) {
        if(!fcategory) return;
        if(fcategory.disable) return;
        if(fcategory.name == 'All') return this.setCheckBoxValue(fcategory);
        let cateAmount = 0;
        this.categoryArr.map(category => { cateAmount += category.value; });
        if(cateAmount == 0){
            this.categoryArr[0].value = true;
            return this.setCheckBoxValue(this.categoryArr[0]);
        }
        this.filterActivityList = this.filterActivityList.filter(activity => {
            let boolArr = [];
            let amount = 0;
            this.categoryArr.map(category => {
                if(category.value) boolArr.push(activity.category == category.name);
            });
            boolArr.map(bool => amount += bool);
            return amount > 0;
        });
      },
      setCheckBoxValue(fcategory) {
            if(fcategory.value){
                this.categoryArr = this.categoryArr.map(category =>{
                    if(category.name != 'All'){
                        return {
                            ...category,
                            value : false,
                            disable : true,
                        }
                    }else{
                        return category
                    }
                });
                return;
            }else{
                this.categoryArr = this.categoryArr.map(category =>{
                    if(category.name != 'All'){
                        return {
                            ...category,
                            value : false,
                            disable : false,
                        }
                    }else{
                        return category
                    }
                });
        }
      },
      searchTextFun() {
          if(this.searchText == '') return;
          this.filterActivityList = this.filterActivityList.filter(activity => activity.title.includes(this.searchText));
      },
      filterAll(category) {
          this.changeLocation();
          this.filterDate();
          this.$nextTick(()=>{
              if(category){
                  this.searchTextFun();
                  if(!category.target){
                      this.filterCategory(category);
                      if(category.disable) return;
                  }
              }
              this.cutPage();
              this.changePage(1);
              this.setAllKindFilterArr();
          })
      },
      collapseFilter(type) {
          this.expandFilter = type;
      },
      collapseStyle(type) {
          return this.expandFilter == type ? 'expand' : undefined;
      },
      removeFilter(filter,key){
          switch (key) {
              case 'location':
                  this.nowLocation = 'All';
                  this.filterAll();
                  break;
              case 'time':
                  this.startTime = '';
                  this.endTime = '';
                  this.filterAll();
                  break;
              case 'searchText':
                  this.searchText = '';
                  this.filterAll();
                  break;
              case 'category':
                  let fcategory = {
                      name : filter,
                      value : false,
                      disable : false
                  }
                  this.categoryArr = this.categoryArr.map(category => {
                      if(category.name == fcategory.name) return fcategory;
                      return category;
                  });
                  this.filterAll(fcategory);
                  break;
              default:
                  break;
          }
      },
      setAllKindFilterArr() {
          this.allKindFilter = {};
          let categoryArr = [];
          this.categoryArr.map(category => {
              if(category.name == 'All') return;
              category.value ? categoryArr.push(category.name) : undefined;
          })
          if(this.startTime && this.endTime) this.allKindFilter.time = `${this.startTime} - ${this.endTime}`;
          if(this.nowLocation != 'All') this.allKindFilter.location = this.nowLocation;
          if(this.searchText != '') this.allKindFilter.searchText = this.searchText;
          this.allKindFilter = {
              ...this.allKindFilter,
              category : categoryArr
          };
      },
      setToListPage() {
          if(this.$route.path == '/article') this.$router.push('/');
      }
  }
}
</script>

<style lang="scss">
    @import url(https://fonts.googleapis.com/css?family=Oswald);
    *{
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: arial;
    }
    div,aside,article,header{
        box-sizing: border-box;
    }
    input,select{
        border: none;
        padding: 5px;
        outline: none;
    }
    label.checkbox{
        width: 15px;
        height: 15px;
        background-color: #fff;
        display: inline-block;
        border-radius: 2px;
        cursor: pointer;
        i{
            display: none;
        }
        &.disable{
            background-color: #9b9b9b;
            cursor: not-allowed;
        }
        &.active{
            text-align: center;
            i{
                line-height: 15px;
                font-size: 10px;
                display: block;
            }
            background-color: #7828B4;
            color: #fff;
        }
    }
    .article{
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        .picture{
            background-position: center;
            background-size: cover;
        }
        .title{
            margin: 10px 0;
            color: #9013FE;
        }
        .content{
            line-height: 1.5;
            margin: 10px 0;
            text-overflow: ellipsis;
            height: 100px;
            overflow: hidden;
        }
        .orgAndCategory{
            display: flex;
            padding: 15px 0;
            .category{
                background-color: #D7D7D7;
                color: #fff;
                padding: 2px 10px;
                border-radius: 10px;
                margin: 0 0 0 10px;
            }
            .orgnization{
                font-weight: bold;
                color: #000000;
            }
        }
        .locAndTime{
            display: flex;
            p{
                color: #9B9B9B;
            }
            i{
                color: #000;
                margin: 0 5px 0 0;
            }
            .item{
                display: flex;
                &.time{
                    margin: 0 0 0 20px;
                }
            }
        }
        .information{
            background-color: #fff;
        }
    }
    header{
        background-color: #7828B4;
        padding: 20px;
        .container{
            display: flex;
            align-items: center;
            .logo{
                width: 25%;
                color: #fff;
                font-family: 'Oswald', sans-serif;
                font-size: 30px;
                letter-spacing: 2px;
                font-weight: bold;
                padding: 20px 40px;
                margin: -20px 0;
                cursor: pointer;
            }
            .search{
                margin: 0 0 0 20px;
                border-bottom: 1px solid #fff;
                padding: 5px;
                width: 30%;
                i{
                    color: #fff;
                }
                ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                    color: rgba(255,255,255,0.5);
                }
                input{
                    font-style: italic;
                    color: #fff;
                    background-color: transparent;
                    border: none;
                    width: 80%;
                }

            }
        }
    }
    .wrapper{
        background-color: #f2f2f2;
        min-height: 120vh;
    }
    .container{
        margin: auto;
        max-width: 1200px;
        display: flex;
        aside{
            background-color: #EBEBEB;
            width: 25%;
            .filterGroup{
                padding: 10px 20px;
                border-bottom: 1px solid #D7D7D7;
                .filterCollapse{
                    display: none;
                }
                .filterTitle{
                    font-weight: bold;
                    margin: 10px 0;
                }
                &.locationGroup{
                    .locationFilter{
                        width: 100%;
                    }
                }
                &.dateGroup{
                    table{
                        width: calc( 100% - 10px);
                        th{
                            font-weight: normal;
                            padding: 0 5px;
                            text-align: right;
                        }
                        td{
                            padding: 5px 0;
                            input{
                                width: 100%;
                            }
                        }
                    }
                }
                &.categoryGroup{
                    text-transform: capitalize;
                    border-bottom:none;
                    ul{
                        li{
                            display: flex;
                            align-items: center;
                            padding: 5px 0;
                            p{
                                margin: 0 0 0 5px;
                            }
                        }
                    }
                }
            }
        }
        article{
            padding: 20px;
            width: 75%;
            .filterResult{
                .resultText{
                    font-weight: bold;
                    .amount{
                        color: #7828B4;
                    }
                }
                ul.filterItem{
                    display: flex;
                    color:#9013FE;
                    margin: 10px 0 0 0;
                    flex-wrap: wrap;
                    li{
                        border: 1px solid #9013FE;
                        border-radius: 30px;
                        padding: 10px;
                        display: flex;
                        margin: 10px 10px 0 0;
                        align-items: center;
                        font-style: italic;
                        cursor: pointer;
                        &:hover{
                            background-color: #9013FE;
                            color: #fff;
                            border-color: #fff;
                            a{
                                border-color: #fff;
                            }
                        }
                        a{
                            margin: 0 0 0 10px;
                            border: 1px solid #9013fe;
                            border-radius: 50%;
                            width: 20px;
                            height: 20px;
                            text-align: center;
                            cursor: pointer;
                            i{
                                line-height: 20px;
                            }
                        }
                    }
                }
            }
            .articleList{
                width: 100%;
                ul{
                    li.article{
                        display: flex;
                        width: 100%;
                        margin: 20px 0;
                        &:hover{
                            box-shadow: 0 0 10px rgba(0,0,0,.2);
                        }
                        cursor: pointer;
                        .picture{
                            flex: 1;
                        }
                        .information{
                            padding: 20px;
                            flex: 2;
                        }
                    }
                }
            }
            .pagination{
                display: flex;
                justify-content: flex-end;
                ul{
                    display: flex;
                    li{
                        background-color: #fff;
                        padding: 10px 15px;
                        border: 1px solid #ECEEEF;
                        cursor: pointer;
                        color: #9013FE;
                        &:hover{
                            background-color: #9013FE;
                            color: #fff;
                        }
                        &.nowPage{
                            background-color: #9013FE;
                            color: #fff;
                        }
                        &.disable{
                            color: #777777;
                            &:hover{
                                background-color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width : 996px){
        header{
            .container{
                .logo{
                    width: 40%;
                }
            }
        }
        .container{
            aside{
                width: 40%;
                .filterGroup{
                    padding: 10px 40px;
                    .filterTitle{
                        font-size: 18px;
                    }
                }
            }
            article{
                width: 60%;
                .filterResult .resultText{
                    font-size: 25px;
                }
                .articleList  ul li.article{
                    display: block;
                    .picture{
                        width: 100%;
                        padding-top: 42%;
                    }
                    .information{
                        .title{
                            font-size: 20px;
                        }
                        .content{
                            height: 60px;
                            font-size: 20px;
                        }
                    }
                }
            }
        }
        header .container .search{
            input{
                font-size: 20px;
            }
        }
    }
    @media screen and (max-width : 760px){
        header{
            background-color: transparent;
            padding: 0;
            .container{
                display: block;
                .logo{
                    text-align: center;
                    background-color: #7828B4;
                    padding: 10px 0;
                    width: 100%;
                    font-size: 25px;
                    margin: 0;
                }
                .search{
                    border-bottom-color: #000;
                    margin: 10px 20px;
                    padding: 10px 0 5px 0;
                    text-align: center;
                    width: 90%;
                    i{
                        color: #000;
                    }
                    ::-webkit-input-placeholder{
                        color: #9b9b9b;
                    }
                    input{
                        width: 80%;
                    }
                }
            }
        }
        .container{
            display: block;
            aside{
                width: 100%;
                background-color:#D7D7D7;
                .filterGroup{
                    border-bottom-color: #aaa;
                    .filterTitleGroup{
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .filterCollapse{
                            display: block;
                            color: #9b9b9b;
                            i.fa-plus{
                                display: block;
                            }
                            i.fa-minus{
                                display: none;
                            }
                        }
                    }
                    .filterControl{
                        overflow: hidden;
                        height: 0;
                        max-height: 0;
                        transition: max-height 1s;
                    }
                    &.expand{
                        background-color:#ebebeb;
                        .filterTitleGroup{
                            .filterCollapse{
                                i.fa-plus{
                                    display: none;
                                }
                                i.fa-minus{
                                    display: block;
                                }
                            }
                        }
                        .filterControl{
                            height: auto;
                            max-height: 500px;
                        }
                    }
                }
            }
            article{
                width: 100%;
                padding: 20px 40px;
                .pagination{
                    justify-content: center;
                    ul{
                        li{
                            padding: 10px;
                        }
                    }
                }
            }
        }
    }
</style>

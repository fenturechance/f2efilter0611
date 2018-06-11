<template>
    <div class="wrapper">
        <header>
            <div class="container">
                <div class="logo">
                    <p>HaveFun</p>
                </div>
                <div class="search">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Explore your own activities">
                </div>
            </div>
        </header>
        <div class="container main">
            <aside>
                <div class="filterGroup locationGroup">
                    <p class="filterTitle">Location</p>
                    <select class="locationFilter" v-model="nowLocation" @change="changeLocation">
                        <option v-for="location in locationArr">{{ location.name }}</option>
                    </select>
                </div>
                <div class="filterGroup dateGroup">
                    <p class="filterTitle">Date</p>
                    <table>
                        <tr>
                            <th>from</th>
                            <td>
                                <input type="date">
                            </td>
                        </tr>
                        <tr>
                            <th>to</th>
                            <td>
                                <input type="date">
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="filterGroup categoryGroup">
                    <p class="filterTitle">Categories</p>
                    <ul>
                        <li>
                            <label class="checkbox">
                                <input type="checkbox" style="display:none">
                                <i class="fas fa-check"></i>
                            </label>
                            <p>All</p>
                        </li>
                        <li v-for="category in categoryArr">
                            <label class="checkbox">
                                <input type="checkbox" style="display:none" v-model="category.value">
                            </label>
                            <p>{{ category.name }}</p>
                        </li>
                    </ul>
                </div>
            </aside>
            <article>
                <div class="filterResult">
                    <p class="resultText">Showing <span class="amount">{{ filterListAmout }}</span> results by...</p>
                    <ul class="filterItem">
                        <li>
                            <p></p>
                            <button>
                                <i></i>
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="articleList">
                    <ul>
                        <li v-for="activity in filterActivityList">
                            <div class="picture" :style="pictureSet(activity)"></div>
                            <div class="information">
                                <h3 class="title">{{ activity.title }}</h3>
                                <p class="content">{{ activity.content }}</p>
                                <div class="orgAndCategory">
                                    <h4 class="orgnization">{{ activity.orgnization }}</h4>
                                    <span class="category">{{ activity.category }}</span>
                                </div>
                                <div class="locAndTime">
                                    <div class="location item">
                                        <i class="fas fa-map-marker"></i>
                                        <p>{{ activity.location }}</p>
                                    </div>
                                    <div class="time item">
                                        <i class="far fa-calendar-alt"></i>
                                        <p>
                                            <span>{{ activity.startTime }}</span>
                                            <span class="timeTo">-</span>
                                            <span>{{ activity.endTime }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div class="pagination">
                        <ul>
                            <li>
                                <i></i>
                            </li>
                            <li></li>
                            <li>
                                <i></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>

<script>
window._ = require('lodash');
export default {
  data () {
    return {
        activityList : [],
        filterActivityList : [],
        categoryArr : [],
        locationArr : [],
        nowLocation : {}
    }
  },
  computed: {
      filterListAmout() {
          return this.filterActivityList.length;
      }
  },
  created() {
      this.testFunction();
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
      },
      pictureSet(activity){
          return {
              backgroundImage : `url(${activity.picture})`
          }
      },
      setFilterArr(list , filter) {
        let newArr = _.uniqBy(list , filter);

        return newArr.map( activity => {
            let obj = {
                name : activity[filter],
                value : false
            };
            return obj
        });
      },
      changeLocation() {
          
      }
  }
}
</script>

<style lang="scss">
    @import url(https://fonts.googleapis.com/css?family=Oswald);
    $asideWidth : 250px;
    *{
        margin: 0;
        padding: 0;
        list-style: none;
        font-family: arial;
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
    header{
        background-color: #7828B4;
        padding: 20px;
        .container{
            display: flex;
            align-items: center;
            .logo{
                width: $asideWidth;
                color: #fff;
                font-family: 'Oswald', sans-serif;
                font-size: 30px;
                letter-spacing: 2px;
                font-weight: bold;
            }
            .search{
                margin: 0 0 0 20px;
                border-bottom: 1px solid #fff;
                padding: 5px;
                i{
                    color: #fff;
                }
                input{
                    background-color: transparent;
                    border: none;
                }

            }
        }
    }
    .wrapper{
        background-color: #f2f2f2;
        min-height: 100vh;
    }
    .container{
        margin: auto;
        max-width: 1200px;
        display: flex;
        aside{
            background-color: #EBEBEB;
            width: $asideWidth;
            .filterGroup{
                padding: 10px 20px;
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
                        th{
                            font-weight: normal;
                            padding: 0 5px;
                            text-align: right;
                        }
                        td{
                            padding: 5px 0;
                        }
                    }
                }
                &.categoryGroup{
                    text-transform: capitalize;
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
            width: 100%;
            padding: 20px;
            .filterResult{
                .resultText{
                    font-weight: bold;
                    .amount{
                        color: #7828B4;
                    }
                }
            }
            .articleList{
                width: 100%;
                ul{
                    li{
                        display: flex;
                        width: 100%;
                        .picture{
                            width: 75%;
                            background-position: center;
                        }
                        .information{
                            background-color: #fff;
                            padding: 20px;
                            .title{
                                margin: 10px 0;
                                color: #9013FE;
                            }
                            .content{
                                line-height: 1.5;
                                margin: 10px 0;
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
                        }
                    }
                }
            }
        }
    }
</style>

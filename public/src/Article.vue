<template>
    <div>
        <div class="breadcrumb">
            <ul>
                <li class="home" @click="$router.push('/')">Explore</li>
                <li>{{ nowArticle.title }}</li>
            </ul>
        </div>
        <div class="article">
            <div class="picture" :style="imageStyle"></div>
            <div class="information">
                <h1 class="title">{{ nowArticle.title }}</h1>
                <div class="orgAndCategory">
                    <p class="orgnization">{{ nowArticle.orgnization }}</p>
                    <p class="category">{{ nowArticle.category }}</p>
                </div>
                <div class="locAndTime">
                    <div class="location item">
                        <i class="fas fa-map-marker"></i>
                        <p>{{ nowArticle.location }}</p>
                    </div>
                    <div class="time item">
                        <i class="far fa-calendar-alt"></i>
                        <p>
                            <span>{{ $store.getters.timeFormat(nowArticle,'startTime') }}</span>
                            <span class="timeTo">-</span>
                            <span>{{ $store.getters.timeFormat(nowArticle,'endTime') }}</span>
                        </p>
                    </div>
                </div>
                <div class="content">
                    <p>{{ nowArticle.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['activityList'],
        computed: {
            nowArticle() {
                return this.$store.state.nowPageArticle
            },
            imageStyle() {
                return {
                    backgroundImage : `url(${this.nowArticle.picture})`
                }
            }
        }
    }
</script>
<style lang="scss">
    .articlaMode{
        .breadcrumb{
            background-color: #ebebeb;
            padding: 10px;
            border-radius: 5px;
            ul{
                display: flex;
                li{
                    color: #aaa;
                    &.home{
                        color: #9013FE;
                        cursor: pointer;
                    }
                    &:after{
                        content: '/';
                        padding: 0 10px;
                        color: #aaa;
                    }
                    &:last-child{
                        &:after{
                            content: '';
                        }
                    }
                }
            }
        }
        .article{
            margin: 10px 0;
            .picture{
                width: 100%;
                padding-top: 50%;
            }
            .information{
                padding: 20px 40px;
            }
            .content{
                height: auto;
            }
        }
    }
    @media screen and (max-width : 760px){
        .articlaMode{
            header{
                .container{
                    position: relative;
                    display: flex;
                    background-color: #7828B4;
                    .logo{
                        padding: 10px 20px;
                        text-align: left;
                    }
                    .search{
                        border-bottom: none;
                        width: auto;
                        i{
                            color: #fff;
                        }
                        input{
                            display: none;
                        }
                    }
                }
            }
            .container{
                aside{
                    display: none;
                }
                article{
                    padding: 20px 20px;
                    .article{
                        margin: 0 -20px;
                    }
                }
            }
        }
    }
</style>

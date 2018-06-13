<template>
    <div>
        <div class="filterResult">
            <p class="resultText">Showing <span class="amount">{{ filterListAmout }}</span> results by...</p>
            <ul class="filterItem">
                <li v-for="(filter,key) in allKindFilter" v-if="key != 'category'" @click="$emit('removeFilter',filter,key)">
                    <p>{{ filter }}</p>
                    <a>
                        <i class="fas fa-times"></i>
                    </a>
                </li>
                <template v-for="(filter,key) in allKindFilter" v-if="key == 'category'">
                    <li v-for="category in filter" @click="$emit('removeFilter',category,'category')">
                        <p>{{ category }}</p>
                        <a>
                            <i class="fas fa-times"></i>
                        </a>
                    </li>
                </template>
            </ul>
        </div>
        <div class="articleList">
            <ul>
                <li v-for="activity in nowShowPage" class="article" @click="goToArticle(activity)">
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
                                    <span>{{ $store.getters.timeFormat(activity,'startTime') }}</span>
                                    <span class="timeTo">-</span>
                                    <span>{{ $store.getters.timeFormat(activity,'endTime') }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="pagination">
                <ul>
                    <li @click="changePage(nowPage - 1)" :class="controlStyle('previous')">
                        <i class="fas fa-angle-double-left"></i>
                    </li>
                    <li v-for="page in pageArr" :class="pageStyle(page)" @click="changePage(page)">
                        <span>{{ page }}</span>
                    </li>
                    <li @click="changePage(nowPage + 1)" :class="controlStyle('next')">
                        <i class="fas fa-angle-double-right"></i>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                offset : 3,
            }
        },
        props : ['nowShowPage','filterListAmout','totalPage','nowPage','allKindFilter'],
        computed : {
            pageArr() {
                let firstPage = 0;
                let lastPage = 0;
                if(this.totalPage <= (1 + this.offset * 2 ) ) {
                    firstPage = 1;
                    lastPage = this.totalPage;
                }else if(this.nowPage < (1 + this.offset * 2 )){
                    firstPage = 1;
                    lastPage = 1 + this.offset * 2;
                }else if(this.nowPage > this.totalPage - (1 + this.offset * 2 )){
                    firstPage = this.totalPage - (1 + this.offset * 2 );
                    lastPage = this.totalPage;
                }else{
                    firstPage = this.nowPage - this.offset;
                    lastPage = this.nowPage + this.offset;
                }
                let arr = [];
                for (let i = firstPage; i <= lastPage; i++) arr.push(i);
                return arr ;
            }
        },
        methods : {
            pictureSet(activity){
                return {
                    backgroundImage : `url(${activity.picture})`
                }
            },
            controlStyle(control) {
                switch (control) {
                    case 'previous':
                        return this.nowPage == 1 ? 'disable' : undefined;
                        break;
                    case 'next':
                        return this.nowPage == this.totalPage ? 'disable' : undefined;
                        break;
                    default:
                        break;
                }
            },
            pageStyle(page) {
                return this.nowPage == page ? 'nowPage' : undefined;
            },
            changePage(page) {
                this.$emit('changePage',page);
                this.goToScrollTop();
            },
            goToArticle(aritcle) {
                this.$store.state.nowPageArticle = { ...aritcle };
                this.$router.push('article');
                this.goToScrollTop();
            },
            goToScrollTop() {
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }
        }
    }
</script>
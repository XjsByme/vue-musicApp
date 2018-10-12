//路由配置
import Vue from 'vue'
import Router from 'vue-router'
//引入组件
import MyRecommend from '@/components/MyRecommend/MyRecommend'
import MySinger from '@/components/MySinger/MySinger'
import MyRank from '@/components/MyRank/MyRank'
import MySearch from '@/components/MySearch/MySearch'
//歌手详情页
import MySingerDetail from '@/components/MySingerDetail/MySingerDetail'
//推荐页歌曲详情
import Disc from '@/components/disc/disc'
import TopList from '@/components/toplist/toplist'
// 个人中心
import MyUser from '@/components/Myuser/Myuser'

//注册使用
Vue.use(Router)

export default new Router({
  mode: 'history', //去除url中#
  routes: [
  	{
      path: '/',
      redirect: '/recommend' //设置默认页面,即一打开就展示的页面
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: MyRecommend, //推荐页面
      children:[
        {
          path: ':id',
          name:'disc',
          component:Disc
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: MySinger,
      //子路由，歌手详情页
      children: [
        {
          path: ':id',
          name: 'singerdetail',
          component: MySingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: MyRank,
      children:[
        {
          path: ':id',
          name:'toplist',
          component:TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: MySearch,
      children: [
        {
          path: ':id',
          name: 'singerdetail',
          component: MySingerDetail
        }
      ]
    },
    // 个人中心
    {
      path:'/user',
      name: 'user',
      component: MyUser
    }
  ]
})

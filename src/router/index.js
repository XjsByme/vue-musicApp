//路由配置
import Vue from 'vue'
import Router from 'vue-router'
//引入组件
// import MyRecommend from '@/components/MyRecommend/MyRecommend'
// import MySinger from '@/components/MySinger/MySinger'
// import MyRank from '@/components/MyRank/MyRank'
// import MySearch from '@/components/MySearch/MySearch'
//歌手详情页
// import MySingerDetail from '@/components/MySingerDetail/MySingerDetail'
//推荐页歌曲详情
// import Disc from '@/components/disc/disc'
// import TopList from '@/components/toplist/toplist'
// 个人中心
// import MyUser from '@/components/Myuser/Myuser'

//注册使用
Vue.use(Router)

// 路由懒加载(异步)
const MyRecommend = (resolve) => {
  import('@/components/MyRecommend/MyRecommend').then((module) => {
    resolve(module)
  })
}
const MySinger = (resolve) => {
    import ('@/components/MySinger/MySinger').then((module) => {
        resolve(module)
    })
}
const MyRank = (resolve) => {
    import ('@/components/MyRank/MyRank').then((module) => {
        resolve(module)
    })
}
const MySearch = (resolve) => {
    import ('@/components/MySearch/MySearch').then((module) => {
        resolve(module)
    })
}
const MySingerDetail = (resolve) => {
    import ('@/components/MySingerDetail/MySingerDetail').then((module) => {
        resolve(module)
    })
}
const Disc = (resolve) => {
    import ('@/components/disc/disc').then((module) => {
        resolve(module)
    })
}
const TopList = (resolve) => {
    import ('@/components/TopList/TopList').then((module) => {
        resolve(module)
    })
}
const MyUser = (resolve) => {
    import ('@/components/MyUser/MyUser').then((module) => {
        resolve(module)
    })
}
//路由
export default new Router({
    mode: 'history', //去除url中#
    routes: [{
            path: '/',
            redirect: '/recommend' //设置默认页面,即一打开就展示的页面
        }, {
            path: '/recommend',
            name: 'recommend',
            component: MyRecommend, //推荐页面
            children: [{
                path: ':id',
                name: 'disc',
                component: Disc
            }]
        }, {
            path: '/singer',
            name: 'singer',
            component: MySinger,
            //子路由，歌手详情页
            children: [{
                path: ':id',
                name: 'singerdetail',
                component: MySingerDetail
            }]
        }, {
            path: '/rank',
            name: 'rank',
            component: MyRank,
            children: [{
                path: ':id',
                name: 'toplist',
                component: TopList
            }]
        }, {
            path: '/search',
            name: 'search',
            component: MySearch,
            children: [{
                path: ':id',
                name: 'singerdetail',
                component: MySingerDetail
            }]
        },
        // 个人中心
        {
            path: '/user',
            name: 'user',
            component: MyUser
        }
    ]
})

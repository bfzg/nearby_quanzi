<template>
  <view class="container">
    <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options" :collection="collectionList" field="user_id,title,description,province,content,article_status,last_comment_user_id,picurls,publish_date,last_modify_date" :where="queryWhere" :getone="true" :manual="true">
      <view v-if="error">{{error.message}}</view>
      <view v-else-if="loading">
        <uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
      </view>
      <view v-else-if="data">
        <view>
          <text>user_id</text>
          <text>{{data.user_id}}</text>
        </view>
        <view>
          <text>标题</text>
          <text>{{data.title}}</text>
        </view>
        <view>
          <text>文章摘要</text>
          <text>{{data.description}}</text>
        </view>
        <view>
          <text>发布省份</text>
          <text>{{data.province}}</text>
        </view>
        <view>
          <text>文章内容</text>
          <text>{{data.content}}</text>
        </view>
        <view>
          <text>文章状态</text>
          <text>{{options.article_status_valuetotext[data.article_status]}}</text>
        </view>
        <view>
          <text>last_comment_user_id</text>
          <text>{{data.last_comment_user_id}}</text>
        </view>
        <view>
          <text>封面大图</text>
          <text>{{data.picurls}}</text>
        </view>
        <view>
          <text>发表时间</text>
          <uni-dateformat :threshold="[0, 0]" :date="data.publish_date"></uni-dateformat>
        </view>
        <view>
          <text>最后修改时间</text>
          <uni-dateformat :threshold="[0, 0]" :date="data.last_modify_date"></uni-dateformat>
        </view>
      </view>
    </unicloud-db>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  // 由schema2code生成，包含校验规则和enum静态数据
  import { enumConverter } from '../../js_sdk/validator/quanzi_article.js'
  const db = uniCloud.database()

  export default {
    data() {
      return {
        queryWhere: '',
        collectionList: "quanzi_article",
        loadMore: {
          contentdown: '',
          contentrefresh: '',
          contentnomore: ''
        },
        options: {
          // 将scheme enum 属性静态数据中的value转成text
          ...enumConverter
        }
      }
    },
    onLoad(e) {
      this._id = e.id
    },
    onReady() {
      if (this._id) {
        this.queryWhere = '_id=="' + this._id + '"'
      }
    },
    methods: {
      handleUpdate() {
        // 打开修改页面
        uni.navigateTo({
          url: './edit?id=' + this._id,
          events: {
            // 监听修改页面成功修改数据后, 刷新当前页面数据
            refreshData: () => {
              this.$refs.udb.loadData({
                clear: true
              })
            }
          }
        })
      },
      handleDelete() {
        this.$refs.udb.remove(this._id, {
          success: (res) => {
            // 删除数据成功后跳转到list页面
            uni.navigateTo({
              url: './list'
            })
          }
        })
      }
    }
  }
</script>

<style>
  .container {
    padding: 10px;
  }

  .btns {
    margin-top: 10px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-delete {
    margin-left: 10px;
  }
</style>

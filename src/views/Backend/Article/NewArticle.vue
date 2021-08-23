<template>
  <div class="MerchantAddArticle px-1 px-sm-5 py-4">
    <router-link
      :to="{ name: 'MerchantArticleList' }"
      class="text-muted d-block text-start mb-4"
    >
      <font-awesome-icon icon="long-arrow-alt-left" class="me-2" />回到文章列表
    </router-link>
    <Form ref="form" class="pe-5" v-slot="{ errors }" @submit="onSubmit">
      <div class="spin-wrap" v-if="dataLoading"><a-spin /></div>
      <main v-else>
        <Field
          name="標題"
          type="text"
          class="form-control mb-3 rounded"
          rules="required"
          :class="{ 'is-invalid': errors['標題'] }"
          v-model="title"
          placeholder="輸入標題"
        />
        <ErrorMessage name="標題" class="invalid-feedback pb-1 text-start" />
        <a-textarea
          validate="'required|string|min:10'"
          :class="{ 'is-invalid': errors['標題'] }"
          class="rounded "
          v-model:value="content"
          placeholder="請輸入文章內容"
          :auto-size="{ minRows: 12, maxRows: 20 }"
        />
      </main>
      <section class="bg-white mt-2 p-5 rounded">
        <div class="text-start pb-3 d-flex flex-column flex-md-row">
          <label for="active" class="text-right me-4">是否顯示: </label>
          <a-switch
            class="w-20 w-lg-auto"
            checked-children="開"
            un-checked-children="關"
            v-model:checked="isPublic"
          />
        </div>
        <div
          class="text-start pb-3 position-relative d-flex flex-column flex-md-row "
        >
          <label for="tag" class="text-right me-4">文章標籤: </label>
          <div class="d-inline-block d-flex flex-column flex-md-row">
            <a-tag
              class="me-2 p-1 tag w-lg-auto mb-2 mb-lg-0 flex-none"
              closable
              @close="onTagClick(i, true)"
              v-for="(tag, i) in tags"
              :key="`tag_' ${tag}`"
              ># {{ tag }}</a-tag>
            <div
              class="btn btn-outline-secondary p-1  w-20 w-lg-auto fs-6"
              @click="showDrawer = true"
            >
              <font-awesome-icon icon="plus" />
            </div>
          </div>
          <div
            v-if="showDrawer"
            class="drawer"
          >
            <a-drawer
              placement="top"
              :closable="true"
              :visible="showDrawer"
              :get-container="false"
              :wrap-style="{ position: 'absolute' }"
              @close="showDrawer = false"
            >
              <span>添加文章標籤</span>
              <a-input
                v-model:value="tagValue"
                placeholder="按下enter即可新增"
                @pressEnter="onTagClick"
              />
            </a-drawer>
          </div>
        </div>
        <div class="d-flex flex-column flex-md-row ">
          <label for="cover" class="text-start me-4">展示封面: </label>
          <div class="text-start">
            <a-radio-group v-model:value="isCover" class="mb-3">
              <a-radio :value="1">無封面</a-radio>
              <a-radio :value="2">單圖</a-radio>
            </a-radio-group>
            <a-upload
              v-if="isCover === 2"
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :customRequest="uploadImg"
              :show-upload-list="false"
              :before-upload="beforeUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="預設圖片" />
              <div v-else>
                <loading-outlined v-if="loading" />
                <plus-outlined v-else />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </div>
        </div>
      </section>
      <button
        type="submit"
        class="btn btn-danger mt-4 text-white"
        :loading="sendLoading"
      >
        送出
      </button>
    </Form>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { onMounted, reactive, ref, toRefs } from 'vue'

import { AddArticile, EditArticile, GetMArticile } from '@/API/MerchantArticle'
import { UploadImg } from '@/API/MerchantProduct'

import { Toast } from '@/utils/UseSwal'

import { message } from 'ant-design-vue'

export default {
  name: 'MerchantAddArticle',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const showDrawer = ref(false)
    onMounted(() => {
      if (route.params.id) {
        getData(route.params.id)
      }
    })
    const form = reactive({
      title: '',
      isPublic: false,
      content: '',
      isCover: 1,
      tags: [],
      create_at: 1555459220,
      author: 'alice',
      imageUrl: null
    })
    const loading = reactive({
      uploadLoading: false,
      dataLoading: false,
      sendLoading: false
    })
    const getData = id => {
      loading.dataLoading = true
      GetMArticile(id).then(res => {
        loading.dataLoading = false
        if (!res.data.success) return
        const { article } = res.data
        Object.assign(form, article)
      })
    }
    const onSubmit = () => {
      loading.sendLoading = true
      route.params.id ? edit() : add()
    }
    const edit = () => {
      if (form.isCover === 1) form.imageUrl = null
      EditArticile(form).then(res => {
        loading.sendLoading = false
        if (!res.data.success) return
        Toast.fire({ icon: 'success', title: '編輯成功' })
        router.push({ name: 'MerchantArticleList' })
      })
    }
    const add = () => {
      if (form.isCover === 1) form.imageUrl = null
      AddArticile(form).then(res => {
        loading.sendLoading = false
        if (!res.data.success) return
        Toast.fire({ icon: 'success', title: '加入成功' })
        router.push({ name: 'MerchantArticleList' })
      })
    }
    const tagValue = ref('')
    const onTagClick = (i, delet) => {
      if (delet) {
        form.tags.splice(i, 1)
      } else {
        form.tags.push(tagValue.value)
        tagValue.value = ''
      }
    }
    const uploadImg = e => {
      loading.uploadLoading = true
      const file = e.file
      const formData = new FormData()
      formData.append('file-to-upload', file)
      UploadImg(formData).then(res => {
        loading.uploadLoading = false
        const { imageUrl, success } = res.data
        if (!success) {
          e.target.value = ''
          return
        }
        form.imageUrl = imageUrl
      })
    }

    const beforeUpload = file => {
      const isJpgOrPng =
        file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) message.error('只允許上傳jpg,png格式!')

      const isLt2M = file.size / 1024 / 1024 < 1

      if (!isLt2M) message.error('圖片必須小於 1MB!')

      return isJpgOrPng && isLt2M
    }
    return {
      beforeUpload,
      uploadImg,
      onTagClick,
      showDrawer,
      tagValue,
      ...toRefs(form),
      ...toRefs(loading),
      onSubmit
    }
  }
}
</script>

<style lang="sass" scoped>
.ant-upload img
  width: 100%

$colors: $primary, $secondary, $success, $black
$repeat: 4 // How often you want the pattern to repeat.

@for $i from 1 through $repeat
  .tag:nth-child(#{length($colors)}n + #{$i})
    background: nth($colors, random(length($colors)))
    color: #333333
.drawer
  position: absolute
  left: 10rem
  width: 100%
  max-width: 200px
  height: 8rem
  overflow: hidden
  border: 1px solid #ebedf0

</style>

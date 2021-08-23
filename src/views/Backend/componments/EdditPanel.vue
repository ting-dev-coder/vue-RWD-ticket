<template>
  <a-drawer
    :title="translate[type] + '產品'"
    placement="right"
    v-model:visible="visible"
    width="80%"
    :after-visible-change="afterVisibleChange"
  >
    <div class="editpopup bg-white">
      <main class="d-flex">
        <div class="img-part">
          <label for="avatar">主要圖片</label>
          <div class="position-relative main-pic-wrap">
            <img
              v-if="form.imageUrl"
              :src="form.imageUrl"
              alt="產品圖片"
              class="main-pic"
              @click="removePic()"
            />
            <img
              v-else
              src="~@imgs/default_img.png"
              alt="預設圖片"
              class="main-pic"
            />
            <div class="w-100 removePrompt" @click="removePic"><span class="text">點擊移除</span></div>
          </div>
          <a href="javascript:;" class="file btn btn-primary p-1 m-2">+ 選擇檔案
            <input type="file" name="" id="" @change="uploadImg" />
          </a>
        </div>
        <form @submit.prevent="confirm">
          <label class="pr-3 h5" for="rate">評價星級(點擊選擇)</label>
          <div class="text-right">
            <font-awesome-icon
              icon="star"
              class="start mx-1"
              :class="{ active: start >= i }"
              aria-hidden="true"
              v-for="i in 5"
              :key="`rate_${i}`"
              @mouseover="start = i"
              @mouseleave="start = form.rate"
              @click="rate(i)"
            />
            {{ form.rate || "尚未評價" }} <span v-show="form.rate">星</span>
          </div>
          <div
            class="form-item"
            v-for="(item, idx) in formList"
            :key="`edit_list_${idx}`"
            :class="item.name"
          >
            <label :for="item.name" class="h5 pb-2">{{ item.title }}</label>
            <textarea
              v-if="item.type === 'textarea'"
              name="item.name"
              v-model="form[item.name]"
              :placeholder="'請輸入' + item.title"
            />
            <input
              v-else
              :type="item.type"
              :name="item.name"
              v-model.number="form[item.name]"
              min="0"
              :placeholder="'請輸入' + item.title"
            />
          </div>
          <span class="text-left pr-3 h5" style="line-height:38px;">活動日期:
          </span>
          <v-date-picker
            v-model="form.range"
            mode="dateTime"
            :masks="{ input: 'YYYY-MM-DD h:mm A' }"
            is-range
          >
            <template v-slot="{ inputValue, inputEvents, isDragging }">
              <div
                class=" d-flex flex-column flex-sm-row justify-start items-center"
              >
                <div class="position-relative flex-grow-1">
                  <input
                    class="flex-grow-1 p-2 bg-light border rounded"
                    :class="{ 'text-muted': isDragging }"
                    :value="inputValue.start"
                    v-on="inputEvents.start"
                  />
                </div>
                <span class="flex-shrink-0 m-2">
                  <svg
                    class="w-4 h-4 stroke-current text-gray-600"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <div class="position-relative flex-grow-1">
                  <input
                    class="flex-grow-1 p-2 bg-light border rounded"
                    :class="{ 'text-muted': isDragging }"
                    :value="inputValue.end"
                    v-on="inputEvents.end"
                  />
                </div>
              </div>
            </template>
          </v-date-picker>
          <div class="form-item-active w-100 pt-3">
            <input type="checkbox" v-model="form.is_enabled" name="active" />
            <label for="active" class="pl-3 h5">是否啟用</label>
          </div>
          <div class="w-100 text-right">
            <button
              type="button"
              class="btn btn-outline-secondary mr-3"
              @click="hide"
            >
              取消
            </button>
            <button type="submit" class="btn btn-primary">確認</button>
          </div>
        </form>
      </main>
    </div>
  </a-drawer>
</template>

<script>
import { AddPouduct, EditPouduct, UploadImg } from '@/API/MerchantProduct'

import { watch, reactive, ref } from 'vue'

export default {
  props: {
    list: {
      type: Object,
      require: true
    },
    type: {
      type: String,
      require: true
    }
  },
  setup (props, { emit }) {
    const visible = ref(false)
    const translate = reactive({
      edit: '編輯',
      add: '新增'
    })
    const formList = reactive([
      {
        type: 'text',
        title: '標題',
        name: 'title'
      },
      {
        type: 'text',
        title: '分類',
        name: 'category'
      },
      {
        type: 'text',
        title: '單位',
        name: 'unit'
      },
      {
        type: 'number',
        title: '原價',
        name: 'origin_price'
      },
      {
        type: 'number',
        title: '售價',
        name: 'price'
      },
      {
        type: 'textarea',
        title: '產品描述',
        name: 'description'
      },
      {
        type: 'textarea',
        title: '說明內容',
        name: 'content'
      }
    ])
    const start = ref(0)
    const form = reactive({
      title: '',
      category: '',
      origin_price: 0,
      price: 0,
      unit: '',
      description: '',
      content: '',
      is_enabled: 1,
      imageUrl: '',
      imagesUrl: [],
      id: '',
      range: {
        start: new Date(),
        end: new Date().setFullYear(new Date().getFullYear() + 1)
      },
      rate: 0
    })
    watch(props.list, (newVal) => {
      const obj = newVal.selected
      const newObj = JSON.parse(JSON.stringify(obj))
      newObj.is_enabled = newObj.is_enabled === 1
      newObj.rate = newObj.rate ? newObj.rate : 0
      Object.assign(form, newObj)
      start.value = form.rate
    })
    const rate = idx => {
      start.value = idx
      form.rate = idx
    }
    const confirm = () => {
      const callFunction = {
        edit: editProduct,
        add: addPouduct
      }
      form.is_enabled = form.is_enabled ? 1 : 2
      callFunction[props.type]()
    }
    const editProduct = () => {
      EditPouduct(form)
        .then(res => {
          const { success } = res.data
          if (!success) return
          emit('getData')
          hide()
        })
        .catch(error => {
          console.log(error)
        })
    }
    const addPouduct = () => {
      AddPouduct(form)
        .then(res => {
          const { success } = res.data
          if (!success) return
          emit('getData')
          hide()
        })
        .catch(error => {
          console.log(error)
        })
    }
    const open = () => {
      visible.value = true
    }
    const hide = () => {
      form.imageUrl = []
      visible.value = false
    }
    const uploadImg = e => {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', file)
      UploadImg(formData).then(res => {
        if (!res) {
          e.target.value = ''
          return
        }
        const data = res.data
        form.imageUrl = data.imageUrl
      })
    }
    const removePic = () => {
      form.imageUrl = ''
    }
    return {
      removePic,
      visible,
      open,
      hide,
      formList,
      confirm,
      form,
      translate,
      start,
      rate,
      uploadImg
    }
  }
}
</script>

<style lang="sass" scoped>
.removePrompt
  position: absolute
  top: 0
  left: 0
  right: 0
  width: 100%
  height: 100%
  transition: 1s ease
  opacity: 0
  background: #000
  .text
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%,-50%)
    font-size: 1.5rem
    color: $gray-300
.removePrompt:hover
  opacity: 0.8
form
  padding: 0 1rem
  flex: 1
  height: 80%
  display: flex
  flex-wrap: wrap
  align-content: space-evenly

.form-item
  flex: 100%
  margin-bottom: 10px
  text-align: left
  box-sizing: border-box
  input,textarea
    padding: 5px 0 5px 10px
    border-radius: 5px
  input
    display: block
    width: 100%
    border: 1px solid grey
header
  margin-bottom: 0.965rem
  height: 40px
  line-height: 40px
  color: $white
  font-size: 1rem
  background: black
textarea
  width: 100%
  min-height: 125px
  max-height: 160px
  resize: vertical
.form-item-active
  align-items: center
  input[type=checkbox]
    width: 15px
    height: 15px
.img-part
  flex: 0.5
  padding: 1rem
  width: 50%
  .main-pic
    max-width: 100%
    height: auto
.editpopup
  z-index: 1000
  width: 70vw
  height: 75vh
  position: absolute
  left: 0
  top: 0
  right: 0
  bottom: 0
  margin: auto

.start
  width: 20px
  height: 20px
  cursor: pointer
  color: $gray-500
.start.active
  color: $primary

span strong
  color: #f60
  padding: 0 10px

.file
    position: relative

.file input
    position: absolute
    font-size: 100px
    right: 0
    top: 0
    opacity: 0

.file:hover
    background: $blue-100
    color: $blue-600
    text-decoration: none
.img:hover
</style>

<template>
  <a-drawer
    title="新增優惠卷"
    :placement="placement"
    :closable="false"
    width="50%"
    :visible="visible"
    @close="onClose"
  >
    <Form @submit="confirm" v-slot="{ errors }">
      <div
        class="form-item"
        v-for="(item, idx) in formList"
        :key="`edit_list_${idx}`"
        :class="item.name"
      >
        <label :for="item.name">{{ item.title }} :</label>
        <Field
          :type="item.type"
          :name="item.name"
          v-model.number="form[item.name]"
          :rules="item.rules"
          :class="{ 'is-invalid': errors[item.name] }"
          :placeholder="'請輸入' + item.name"
          mim="0"
        />
        <ErrorMessage :name="item.name" class="invalid-feedback" />
      </div>
      <label for="date" class="text-left">活動日期: </label>
      <v-date-picker
        v-model="form.range"
        mode="dateTime"
        :masks="masks"
        is-range
      >
        <template v-slot="{ inputValue, inputEvents, isDragging }">
          <div
            class="d-flex flex-column flex-sm-row justify-start items-center"
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
      <div class="text-left w-100">
        <input
          type="checkbox"
          v-model="form.is_enabled"
          name="active"
          class="mr-2"
        />
        <label for="active">是否啟用</label>
      </div>
      <div class="text-right w-100">
        <button
          type="button"
          class="btn btn-outline-secondary mr-2"
          @click="hide"
        >
          取消
        </button>
        <button type="submit" class="btn btn-primary ms-2">確認</button>
      </div>
    </Form>
  </a-drawer>
</template>

<script>
import { watch, reactive, ref, computed } from 'vue'

import { AddCoupon, EditCoupon } from '@/API/MercahntCoupon'

const isValidCode = value => {
  const phoneNumber = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{5,8}$/
  return phoneNumber.test(value)
    ? true
    : '優惠代碼至少要包含 数字和英文，長度5-8'
}

export default {
  name: 'voucherPanel',
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
    const translate = reactive({
      edit: '編輯',
      add: '新增'
    })
    const formList = reactive([
      {
        type: 'text',
        title: '標題',
        name: 'title',
        rules: 'required'
      },
      {
        type: 'text',
        title: '優惠卷代碼',
        name: 'code',
        rules: isValidCode
      },
      {
        type: 'number',
        title: '折扣',
        name: 'percent',
        rules: 'required'
      }
    ])
    const range = reactive({
      start: new Date(2020, 0, 6),
      end: new Date(2020, 0, 23)
    })
    const inputValue = reactive({
      start: '',
      end: ''
    })

    const form = reactive({
      id: '',
      title: '',
      is_enabled: 1,
      percent: 0,
      due_date: computed(() => form.range.end),
      code: '',
      range: {
        start: new Date(),
        end: new Date().setFullYear(new Date().getFullYear() + 1)
      }
    })
    watch(props.list, (newVal) => {
      const obj = newVal.selected
      const newObj = JSON.parse(JSON.stringify(obj))
      newObj.is_enabled = newObj.is_enabled === 1
      Object.assign(form, newObj)
    })
    const confirm = () => {
      form.due_date = form.range.end
      const callFunction = {
        edit: editCoupon,
        add: addCoupon
      }
      form.is_enabled = form.is_enabled ? 1 : 2
      callFunction[props.type]()
    }
    const editCoupon = () => {
      EditCoupon(form)
        .then(res => {
          const { success } = res?.data
          if (!success) return
          emit('getData')
          hide()
        })
        .catch(error => {
          console.log(error)
        })
    }
    const addCoupon = () => {
      AddCoupon(form)
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
    const visible = ref(false)
    const open = () => {
      visible.value = true
    }
    const hide = () => {
      visible.value = false
    }

    return {
      inputValue,
      range,
      open,
      hide,
      visible,
      formList,
      confirm,
      form,
      translate
    }
  }
}
</script>

<style lang="sass" scoped>
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
  min-height: 45px
  max-height: 80px
  resize: vertical
  input[type=checkbox]
    width: 15px
    height: 15px
.img_part
  flex: 0.5
  padding: 1rem
  width: 50%
  .main_pic
    max-width: 100%
    height: auto
</style>

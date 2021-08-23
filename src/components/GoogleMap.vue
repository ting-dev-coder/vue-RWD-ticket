<template>
  <div class="map-container border rounded w-100">
    <!--地圖呈現在此-->
    <div class="google-map" id="map" />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'

/* global google */
export default {
  name: 'Restaurants',
  setup () {
    const map = ref(null)
    const lat = ref(25.0325917)
    const lng = ref(121.5624999)
    onMounted(() => {
      initMap()
      setMarker()
    })
    const initMap = () => {
      // 透過 Map 物件建構子建立新地圖 map 物件實例，並將地圖呈現在 id 為 map 的元素中
      map.value = new google.maps.Map(document.getElementById('map'), {
        // 設定地圖的中心點經緯度位置
        center: { lat: lat.value, lng: lng.value },
        // 設定地圖縮放比例 0-20
        zoom: 15,
        // 限制使用者能縮放地圖的最大比例
        maxZoom: 20,
        // 限制使用者能縮放地圖的最小比例
        minZoom: 3,
        // 設定是否呈現右下角街景小人
        streetViewControl: false,
        // 設定是否讓使用者可以切換地圖樣式：一般、衛星圖等
        mapTypeControl: false
      })
      map.value.addListener('click', function () {
        window.open(
          'https://www.google.com/maps/search/?api=1&query=25.042420%2C121.544700'
        )
      })
    }

    const setMarker = () => {
      // 建立一個新地標
      // eslint-disable-next-line no-unused-vars
      const marker = new google.maps.Marker({
        // 設定地標的座標
        position: { lat: lat.value, lng: lng.value },
        // 設定地標要放在哪一個地圖
        map: map.value
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.google-map
  width: 100%
  height: 400px
</style>

'use strict';
import firebase from '~/plugins/firebase';

export const state = () => ({
});

export const actions = {
  async booking({ commit, state }) {
    // // 店舗の予約スケジュールに追加
    await firebase.firestore().collection('studio').doc(state.studioId).collection('reserveList').add({
      room: state.room,
      date: state.date,
      start: state.start,
      finish: state.finish,
    }).then(() => {
      $nuxt.$router.push('/thanks');
    }).catch((error) => {
      alert('注文にエラーが発生しました。再度ご試行ください。');
      console.error("Error writing document: ", error);
    });

    // 店舗の予約コアに追加
    await firebase.firestore().collection('studio').doc(state.studioId).collection('reserveList_core').add({
      name: state.name,
      room: state.room,
      date: state.date,
      start: state.start,
      finish: state.finish,
    }).then(() => {
      $nuxt.$router.push('/thanks');
    }).catch((error) => {
      alert('注文にエラーが発生しました。再度ご試行ください。');
      console.error("Error writing document: ", error);
    });

    // ユーザの注文履歴に追加
    await firebase.firestore().collection('user').doc(firebase.auth().currentUser.uid).collection('reserve_history').add({
      name: state.name,
      room: state.room,
      date: state.date,
      start: state.start,
      finish: state.finish,
    }).catch((error) => {
      alert('注文にエラーが発生しました。再度ご試行ください。');
      console.error("Error writing document: ", error);
    });
  },
  addUsual({ commit }, order) {
    const now = new Date();
    const s = now.getSeconds() + '';
    const mi = now.getMinutes() + '';
    const h = now.getHours() + '';
    const d = now.getDate() + '';
    const mo = (now.getMonth() + 1)  + '';
    const y = now.getFullYear() + '';
    const fullDate = y + (mo > 9 ? mo : '0' + mo) + d + (h > 9 ? h : '0' + h) + (mi > 9 ? mi : '0' + mi) + (s > 9 ? s : '0' + s);
    // 秒まで取得 y + (mo > 9 ? mo : '0' + mo) + d + (h > 9 ? h : '0' + h) + mi + (s > 9 ? s : '0' + s);
    // 秒から時間まで取得 (h > 9 ? h : '0' + h) + mi + (s > 9 ? s : '0' + s);
    // 日付まで取得 y + (mo > 9 ? mo : '0' + mo) + d;

    // ユーザの【いつもの注文リスト】に追加
    firebase.firestore().collection('user').doc(order.user.uid).collection('order_usual').doc(fullDate).set(order).catch((error) => {
      alert('注文にエラーが発生しました。再度ご試行ください。');
      console.error("Error writing document: ", error);
    });
  },
  removeUsual({ commit }, set) {
    firebase.firestore().collection('user').doc(set.uid).collection('order_usual').doc(set.id).delete().catch((error) => {
      console.error("Error removing document: ", error);
    });
  },
}

export const mutations = {
  setReservation(state, reserveData) {
    Object.assign(state, reserveData);
    $nuxt.$router.push('/confirm');
  },
}
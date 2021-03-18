'use strict';
import firebase from '~/plugins/firebase';

export const state = () => ({
 user: {
   uid: '',
   name: '',
   email: '',
　　// ログイン状態の真偽値を追加
   login: false,
 },
})

export const getters = {
 user: state => {
   return state.user
 }
}

export const actions = {
    signin({ rootState, state, commit }, account) {
        firebase.auth().signInWithEmailAndPassword(account.email, account.password).then(user => {
            $nuxt.$router.push('/home');
            commit('getData', { uid: user.user.uid, email: user.user.email, name: user.user.displayName });
            commit('switchLogin', true);
        }).catch((error) => {
            alert('アカウントが確認できません。再度ご入力ください。');
        });
    },
    signup({ rootState, state, commit }, account) {
        firebase.auth().createUserWithEmailAndPassword(account.email, account.password).then((user) => {
            firebase.auth().currentUser.updateProfile({
                displayName: account.name,
            }).then(function(){
                const id = user.user.uid;
                const name = user.user.displayName;
                firebase.firestore().collection('user').doc(user.user.uid).set({
                    id: id,
                    name: name
                }).catch((error) => {
                    alert('アカウントデータの保存にエラーが発生しました。');
                });
                $nuxt.$router.push('/home');
                commit('getData', { uid: user.user.uid, email: user.user.email, name: user.user.displayName });
                commit('switchLogin', true);
            }).catch(function(error) {
                location.reload();
            });
        }).catch((error) => {
            alert('メールアドレスがご利用いただけないか、既に使われています。');
        });
    },
    signOut({ commit }) {
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            commit('getData', { uid: null, email: null, name: null })
            // ユーザー情報の取得と同時にcommitで真偽値の切り替え
            commit('switchLogin', false);
        }).catch(function(error) {
            alert('サインアウト中に問題が発生しました。再度ご試行ください。');
        });
    },
    userUpdate({ commit }, userData) {
        firebase.auth().currentUser.updateProfile({
            displayName: userData.name,
        }).catch(function(error) {
            alert('アカウントデータの保存にエラーが発生しました。時間を空けて再度ご試行ください。');
        });
        firebase.firestore().collection('user').doc(userData.id).set({
            name: userData.name,
            email: userData.email,
        }).catch((error) => {
            alert('アカウントデータの保存にエラーが発生しました。時間を空けて再度ご試行ください。');
        });
    },
}

export const mutations = {
 getData (state, account) {
   state.user.uid = account.uid;
   state.user.name = account.name;
   state.user.email = account.email;
 },
 // 真偽値を切り替えるmutationsを追加
 switchLogin (state, bool) {
   state.user.login = bool;
 },
}
'use strict';
import firebase from '~/plugins/firebase';

export const actions = {
    signin({ rootState, state, commit }, account) {
        firebase.auth().signInWithEmailAndPassword(account.email, account.password).then(user => {
            $nuxt.$router.push('/home');
        }).catch((error) => {
            alert('アカウントが確認できません。再度ご入力ください。');
        });
    },
    signup({ rootState, state, commit }, account) {
        firebase.auth().createUserWithEmailAndPassword(account.email, account.password).then((user) => {
            firebase.auth().currentUser.updateProfile({
                displayName: account.name,
            }).then(function(){
                $nuxt.$router.push('/home');
            }).catch(function(error) {
                location.reload();
            });
        }).catch((error) => {
            alert('メールアドレスがご利用いただけないか、既に使われています。');
        });
    },
    signOut({ commit }) {
        firebase.auth().signOut().then(() => {
        }).catch(function(error) {
            alert('サインアウト中に問題が発生しました。再度ご試行ください。');
        });
    },
    async userUpdate({ commit }, userData) {
        await firebase.auth().currentUser.updateProfile({
            displayName: userData.name,
        }).catch(function(error) {
            alert('アカウントデータの保存にエラーが発生しました。時間を空けて再度ご試行ください。');
        });
        await firebase.firestore().collection('user').doc(userData.id).set({
            name: userData.name,
            email: userData.email,
        }).catch((error) => {
            alert('アカウントデータの保存にエラーが発生しました。時間を空けて再度ご試行ください。');
        });
    },
}
'use strict';
import firebase from '~/plugins/firebase';

export const state = () => ({
});

export const actions = {
  async getImage({ commit, state }) {
    const url = firebase.storage().ref().child('studio-thumbnails/' + urls[i]);
    await url.getDownloadURL().then(function(res) {
        thumbnails.push(res);
        return res;
    });
  },
}

export const mutations = {
}
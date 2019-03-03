import axios from 'axios';

export default {
 namespaced: true,
 state: {
   loading: false,
   error: null
 },
 mutations: {
   request(state) {
     state.loading = true;
   },
   success(state) {
     state.loading = false;
     state.error = null;
   },
   failure(state, error) {
     state.loading = false;
     state.error = error;
   }
 },
 actions: {
   async $init(context, store) { },
   async do(context, data) {
     context.commit('request');

     const { type, filename, file } = data;

     try {
       const formData = new FormData;
       formData.append('type', type);
       formData.append('filename', filename);
       formData.append('file', file);

       const response = await axios.post(`/api/gallery`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data'
         }
       });
       context.commit('success');
     } catch (error) {
       console.error(`Failed to upload file to gallery.`, error);
       if (error.response) {
         context.commit('failure', error.response.data.message);
       } else {
         context.commit('failure', error.message);
       }
     }
   }
 }
};

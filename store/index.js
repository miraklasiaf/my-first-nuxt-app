import Vuex from 'vuex';
import axios from 'axios';
import Cookie from 'js-cookie';

const createStore = () => {
	return new Vuex.Store({
		state: {
			loadedPosts: [],
			token: null
		},
		mutations: {
			setPosts(state, posts) {
				state.loadedPosts = posts;
			},
			addPost(state, post) {
				state.loadedPosts.push(post);
			},
			editPost(state, editedPost) {
				const postIndex = state.loadedPosts.findIndex((post) => post.id === editedPost.id);
				state.loadedPosts[postIndex] = editedPost;
			},
			setToken(state, token) {
				state.token = token;
			},
			clearToken(token) {
				state.token = null;
			}
		},
		actions: {
			nuxtServerInit(vuexContext, context) {
				return axios
					.get(process.env.baseUrl + '/posts.json')
					.then((res) => {
						const postsArray = [];
						for (const key in res.data) {
							postsArray.push({ ...res.data[key], id: key });
						}
						vuexContext.commit('setPosts', postsArray);
					})
					.catch((e) => context.error(e));
			},
			addPost(vuexContext, post) {
				const createdPost = {
					...post,
					updatedDate: new Date()
				};
				return axios
					.post(process.env.baseUrl + '/posts.json?auth=' + vuexContext.state.token, createdPost)
					.then((res) => {
						vuexContext.commit('addPost', { ...createdPost, id: res.data.name });
					})
					.catch((e) => console.log(e));
			},
			editPost(vuexContext, editedPost) {
				return axios
					.put(
						process.env.baseUrl + '/posts/' + editedPost.id + '.json?auth=' + vuexContext.state.token,
						editedPost
					)
					.then((res) => {
						vuexContext.commit('editPost', editedPost);
					})
					.catch((e) => console.log(e));
			},
			setPosts(vuexContext, posts) {
				vuexContext.commit('setPosts', posts);
			},
			authenticateUser(vuexContext, authData) {
				let authUrl =
					'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.fbAPIKey;

				if (!authData.isLogin) {
					authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + process.env.fbAPIKey;
				}
				return axios
					.post(authUrl, {
						email: authData.email,
						password: authData.password,
						returnSecureToken: true
					})
					.then((res) => {
						vuexContext.commit('setToken', res.data.idToken);
						localStorage.setItem('token', res.data.idToken);
						localStorage.setItem('tokenExpiration', new Date().getTime() + res.expiresIn * 1000);
						Cookie.set('jwt', token);
						Cooket.set('expirationDate', new Date().getTime() + res.expiresIn * 1000);

						vuexContext.dispatch('setLogoutTimer', res.expiresIn * 1000);
					})
					.catch((err) => {
						console.log(err);
					});
			},
			setLogoutTimer(vuexContext, duration) {
				setTimeout(() => {
					vuexContext.commit('clearToken');
				}, duration);
			},
			initAuth(vuexContext, req) {
				if (req) {
					if (!req.headers.cookie) {
						return;
					}
					const jwtCookie = req.headers.cookie.split(';').find((c) => c.trim().startsWith('jwt='));
					if (!jwtCookie) {
						return;
					}
					const token = jwtCookie.split('=')[1];
				} else {
					const token = localStorage.getItem('token');
					const expirationDate = localStorage.getItem('tokenExpiration');
					if (new Date().getTime() > +expirationDate || !token) {
						return;
					}
				}
				vuexContext.commit('setLogoutTimer', +expirationDate - new Date().getTime());
				vuexContext.commit('setToken', token);
			}
		},
		getters: {
			loadedPosts(state) {
				return state.loadedPosts;
			},
			isAuthenticated(state) {
				return state.token != null;
			}
		}
	});
};

export default createStore;

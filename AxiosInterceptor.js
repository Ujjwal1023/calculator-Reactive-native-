import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const AxiosInterceptor = ({ children }) => {
	const navigate = useNavigation();

	useEffect(
		() => {
			const resInterceptor = async response => {
				let headers = response.headers;

				// your 401 check here
				// token refresh - update client session
				if (headers.authorization !== undefined) {
					// localStorage.setItem("access_token", headers.authorization);
					await AsyncStorage.setItem("access_token", headers.authorization);
				}
				return parseBody(response);
			};

			const errInterceptor = async error => {
				if (error.response) {
					if (error.response.status === 401 || error.response.status === 403) {
						await AsyncStorage.clear();
						navigate.reset({
							index: 0,
							routes: [{ name: "Login" }]
						});
					} else if (error.response) {
						return parseError(error.response.data);
					} else {
						return Promise.reject(error);
					}
				}
				return Promise.reject(error);
			};

			const interceptor = instance.interceptors.response.use(
				resInterceptor,
				errInterceptor
			);

			return () => instance.interceptors.response.eject(interceptor);
		},
		[navigate]
	);

	return children;
};

function parseError(messages) {
	if (messages) {
		if (messages instanceof Array) {
			return Promise.reject({ messages: messages });
		} else {
			return Promise.reject({ messages: messages });
		}
	} else {
		return Promise.reject({ messages: "parse error" });
	}
}

/**
 * parse response
 */
function parseBody(response) {
	if (response.status === 200) {
		return response.data;
	} else {
		return parseError(response.data);
	}
}

/**
 * axios instance
 */
const instance = axios.create({
	baseURL: "https://api.billclap.com",
	// baseURL: "http://192.168.1.67:8000",
	paramsSerializer: {
		encode: parse,
		serialize: stringify
	},
	timeout: 30000
});

// request header
instance.interceptors.request.use(
	async config => {
		const apiToken = await AsyncStorage.getItem("access_token");
		config.headers.Authorization = "Bearer " + apiToken;
		config.headers.Accept = "application/json";
		config.headers.RequestOrigin = "app";
		let deviceId = DeviceInfo.getDeviceId();
		config.headers.DeviceId = deviceId;
		config.headers.Platform = Platform.OS;
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

export const http = instance;
export { AxiosInterceptor };
export const preview = 'https://api.billclap.com';
export const storage = 'https://www.billclap.com/storage/';


export default AxiosInterceptor;
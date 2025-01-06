import { UserBody } from "../models/user/UserBody";
import { UserGroup } from "../models/user/UserGroup";
import { UserInfo } from "../models/user/UserInfo";
import { UserLoginRes } from "../models/user/UserLoginRes";
import { UserModel } from "../models/user/UserModel";
import apiClient from "./interceptor";

export class UserService {
    login(username: string, password: string): Promise<UserLoginRes>{
        return new Promise<UserLoginRes>((resolve, reject) => {
            apiClient.post('/token/', {
                username: username,
                password: password
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            }
            );
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            apiClient.post('/token/logout/').then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    getInfoUser(): Promise<UserInfo> {
        return new Promise<UserInfo>((resolve, reject) => {
            apiClient.get('/token/user-info/').then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    register(fist_name: string, last_name: string, username: string, email: string, password: string) {
        return new Promise((resolve, reject) => {
            apiClient.post('/auth/register/', {
                first_name: fist_name,
                last_name: last_name,
                username: username,
                email: email,
                password: password
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    getUserList(): Promise<UserModel[]> {
        return new Promise<UserModel[]>((resolve, reject) => {
            apiClient.get('/auth/').then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    getUserById(id: number): Promise<UserModel> {
        return new Promise<UserModel>((resolve, reject) => {
            apiClient.get(`/auth/${id}/`).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    createUser(userBody: UserBody) {
        return new Promise((resolve, reject) => {
            apiClient.post('/auth/', userBody).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    updateUser(id: number, userBody: UserBody) {
        return new Promise((resolve, reject) => {
            apiClient.patch(`/auth/${id}/`, userBody).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    deleteUser(id: number) {
        return new Promise((resolve, reject) => {
            apiClient.delete(`/auth/${id}/`).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    getUserGroups(): Promise<UserGroup[]> {
        return new Promise<UserGroup[]>((resolve, reject) => {
            apiClient.get('/auth/groups/').then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }
}
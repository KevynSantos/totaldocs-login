import StorageService from "../storage/StorageService";
import { SESSION_TOTAL_DOCS, PERMISSIONS_USER } from "../constants/StorageConstants";
import ApiService from '../services/ApiService';
import {GET_ME} from '../api/urls';

export const getUser = async () =>
{
        
        const token = StorageService.get(SESSION_TOTAL_DOCS);
        const api = new ApiService();
        var response = null;
        try 
    {
        const data = await api.get(GET_ME, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        response = {msg:"success", data:data};
    } catch (error) {
        console.error(error);
        response = {msg:error};
    }

    return response;

}

export const setUserPermissions = async () => {
    const token = StorageService.get(SESSION_TOTAL_DOCS);
    const api = new ApiService();
    let response = null;

    try {
        const data = await api.get(GET_ME, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const permissions = data.permissions || {};

        const formattedPermissions = {
            Sign: {
                electronicSignatureView: permissions["electronicSignatureView"] === true,
                electronicSignatureManage: permissions["electronicSignatureManage"] === true,
            },
            TotalBot: {
                chatbotsManage: permissions["chatbotsManage"] === true,
                chatbotAttendantsManage: permissions["chatbotAttendantsManage"] === true,
            },
            TotalDocs: {
                repository: permissions["repository"] === true,
            },
            Usuario: {
                userManage: permissions["userManage"] === true,
                userCreate: permissions["userCreate"] === true,
                userEdit: permissions["userEdit"] === true,
                userDelete: permissions["userDelete"] === true,
            }
        };

        response = { msg: "success", data: formattedPermissions };
    } catch (error) {
        console.error(error);
        response = { msg: error };
    }

    StorageService.set(PERMISSIONS_USER,response.data);

    return response;
};

import StorageService from "../../storage/StorageService";
import {SESSION_TOTAL_DOCS} from '../../constants/StorageConstants';
import ApiService from "../ApiService";
import { COMPANY } from "../../constants/ApiTotalDocsCoreConstants";

export const getCompanyName = async () => {
        const token = StorageService.get(SESSION_TOTAL_DOCS);
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
        const api = new ApiService();
        const data = await api.get(COMPANY, { headers });
        const componayName = data.name;
        return componayName;
}
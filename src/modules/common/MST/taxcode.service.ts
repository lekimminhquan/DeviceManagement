import { Injectable } from "@nestjs/common";
import axios from "axios";


@Injectable()
export class TaxCodeService {
    constructor(
    ) {}

    async getTaxCodeInfo(mst: string) {
        return await axios.get(`https://api.vietqr.io/v2/business/${mst}`).then(async (res) => {
            if(res.data) {
                const getNewAddress = await axios.get(`https://maps.track-asia.com/api/v2/place/textsearch/json?language=vi&key=public_key&query=${res.data.data.address}&new_admin=true&include_old_admin=true`).then(async (resNewAddress) => {
                    return  resNewAddress.data.results[0].name +' '+ resNewAddress.data.results[0].formatted_address ;
                });
                res.data.data.address = getNewAddress;
                return res.data;
            }
            return null;
        });
    }
}

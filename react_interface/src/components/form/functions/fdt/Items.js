import { getPathValue } from "../../../fn/json/getPathValue";

export const isItemTaken = (value, Items, path, ignore_item) => {
    let index = -1;
    for (let i = 0; i < Items.length; i++) {

        const item_value = getPathValue(Items[i], path);
        if(ignore_item){
            const ignore_item_value = getPathValue(ignore_item, path);
            if (item_value === ignore_item_value) {
                continue;
            }
        }
        
        if (item_value === value) {
            index = i;
            break;
        }
    }
    return { index, taken: index > -1 };
}

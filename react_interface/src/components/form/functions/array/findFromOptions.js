export const findFromOptions = ({options, key, value}) => {

    for(const option of options){
        if(option?.[key] === value){
            return option;
        }
    }
}

// const options = [{ name: "A" }, { name: "B" }]
// console.log(findFromOptions({options, key:"name", value:"A"}));
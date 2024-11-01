export const findIndexById = (id, prev) => {
    let index = -1;
    // console.log(id, prev)
    for (let i = 0; i < prev.length; i++) {
      if (prev[i].id === id) {
        index = i;
        break;
      }
    }
  
    return index;
  };

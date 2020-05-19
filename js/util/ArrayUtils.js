export default class ArrayUtils {
  static isEqual(array1, array2) {
    if (!(array1 && array2)) {
      return false;
    }
    if (array1.length !== array2.length) {
      return false;
    }
    for (let i = 0, length = array1.length; i < length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  static updateArray(changeValues, data) {
    for (let i = 0, length = changeValues.length; i < length; i++) {
      let temp = changeValues[i];
      if (temp === data) {
        changeValues.splice(i, 1);
        return;
      }
    }
    changeValues.push(data);
  }
}

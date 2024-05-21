class DataModel {
  constructor(data, prefix) {
    for (const key in data) {
      this[key.replace(prefix, "")] = data[key];
    }
  }
}

class RawDataModel {
  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }
  }
}

exports.DataModeling = (data, prefix) => {
  let result = [];

  data.forEach((d) => {
    result.push(new DataModel(d, prefix));
  });

  return result;
};

exports.RawData = (data) => {
  let result = [];

  data.forEach((d) => {
    result.push(new RawDataModel(d));
  });

  return result;
};
